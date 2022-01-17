'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */
const ridesDao = require('../daos/rides-dao');
const { getTokensByIds } = require("../services/fcm-service")
const { sendNotifications } = require('../services/notifications-service')
const createHttpError = require('http-errors');
/**
 * export module
 */

module.exports = {

    addRide: async function (req, res, next) {
        let result = await ridesDao.addRide(req.body)
        res.sendResponse(result)
    },

    updateRide: async function (req,res,next) {
        let reqObj = req.body
        let ride = ridesDao.getRideByPk(reqObj.id)
        ride.set(reqObj)
        await ride.save()
        res.sendResponse(ride)
    },

    getRideUsers: async function (req, res, next) {

        console.log("bookRide Service Called ::")
        let reqObj = req.body
        let { driver_id, customer_id } = req.body
        console.log("reqObj::", reqObj)
        let [driver_fcmtokens, customer_fcmtokens] = await Promise.all([
            getTokensByIds(driver_id),
            getTokensByIds(customer_id)
        ])
        console.log("driver_fcmtokens.data:: ", driver_fcmtokens.data)
        console.log("customer_fcmtokens.data:: ", customer_fcmtokens.data)

        if (driver_fcmtokens.data.length <= 0 && customer_fcmtokens.data.length <= 0)
            throw new createHttpError.NotFound("fcm tokens not found")
        req.data = {
            driver_fcmtokens: driver_fcmtokens.data,
            customer_fcmtokens: customer_fcmtokens.data
        } //array
        next()

    },

    bookRide: async function (req, res, next) {
        console.log("req.data", req.data)
        let { driver_fcmtokens, customer_fcmtokens } = req.data
        let notificationdata = {
            data: JSON.stringify({
                rideId: req.body.id,
                state: req.state
            })
        }
        let driverMsg = {
            notification: {
                title: "Ride Booked By Customer",
                body: "Customer is waiting at pickup location"
            },
            android: {
                notification: {
                    clickAction: 'rideclick'
                }
            },
            data: notificationdata ? notificationdata : "",
            tokens: driver_fcmtokens,
        };
        let customerMsg = driverMsg
        customerMsg.notification = {
            title: "Ride Booking Successfull",
            body: "Driver is arriving soon at pickup location"
        }
        customerMsg.tokens = customer_fcmtokens

        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])
        let result = await ridesDao.updateRide(reqObj)
        res.sendResponse(result)
    },

    startRide: async function (req) {
        console.log("req.data", req.data)
        let { driver_fcmtokens, customer_fcmtokens } = req.data

        let notificationdata = {
            data: JSON.stringify({
                rideId: req.body.id,
                state: req.state
            })
        }

        let driverMsg = {
            notification: {
                title: "Ride Started",
                body: "Reach Drop point to end ride"
            },
            android: {
                notification: {
                    clickAction: 'startRide'
                }
            },
            data: notificationdata ? notificationdata : "",
            tokens: driver_fcmtokens,
        };
        let customerMsg = driverMsg
        customerMsg.notification = {
            title: "Ride Started by driver",
            body: "You will reach your destination soon!"
        }
        customerMsg.tokens = customer_fcmtokens
        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])
        let result = await ridesDao.updateRide(reqObj)
        res.sendResponse(result)
    },

    endRide: async function (req) {

        console.log("req.data", req.data)
        let { driver_fcmtokens, customer_fcmtokens } = req.data

        let notificationdata = {
            data: JSON.stringify({
                rideId: req.body.id,
                state: req.state
            })
        }

        let driverMsg = {
            notification: {
                title: "Ride Ended",
                body: "Ride is ended successfully"
            },
            android: {
                notification: {
                    clickAction: 'endRide'
                }
            },
            data: notificationdata ? notificationdata : "",
            tokens: driver_fcmtokens,
        };
        let customerMsg = driverMsg
        customerMsg.notification = {
            title: "Ride Ended Successfully",
            body: "Thank you, have a nice day!"
        }
        customerMsg.tokens = customer_fcmtokens
        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])
        let result = await ridesDao.updateRide(reqObj)
        res.sendResponse(result)
    },

    cancelRide: async function (req, res, next) {
        console.log("req.data", req.data)
        let { driver_fcmtokens, customer_fcmtokens } = req.data

        let notificationdata = {
            data: JSON.stringify({
                rideId: req.body.id,
                state: req.state
            })
        }

        let driverMsg = {
            notification: {
                title: "Ride is Cancelled",
                body: "Customer cancelled the ride"
            },
            android: {
                notification: {
                    clickAction: 'cancelRide'
                }
            },
            data: notificationdata ? notificationdata : "",
            tokens: driver_fcmtokens,
        };

        let customerMsg = driverMsg
        customerMsg.notification = {
            title: "Ride is Cancelled",
            body: "Book a new ride to start again"
        }
        customerMsg.tokens = customer_fcmtokens

        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])
        let result = await ridesDao.updateRide(reqObj)
        res.sendResponse(result)
    },

    getRide: async function (req, res, next) {
        let { rideId } = req.params
        let result = await ridesDao.getRide(rideId)
        res.sendResponse(result)
    },

    getRidesByUserId: async function (req, res, next) {
        let result = ridesDao.getRidesByUserId(req.user.id)
        res.sendResponse(result)
    },

    getRideState: async function (req, res, next) {
        let { userId, userType } = req.params
        let result = await ridesDao.getRideState(userId, userType)
        res.sendResponse(result)
    },





}



