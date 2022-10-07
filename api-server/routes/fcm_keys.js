const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const fcmService = require('../services/fcm-service');
const authorize = require("../middleware/authorize")
const ROLE = require("../utils/roles");
const { PromiseHandler } = require('../utils/errorHandler');


router.post('/', authorize(), PromiseHandler(fcmService.addFcmKey))

router.post('/getTokensByIds', PromiseHandler(fcmService.getTokensByIds))

module.exports = router;