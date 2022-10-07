const express = require('express');
const router = express.Router();

const subscriptionsService = require('../services/subscriptions-service');
const { getUserSubscriptions } = require('../services/subscriptions-service');
const authorize = require("../middleware/authorize")
const { PromiseHandler } = require('../utils/errorHandler');


router.get('/', authorize(), PromiseHandler(subscriptionsService.getSubscriptions))

router.get('/userSubscription/:userId', authorize(), PromiseHandler(getUserSubscriptions))

module.exports = router;