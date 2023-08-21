const express = require("express");
const app = express();
const Auth2 = require("./auth");
const Appointment = require("./appointment");
const Adoption = require("./adoption");
const Product = require("./products");
const Cart = require("./cart");
const Order = require("./order");

//Routes
app.use("/api/auth", Auth2);
app.use("/api/appointment", Appointment);
app.use("/api/adoption", Adoption);
app.use("/api/product", Product);
app.use("/api/cart", Cart);
app.use("/api/order", Order);

// if 404 error
app.use((req, res) => {
  res.status(404).send("not found");
});
module.exports = app;
