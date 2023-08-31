const express = require('express');
const router = express.Router();
const {checkAuth}=require("../modules/auth")
const User = require("../models/userDetails");


router.post("/",async (req,res)=>{
    try{const {token, stopLoss, trailingStopLoss, stopLossTSL}=req.body

    // console.log("\n\n\n\n\n\n\n\n\n\n\n\n",token)
    const checkAuthResponse=await checkAuth(token)
    // console.log(checkAuthResponse)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const userData=checkAuthResponse.data
    res.send({Cache:userData.Cache})
}catch(e){
        console.log(e)
    }
    
})

module.exports=router