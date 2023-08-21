const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const appointmentSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User2",
      required: true,
    },
    petName: {
      type: String,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    petType: {
      type: String,
    },
    status: { type: String, default: "Not Approved" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
