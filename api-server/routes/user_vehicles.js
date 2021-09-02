const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const userVehiclesService = require('../services/user_vehicles-service');
const validate = require('../utils/validator')
const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")


router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to Vehicles Route');
});


router.post('/addVehicle', verifyAccessToken, (req, res) => {

    let reqObj = req.body
    verifyUser(req, "driver").then(() => {

        userVehiclesService.addUserVehicles(req).then((result) => {
            res.send(result);
        }, (err) => {
            if (err.status === 1003) {
                res.status(HttpStatus.StatusCodes.CONFLICT).send({
                    status: err.status,
                    message: err.message
                });
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });


    }).catch(err => {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(err);
    })

}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});


module.exports = router;