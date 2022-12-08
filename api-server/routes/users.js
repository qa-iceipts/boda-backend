const express = require('express');
const router = express.Router();
const role = require('../utils/roles')
const { PromiseHandler } = require('../utils/errorHandler')
const userService = require('../services/user-service');
const authorize = require("../middleware/authorize")

const { authMiddleware } = require('../middleware/firebase_middleware');
// Routes
router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to Users');
});

router.post('/addUser', PromiseHandler(userService.addUser), PromiseHandler(userService.login))

router.post('/login/:roleName', authMiddleware, PromiseHandler(userService.login))

router.get('/getUser/:id', authorize(), PromiseHandler(userService.getUserById))

router.put('/updateUser/:userId', authorize(), PromiseHandler(userService.updateUser))

router.patch('/patchUser/:userId', authorize(), PromiseHandler(userService.patchUser))

router.post('/logout', authorize(), PromiseHandler(userService.logout))

router.post('/refreshToken', PromiseHandler(userService.refreshToken));

router.post('/forgotPassword', PromiseHandler(userService.forgotPassword));

router.post('/verifyOTP', PromiseHandler(userService.verifyOTP));

router.post('/changePassword', PromiseHandler(userService.changePassword));

//Admin
// disable User with userId
router.put('/disableUser/:userId', authorize(role.ADMIN), PromiseHandler(userService.disableUser))

router.post('/getDriverMetrics', PromiseHandler(userService.getDriverMetrics))

router.get('/getAllUsers/:userType', authorize(), PromiseHandler(userService.getAllUsers))

router.post('/getAllUsersByIds/', PromiseHandler(userService.getAllUsersByIds))

router.get('/getDriverProfile/:id', PromiseHandler(userService.getDriverProfile))

//send custom Notifications to any user api
router.post('/sendNotification/:userId', PromiseHandler(userService.sendNotification))


// const cron = require('node-cron');

// const { DestroyCronJob } = require("../utils/verifytoken")

// cron.schedule('0 8 * * 1', async () => {
//     // Runs 8 AM on every Monday
//     console.log('running a task every monday 8 AM');
//     let result = await DestroyCronJob()
//     console.log("result CRON JOB ::", result)
// });

module.exports = router;