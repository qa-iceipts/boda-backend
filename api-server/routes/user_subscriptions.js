const express = require('express');
const router = express.Router();
const { PromiseHandler } = require('../utils/errorHandler')

router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to User Subscriptions');
});

// router.put('/deactivate', authorize(role.ADMIN), PromiseHandler(userService.login))

module.exports = router
