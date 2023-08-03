
const KiteConnect = require("kiteconnect").KiteConnect;
const express = require('express');
const router = express.Router();
const {checkAuth}=require("../modules/auth")


router.post("/", async(req,res)=>{
    const {token, variety, symbol, exchange, order_id}=req.body
    const checkAuthResponse=await checkAuth(token)
    if(!checkAuthResponse.status){
        res.status(500).json({ status: "error", msg: "jwt authintication failed" });
    }
    const userData=checkAuthResponse.data
    console.log(userData)   
    const api_key=userData.apiKey
    const access_token=userData.accessToken
    const kite = new KiteConnect({ api_key });
    kite.setAccessToken(access_token);
    kite.exitOrder(variety,order_id)
    .then(function(resp) {
        console.log(resp);
        res.send({status:true, order_id:resp})
    }).catch(function(err) {
        console.log(err);
        res.send({status:false, error:err})
    });
    
})

module.exports=router