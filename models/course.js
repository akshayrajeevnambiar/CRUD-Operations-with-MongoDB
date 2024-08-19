// defines the course schema

// import mogoose
const mongoose = require("mongoose");

// Define the schema
const course = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
});

// Defining the Courses Model
const Courses = mongoose.model("Courses", course);

// exporting the courses model
module.exports = Courses;
