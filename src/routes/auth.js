const express = require("express");
const router = express.Router();
const CryptoJs = require("crypto-js");
const jwt = require("jsonwebtoken");

const Response = require("../controllers/response");

const User = require("../models/User2");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",

  auth: {
    user: "mzain6805@gmail.com",
    pass: "nkhifguztchvidbp",
  },
  tls: {
    rejectUnauthorized: false,
  },
});
router.post("/register", async (req, res, next) => {
  const { email, username, password } = req.body;
  // Check we have an email
  if (!email) {
    return res.status(422).send({ message: "Missing email." });
  }
  try {
    // Check if the email is in use
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(409).send({
        message: "Email is already in use.",
      });
    }
    // const existUsername = await User.findOne({ username }).exec();
    // if (existUsername) {
    //   return res.status(409).send({
    //     message: "Username is already in use.",
    //   });
    // }
    // Step 1 - Create and save the user
    const user = await new User({
      _id: new mongoose.Types.ObjectId(),
      email: email,
      username: username,
      password: CryptoJs.AES.encrypt(password, process.env.PASSWORD_SECRET),
    }).save();
    // Step 2 - Generate a verification token with the user's ID
    const verificationToken = user.generateVerificationToken();
    // Step 3 - Email the user a unique verification link
    const url = `http://localhost:3000/verify?${verificationToken}`;
    transporter.sendMail({
      to: email,
      subject: "Verify Account",
      html: `Click <a href = '${url}'>here</a> to confirm your email.`,
    });
    return res.status(201).send({
      response: user,
      message: `Sent a verification email to ${email}`,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/registergoogle", async (req, res, next) => {
  const { email, username, password } = req.body;

  // Check we have an email
  const existingUser = await User.findOne({ email }).exec();
  if (existingUser) {
    console.log("user hai", req.body);

    console.log(existingUser);

    const hashedPassword = CryptoJs.AES.decrypt(
      existingUser,
      process.env.PASSWORD_SECRET
    );
    const accessToken = CreateJwt(hashedPassword);

    console.log(accessToken, existingUser);
    Response(res, false, "success", 200, existingUser);

    // try {
    //   const user = await new User({
    //     _id: new mongoose.Types.ObjectId(),
    //     email: email,
    //     username: username,
    //     password: CryptoJs.AES.encrypt(password, process.env.PASSWORD_SECRET),
    //   }).save();
    //   const hashedPassword = CryptoJs.AES.decrypt(
    //     existingUser.password,
    //     process.env.PASSWORD_SECRET
    //   );
    //   const accessToken = CreateJwt(hashedPassword);
    //   Response(res, false, "success", 200, { user, accessToken });
    // } catch (err) {
    //   return res.status(500).send(err);
    // }
    // const hashedPassword = CryptoJs.AES.decrypt(
    //   existingUser.password,
    //   process.env.PASSWORD_SECRET
    // );
    // const accessToken = CreateJwt(hashedPassword);
    // const { password, ...others } = existingUser._doc;
    // Response(res, false, "success", 200, { ...others, accessToken });
  } else {
    try {
      const user = await new User({
        _id: new mongoose.Types.ObjectId(),
        email: email,
        username: username,
        password: CryptoJs.AES.encrypt(password, process.env.PASSWORD_SECRET),
      }).save();

      // const hashedPassword = CryptoJs.AES.decrypt(
      //   existingUser,
      //   process.env.PASSWORD_SECRET
      // );

      // console.log("hasded password", hashedPassword);
      // const accessToken = CreateJwt(user);

      // console.log(accessToken, existingUser);
      Response(res, false, "success", 200, user);

      // const hashedPassword = CryptoJs.AES.decrypt(
      //   existingUser,
      //   process.env.PASSWORD_SECRET
      // );
      // const accessToken = CreateJwt(hashedPassword);

      // console.log(accessToken, user);
      // Response(res, false, "success", 200, { user, accessToken });
    } catch (err) {
      return res.status(500).send(err);
    }
  }
});

router.get("/forgot", async (req, res) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email }).exec();
  if (!existingUser) {
    return Response(res, true, "Email Not Exist", 209, existingUser);
  } else {
  }
});
router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  // console.log("", req.params.id);
  // Check we have an id
  if (!token) {
    return res.status(422).send({
      message: "Missing Token",
    });
  }
  // Step 1 -  Verify the token from the URL
  let payload = null;
  try {
    payload = jwt.verify(token, process.env.USER_VERIFICATION_TOKEN_SECRET);
  } catch (err) {
    return res.status(500).send(err);
  }
  try {
    // Step 2 - Find user with matching ID
    const user = await User.findOne({ _id: payload.ID }).exec();
    if (!user) {
      return res.status(404).send({
        message: "User does not  exists",
      });
    }
    // Step 3 - Update user verification status to true
    user.verified = true;
    await user.save();
    return res.status(200).send({
      message: "Account Verified",
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return Response(res, true, "Invalid Email", 409);
    }
    const hashedPassword = CryptoJs.AES.decrypt(
      user.password,
      process.env.PASSWORD_SECRET
    );
    const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
    if (originalPassword !== req.body.password) {
      return Response(res, true, "Wrong Credentials", 409);
    }

    const accessToken = CreateJwt(user);
    console.log(originalPassword, "hashedPassword", accessToken);
    const { password, ...others } = user._doc;
    Response(res, false, "success", 200, { ...others, accessToken });
  } catch (err) {
    Response(res, true, err, 401);
  }
});

module.exports = router;
function CreateJwt(user) {
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "7d" }
  );
  return accessToken;
}
