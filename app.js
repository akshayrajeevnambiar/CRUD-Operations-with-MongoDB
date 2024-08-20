// app.js contains the business logic (CRUD Operations)

// loading on the .env values onto process.env
require("dotenv").config();

// importing body parser. This makes sure that the body data is converted
// from a raw string to JSON data.
const bodyParser = require("body-parser");

// importing express
const express = require("express");

// importing mongoose
const mongoose = require("mongoose");

// Intialising the express object
const app = express();

// fetching the enviroment variables
const PORT = process.env.PORT;
const URI = process.env.MONGOOSE_URI;

// fetching all the routes
const courseRoutes = require("./routes/courses");

// establishing the mongodb connection
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Established");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.json());

app.use("/courses", courseRoutes);

// Listening to the PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
