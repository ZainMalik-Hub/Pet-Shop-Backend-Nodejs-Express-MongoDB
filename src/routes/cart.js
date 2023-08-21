const express = require("express");
const router = express.Router();

const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Response = require("../controllers/response");
const Validate = require("../controllers/validateAttributes");

router.post("/:value", async (req, res, next) => {
  const userId = req.body.userId;
  const productCode = req.body.productCode;
  const productId = req.body.productId;
  const price = req.body.price;
  const totalPrice = req.body.totalPrice;
  const Productthumbnail = req.body.Productthumbnail;
  const Productname = req.body.Productname;

  Validate(userId, res, "User Id", 500);
  Validate(productCode, res, "Product Code", 500);
  Validate(productId, res, "Product Id", 500);
  Validate(price, res, "price", 500);
  Validate(totalPrice, res, "Total Price", 500);

  const cartExist = await Cart.findOne({ userId: userId });
  // if cart is not exist with this user Id then create cart
  if (!cartExist) {
    const newCart = new Cart({
      userId: userId,
      products: [
        // at first time cart is only one product
        {
          productCode: productCode,
          productId: productId,
          quantity: 1,
          price: price,
          totalPrice: totalPrice,
          thumbnail: Productthumbnail,
          name: Productname,
        },
      ],
    });

    try {
      const cart = await newCart.save();
      Response(res, false, "success", 200, cart);
    } catch (err) {
      Response(res, true, err, 500);
    }
  }
  // if cart is already exist with this user id

  if (cartExist) {
    const product2 = await Cart.find(
      { userId: userId },
      { products: { $elemMatch: { productId: productId } } }
    );
    if (
      req.params.value === "decrement" &&
      product2[0]?.products[0]?.quantity > 0
    ) {
      if (product2[0].products[0].quantity === 1) {
        // const query =
        //   ();

        try {
          const productAlreadyExist = await Cart.updateOne(
            {
              userId: userId, // select Wishlist with this user id
            },
            {
              $pull: { products: { productId: productId } },
            }
          );

          Response(res, false, "success", 200, productAlreadyExist);
        } catch (err) {
          Response(res, true, err, 500);
        }
      }

      const query = {
        userId: userId, // select cart with this user id
        "products.productId": productId, // select product with given productId from products array
      };
      const updateDocument = {
        $inc: {
          "products.$.quantity": -1,
          "products.$.totalPrice": -price,
        }, // update quantity of selected product from array and add 1 in it
      };
      try {
        const result = await Cart.updateMany(query, updateDocument);

        return Response(res, false, "success", 200, result);
      } catch (err) {
        Response(res, true, err, 500);
      }
    }
    if (req.params.value === "decrement") {
      return Response(res, true, "no product found for decrement", 500);
    }

    ///////////////////////////////

    const product = await Cart.find({
      userId: userId,
      "products.productId": productId,
    });
    if (product.length > 0) {
      // if given product id is already in products array
      const query = {
        userId: userId, // select cart with this user id
        "products.productId": productId, // select product with given productId from products array
      };
      const updateDocument = {
        $inc: {
          "products.$.quantity": 1,
          "products.$.totalPrice": price,
        }, // update quantity of selected product from array and add 1 in it
      };
      try {
        const result = await Cart.updateMany(query, updateDocument);
        return Response(res, false, "success", 200, result);
      } catch (err) {
        Response(res, true, err, 500);
      }
    } else {
      //if there is new product in cart
      try {
        const result = await Cart.updateOne(
          { userId: userId },
          {
            $push: {
              // update cart with new product
              products: {
                productCode: productCode,
                productId: productId,
                quantity: 1,
                price: price,
                totalPrice: totalPrice,
                thumbnail: Productthumbnail,
                name: Productname,
              },
            },
          }
        );
        return Response(res, false, "success", 200, result);
      } catch (err) {
        Response(res, true, err, 500);
      }
    }
  }
});

module.exports = router;

// get cart
router.get("/:userId", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      const productsWithDetails = await Promise.all(
        cart.products.map(async (product) => {
          const productDetails = await Product.findById(
            product.productId
          ).select("title pricing thumbnail");
          return { ...product.toObject(), productDetails };
        })
      );
      const cartWithDetails = {
        ...cart.toObject(),
        products: productsWithDetails,
      };
      // res.json(cartWithDetails);
      return Response(res, false, "Success", 200, cartWithDetails);
    } else {
      return Response(res, true, "Cart is Empty", 500);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// get quantity of product in cart
router.get("/quantity/:productId", async (req, res, next) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ "products.productId": productId });
    let quantity = 0;
    if (cart) {
      const product = cart.products.find((p) => p.productId === productId);
      if (product) {
        quantity = product.quantity;
      }
    }
    res.json({ quantity });
  } catch (err) {}
});

// delete product
router.delete("/product/:productId/userId/:userId", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    const cart = await Cart.findOne({ userId: userId });
    const updatedProducts = cart.products.filter(
      (product) => product.productId !== productId
    );
    cart.products = updatedProducts;
    await cart.save();
    res.status(200).json({ message: "Product removed from cart." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});
