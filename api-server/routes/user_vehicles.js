const express = require('express');
const router = express.Router();
const userVehiclesService = require('../services/user_vehicles-service');
const role = require("../utils/roles")
const authorize = require("../middleware/authorize");
const { PromiseHandler } = require('../utils/errorHandler');

router.post('/addVehicle', authorize(role.DRIVER), PromiseHandler(userVehiclesService.addUserVehicles))

router.get('/:userId', authorize(role.DRIVER), PromiseHandler(userVehiclesService.getUserVehicles))

router.post('/update', authorize(role.DRIVER), PromiseHandler(userVehiclesService.updateUserVehicles))

module.exports = router;