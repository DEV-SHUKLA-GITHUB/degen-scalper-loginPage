const KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const express = require('express');
const app=express()
const server=require("http").createServer(app)
const WebSocket = require('ws');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
 
router.post("/getInstruments",async (req,res)=>{
  const {selected, token}=req.body
  // console.log(selected)
    
    try {
      const user = jwt.verify(token, JWT_SECRET);
        const {email} = user;                 

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
    const instruments = await kite.getInstruments(["NFO"]);
    const orderHistory = await kite.getOrderHistory();

    const filteredInstruments = instruments.filter(
      (instrument) => instrument.name === selected.name && instrument.segment === 'NFO-OPT'
    );
    
    const uniqueExpiryDates = Array.from(
      new Set(
        filteredInstruments.map((instrument) => instrument.expiry.getTime())
      )
    ).map((timestamp) => new Date(timestamp));
    
    
    
    // res.send(instruments)
    res.send({uniqueExpiryDates,instruments})
    }
    a()
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }

})

//...................................................................................................

const wss = new WebSocket.Server({ port: 7000 }); // Replace port number as per your requirement

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const initialData = JSON.parse(message);
    // console.log("recived",initialData)
    const { token, instrumentToken, prev_instrumentToken } = initialData;
    console.log("token",instrumentToken)                                    
    // Use the received data (token, instrumentToken, email) for further processing or to retrieve the required tick data
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const {email} = user; 
      console.log(email)
      const jsonData=await User.findOne({email})
    // Extract the access token
    const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
    const access_token=accessToken
    const api_key=apiKey
      const a=async ()=>{
        var ticker = new KiteTicker({api_key, access_token});
        function onTicks(ticks) {
          console.log("Ticks", ticks);
          // console.log(ticks[0].instrument_token)
          console.log("\n\n\n\n\n")
        ws.send(JSON.stringify(ticks));
      }
      function subscribe() {
          var items = [Number(instrumentToken)];
          ticker.subscribe(items);
          ticker.setMode(ticker.modeQuote, items);
      }
      function unsubscribe() {
        var items = [Number(prev_instrumentToken)];
        ticker.subscribe(items);
        console.log(`token ${prev_instrumentToken} is unsubscribed`)
        // ticker.setMode(ticker.modeQuote, items);
    }
        // ticker.disconnect()
        ticker.connect();
        ticker.on("connect", ()=>{
          if(prev_instrumentToken!=""){
            console.log(prev_instrumentToken)
            unsubscribe()}
          
          subscribe()});
        ticker.on("ticks", onTicks);     
}
a()
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

//....................................................................................................

module.exports=router;