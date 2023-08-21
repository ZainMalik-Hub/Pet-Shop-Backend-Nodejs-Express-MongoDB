const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Appointment = require("../models/Appointment");

const Response = require("../controllers/response");
const Validate = require("../controllers/validateAttributes");

// Add new Product

router.post("/", async (req, res, next) => {
  const userId = req.body.userId;
  const petName = req.body.petName;
  const date = req.body.date;
  const time = req.body.time;
  const petType = req.body.petType;

  Validate(userId, res, "User Id", 500); // validate req.body values
  Validate(petName, res, "Pet Name", 500);
  Validate(date, res, "Date", 500);
  Validate(time, res, "Time", 500);
  Validate(petType, res, "Pet Type", 500);

  const newAppoinment = new Appointment(req.body);

  try {
    const saveAppoinment = await newAppoinment.save();
    Response(res, false, "success", 200, saveAppoinment);
  } catch (err) {
    Response(res, true, err, 500);
  }
});
router.get("/:type", async (req, res, next) => {
  if (req.params.type === "All") {
    try {
      const AllPendingRequests = await Appointment.find({});

      Response(res, false, "success", 200, AllPendingRequests);
    } catch (err) {
      Response(res, true, err, 500);
    }
  } else {
    try {
      const AllPendingRequests = await Appointment.find({
        status: req.params.type,
      });

      Response(res, false, "success", 200, AllPendingRequests);
    } catch (err) {
      Response(res, true, err, 500);
    }
  }
});

router.post("/update/:id", async (req, res, next) => {
  try {
    const currentAppointment = await Appointment.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: req.body.type,
      }
    );
    Response(res, false, "success", 200, currentAppointment);
  } catch (err) {
    Response(res, true, err, 500);
  }
});

module.exports = router;
