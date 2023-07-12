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
  console.log("email",email)
  
  // Read the file contents
  // fs.readFile('./auth/zerodha_access_token.json', 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Error reading file:', err);
  //     return;
  //   }
    
   try {
     // Parse the JSON data
    //  const jsonData = JSON.parse(data);
    const jsonData=await User.findOne({email})
     
     // Extract the access token
    //  const {access_token, api_key} = jsonData.BrokerList.filter(broker=>broker.broker=="Zerodha");
     
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
      //   console.log(await kite.getLTP(["NSE:RELIANCE", "NSE:NIFTY 50"]))
      // const quote=kite.getQuote(`NSE:${instrumentName}`)
      //   console.log("test",await kite.getInstruments(["NSE"]))
      const instruments=await kite.getInstruments(["NSE"])
      res.send(instruments)
      
      
      
      //here perform any kite operations
    }
    a()
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
// });
// res.send(instruments)

})







router.post("/getData",async (req,res)=>{
  const {token, instrumentName,email}=req.body
  console.log(instrumentName)
  
  
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
        console.log(await kite.getLTP(["NSE:NIFTY 50"]))
        const quote=await kite.getLTP([`NSE:NIFTY 50`])
        console.log(`NSE:${instrumentName}`)

        res.send(quote)
    
    
    
        //here perform any kite operations
      }
      a()
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
    });
  // res.send(instruments)
    
  })
  

module.exports=router;

