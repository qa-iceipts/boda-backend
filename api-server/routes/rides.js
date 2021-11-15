const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const ridesService = require('../services/rides-service');
const {validate,superSchema}  = require('../utils/validator')
const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")
const PromiseHandler = fn => (req, res, next ) => Promise.resolve(fn(req,res,next)).catch(next);



router.post('/', verifyAccessToken , (req, res, next) => {

    console.log("rides/ post Route Called")

    ridesService.addRide(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/update', verifyAccessToken , (req, res, next) => {

    console.log("rides/update post Route Called")

    ridesService.updateRide(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});


router.post('/bookRide', verifyAccessToken , (req, res, next) => {

    console.log("/bookRide post Route Called")
    ridesService.bookRide(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/cancelRide', verifyAccessToken , (req, res, next) => {

    console.log("/cancelRide post Route Called")
    ridesService.cancelRide(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/startRide', verifyAccessToken , (req, res, next) => {

    console.log("/startRide post Route Called")
    ridesService.startRide(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});



router.post('/endRide', verifyAccessToken , (req, res, next) => {

    console.log("/endRide post Route Called")
    ridesService.endRide(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get('/:rideId', verifyAccessToken , (req, res, next) => {

    console.log("rides / get Route Called")
    rideId = req.params.rideId
    ridesService.getRide(rideId).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1114) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get('/', verifyAccessToken , (req, res, next) => {

    console.log("rides all / get Route Called",req.payload.id)
    ridesService.getRidesByUserId(req.payload.id).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});



// new apis

router.get('/rideState/:userType/:userId', verifyAccessToken ,PromiseHandler(ridesService.getRideState))

module.exports = router;