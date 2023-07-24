
const KiteConnect = require("kiteconnect").KiteConnect;

// const a=async ()=>{
//     const kite = new KiteConnect({api_key: "elrfps73mpn9aou4"});
//     kite.setAccessToken("sHk84Sen4YcxKgvJwo6lORoWoykajqcK");
//     const instruments = await kite.getInstruments(["NFO"]);

//     console.log(instruments)
// }
//here perform any kite operations
const access_token="cdyxU82oXX7E0Q5eC0al0g6X7lPnEh83"
const api_key="elrfps73mpn9aou4"
const b=async ()=>{
// console.log("test",await kite.())
// Javascript example.
console.log(access_token, api_key)
const kite = new KiteConnect({ api_key});
kite.setAccessToken(access_token);

//here perform any kite operations
const instruments = await kite.getOrders();
console.log(instruments)
}
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
b()