const express = require('express');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";

router.post("/", async (req, res) => {
    const { token} = req.body;

  
    try {
      // Verify the token and extract the user's email
      const user = jwt.verify(token, JWT_SECRET);
      const userEmail = user.email;
  
      // Find the user in the database using the email
      User.findOne(
        { email: userEmail }
      )
        .then((userData) => {
          res.json({ status: "ok", data: userData });
        })
        .catch((error) => {
          res.status(500).json({ status: "error", data: error });
        });
    } catch (error) {
      res.status(500).json({ status: "error", data: error });
    }
  });
  
  module.exports=router;