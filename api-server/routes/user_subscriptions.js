const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const { PromiseHandler } = require('../utils/error_handler')
const HttpStatus = require('http-status-codes');
const userService = require('../services/user-service');
const { validate, superSchema } = require('../utils/validator')
const ROLE = require('../utils/roles')
const {
    verifyAccessToken,
    authorize
} = require("../utils/verifytoken")

router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to User Subscriptions');
});

router.put('/deactivate', verifyAccessToken,authorize(ROLE.ADMIN), PromiseHandler(userService.login))

module.exports = router
