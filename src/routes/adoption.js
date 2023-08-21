const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Adopt = require("../models/Adopt");

const Response = require("../controllers/response");
const Validate = require("../controllers/validateAttributes");

// Add new Product

router.post("/", async (req, res, next) => {
  const userId = req.body.userId;
  const name = req.body.name;
  const petId = req.body.petId;
  const petName = req.body.petName;
  const address = req.body.address;
  const city = req.body.city;
  const phone = req.body.phone;

  Validate(userId, res, "User Id", 500); // validate req.body values
  Validate(name, res, "Name", 500);
  Validate(petId, res, "Pet Id", 500);
  Validate(petName, res, "Pet Id", 500);
  Validate(address, res, "Address", 500);
  Validate(city, res, "City", 500);
  Validate(phone, res, "Phone Number", 500);

  const newAdoption = new Adopt(req.body);

  try {
    const saveAdoption = await newAdoption.save();
    Response(res, false, "success", 200, saveAdoption);
  } catch (err) {
    console.log("errrrr", err);
    Response(res, true, err, 500);
  }
});
router.get("/:type", async (req, res, next) => {
  if (req.params.type === "All") {
    try {
      const AllPendingAdoption = await Adopt.find({});

      Response(res, false, "success", 200, AllPendingAdoption);
    } catch (err) {
      console.log("errrrr", err);
      Response(res, true, err, 500);
    }
  } else {
    try {
      const AllPendingAdoption = await Adopt.find({ status: req.params.type });

      Response(res, false, "success", 200, AllPendingAdoption);
    } catch (err) {
      console.log("errrrr", err);
      Response(res, true, err, 500);
    }
  }
});

router.post("/update/:id", async (req, res, next) => {
  try {
    const currentAdoption = await Adopt.findOneAndUpdate(
      { _id: req.params.id },
      {
        status: req.body.type,
      }
    );
    Response(res, false, "success", 200, currentAdoption);
  } catch (err) {
    console.log("errrrr", err);
    Response(res, true, err, 500);
  }
});

module.exports = router;
