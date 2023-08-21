const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    productCode: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    categories: { type: Array, index: true, required: true },
    description: {
      type: String,
      required: true,
    },
    pricing: {
      price: { type: Number, required: true },
      oldPrice: { type: Number },
      discount: { type: Number },
    },
    status: { type: String, default: "Active" },
    keyWords: { type: Array },
    thumbnail: { type: String },
    variations: [
      {
        color: { type: String },
        images: { type: Array },
        size: { type: Array },
      },
    ],

    manufacture_details: {
      brandName: { type: String },
      model_number: { type: String },
    },
    shipping_details: {
      weight: { type: String },
      width: { type: String },
      height: { type: String },
      depth: { type: String },
    },
    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
        required: true,
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
