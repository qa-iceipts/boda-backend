const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const role = require('../utils/roles')
const authorize = require("../middleware/authorize");
const { PromiseHandler } = require('../utils/errorHandler');
const mpesaService = require('../services/mpesa-service')
const {
    getOAuthToken,
    lipaNaMpesaOnline
} = require('../utils/mpesa')

router.post('/subscribe', authorize(role.DRIVER),PromiseHandler(getOAuthToken),PromiseHandler(mpesaService.mpesaSubscribe))

router.get('/auth', getOAuthToken, lipaNaMpesaOnline, function (req, res) {
    res.send(req.token)

});

router.post('/lipa-na-mpesa-callback', function lipaNaMpesaOnlineCallback(req, res) {

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