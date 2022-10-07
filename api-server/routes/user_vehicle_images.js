const express = require('express');
const router = express.Router();
const userVehiclesImagesService = require('../services/user-vehicles-images-service');
const authorize = require("../middleware/authorize");
const { PromiseHandler } = require('../utils/errorHandler');


router.get('/:userVehicleId', authorize(), PromiseHandler(userVehiclesImagesService.getAllUserVehiclesImages))

router.delete('/:userVehicleImageId', authorize(), PromiseHandler(userVehiclesImagesService.deleteUserVehicleImage))

module.exports = router