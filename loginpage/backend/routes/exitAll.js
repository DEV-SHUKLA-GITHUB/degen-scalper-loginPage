
const KiteConnect = require("kiteconnect").KiteConnect;
const express = require('express');
const router = express.Router();
const {checkAuth}=require("../modules/auth")


router.post("/", async(req,res)=>{
    const {token}=req.body
    const checkAuthResponse=await checkAuth(token)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const userData=checkAuthResponse.data
    console.log(userData)   
    try{const api_key=userData.apiKey
    const access_token=userData.accessToken
    const kite = new KiteConnect({ api_key });
    kite.setAccessToken(access_token);
    const orderbook = kite.getOrders()
    orderbook.map(order=>{
        if(order.status=='COMPLETE'){
        const {order_id}=order
        const variet="normal"
        kite.exitOrder(variety, order_id)
            .then(function(resp) {
                console.log(resp);
            }).catch(function(err) {
                console.log(err);
            });
        }
    })}
    catch(err){
        res.send({status: false, error:err})
    }
    res.send({status : true})
})

module.exports=router