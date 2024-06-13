const express = require("express");
const cors = require("cors");
const app = express();
const connectDB = require("../db/connect");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
require("dotenv").config();

const tokenBlacklist = new Set();
const router = express.Router();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// jwt token
function verifyJWT(req, res, next) {
  // console.log('token: ', req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("unauthorized access");
  }

  const token = authHeader.split(" ")[1];
  // console.log(token);

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
    if (err) {
      return res.status(403).send({ message: "forbidden access" });
    }

    req.decoded = decoded;

    next();
  });
}

// Signup route
router.post("/user/signup", async (req, res) => {
  console.log(req.body);
  const { fullName, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    // console.log(user);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "admin@gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.APP_USER,
        pass: process.env.APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "Homeoly",
        address: process.env.APP_USER,
      },
      to: user.email,
      subject: "OTP for Account Verification",
      text: `Your OTP code is ${otp}`,
      // html: `Your OTP code is <b>${otp}</b>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    res.status(200).send({ status: "OK", message: 'Successfully created.' });
  } catch (error) {
    res.status(500).send("Error in signup");
  }
});

// Verify OTP Route
router.post("/user/verify-otp", async (req, res) => {
  const { email, otp } = req.body;
  console.log("frontent otp", otp);
  try {
    const user = await User.findOne({ email });
    console.log("backend otp", user.otp);

    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).send("Invalid OTP");
    }
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).send("OTP verified successfully");
  } catch (error) {
    res.status(500).send("Error verifying OTP");
  }
});

// Sign in
router.post("/user/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const hashedPassword = user.password;
    const isCorrectPass = bcrypt.compare(password, hashedPassword);
    // console.log(isCorrectPass);

    if (!user || !isCorrectPass) {
      return res.status(400).send("Invalid email or password");
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ token, id: user._id});
  } catch (error) {
    res.status(500).send("Error in signin");
  }
});

// Token

const checkBlacklist = (req, res, next) => {
  const token = req.header("Authorization").replace("Bearer ", "");

  if (tokenBlacklist.has(token)) {
    return res.status(401).send("Token is invalid or expired");
  }

  try {
    const decoded = jwt.verify(token, "secret");
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send("Token is invalid or expired");
  }
};

// Sing out
router.get("/logout", (req, res) => {
  res.clearCookie("token"); // Clear the token from cookies
  res.status(200).json({ status: "logged out" });
});

module.exports = router;
