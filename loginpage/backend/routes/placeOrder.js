const KiteTicker = require("kiteconnect").KiteTicker;
const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const router = express.Router();
const JWT_SECRET = "slkdfjlasdfkajsdlkfaksdflaksdjfoajsdofjodsf";
const KiteConnect = require("kiteconnect").KiteConnect;
const {checkAuth}=require("../modules/auth")

router.post("/", async (req, res) => {
    const {symbol, qty, transaction_type,product,variety, token, } = req.body;
    console.log({symbol, qty, transaction_type,product,variety, token, } )
    try {
        const checkAuthResponse = await checkAuth(token)
        if(!checkAuthResponse.status){
            res.status(500).json({ status: "error", msg: "jwt authintication failed" });
        }
        const { accessToken, apiKey } = checkAuthResponse.data.BrokerList.find(broker => broker.broker === "Zerodha");
        const access_token = accessToken;
        const api_key = apiKey;

        const kite = new KiteConnect({ api_key });
        kite.setAccessToken(access_token);
        function regularOrderPlace(variety) {
            return kite.placeOrder(variety, {
                    "exchange": "NFO",
                    "tradingsymbol": symbol,
                    "transaction_type": transaction_type,
                    "quantity": qty*50,
                    "product": product,
                    "order_type": "MARKET"
                }).then(function(resp) {
                    console.log(resp);
                }).catch(function(err) {
                    console.log(err,"error");
                });
        }
        const orderId = await regularOrderPlace(variety);
        if(orderId){
            res.send({status:true,orderId:orderId});
        }else{
            res.send({status:false});
        }

    
    }
    catch{
        res.send({status:false});
    }
})
module.exports=router