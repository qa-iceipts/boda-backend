const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const userVehiclesImagesService = require('../services/user-vehicles-images-service');
const validate = require('../utils/validator')
const ROLE = require("../utils/roles")
const {
    verifyAccessToken,
    authorize
} = require("../utils/verifytoken")


router.get('/:userVehicleId', verifyAccessToken, authorize([ROLE.DRIVER, ROLE.ADMIN]), (req, res) => {
    userVehiclesImagesService.getAllUserVehiclesImages(req.params.userVehicleId).then((result) => {
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

router.delete('/:userVehicleImageId', async (req, res, next) => {

    try {
        let result = await userVehiclesImagesService.deleteUserVehicleImage(req.params.userVehicleImageId)
        res.status(HttpStatus.StatusCodes.OK).send(result);
    } catch (err) {
        next(err)
        // console.log("ERROR => ",err)
        // res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    }
});
// userVehiclesImagesService.deleteUserVehicleImage(req.params.userVehicleImageId).then((result) => {
//         res.send(result);
//     }, (err) => {
//         if (err.status === 1114) {
//             res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
//         } else {
//             res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
//         }

// }

module.exports = router