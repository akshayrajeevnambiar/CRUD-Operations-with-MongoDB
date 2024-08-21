// importing the express library
const express = require("express");

// Creating a router to handle the routes
const router = express.Router();

// Calling in the user signup and signin models
const User = require("../models/user");

// calling in the validation middleware to check upon user credntials
const {
  validateSignUpCredentials,
  validateSigninCredentials,
} = require("../middlewares/validateUser");

// creating a signup route
router.post("/register", validateSignUpCredentials, async (req, res) => {
  try {
    // fetching the associated credentials from request body
    const { username, email, password } = req.body;

    // sending in the data
    const user = new User({
      username: username,
      email: email,
      password: password,
    });

    // waiting for the data to save in the database
    await user.save();

    // sending in a confirmation upon completing the save
    res.status(200).send("new user registered");
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

    // trying to find the user based on their email
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

module.exports = router;
