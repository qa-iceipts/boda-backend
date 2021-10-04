'use strict';

const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const { sendNotifications } = require('../services/notifications-service')
const { getPickupRequests ,quotePrice} = require('../services/pickup-service')
// simple route
router.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to webscoket server." });
});
router.post("/sendNotification", (req, res) => {
    console.log("notification called")
   let notificationObj= {
        title : "Sale",
        body : "get 10% off now"
    }
    sendNotifications(req.body.tokens,notificationObj).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });

}, (err) => {
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});


router.post("/getPickupRequests", (req, res) => {
    console.log("getPickupRequests called")

    getPickupRequests(req.body).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        if(err.status == 1114){
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        }else{
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
        
    });

}, (err) => {
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post("/quotePrice", (req, res) => {
    console.log("quotePrice called")

    quotePrice(req.body).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        if(err.status == 1114){
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        }else{
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
        
    });

}, (err) => {
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

module.exports = router