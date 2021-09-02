const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
// const userVehiclesService = require('../services/user_vehicles-service');
const validate = require('../utils/validator')
const axios = require('axios').default;
const {getOAuthToken,lipaNaMpesaOnline} = require('../utils/mpesa')
const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")


router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to Mpesa Payment Route');
});

router.get('/auth',getOAuthToken,lipaNaMpesaOnline,function (req, res){
    res.send(req.token)
    
});

router.post('/lipa-na-mpesa-callback',function lipaNaMpesaOnlineCallback(req,res){
        console.log("callback mpesa ::",req.body.Body.stkCallback)
    //Get the transaction description
    let message = req.body.Body.stkCallback['ResultDesc'];

    return res.send({
        success:true,
        ss:"hyy",
        message
    });
        
});





module.exports = router;