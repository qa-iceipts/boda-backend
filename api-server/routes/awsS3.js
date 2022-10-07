// /aws/ route file
const express = require('express');
const router = express.Router();
const AwsService = require('../services/awsS3-service');
const HttpStatus = require('http-status-codes');
const logger = require('../utils/logger')
const ROLE = require('../utils/roles')
const { PromiseHandler } = require('../utils/errorHandler');
const { uploadFile } = require('../utils/aws-S3');

router.post('/uploadProfile/:userId', async function (req, res, next) {
    req.subdir = 'profile/'; next();
}, uploadFile.single('profile'), PromiseHandler(AwsService.uploadProfile))

// router.post('/uploadVehicleImage/:userVehicleId', verifyAccessToken, authorize([ROLE.ADMIN, ROLE.DRIVER, ROLE.CUSTOMER]), async function (req, res, next) {
//     req.subdir = 'vehicle/'; next();
// }, PromiseHandler(AwsService.uploadVehicleImage))


router.post('/uploadVehicleImage/:userVehicleId',
    function (req, res, next) {
        req.subdir = 'vehicles/';
        AwsService.uploadVehicleImage(req, res, next).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }).catch(err => {
            console.log(err)
            logger.error(err)
            if (err.status == 1114) {
                res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }

        });

    })



module.exports = router;