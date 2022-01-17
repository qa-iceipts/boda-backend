const express = require('express');
const router = express.Router();
const vehiclesService = require('../services/vehicles-service');
const authorize = require("../middleware/authorize")
const { PromiseHandler } = require('../utils/errorHandler');

router.get('/',authorize(),PromiseHandler(vehiclesService.getVehicles))

module.exports = router;