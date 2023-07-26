
const KiteTicker = require("kiteconnect").KiteTicker;
const KiteConnect = require("kiteconnect").KiteConnect;
const access_token="******************************"
const api_key="***********"
const b=async ()=>{
// console.log("test",await kite.())
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
      console.log("Ticks", ticks.length);
      // console.log(ticks[0].instrument_token)
      console.log("\n\n\n\n\n")
    // ws.send(JSON.stringify(ticks));
  }
  function subscribe() {
      var items = [
        8963842, 10930434, 8972290,  8963586, 10929154, 8972034,
        9045506, 10930690, 8982786,  9046530, 10930946, 8983042,
       10056194, 10932226, 8983298, 10057474, 10933250, 8983554,
       10057730, 10933506, 8985346, 10058242, 10933762, 9004802,
       10394882, 10935554, 9005058, 10398466, 10936066, 9008642,
       11576578, 10937858, 9008898, 11577858, 10938626, 9009154,
       12120322, 10942466, 9009410, 12291842, 10942722, 9009922,
       12292098, 10944002, 9011202, 12292354, 10944258, 9011458,
       12292610, 10944514, 9011970, 12292866, 10946562, 9019394,
       12293122, 10946818, 9022466, 12293378, 10947074, 9023234,
       12293634, 10947842, 9058562, 12293890, 10948610, 9059330,
       12294146, 10948866, 9073410, 12294402, 10949122, 9073666,
       12295682, 10949890, 9545986, 12295938, 10950146, 9546242,
       12296194, 10950914, 9684482, 12296450, 10951426, 9684738,
       12296706, 10951938, 9907202, 12296962, 10953730, 9907458,
       12297218, 10953986, 9907714, 12297474, 10954242, 9907970,
       12297730, 10954498, 9910786, 12297986]
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
      // if(prev_instrumentToken!=""){
      //   console.log(prev_instrumentToken)
      //   unsubscribe()}
      
      subscribe()});
    ticker.on("ticks", onTicks);     
}
a()