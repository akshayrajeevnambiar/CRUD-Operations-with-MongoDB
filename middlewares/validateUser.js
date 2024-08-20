// Middleware that validates the user credentials
// using the zod input validation schema

const { signupSchema, signinSchema } = require("../schemas/auth");

const validateSigninCredentials = (req, res, next) => {
  try {
    signinSchema(req);
    next();
  } catch (err) {
    res.status(400).send(err.errors());
  }
};

const validateSignUpCredentials = (req, res, next) => {
  try {
    signupSchema(req);
    next();
  } catch (err) {
    res.status(400).send(err.errors());
  }
};

module.exports = { validateSignUpCredentials, validateSigninCredentials };
