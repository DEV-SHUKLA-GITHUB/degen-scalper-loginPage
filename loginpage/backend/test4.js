const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const path = require('path');

const access_token = "G1wmukgRdwOVobTrTKhvc6tLcXPiM1c6";
const api_key = "elrfps73mpn9aou4";

const a = async () => {
  const kite = new KiteConnect({ api_key });
  kite.setAccessToken(access_token);
  
  // Perform any kite operations here
  const instruments = await kite.getInstruments(["NFO"]);    
  const arrayOfTokens = instruments.map(item => Number(item.instrument_token));

  // Convert the array to JSON format
  const jsonData = JSON.stringify(arrayOfTokens, null, 2);

  // Specify the file path where you want to save the data
  const filePath = path.join(__dirname, 'tokens.json');

  // Write the JSON data to the file
  fs.writeFile(filePath, jsonData, 'utf8', (err) => {
    if (err) {
      console.error("Error writing file:", err);
    } else {
      console.log("Array of tokens has been saved to tokens.json");
    }
  });
};

a();
