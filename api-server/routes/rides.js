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

router.get('/:rideId', verifyAccessToken , (req, res, next) => {

    console.log("rides / get Route Called")
    rideId = req.params.rideId
    ridesService.getRide(rideId).then((result) => {
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


module.exports = router;