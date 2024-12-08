const express = require("express");
const UserModel = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const authMiddleware = require("../middleware/authMiddleware.js");
const router = express.Router();

const jwtSecret = "fasefraw4r5r3wq45wdfgw34twdfg";
router.use(cookieParser());

let userId = "";

/*REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send({ message: "Please enter all fields" });
  }
  try {
    const findUser = await UserModel.findOne({ email });
    if (findUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, async function (err, hash) {
        const user = await UserModel.create({
          name,
          email,
          password: hash,
        });
        const token = jwt.sign({ name, id: user._id, email }, jwtSecret);
        userId = user._id.toString();
        res.cookie("userId", userId);
        res.cookie("token", token,{
          httpOnly: true,
          secure: true, // Use true if on HTTPS
          sameSite: 'None', // Required for cross-origin
      });
        return res.status(200).send(user);
      });
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/*LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send({ message: "Please enter all fields" });
  }
  try {
    const findUser = await UserModel.findOne({ email });
    if (!findUser) {
      return res.status(400).send({ message: "User does not exists" });
    }
    bcrypt.compare(password, findUser.password, (err, result) => {
      if (result) {
        let token = jwt.sign(
          { name: findUser.name, id: findUser._id, email },
          jwtSecret
        );
        userId = findUser._id.toString();
        res.cookie("userId", userId);
        res.cookie("token", token,{
          httpOnly: true,
          secure: true, // Use true if on HTTPS
          sameSite: 'None', // Required for cross-origin
      });
        return res.status(200).send(findUser);
      } else {
        res.status(401).send({ message: "Password is incorrect" });
      }
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

/*GOOGLE SIGN IN*/
router.post("/googleSignin", async (req, res) => {
  const { name, email, firebaseUID } = req.body;

  try {
    let user = await UserModel.findOne({ firebaseUID });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        firebaseUID,
      });
    }

    const token = jwt.sign({ name, id: user._id, email }, jwtSecret);
    userId = user._id.toString();
    res.cookie("userId", user._id.toString());
    res.cookie("token", token,{
      httpOnly: true,
      secure: true, // Use true if on HTTPS
      sameSite: 'None', // Required for cross-origin
  });
    return res.status(200).send(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*USER ID */
router.get("/userId", authMiddleware, async (req, res) => {
  return res.status(200).send(req.user.id);
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserModel.findById(id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});


/*LOGOUT*/
router.post("/logout", authMiddleware, async (req, res) => {
  res.cookie("token", "");
  res.cookie("userId", "");
  res.status(200).json({ message: req.cookies });
});

module.exports = router;
