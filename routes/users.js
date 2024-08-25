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

// calling in the validation middleware to check upon user credntials
const {
  validateSignUpCredentials,
  validateSigninCredentials,
} = require("../middlewares/validateUser");

// importing the authenticateUser function to verify jwt
const { authenticateUser } = require("../middlewares/authenticate");

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

    // If the user doesnt exist continue to signin
    // sending in the data
    const user = new User({
      username: username,
      email: email,
      password: password,
    });

    // waiting for the data to save in the database
    await user.save();

    // generate a jwt so user can login automatically in future logins
    const accessToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.ACCESS_TOKEN_SECRET
    );

    // sending in a confirmation upon completing the save and the access token
    res.status(200).json({
      message: "The User has been created",
      accessToken,
    });
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
    if (user) {
      // if user is found return his/her purchased course list
      return res
        .status(200)
        .send(
          `Welcome Back ${user.username}! ` +
            (user.courses && user.courses.length > 0
              ? `Here are your purchased courses: ${user.courses.join(", ")}`
              : "You have not purchased any courses yet.")
        );
    }

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

module.exports = router;
