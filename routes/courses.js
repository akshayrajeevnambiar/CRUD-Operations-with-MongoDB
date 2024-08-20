// handles the routes to courses
const express = require("express");

// Importing Router which helps with seperating the routing conerns
const router = express.Router();

// Import the validating middlewares
const { validateCourse } = require("../middlewares/validateCourse");

// Importing the course model
const Courses = require("../models/course");

// Route to create courses
router.post("/create", validateCourse, async (req, res) => {
  try {
    const { title, price } = req.body;
    const course = new Courses({ title, price });
    await course.save();
    res.status(201).send("Course created successfully"); // Send a response
  } catch (err) {
    res.status(400).send(err.message); // Send an error response
  }
});

module.exports = router;
