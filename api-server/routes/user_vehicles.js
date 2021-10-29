const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const userVehiclesService = require('../services/user_vehicles-service');
const validate = require('../utils/validator')
const ROLE = require("../utils/roles")
const {
    verifyAccessToken,
    verifyUser,
    authorize
} = require("../utils/verifytoken")


// router.get('/', function (req, res) {
//     console.log("/user request called");
//     res.send('Welcome to Vehicles Route');
// });


router.post('/addVehicle', verifyAccessToken,authorize([ROLE.DRIVER]), (req, res) => {
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
}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get('/',verifyAccessToken,authorize([ROLE.DRIVER]),  (req, res) => {
        userVehiclesService.getUserVehicles(req.payload.id).then((result) => {
            res.send(result);
        }, (err) => {
            if (err.status === 1114) {
                res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });
}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/update',verifyAccessToken,authorize([ROLE.DRIVER]),  (req, res) => {
        userVehiclesService.updateUserVehicles(req).then((result) => {
            res.send(result);
        }, (err) => {
            if (err.status === 1114) {
                res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });
}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});




module.exports = router;