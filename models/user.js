// defines the user schema

// import mogoose
const mongoose = require("mongoose");

// define the schema
const user = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  purchasedCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
    },
  ],
});

// Defining the model
const User = mongoose.model("Users", user);

// Export the model
module.exports = User;
