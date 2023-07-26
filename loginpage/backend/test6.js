const KiteConnect = require("kiteconnect").KiteConnect;
const access_token="**************************"
const api_key="*******************"

const b=async ()=>{
// console.log("test",await kite.())
console.log(access_token, api_key)

//here perform any kite operations
const instruments = await kc.getOrders();
console.log(instruments)
}

function regularOrderPlace(variety) {
    kc.placeOrder(variety, {
            "exchange": "NSE",
            "tradingsymbol": "ITC",
            "transaction_type": "BUY",
            "quantity": 1,
            "product": "MIS",
            "order_type": "MARKET"
        }).then(function(resp) {
            console.log(resp);
        }).catch(function(err) {
            console.log(err);
        });
}
const kc= new KiteConnect({ api_key});
kc.setAccessToken(access_token);
// regularOrderPlace("regular")
// b()
