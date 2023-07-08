const KiteConnect = require("kiteconnect").KiteConnect;
const WebSocket = require('ws');
const fs = require('fs');
const express = require('express');
const router = express.Router();
const User = require("../../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";

router.post("/getInstruments",(res,req)=>{
    
// Read the file contents
fs.readFile('./auth/zerodha_access_token.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
   var KiteTicker = require("kiteconnect").KiteTicker;
    
   try {
      // Parse the JSON data
      const jsonData = JSON.parse(data);
      
      // Extract the access token
      const {access_token, api_key} = jsonData;
  
            const a=async ()=>{
              // console.log("test",await kite.())
              // Javascript example.
              const kite = new KiteConnect({ api_key});
              kite.setAccessToken(access_token);
              console.log(await kite.getOrders())
  
              //write http requests methods here
  
      //         var ticker = new KiteTicker({api_key, access_token});
      //         function onTicks(ticks) {
      //           console.log("Ticks", ticks);
      //       }
            
      //       function subscribe() {
      //           var items = [256265];
      //           ticker.subscribe(items);
      //           ticker.setMode(ticker.modeQuote, items);
      //       }
          
      //         ticker.connect();
      //         ticker.on("connect", subscribe);
      //         ticker.on("ticks", onTicks);
      //         ticker.connect();
              
      //         ticker.on("connect", subscribe);
      //         ticker.on("ticks", onTicks);
              
      // var ws = new WebSocket(`wss://ws.kite.trade?api_key=${api_key}&access_token=${access_token}`);
          // console.log(ws)
      // console.log(await kite.getLTP(["NSE:RELIANCE", "NSE:NIFTY 50"]))
      console.log("test",await kite.getInstruments(["NSE"]))
      const instruments=await kite.getInstruments(["NSE"])
      res.json(instruments)
  
  
  
      //here perform any kite operations
    }
    a()
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
  });
  
})

module.exports=router;

