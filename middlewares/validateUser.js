// Middleware that validates the user credentials
// using the zod input validation schema

const { signupSchema, signinSchema } = require("../schemas/auth");

const validateSigninCredentials = (req, res, next) => {
  try {
    signinSchema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

const validateSignUpCredentials = (req, res, next) => {
  try {
    signupSchema.parse(req.body);
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = { validateSignUpCredentials, validateSigninCredentials };
