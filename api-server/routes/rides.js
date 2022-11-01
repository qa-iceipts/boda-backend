const express = require('express');
const router = express.Router();
const ridesService = require('../services/rides-service');
const authorize = require('../middleware/authorize');
const { PromiseHandler } = require('../utils/errorHandler');
const roles = require('../utils/roles');

router.post('/update', authorize(), PromiseHandler(ridesService.updateRide))

router.post('/bookRide', authorize(), PromiseHandler(ridesService.addRide), PromiseHandler(ridesService.bookingSendNotifications), PromiseHandler(ridesService.notifyDrivers))


router.get('/getPendingRequests/:driverId', authorize(roles.DRIVER), PromiseHandler(ridesService.getPendingRequests))
//driver accept ride api
router.post('/acceptRide', authorize(), PromiseHandler(ridesService.acceptRide))

router.post('/cancelRide', authorize(), PromiseHandler(ridesService.cancelRide))

router.post('/startRide', authorize(), PromiseHandler(ridesService.startRide))

router.post('/endRide', authorize(), PromiseHandler(ridesService.endRide))

router.get('/:rideId', authorize(), PromiseHandler(ridesService.getRide))

router.get('/', authorize(), PromiseHandler(ridesService.getRidesByUserId))

router.get('/getRideById/:rideId', PromiseHandler(ridesService.getRideById))

router.get('/DriverHistory/:userId', authorize(), PromiseHandler(ridesService.getDriverRideHistory))

router.get('/rideState/:userType/:userId', authorize(), PromiseHandler(ridesService.getRideState))

router.post('/postRideRequests', PromiseHandler(ridesService.postRideRequests))


module.exports = router;