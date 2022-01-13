const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const ROLE = require('../utils/roles')
const { PromiseHandler } = require('../utils/errorHandler')
const userService = require('../services/user-service');
const { validate, superSchema } = require('../utils/validator')
const { authMiddleware } = require("../utils/firebase/firebase_middleware");
const authorize = require("../middleware/authorize")


// Routes
router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to Users');
});

router.post('/addUser', validate(superSchema.addUserSchema), PromiseHandler(userService.addUser), PromiseHandler(userService.login))

router.post('/login/:roleName', validate(superSchema.adminloginSchema), PromiseHandler(userService.login))

router.get('/getUser', authorize(), PromiseHandler(userService.getUser))

router.get('/getUser/:id', authorize(), PromiseHandler(userService.getUserById))

router.get('/getAllUsers/:userType', authorize(), PromiseHandler(userService.getAllUsers))

router.post('/getAllUsersByIds/', PromiseHandler(userService.getAllUsersByIds))

router.put('/updateUser/:userId', authorize(), PromiseHandler(userService.updateUser))

router.post('/logout', validate(superSchema.logoutSchema), authorize(), PromiseHandler(userService.logout))

router.post('/refreshToken', PromiseHandler(userService.refreshToken));

router.post('/forgotPassword', PromiseHandler(userService.forgotPassword));

router.post('/verifyOTP', PromiseHandler(userService.verifyOTP));

router.post('/changePassword', PromiseHandler(userService.changePassword));

// disable User with userId
router.put('/disableUser/:userId', authorize(ROLE.ADMIN), PromiseHandler(userService.disableUser))


router.post('/checkUserExists', PromiseHandler(userService.checkUserExists))

router.post('/getDriverMetrics', PromiseHandler(userService.getDriverMetrics))


const cron = require('node-cron');

const { DestroyCronJob } = require("../utils/verifytoken")

cron.schedule('0 8 * * 1', () => {
    // Runs 8 AM on every Monday
    console.log('running a task every monday 8 AM');
    DestroyCronJob().then(result => {
        console.log("result CRON JOB ::", result)
    }).catch(err => {
        console.log(err)
    })
});


module.exports = router;