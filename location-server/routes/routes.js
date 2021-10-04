'use strict';

const express = require('express');
const router = express.Router();
const HttpStatus = require('http-status-codes');

const userLocationService = require("../services/user_location-service")
// var usersRouter = require('./users');
// router.use('/users', usersRouter)

// simple route
router.get("/", (req, res) => {
    res.status(200).send({ message: "Welcome to location server." });
});


router.post("/location", (req, res) => {

    userLocationService.updateLocation(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        if (err.status = 1114) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        } else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get("/userStatus/:user_id", (req, res) => {

    userLocationService.getUserStatus(req.params.user_id).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        if (err.status = 1114) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        } else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post("/getNearbyDrivers", (req, res) => {

    userLocationService.getNearbyDrivers(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
       
        if (err.status = 1114) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        } else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    console.log(err)
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});



module.exports = router