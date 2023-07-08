const KiteConnect = require("kiteconnect").KiteConnect;
// const WebSocket=require("./websockets")
// const http = require('http');
// const httpServer = http.createServer();
const WebSocket = require('ws');


// const { io } = require("socket.io-client");
// const io = require('socket.io')(httpServer);

// const api_key="elrfps73mpn9aou4"

const fs = require('fs');

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

          //   var ticker = new KiteTicker({api_key, access_token});
          //   function onTicks(ticks) {
          //     console.log("Ticks", ticks);
          // }
          
          // function subscribe() {
          //     var items = [738561];
          //     ticker.subscribe(items);
          //     ticker.setMode(ticker.modeQuote, items);
          // }
        
          //   ticker.connect();
          //   ticker.on("connect", subscribe);
          //   ticker.on("ticks", onTicks);
          //   ticker.connect();
            
          //   ticker.on("connect", subscribe);
          //   ticker.on("ticks", onTicks);
            
    // var ws = new WebSocket(`wss://ws.kite.trade?api_key=${api_key}&access_token=${access_token}`);
        // console.log(ws)
    // console.log("test",await kite.getLTP(["NSE:RELIANCE", "NSE:SBIN"]))
    console.log("test",await kite.getProfile())


    //here perform any kite operations
  }
  a()
} catch (error) {
  console.error('Error parsing JSON:', error);
}
});


