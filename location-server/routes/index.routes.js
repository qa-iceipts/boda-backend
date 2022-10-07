'use strict';
const path = require('path')
const express = require('express');
const router = express.Router();
const { PromiseHandler } = require('../utils/errorHandler');

const userLocationController = require("../controllers/userLocation.controller")

// simple route
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});
router.get('/health', (req, res, next) => {
    res.sendFile(path.join(__dirname, '../public/health.html'))
})

router.post("/location", PromiseHandler(userLocationController.updateLocation))

router.get("/userStatus/:user_id", PromiseHandler(userLocationController.getUserStatus))

router.post("/getNearbyDrivers", PromiseHandler(userLocationController.getNearbyDrivers))

router.post("/getLocationByIds", PromiseHandler(userLocationController.getLocationByIds))


router.post("/addFavLoc", PromiseHandler(userLocationController.addFavLoc))

router.get("/favLoc/:userId", PromiseHandler(userLocationController.getFavLoc))

module.exports = router