var KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const WebSocket = require('ws');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
 
router.post("/getInstruments",async (req,res)=>{
  const {email, username, token}=req.body
    
    try {
    const jsonData=await User.findOne({email})
    // console.log(jsonData)
     
    // Extract the access token
    const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
    //  console.log(accessToken, apiKey)
    const access_token=accessToken
    const api_key=apiKey
    const a=async ()=>{
    // console.log("test",await kite.())
    // Javascript example.
    console.log(access_token, api_key)
    const kite = new KiteConnect({ api_key});
    kite.setAccessToken(access_token);
    
    //here perform any kite operations
    const instruments=await kite.getInstruments(["NSE"])
    res.send(instruments)
    }
    a()
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

})







router.post("/getData",async (req,res)=>{
  const {token, instrumentToken,email}=req.body
  console.log(instrumentToken)
      
     try {
      const jsonData=await User.findOne({email})
    // console.log(jsonData)
     
    // Extract the access token
    const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
    //  console.log(accessToken, apiKey)
    const access_token=accessToken
    const api_key=apiKey
      const a=async ()=>{
        var ticker = new KiteTicker({api_key, access_token});
        function onTicks(ticks) {
          console.log("Ticks", ticks);
      }
      
      function subscribe() {
          var items = [Number(instrumentToken)];
          ticker.subscribe(items);
          ticker.setMode(ticker.modeQuote, items);
      }
    
        ticker.connect();
        ticker.on("connect", subscribe);
        ticker.on("ticks", onTicks);
        ticker.connect();
        
        ticker.on("connect", subscribe);
        ticker.on("ticks", onTicks);
}
a()
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
    });
  // res.send(instruments)
    
  
  

module.exports=router;

