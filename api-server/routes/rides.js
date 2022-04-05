const express = require('express');
const router = express.Router();
const ridesService = require('../services/rides-service');
const authorize = require('../middleware/authorize');
const { PromiseHandler } = require('../utils/errorHandler');

router.post('/', authorize(), PromiseHandler(ridesService.addRide))

router.post('/update', authorize(), PromiseHandler(ridesService.updateRide))

router.post('/bookRide', authorize(), PromiseHandler(ridesService.getRideUsers), PromiseHandler(ridesService.bookRide))

router.post('/cancelRide', authorize(), PromiseHandler(ridesService.getRideUsers), PromiseHandler(ridesService.cancelRide))

router.post('/startRide', authorize(), PromiseHandler(ridesService.getRideUsers), PromiseHandler(ridesService.startRide))

router.post('/endRide', authorize(), PromiseHandler(ridesService.getRideUsers), PromiseHandler(ridesService.endRide))

router.get('/:rideId', authorize(), PromiseHandler(ridesService.getRide))

router.get('/', authorize(), PromiseHandler(ridesService.getRidesByUserId))

router.get('/getRideById/:rideId', PromiseHandler(ridesService.getRideById))

router.get('/DriverHistory/:userId', authorize(), PromiseHandler(ridesService.getDriverRideHistory))

router.get('/rideState/:userType/:userId', authorize(), PromiseHandler(ridesService.getRideState))

module.exports = router;