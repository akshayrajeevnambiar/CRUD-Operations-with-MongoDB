// importing the dotenv to access the enviroment variables
require("dotenv").config();

// importing the express library
const express = require("express");

// Creating a router to handle the routes
const router = express.Router();

// Calling in the user signup and signin models
const User = require("../models/user");

// import the jsonwebtoken library to sign the user after signup
const jwt = require("jsonwebtoken");

// importing password-hash library to hash the password
const passwordHash = require("password-hash");

// calling in the validation middleware to check upon user credntials
const {
  validateSignUpCredentials,
  validateSigninCredentials,
} = require("../middlewares/validateUser");

// importing the authenticateUser function to verify jwt
const {
  authenticateUser,
  authenticateToken,
} = require("../middlewares/authenticate");

// creating a signup route
router.post("/register", validateSignUpCredentials, async (req, res) => {
  try {
    // fetching the associated credentials from request body
    const { username, email, password } = req.body;

    // Check if the user already exists
    const isExistingUser = await User.findOne({ email: email });

    if (isExistingUser) {
      return res
        .status(200)
        .send("Email already exists please proceed to sigin");
    }

    // generate a jwt so user can login automatically in future logins
    // made the access token expire in 15 mins for added security
    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15min" }
    );

    // generating a refresh token upon login
    const refreshToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.REFRESH_TOKEN_SECRET
    );

    // hashing the password before storing it into the
    // database
    const hashedPassword = passwordHash.generate(password);

    // If the user doesnt exist continue to signin
    // sending in the data with the refresh token
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      refreshToken: refreshToken,
    });

    // waiting for the data to save in the database
    await user.save();

    // sending in a confirmation upon completing the save and the access token
    res.status(200).json({
      message: "The User has been created",
      accessToken,
    });

    // sending in the refesh token as a http cookie
    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
  } catch (err) {
    // logging in the error
    res.status(400).send(err.message);
  }
});

// creating a signin route
router.post("/login", validateSigninCredentials, async (req, res) => {
  try {
    // fetching the signin information from the request body
    const { email, password } = req.body;

    // trying to find the user based on their email and checking password
    const user = await User.findOne({ email: email });

    // check to see if the user exists
    if (!user) {
      // if user is found return his/her purchased course list
      return res.status(403).send("No user found");
    }

    // verfying the password with the hashed password
    const isMatch = passwordHash.verify(password, user.password);

    if (!isMatch) {
      // if the passwords do no match
      return res.status(401).send("Incorrect password");
    }

    return res
      .status(200)
      .send(
        `Welcome Back ${user.username}! ` +
          (user.courses && user.courses.length > 0
            ? `Here are your purchased courses: ${user.courses.join(", ")}`
            : "You have not purchased any courses yet.")
      );

    res.status(400).send("User doesnt exist");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// protected to route to make sure that only the users with jwt can access
router.post("/profile", authenticateUser, async (req, res) => {
  try {
    // Make sure _id exists on req.user
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// protected route to handle the regenration of the access token using the
// refresh token
router.post("/token", async (req, res) => {
  // fetch the refresh token from the cookies
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) res.status(401).send("Invalid refresh token");

  // when we get the valid refresh token
  try {
    // fetching the user details
    const user = await User.findOne({ refreshToken: refreshToken });

    // checking is such a user exist
    if (!user) res.status(403).send("User not found");

    // verifying the autenticity of the token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) res.status(403).send(err.message);

        // generate new access token
        const newAccessToken = jwt.sign(
          { email: user.email, id: user._id },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15min" }
        );

        const newRefreshToken = jwt.sign(
          { email: user.email, id: user._id },
          process.env.REFRESH_TOKEN_SECRET
        );

        // setting in the new refresh token into the database
        user.refreshToken = newRefreshToken;

        // saving the updates into the database
        await user.save();

        // updating the cookie as well with the new refresh token
        res.cookie("refreshToken", newRefreshToken, {
          httpOnly: true,
          secure: true,
        });

        // sending in the newly generated refresh token and access token
        res.status(200).json({
          message: "token generated",
          newAccessToken,
        });
      }
    );
  } catch (err) {
    res.status(403).send(err.message);
  }
});

// adding a route for logging out so that the refresh token can
// be invalidated
router.post("/logout", authenticateToken, async (req, res) => {
  // fetching the refresh token
  const refreshToken = req.user.refreshToken;

  // if there was a refresh token
  try {
    // tyring to fetch the user details using the refresh token
    const user = await User.findOne({ refreshToken: refreshToken });

    // reseting the refresh token value in the database
    user.refreshToken = null;

    // saving the data within the database
    await user.save();

    // clearing up the cookie values as well
    res.clearCookie("refreshToken");

    // sendind in the result message
    res.status(200).send("User logged out successfully");
  } catch (err) {
    res.status(200).send(err.message);
  }
});

module.exports = router;
