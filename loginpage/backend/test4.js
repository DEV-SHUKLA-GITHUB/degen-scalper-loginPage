const KiteConnect = require("kiteconnect").KiteConnect;
const fs = require('fs');
const path = require('path');

const access_token = "ls8tPJ1IMMwuz6FAIP3PUBLAAe7ThajU";
const api_key = "elrfps73mpn9aou4";

const a = async () => {
  const kc = new KiteConnect({ api_key });
  kc.setAccessToken(access_token);
  const positions=await kc.getOrders()
  console.log(positions)
  // const tradeBook=kc.getTrades()
  // let buy=0, sell=0
  // tradeBook.map(trade=>{
  //   if(trade.transaction_type==='BUY'){
  //     buy+=trade.average_price*trade.quantity
  //   }else{
  //     sell+=trade.average_price*trade.quantity
  //   }
  // })

    
  
  // const arrayOfTokens = instruments.map(item => Number(item.instrument_token));

  // // Convert the array to JSON format
  // const jsonData = JSON.stringify(arrayOfTokens, null, 2);

  // // Specify the file path where you want to save the data
  // const filePath = path.join(__dirname, 'tokens.json');

  // Write the JSON data to the file
  // fs.writeFile(filePath, jsonData, 'utf8', (err) => {
  //   if (err) {
  //     console.error("Error writing file:", err);
  //   } else {
  //     console.log("Array of tokens has been saved to tokens.json");
  //   }
  // });
};

a();
