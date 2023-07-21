const KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const WebSocket = require('ws');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
let instoken;
router.post("/getInstruments", async (req, res) => {
  const { selected, token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const { email } = user;

    const jsonData = await User.findOne({ email });

    // Extract the access token
    const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
    const access_token = accessToken; 
    const api_key = apiKey;

    const a = async () => {
      const kite = new KiteConnect({ api_key });
      kite.setAccessToken(access_token);

      // Perform any kite operations here
      const instruments = await kite.getInstruments(["NFO"]);    
      const filteredInstruments = instruments.filter(
        (instrument) => instrument.name === (selected.name || selected ) && instrument.segment === 'NFO-OPT',
      // instoken = selected.name
    // } 
      
      );

      const uniqueExpiryDates = Array.from(
        new Set(
          filteredInstruments.map((instrument) => instrument.expiry.getTime())
        )
      ).map((timestamp) => new Date(timestamp));

      const uniqueStrikes = Array.from(
        new Set(
          filteredInstruments.map((instrument) => instrument.strike)
        )
      );
      // console.log(uniqueStrikes,"unique")
      // console.log(uniqueExpiryDates,"unique")

      // Send the response to the client
      res.send({ uniqueExpiryDates, instruments,uniqueStrikes });
    };

    a();
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

// WebSocket server code
const wss = new WebSocket.Server({ server });

// Store the WebSocket connection and selected instrument token mapping for each client
const clientInstrumentMap = new Map();

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const initialData = JSON.parse(message);
    const { token, instrumentToken, email } = initialData;   
  
    // Use the received data (token, instrumentToken, email) for further processing or to retrieve the required tick data
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const { email } = user;
      console.log(email);
      const jsonData = await User.findOne({ email });
  
      // Extract the access token
      const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
      const access_token = accessToken;
      const api_key = apiKey;
  
      const a = async () => {
        const ticker = new KiteTicker({ api_key, access_token });
  
        function onTicks(ticks) {
          console.log("Ticks", ticks);
          const instrumentTokens = clientInstrumentMap.get(ws);
          if (instrumentTokens && instrumentTokens.includes(ticks[0].instrument_token)) {
            // Send the ticks data to the current client
            console.log("got it")
            ws.send(JSON.stringify(ticks));
          }
        }
  
        function subscribe() {
          var items = [Number(instrumentToken)];
          ticker.subscribe(items)
          instoken = ticker.subscribe(items);
          console.log(ticker.subscribe(items),"hello")

          ticker.setMode(ticker.modeQuote, items);
        }
  
        function unsubscribe() {
          let instrumentTokens = [];
          const existingInstrumentTokens = clientInstrumentMap.get(ws);
          console.log(instoken)
          if (instoken) {
            // instrumentTokens = existingInstrumentTokens;
            ticker.unsubscribe(instoken);
          }
        }
  
        ticker.connect();
        ticker.on("connect", () => {
          unsubscribe(Number(instrumentToken)); // Unsubscribe from previously subscribed instrument tokens
          subscribe(); // Subscribe to the selected instrument token
          clientInstrumentMap.set(ws, [Number(instrumentToken)]); // Update the instrument token mapping
        });
        ticker.on("ticks", onTicks);
      };
  
      a();
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});

server.listen(7000, () => {
  console.log('Server started on port 7000');
}); 

module.exports = router;