const express = require('express');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { route } = require('./register');
const brokerValidator = require("../validateBrokerCreds")
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";

router.post("/", async (req, res) => {
    
    var isValidated=false;
    const { token, BrokerList } = req.body;
    
  const obj={
    broker_user_id : BrokerList.userId,
    broker_user_password : BrokerList.password,
    api_key : BrokerList.apiKey,
    api_secret : BrokerList.secretKey,
    totp_token : BrokerList.totp,
    redirect_url : "http://localhost:8000",
    broker_name: BrokerList.broker}
    const response=await brokerValidator(obj)
    isValidated=response.validCreds

    try {
      // Verify the token and extract the user's email
      const user = jwt.verify(token, JWT_SECRET);
      const userEmail = user.email;
      // Find the user in the database using the email
      if(isValidated){
        User.findOneAndUpdate(
          { email: userEmail }, // Find the user by email
          { $push: { BrokerList } }, // Push the form data to the formData array
          { new: true } // Return the updated document
        )
          .then((userData) => {
            console.log("updated")
            res.json({ status: "ok", data: userData });
          })
          .catch((error) => {
            res.status(500).json({ status: "error", data: error });
          });
      }
    } catch (error) {
      res.status(500).json({ status: "error", data: error });
    }
  });
  

module.exports=router;