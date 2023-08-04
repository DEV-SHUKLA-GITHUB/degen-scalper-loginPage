
const KiteConnect = require("kiteconnect").KiteConnect;
const express = require('express');
const router = express.Router();
const {checkAuth}=require("../modules/auth")


router.post("/", async(req,res)=>{
    try{const {token, symbol}=req.body
    const checkAuthResponse=await checkAuth(token)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const userData=checkAuthResponse.data
    // console.log(userData)   
    const api_key=userData.BrokerList[0].apiKey
    const access_token=userData.BrokerList[0].accessToken
    // console.log(api_key, access_token)
    const kite = new KiteConnect({ api_key });
    kite.setAccessToken(access_token)
    const tradebook=await kite.getTrades()
    // console.log(tradebook)
    tradebook.map(trade=>{
        // console.log(trade)
        if(trade.tradingsymbol===symbol){
        if(trade.transaction_type==='BUY'){
            console.log(trade)
            const variety="regular"
            kite.placeOrder(variety,{
                "exchange": trade.exchange,
                "tradingsymbol": symbol,
                "transaction_type": "SELL",
                "quantity": trade.quantity,
                "product": trade.product,
                "order_type": "MARKET"
            })
                .then(function(resp) {
                    console.log(resp);
                    res.send({status:true, order_id:resp})
                }).catch(function(err) {
                    console.log(err);
                    res.send({status:false, error:err})
                });}else{
                    
            console.log(trade)
            const variety="regular"
            kite.placeOrder(variety,{
                "exchange": trade.exchange,
                "tradingsymbol": symbol,
                "transaction_type": "BUY",
                "quantity": trade.quantity,
                "product": trade.product,
                "order_type": "MARKET"
            })
                .then(function(resp) {
                    console.log(resp);
                    res.send({status:true, order_id:resp})
                }).catch(function(err) {
                    console.log(err);
                    res.send({status:false, error:err})
                });
                }
            }
    })}catch(err){
        console.log(err)
    }


    
})

module.exports=router