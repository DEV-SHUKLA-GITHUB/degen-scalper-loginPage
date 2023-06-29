const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./userDetails"); // Import the user schema from userDetails.js
app.use(express.json());

const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";

const mongoUrl = "mongodb://localhost:27017/register"; // Update the MongoDB connection URL if necessary
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => console.log(e));

app.post("/register", async (req, res) => {
  const { FullName, email, password, Username } = req.body;
  const encrypted = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(400).json({ error: "User with this email already exists" });
    }
    await User.create({
      FullName,
      email,
      password: encrypted,
      Username,
    });
    res.send({ status: "ok" });
  } catch (error) {
    console.log("Error in registration:", error);
    res.send({ status: "error" });
  }
});

app.post("/check", async (req, res) => {
  const { email, Username } = req.body;
  try {
    const emailExists = await User.exists({ email });
    const usernameExists = await User.exists({ Username });
    res.json({ emailExists, usernameExists });
  } catch (error) {
    console.log("Error checking email and username:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.send({ error: "User Not Exists" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET);

    if (res.status(201)) {
      return res.json({
        status: "ok",
        data: token,
      });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "invalid password" });
});

app.post("/userData", (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

app.listen(8000, () => {
  console.log("Server started on port 8000");
});
