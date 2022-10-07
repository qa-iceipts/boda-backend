const path = require('path')
const express = require('express');
const router = express.Router();
const { swaggerUI,specs } = require('./swagger')

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
});

router.use('/users', require('./users'))
router.use('/user_vehicles', require('./user_vehicles'))
router.use('/user_vehicles_images', require('./user_vehicle_images'))
router.use('/vehicles', require('./vehicles'))
router.use('/subscriptions', require('./subscriptions'))
// router.use('/userSubscriptions', require('./user_subscriptions'))
router.use('/mpesa', require('./mpesa'))
router.use('/admin', require('./admin'))
router.use('/rides', require('./rides'))
router.use('/fcm', require('./fcm_keys'))
router.use('/aws', require('./awsS3'))
router.use('/ratings', require('./ratings'))
router.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

module.exports = router;