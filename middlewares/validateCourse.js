// Importing the course schema
const { courseSchema } = require("../schemas/auth");

const validateCourse = (req, res, next) => {
  try {
    // Ensure we are validating the request body
    courseSchema.parse(req.body);
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    // Send detailed error message or log the error
    res.status(400).json({
      message: "Invalid request data",
      errors: err.errors, // Adjust according to your schema validation error format
    });
  }
};

module.exports = { validateCourse };
