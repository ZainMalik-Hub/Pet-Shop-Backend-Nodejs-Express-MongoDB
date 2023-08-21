const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AdoptSchema = new Schema(
  {
    AdoptionId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    petName: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User2",
      required: true,
    },
    petId: {
      type: String,
    },
    name: {
      type: String,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: { type: String, default: "Not Approved" },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Adopt", AdoptSchema);
