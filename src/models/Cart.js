const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User2",
      required: true,
    },
    products: [
      {
        productCode: {
          type: String,
          required: true,
        },
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        color: {
          type: String,
        },
        size: {
          type: String,
        },
        price: {
          type: Number,
        },
        totalPrice: {
          type: Number,
        },
        thumbnail: {
          type: String,
        },
        name: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
