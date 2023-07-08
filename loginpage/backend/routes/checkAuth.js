const express = require('express');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const {checkAuth}=require("../modules/auth")


router.post("/", async (req, res) => {
    const { token,username} = req.body;

  
    const checkAuthResponsres= await checkAuth(token,username)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const data=checkAuthResponsres.data[0]
    res.json({ status: "ok", data });
  });
  
  module.exports=router;