const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const ratingsService = require('../services/ratings-service');
const authorize = require("../middleware/authorize");
const { PromiseHandler } = require('../utils/errorHandler');

router.post('/', authorize() , PromiseHandler(ratingsService.addRatings))

module.exports = router;