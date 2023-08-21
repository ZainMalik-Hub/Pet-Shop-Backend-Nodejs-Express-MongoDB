const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User2",
      required: true,
    },
    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        totalPrice: {
          type: Number,
        },
        price: {
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
    name: {
      type: Object,
      required: true,
    },
    email: {
      type: Object,
    },
    phone: {
      type: Object,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    city: {
      type: Object,
    },
    amount: {
      type: Number,
      required: true,
    },
    discount: {
      discountedPrice: { type: Number },
      couponId: { type: String },
      couponName: { type: String },
    },
    paymentType: { type: String, default: "COD" },
    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Orders", OrderSchema);
