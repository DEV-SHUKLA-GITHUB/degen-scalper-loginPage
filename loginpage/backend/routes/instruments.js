const KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const WebSocket = require('ws');
const router = express.Router();
const User = require("../models/userDetails"); // Import the user schema from userDetails.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const csvtojson = require('csvtojson');
const cron = require('node-cron');
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
let instoken;
let instrumentsData=[];

// Create a directory 'data' to store the instrument.json file
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// Function to download the file, convert to JSON, and store it in instrument.json
const downloadInstrumentsData = async () => {
  try {
    const url = 'https://api.kite.trade/instruments';
    const response = await axios.get(url);
    const jsonData = await csvtojson().fromString(response.data);

    // Store the instruments data in instrument.json
    fs.writeFileSync(path.join(dataDir, 'instrument.json'), JSON.stringify(jsonData, null, 2));
    console.log('Instruments data downloaded and stored in instrument.json.');
  } catch (error) {
    console.error('Error downloading or converting instruments data:', error);
  }
};

// Read instruments data from instrument.json on server start
const instrumentDataPath = path.join(dataDir, 'instrument.json');
if (fs.existsSync(instrumentDataPath)) {
  const jsonData = fs.readFileSync(instrumentDataPath, 'utf-8');
  instrumentsData = JSON.parse(jsonData).map(instrument => ({
    ...instrument,
    expiry: instrument.expiry, // Convert the expiry date to a JavaScript Date object
  }));
  console.log('Instruments data loaded from instrument.json.');
} else {
  console.log('Instruments data not found. Downloading...');
  downloadInstrumentsData();
}

// Set up a cron job to download the file once every day (adjust the cron schedule as needed)
cron.schedule('0 0 * * *', downloadInstrumentsData); // This runs the function at midnight every day

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
      const filteredInstruments = instrumentsData.filter(
        (instrument) => instrument.name === (selected.name || selected) && instrument.segment === 'NFO-OPT'
      );

      const uniqueExpiryDates = Array.from(
        new Set(
          filteredInstruments.map((instrument) => new Date(instrument.expiry).getTime())
        )
      ).map((timestamp) => new Date(timestamp));

      const uniqueStrikes = Array.from(
        new Set(
          filteredInstruments.map((instrument) => instrument.strike)
        )
      );

      // Send the response to the client
      res.send({ uniqueExpiryDates, instruments, uniqueStrikes });
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
// let connectedClients = new Set();
// let firstClient = true
wss.on('connection', (ws) => {
  const subscribedInstruments = [];

  console.log('Client connected');
  var ticker, Token;

  ws.on('message', async (message) => {
    const initialData = JSON.parse(message);
    const { token, instrumentToken} = initialData;
    // console.log(instrumentToken)
    Token=[Number(instrumentToken)]

    // Use the received data (token, instrumentToken, email) for further processing or to retrieve the required tick data
    try {
      const user = jwt.verify(token, JWT_SECRET);
      const { email } = user;
      // console.log(email);
      const jsonData = await User.findOne({ email });

      // Extract the access token
      const { accessToken, apiKey } = jsonData.BrokerList.find(broker => broker.broker === "Zerodha");
      const access_token = accessToken;
      const api_key = apiKey;
      console.log("access_token",access_token)

      
        ticker = new KiteTicker({ api_key, access_token }); 

        function onTicks(ticks) {
          console.log("Ticks", ticks);
          ws.send(JSON.stringify(ticks));
          const instrumentTokens = clientInstrumentMap.get(ws);
          if (instrumentTokens && instrumentTokens.includes(ticks[0].instrument_token)) {
            // Send the ticks data to the current client
            // console.log("got it")
          }
        }

        function subscribe() {
          console.log("subscribe")
          // var items = [Number(instrumentToken)];
          console.log(instrumentToken)

          ticker.subscribe(instrumentToken)
          // instoken = ticker.subscribe(items);
          // console.log(ticker.subscribe(items), "hello")

          ticker.setMode(ticker.modeQuote, instrumentToken);
        }

        function unsubscribeFromPrevious() {
          subscribedInstruments.forEach((instrumentToken) => {
            ticker.unsubscribe(instrumentToken);
          });
          subscribedInstruments.length = 0; // Clear the array
        }

        ticker.connect();
        ticker.on("connect", () => {
          // unsubscribe(Number(instrumentToken)); // Unsubscribe from previously subscribed instrument tokens
          // unsubscribeFromPrevious(); // Unsubscribe from previously subscribed instrument tokens
          subscribe(); // Subscribe to the new instrument token
          // subscribedInstruments.push(Number(instrumentToken)); 
          // clientInstrumentMap.set(ws, [Number(instrumentToken)]); // Update the instrument token mapping
        });
        ticker.on("ticks", onTicks);
      
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
  ws.on("close",()=>{
    ticker&&ticker.disconnect()
    delete ticker
    console.log("182",ticker)
  })
});

server.listen(7000, () => {
  console.log('Server started on port 7000');
});

module.exports = router;