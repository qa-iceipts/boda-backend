const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const vehiclesService = require('../services/vehicles-service');
const validate = require('../utils/validator')
const {
    verifyAccessToken,
    verifyUser,
    authorize
} = require("../utils/verifytoken")
const ROLE = require("../utils/roles")


router.get('/', verifyAccessToken, authorize([ROLE.ADMIN, ROLE.DRIVER, ROLE.CUSTOMER]), (req, res) => {

    vehiclesService.getVehicles(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {

        if (err.status = 1114) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
        } else {
            logger, error(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });
}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});


module.exports = router;