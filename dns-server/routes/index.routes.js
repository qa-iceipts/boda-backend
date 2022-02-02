'use strict';
const path = require('path')
const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');
const { sendNotifications } = require('../services/notifications-service')
const { getPickupRequests, quotePrice } = require('../services/pickup-service')
const { getChats } = require('../services/chats')

const { PromiseHandler } = require('../utils/errorHandler')

// simple route
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

router.get('/health', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/health.html'))
})

router.post("/sendNotification", (req, res) => {
    console.log("notification called")
    let notificationObj = {
        title: "Sale",
        body: "get 10% off now"
    }
    sendNotifications(req.body.tokens, notificationObj).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });

})

router.post("/getMsgs", PromiseHandler(getChats));

router.post("/getPickupRequests", PromiseHandler(getPickupRequests))

router.post("/quotePrice", PromiseHandler(quotePrice))

module.exports = router