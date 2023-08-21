const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("../models/Product");

const Response = require("../controllers/response");
const Validate = require("../controllers/validateAttributes");
const CleanObj = require("../controllers/cleanObj");

// Add new Product
router.post("/", async (req, res, next) => {
  const productCode = req.body.productCode;
  const title = req.body.title;
  const description = req.body.description;
  const pricing = req.body.pricing;
  const categories = req.body.categories;

  Validate(productCode, res, "Product Code", 500); // validate req.body values
  Validate(title, res, "Title", 500);
  Validate(description, res, "Description", 500);
  Validate(pricing, res, "Price", 500);
  Validate(categories, res, "Catogory", 500);

  const newproduct = new Product(req.body);
  const product = await Product.findOne({ productCode: req.body.productCode });
  if (product) {
    Response(res, true, "Product With this Code Already Exist", 209);
  } else {
    try {
      const saveProduct = await newproduct.save();
      Response(res, false, "success", 200, saveProduct);
    } catch (err) {
      console.log("errrrr", err);
      Response(res, true, err, 500);
    }
  }
});

router.get("/", async (req, res, next) => {
  try {
    const Products = await Product.find({});

    Response(res, false, "success", 200, Products);
  } catch (err) {
    Response(res, true, err, 500);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const Products = await Product.find({ _id: req.params.id });

    Response(res, false, "success", 200, Products);
  } catch (err) {
    Response(res, true, err, 500);
  }
});

// search products
router.get("/search/:value", async (req, res, next) => {
  const page_size = req.query.page_size;
  const page_num = req.query.page_num;
  const skips = page_size * (page_num - 1);

  const products = await Product.find(
    {
      title: { $regex: req.params.value },
    },
    { title: 1 }
  )
    .skip(skips)
    .limit(page_size);

  Response(res, false, "success", 200, products);
});

router.get("/filter", async (req, res, next) => {
  const page_size = parseInt(req.query.page_size);
  const page_num = parseInt(req.query.page_num);
  const skips = page_size * (page_num - 1);
  const data = {
    status: "Active",
    title: null,
    "pricing.price": { $gte: 200 },
    "pricing.price": { $lte: 1000 },
  };

  const products = await Product.find(CleanObj(data))
    .skip(skips)
    .limit(page_size);

  Response(res, false, "success", 200, products);
});
module.exports = router;

router.delete("/:productId", async (req, res, next) => {
  try {
    const id = req.params.productId;
    console.log("idddddd", id);
    // Use Mongoose to find and delete the product by ID
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    res.send(product);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error", error);
  }
});

//update product
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body, // use request body to update the product object
      },
      { new: true } // return updated product object
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});
