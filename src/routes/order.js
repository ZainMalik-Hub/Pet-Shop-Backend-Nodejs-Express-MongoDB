const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Response = require("../controllers/response");
const Validate = require("../controllers/validateAttributes");

//User New Order
router.post("/", async (req, res, next) => {
  const userId = req.body.userId;
  Validate(userId, res, "User Id", 500);

  const cart = await Cart.findOne({ userId: req.body.userId });

  if (cart?.products?.length > 0) {
    //if products exists in cart
    const temp = await Cart.aggregate([
      {
        $group: {
          _id: "$userId",
          totalValue: {
            $sum: { $sum: "$products.totalPrice" }, // sum  of products totalPrice
          },
        },
      },
    ]);

    const total = temp[0].totalValue; // first index of sum

    let neworder;

    neworder = new Order({
      userId: req.body.userId,
      products: cart.products,
      amount: total,
      address: req.body.address,
      name: req.body.name,
      city: req.body.city,
      phone: req.body.city,
      email: req.body.email,
    });
    // }

    try {
      const saveOrder = await neworder.save();
      await Cart.findOneAndDelete({ userId: req.body.userId }); //delete cart
      Response(res, false, "success", 200, saveOrder);
    } catch (err) {
      Response(res, true, err, 500);
    }
  } else {
    Response(res, true, "Cart is Empty", 500);
  }
});

module.exports = router;

router.get("/allorder/:status", async (req, res, next) => {
  try {
    const orders = await Order.find({ status: req.params.status }).sort({
      _id: -1,
    });
    if (orders.length > 0) {
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const productsWithDetails = await Promise.all(
            order.products.map(async (product) => {
              const productDetails = await Product.findById(
                product.productId
              ).select("title thumbnail");
              return { ...product.toObject(), productDetails };
            })
          );
          const OrderWithDetails = {
            ...order.toObject(),
            products: productsWithDetails,
          };
          return OrderWithDetails;
        })
      );
      return Response(res, false, "Success", 200, ordersWithDetails);
    } else {
      const message =
        req.params.status === "Approved"
          ? "No Orders Found with the status of 'Approved'"
          : `No Orders Found with the status of '${req.params.status}'`;
      return Response(res, true, message, 200);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/myorders/:userId", async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({
      _id: -1,
    });
    if (orders.length > 0) {
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          const productsWithDetails = await Promise.all(
            order.products.map(async (product) => {
              const productDetails = await Product.findById(
                product.productId
              ).select("title thumbnail");
              return { ...product.toObject(), productDetails };
            })
          );
          const OrderWithDetails = {
            ...order.toObject(),
            products: productsWithDetails,
          };
          return OrderWithDetails;
        })
      );
      return Response(res, false, "Success", 200, ordersWithDetails);
    } else {
      return Response(res, true, "No Orders Found", 404);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// update order status
router.post("/:orderId", async (req, res, next) => {
  // Pagination

  const status = req.body.status;

  try {
    const currrentOrder = await Order.findOneAndUpdate(
      { _id: req.params.orderId },
      {
        status: status,
      }
    );
    Response(res, false, "success", 200, currrentOrder);
  } catch (err) {
    Response(res, true, "error", 200, err);
  }
});
