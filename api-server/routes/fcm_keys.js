const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const fcmService = require('../services/fcm-service');
const validate = require('../utils/validator')
const {
    verifyAccessToken,
    authorize
} = require("../utils/verifytoken")
const ROLE = require("../utils/roles")


router.post('/', verifyAccessToken, authorize([ROLE.ADMIN, ROLE.DRIVER , ROLE.CUSTOMER]), (req, res) => {

    fcmService.addFcmKey(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        console.log(err)
        if (err.status = 1114) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        } else {
            logger.error(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });
}, (err) => {
    console.log(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/getTokensByIds', (req, res) => {
    console.log("getTokensByIds called obj" , req.body , req.body.Ids)
    fcmService.getTokensByIds(req.body.Ids).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        console.log(err)
        if (err.status = 1114) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        } else {
            logger, error(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });
}, (err) => {
    console.log(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});


module.exports = router;