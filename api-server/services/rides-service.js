'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */
const ridesDao = require('../daos/rides-dao');
const { getTokensByIds, getAllTokensByIds } = require("../services/fcm-service")
const { sendNotifications } = require('../services/notifications-service')
const createHttpError = require('http-errors');
const axios = require("axios")
/**
 * export module
 */

module.exports = {

    addRide: async function (req, res, next) {
        // ETA GET
        let reqObj = req.body
        let origins = reqObj.origin_lat + ',' + reqObj.origin_long
        let destinations = reqObj.destination_lat + ',' + reqObj.destination_long
        let etaResult = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                destinations: destinations,
                origins: origins,
                key: process.env.MAPS_API_KEY
            }
        })
        console.log(etaResult)
        if (!etaResult.data || etaResult.data.rows.length <= 0)
            throw new createHttpError.InternalServerError("ETA RESULT google error")

        reqObj.distance = etaResult.data.rows[0].elements[0].distance.text
        reqObj.eta = etaResult.data.rows[0].elements[0].duration.text
        console.log(reqObj)

        let result = await ridesDao.addRide(reqObj)
        res.sendResponse(result)
    },

    updateRide: async function (req, res, next) {
        let reqObj = req.body
        let ride = ridesDao.getRideByPk(reqObj.id)
        ride.set(reqObj)
        await ride.save()
        res.sendResponse(ride)
    },

    acceptRide: async function (req, res, next) {
        let reqObj = req.body
        let ride = await ridesDao.getRideByPk(req.params.rideId)
        if (!ride) throw new createHttpError.NotFound("ride Not Found")
        console.log(ride)
        let [driver_fcmtokens, customer_fcmtokens] = await Promise.all([
            getAllTokensByIds(ride.driver_id),
            getAllTokensByIds(ride.customer_id)
        ])

        ride.state = "ACCEPTED"
        await ride.save()

        let notificationdata = {
            data: JSON.stringify({
                rideId: ride.id,
                state: ride.state
            })
        }
        let driverMsg = {
            notification: {
                title: "Booking Successfull",
                body: "Accepted"
            },
            android: {
                notification: {
                    clickAction: 'acceptedRide'
                }
            },
            data: notificationdata ? notificationdata : "",
            tokens: driver_fcmtokens,
            // driver_fcmtokens,
        };

        // let customerMsg = Object.create(driverMsg);
        let customerMsg = {
            ...driverMsg,
            notification: {
                title: "Ride Accepted",
                body: "Driver arriving soon at pickup location"
            },
            tokens: customer_fcmtokens
        }
        console.log(customerMsg)
        console.log(driverMsg)
        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])

        res.sendResponse({
            msg: "ride accepted successfully"
        })
    },

    getRideUsers: async function (req, res, next) {

        console.log("bookRide Service Called ::")
        let reqObj = req.body
        let ride = await ridesDao.getRideByPk(reqObj.id)
        if (!ride) throw new createHttpError.NotFound("ride Not Found")
        console.log(ride.dataValues)
        console.log("reqObj::", reqObj)
        let [driver_fcmtokens, customer_fcmtokens] = await Promise.all([
            getAllTokensByIds(reqObj.driver_id),
            getAllTokensByIds(ride.customer_id)
        ])
        console.log("driver_fcmtokens.data:: ", driver_fcmtokens)
        console.log("customer_fcmtokens.data:: ", customer_fcmtokens)

        if (driver_fcmtokens.length <= 0 && customer_fcmtokens.length <= 0)
            throw new createHttpError.NotFound("fcm tokens not found")
        req.data = {
            ride: reqObj,
            rideData: ride.dataValues,
            driver_fcmtokens: driver_fcmtokens,
            customer_fcmtokens: customer_fcmtokens
        } //array
        next()

    },


    bookRide: async function (req, res, next) {
        console.log("req.data", req.data)
        if (req.data.rideData.state != 'FINDING') {
            throw new createHttpError.Conflict("ride is already " + req.data.rideData.state)
        }
        let { driver_fcmtokens, customer_fcmtokens } = req.data
        let notificationdata = {
            data: JSON.stringify({
                rideId: req.body.id,
                state: req.state
            })
        }
        let driverMsg = {
            notification: {
                title: "New ride booked",
                body: "Waiting for approval"
            },
            android: {
                notification: {
                    clickAction: 'pendingRide'
                }
            },
            data: notificationdata ? notificationdata : "",
            tokens: driver_fcmtokens,
            // driver_fcmtokens,
        };

        // let customerMsg = Object.create(driverMsg);
        let customerMsg = {
            ...driverMsg,
            notification: {
                title: "Ride Booking Successfull",
                body: "Waiting for driver confirmation"
            },
            tokens: customer_fcmtokens
        }
        console.log(customerMsg)
        console.log(driverMsg)
        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])
        req.data.ride.state = 'BOOKED'
        await ridesDao.updateRide(req.data.ride)
        res.sendResponse({
            msg: "success"
        })
    },

    getPendingRequests: async function (req, res, next) {
        let result = await ridesDao.getPendingRequests(req.params.driverId)
        res.sendResponse(result)
    },
    // bookRide: async function (req, res, next) {
    //     console.log("req.data", req.data)
    //     let { driver_fcmtokens, customer_fcmtokens } = req.data
    //     let notificationdata = {
    //         data: JSON.stringify({
    //             rideId: req.body.id,
    //             state: req.state
    //         })
    //     }
    //     let driverMsg = {
    //         notification: {
    //             title: "Ride Booked By Customer",
    //             body: "Customer is waiting at pickup location"
    //         },
    //         android: {
    //             notification: {
    //                 clickAction: 'rideclick'
    //             }
    //         },
    //         data: notificationdata ? notificationdata : "",
    //         tokens: driver_fcmtokens,
    //         // driver_fcmtokens,
    //     };

    //     // let customerMsg = Object.create(driverMsg);
    //     let customerMsg = {
    //         ...driverMsg,
    //         notification: {
    //             title: "Ride Booking Successfull",
    //             body: "Driver is arriving soon at pickup location"
    //         },
    //         tokens: customer_fcmtokens
    //     }
    //     console.log(customerMsg)
    //     console.log(driverMsg)
    //     await Promise.all([
    //         sendNotifications(driverMsg),
    //         sendNotifications(customerMsg)
    //     ])
    //     await ridesDao.updateRide(req.data.ride)
    //     res.sendResponse({
    //         msg: "success"
    //     })
    // },

    startRide: async function (req, res, next) {
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

        let customerMsg = {
            ...driverMsg,
            notification: {
                title: "Ride Started by driver",
                body: "You will reach your destination soon!"
            },
            tokens: customer_fcmtokens
        }
        console.log(customerMsg)
        console.log(driverMsg)

        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])
        let result = await ridesDao.updateRide(req.data.ride)
        // res.sendResponse(result)
        res.sendResponse({
            msg: "success"
        })
    },

    endRide: async function (req, res, next) {

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
        let result = await ridesDao.updateRide(req.data.ride)
        // res.sendResponse(result)
        res.sendResponse({
            msg: "success"
        })
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


        let customerMsg = {
            ...driverMsg,
            notification: {
                title: "Ride is Cancelled",
                body: "Book a new ride to start again"
            },
            tokens: customer_fcmtokens
        }

        await Promise.all([
            sendNotifications(driverMsg),
            sendNotifications(customerMsg)
        ])
        await ridesDao.updateRide(req.data.ride)
        res.sendResponse({
            msg: "success"
        })
    },

    getRide: async function (req, res, next) {
        let { rideId } = req.params
        let result = await ridesDao.getRide(rideId)
        res.sendResponse(result)
    },

    getRidesByUserId: async function (req, res, next) {
        let result = await ridesDao.getRidesByUserId(req.user.id)
        res.sendResponse({
            ridehistory: result
        })
    },

    getRideById: async function (req, res, next) {
        let result = await ridesDao.getRidesById(req.params.rideId)
        res.sendResponse(result)
    },

    getDriverRideHistory: async function (req, res, next) {
        let result = await ridesDao.getDriverRideHistory(req.params.userId)
        res.sendResponse({
            ridehistory: result
        })
    },

    getRideState: async function (req, res, next) {
        let { userId, userType } = req.params
        let result = await ridesDao.getRideState(userId, userType)
        res.sendResponse(result)
    },

}



