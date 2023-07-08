const express = require('express');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
const checkAuth=(token)=>{
    try {
        // Verify the token and extract the user's email
        const user = jwt.verify(token, JWT_SECRET);
        const userEmail = user.email;
    
        // Find the user in the database using the email
        User.findOne(
          { email: userEmail }
        )
          .then((userData) => {
            return { status: "ok", data: userData };
          })
          .catch((error) => {
            return { status: "error", data: userData };;
          });
      } catch (error) {
        console.log(error)
      }

}
module.export=checkAuth