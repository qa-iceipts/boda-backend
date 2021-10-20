const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const validate = require('../utils/validator')
const {
    mpesaSubscribe,
    mpesaCallback
} = require('../services/mpesa-service')
const axios = require('axios').default;
const {
    getOAuthToken,
    lipaNaMpesaOnline
} = require('../utils/mpesa')
const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")


router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to Mpesa Payment Route');
});

router.post('/subscribe', verifyAccessToken, function (req, res) {
    verifyUser(req, "driver")
        .then(mpesaSubscribe(req, res)
            .then(result => {
                res.status(HttpStatus.StatusCodes.OK).send(result);
            }).catch(err => {
                if(err.status=1114){
                    res.status(HttpStatus.StatusCodes.BAD_REQUEST).send(err)
                }
                else{
                    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err)
                }
            })).catch(err => {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err)
        });
}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get('/auth', getOAuthToken, lipaNaMpesaOnline, function (req, res) {
    res.send(req.token)

});

router.post('/lipa-na-mpesa-callback', function lipaNaMpesaOnlineCallback(req, res) {

    // console.log("callback mpesa REQ Body::", req.body)
    // console.log("callback mpesa ::", req.body.Body.stkCallback)
    // //Get the transaction description
    // let message = req.body.Body.stkCallback['ResultDesc'];

    // return res.send({
    //     success: true,
    //     message
    // });

    let obj = {
        MerchantRequestID: req.body.MerchantRequestID,            
        CheckoutRequestID: req.body.CheckoutRequestID,        
    }
    mpesaCallback(obj).then(result => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err)
    })


});


module.exports = router;