// /aws/ route file
const express = require('express');
const router = express.Router();
const AwsService = require('../services/awsS3-service');
const { PromiseHandler } = require('../utils/errorHandler');
const { uploadFile } = require('../utils/aws-S3');
const authorize = require("../middleware/authorize");
const { getVehicleById } = require('../daos/user_vehicles-dao');
const { checkUploadLimit } = require('../daos/user_vehicles_images-dao');

router.post('/uploadProfile/:userId',
    authorize(),
    PromiseHandler(
        async function (req, res, next) {
            req.subdir = 'profile/';
            next();
        }),
    uploadFile.single('profile'),
    PromiseHandler(AwsService.uploadProfile))

router.post('/uploadVehicleImage/:userVehicleId',
    authorize(),
    PromiseHandler(
        async function (req, res, next) {
            let userVehicleId = req.params.userVehicleId
            await getVehicleById(userVehicleId)
            await checkUploadLimit(userVehicleId)
            req.subdir = 'vehicle/'; next();
        }
    ),
    uploadFile.single('vehicle'),
    PromiseHandler(AwsService.saveVehicleImage))

module.exports = router;