const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Routes = require("../src/routes");
const compression = require("compression");

const bodyParser = require("body-parser");
const cors = require("cors");

require("dotenv/config");

//Mongo Db Connection
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection
  .once("open", function () {
    console.log("MongoDB running");
  })
  .on("error", function (err) {
    console.log(err);
  });

// END
app.use(compression());

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});
app.use(Routes); // getting all routes

module.exports = app;
