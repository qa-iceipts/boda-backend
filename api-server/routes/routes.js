const express = require('express');
const router = express.Router();
var usersRouter = require('./users');
var vehiclesRouter = require('./user_vehicles');
var mpesaRouter = require('./mpesa');

router.use('/users', usersRouter)
router.use('/vehicles', vehiclesRouter)
router.use('/mpesa', mpesaRouter)


//ERROR HANDLING FOR ALL UNDEFINED API ENDPOINTS
router.use("*", (req, res, next) => {
	const error = {
		status: 404,
		message: "API ENDPOINT NOT FOUND ON SERVER",
	};
	res.status(404).send(error);
});

module.exports = router;