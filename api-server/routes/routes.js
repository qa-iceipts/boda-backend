const path = require('path')
const express = require('express');
const router = express.Router();
var usersRouter = require('./users');
var UserVehiclesRouter = require('./user_vehicles');
var vehiclesRouter = require('./vehicles');
var mpesaRouter = require('./mpesa');
var subscriptionsRouter = require('./subscriptions');
var adminRouter = require('./admin');
var ridesRouter = require('./rides');
var fcm_keysRouter = require('./fcm_keys');
var ratingsRouter = require('./ratings');
var awsS3Router = require('./awsS3');
var UserVehiclesImagesRouter = require('./user_vehicle_images');

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

router.use('/users', usersRouter)
router.use('/user_vehicles', UserVehiclesRouter)
router.use('/user_vehicles_images', UserVehiclesImagesRouter)
router.use('/vehicles', vehiclesRouter)
router.use('/subscriptions', subscriptionsRouter)
router.use('/mpesa', mpesaRouter)
router.use('/admin', adminRouter)
router.use('/rides', ridesRouter)
router.use('/fcm', fcm_keysRouter)
router.use('/aws', awsS3Router)
router.use('/ratings', ratingsRouter)

router.get('/health' ,(req,res,next)=>{
	res.sendFile(path.join(__dirname, '../public/health.html'))
})

module.exports = router;