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

router.use('/users', usersRouter)
router.use('/user_vehicles', UserVehiclesRouter)
router.use('/vehicles', vehiclesRouter)
router.use('/subscriptions', subscriptionsRouter)
router.use('/mpesa', mpesaRouter)
router.use('/admin', adminRouter)
router.use('/rides', ridesRouter)
router.use('/fcm', fcm_keysRouter)


router.get('/health' ,(req,res,next)=>{
	res.sendFile(path.join(__dirname, '../public/health.html'))
})

//ERROR HANDLING FOR ALL UNDEFINED API ENDPOINTS
router.use("*", (req, res, next) => {
	const error = {
		status: 404,
		message: "API ENDPOINT NOT FOUND ON SERVER",
	};
	res.status(404).send(error);
});

module.exports = router;