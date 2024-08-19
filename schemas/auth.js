// This schema paired with zod would be used to perforom validation
// checks on the input that the users provide from the body

// Importing the zod library for validation checks
const { z } = require("zod");

// creating the user schema
// creating 2 schemas one for signin and one for signup
// which would help isolate the concerns and help in more cleaner code
// and error handling purposes

const signupSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  passwords: z.string().min(6),
});

const signinSchema = z.object({
  email: z.string().email(),
  passwords: z.string(),
});

// Adding a Schema for courses

const courseSchema = z.object({
  title: z.string().min(1).max(100),
  price: z.number().positive(),
});

module.exports = { signupSchema, signinSchema, courseSchema };
