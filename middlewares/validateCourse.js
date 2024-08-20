// Importing the course schema
const { courseSchema } = require("../schemas/auth");

const validateCourse = (req, res, next) => {
  try {
    courseSchema.parse(req);
    next();
  } catch (err) {
    res.status(400).send(err.error());
  }
};

module.exports = { validateCourse };
