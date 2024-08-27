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

// creating a middleware to authenticate the token
const authenticateToken = (req, res, next) => {
  // extracting the refresh token from the cookie
  const refreshToken = req.cookies.refreshToken;

  // checking if the refresh token is not null
  if (!refreshToken) return res.status(403).send("No token found");

  // verfying the token to check the validity of the token found
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// exporting the authentication middlewares
module.exports = { authenticateUser, authenticateToken };
