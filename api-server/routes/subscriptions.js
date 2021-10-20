const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const subscriptionsService = require('../services/subscriptions-service');
const {getUserSubscriptions} = require('../services/mpesa-service');
const {validate,superSchema}  = require('../utils/validator')
const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")
const {getSubscriptionReport} = require("../daos/user_subscriptions-dao")


router.get('/', verifyAccessToken, (req, res) => {
    
        subscriptionsService.getSubscriptions(req).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }).catch(err => {
            if (err.status = 1114) {
                res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });

}, (err) => {
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get('/graph', (req, res) => {
    getSubscriptionReport(req).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }).catch(err => {
            if (err.status = 1114) {
                res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });

}, (err) => {
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});


router.get('/userSubscription', verifyAccessToken, (req, res) => {

    getUserSubscriptions(req.payload.id).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }).catch(err => {
            if (err.status = 1114) {
                res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });
}, (err) => {
    logger.error(err)
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});


module.exports = router;