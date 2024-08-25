// this middlewares sole responsibility is to create a authentication
// using the JSON Web Tokens

require("dotenv").config();

// importing the jsonwebtoken library
const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  // extracting the jwt from the request header
  const authHeader = req.headers["authorization"];

  // checking to see if we have a auth header
  const token = authHeader && authHeader.split(" ")[1];

  // if there is no token
  if (!token) {
    res.status(401).send("Access Denied: No Valid token found");
  }

  try {
    // authenticating the jwt
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(payload);

    // fetching the payload
    req.user = payload;

    // moving on to the next middleware or route handler
    next();
  } catch (err) {
    return res.status(403).send("Invalid Token");
  }
};

// exporting the function
module.exports = { authenticateUser };
