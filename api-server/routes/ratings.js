const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const ratingsService = require('../services/ratings-service');
const {validate,superSchema}  = require('../utils/validator')
const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")

router.post('/', verifyAccessToken , (req, res, next) => {

    console.log("ratings/ post Route Called")

    ratingsService.addRating(req).then((result) => {
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