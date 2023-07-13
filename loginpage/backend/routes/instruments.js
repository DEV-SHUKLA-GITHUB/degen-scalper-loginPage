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

router.post("/getInstruments", async (req, res) => {
  const { email, username, token } = req.body;
  console.log("email", email);

  try {
    const jsonData = await User.findOne({ email });

    const a = async () => {
      const { access_token, api_key } = jsonData.BrokerList.filter(
        (broker) => broker.broker == "Zerodha"
      )[0];

      const kite = new KiteConnect({ api_key });
      kite.setAccessToken(access_token);
      console.log(await kite.getOrders());

      const instruments = await kite.getInstruments(["NSE"]);
      res.send(instruments);
    };
    a();
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});

router.post("/getData", async (req, res) => {
  const { token, instrumentName, email } = req.body;
  console.log(instrumentName);

  fs.readFile('./auth/zerodha_access_token.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }
    
    try {
      const jsonData = JSON.parse(data);
      const { access_token, api_key } = jsonData;

      const a = async () => {
        const kite = new KiteConnect({ api_key });
        kite.setAccessToken(access_token);
        console.log(await kite.getOrders());

        console.log(await kite.getLTP(["NSE:NIFTY 50"]));
        const quote = await kite.getLTP([`NSE:${instrumentName}`]);
        console.log(`NSE:${instrumentName}`);
        res.send(quote);
      };
      a();
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  });
});

module.exports = router;
