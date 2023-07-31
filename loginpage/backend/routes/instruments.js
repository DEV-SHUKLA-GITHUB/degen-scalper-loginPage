const KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const server = require("http").createServer(app);
const WebSocket = require('ws');
const router = express.Router();
const User = require("../models/userDetails"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const csvtojson = require('csvtojson');
const cron = require('node-cron');
const { json } = require("body-parser");
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
let instoken;
let instrumentsData = [];

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
    console.log(jsonData, "json data");

    // Filter the jsonData array based on the given conditions
    const filteredData = jsonData.filter(item => {
      return (
        item.name === "NIFTY" ||
        item.name === "BANKNIFTY" ||
        item.name === "FINNIFTY"
      );
    });
console.log(filteredData,"filteredData")
    // Store the filtered instruments data in instrument.json
    fs.writeFileSync(
      path.join(dataDir, 'instrument.json'),
      JSON.stringify(filteredData, null, 2)
    );

    console.log('Instruments data downloaded, filtered, and stored in instrument.json.');
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

      const orderbook = await kite.getOrders();
      console.log(orderbook, "orderbook");

      // Perform any kite operations here
      const instruments = await kite.getInstruments(["NFO"]);
      console.log(instruments, "instruments");
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
      res.send({ uniqueExpiryDates, instruments, uniqueStrikes, orderbook, accountName: jsonData.BrokerList[0].accountName });
    };

    a();
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

// WebSocket server code
const wss = new WebSocket.Server({ server });

// Store the WebSocket connection and ticker mapping for each client
const clientTickerMap = new Map();

// Function to set up the WebSocket connection and ticker
const setupWebSocket = (ws, api_key, access_token, instrumentToken) => {
  const ticker = new KiteTicker({ api_key, access_token });

  function onTicks(ticks) {
    // Check if the WebSocket connection is still open before sending data
    if (ws.readyState === WebSocket.OPEN) {
      // Send the ticks data to the current client
//       ws.send(JSON.stringify(ticks));
    }
  }

  function subscribe() {
    var items = [Number(instrumentToken)];
    ticker.subscribe(items);
    instoken = ticker.subscribe(items);
    console.log(ticker.subscribe(items), "hello");

    ticker.setMode(ticker.modeQuote, items);
  }

  function unsubscribe() {
    if (instoken) {
      ticker.unsubscribe(instoken);
      console.log("Unsubscribed from instrument token:", instoken);
      instoken = null;
    }
  }

  // Close the previous ticker instance for this client, if any
  unsubscribe();

  ticker.connect();
  ticker.on("connect", () => {
    subscribe(); // Subscribe to the selected instrument token
  });
  ticker.on("ticks", onTicks);

  // Save the current ticker instance in the map for this client
  clientTickerMap.set(ws, ticker);
};

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    const initialData = JSON.parse(message);
    const { token, instrumentToken, email } = initialData;
    // console.log(instrumentToken)

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
          // console.log("Ticks", ticks);
          ws.send(JSON.stringify(ticks));
          // const instrumentTokens = clientInstrumentMap.get(ws);
          // if (instrumentTokens && instrumentTokens.includes(ticks[0].instrument_token)) {
            //   // Send the ticks data to the current client
            //   // console.log("got it")
            // }
          }
          
          function subscribe(instrumentToken) {
            // console.log("inside subscribe", instrumentToken)
            console.log(instrumentToken)
            var items = instrumentToken;
            ticker.subscribe(instrumentToken);
            // instoken = ticker.subscribe(items);
            // console.log(ticker.subscribe(items), "hello");
            
            ticker.setMode(ticker.modeQuote, items);
          }
          
          // function unsubscribe(instrumentToken) {
            //   let instrumentTokens = clientInstrumentMap.get(ws);
            //   console.log(instrumentTokens, "up");
            //   console.log(instoken, "instoken");
            //   if (instrumentTokens) {
              //     const index = instrumentTokens.indexOf(Number(instrumentToken));
              //     if (index > -1) {
                //       instrumentTokens.splice(index, 1);
                //       ticker.unsubscribe(instoken);
                //     }
                //   }
                // }
                
                ticker.connect();
                ticker.on("connect", () => {
                    subscribe(instrumentToken); 
        });
        ticker.on("ticks", onTicks);

      };

      a();
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });

  ws.on('close', () => {
    // Close the ticker instance for this client when the WebSocket connection is closed
    const ticker = clientTickerMap.get(ws);
    if (ticker) {
      ticker.disconnect();
      clientTickerMap.delete(ws);
    }
  });
});

server.listen(7000, () => {
  console.log('Server started on port 7000');
});

module.exports = router;
