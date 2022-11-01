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
const axios = require("axios");
const { calculateDistance } = require('../utils/commonUtils');
/**
 * export module
 */

module.exports = {

    addRide: async function (req, res, next) {
        // ETA GET
        let reqObj = req.body
        reqObj.state = "FINDING"
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
        req.body.id = result.id
        next()
    },

    updateRide: async function (req, res, next) {
        let reqObj = req.body
        let ride = ridesDao.getRideByPk(reqObj.id)
        ride.set(reqObj)
        await ride.save()
        res.sendResponse(ride)
    },

    acceptRide: async function (req, res, next) {

        let ride = await ridesDao.getRideByPk(req.body.rideId)
        if (!ride) throw new createHttpError.NotFound("ride Not Found")
        if (ride.state != 'BOOKED')
            throw new createHttpError.Conflict("ride is already " + ride.state)
        console.log(await ride.getRide_requests({
            where: {
                driver_id: req.body.driverId
            }
        }))
        let pendingCheck = await ride.getRide_requests({
            where: {
                driver_id: req.body.driverId
            }
        })
        if (pendingCheck.length != 1) {
            throw new createHttpError.Forbidden("only selected users can accept this request")
        }

        let [driver_fcmtokens, customer_fcmtokens] = await Promise.all([
            getAllTokensByIds(req.body.driverId),
            getAllTokensByIds(ride.customer_id)
        ])

        pendingCheck[0].status = 'ACCEPTED'
        ride.state = "ACCEPTED"
        ride.driver_id = req.body.driverId
        await ride.save()
        await pendingCheck[0].save()

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
            msg: "ride accepted successfully",
            rideId: ride.id
        })
    },

    getRideUsers: async function (req, res, next) {

        console.log("bookRide Service Called ::")
        let reqObj = req.body
        let ride = await ridesDao.getRideByPk(reqObj.id)
        if (!ride) throw new createHttpError.NotFound("ride Not Found")
        console.log(ride.dataValues)
        //startride check include
        console.log("reqObj::", reqObj)
        let [driver_fcmtokens, customer_fcmtokens] = await Promise.all([
            getAllTokensByIds(ride.driver_id),
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
        }
        next()

    },



    notifyDrivers: async function (req, res, next) {
        console.log("req.ride , body", req.ride, req.body)
        let { driverIds, customerId } = req.ride
        let rideData = await ridesDao.getRideByPk(req.body.id)
        let [driver_fcmtokens, customer_fcmtokens] = await Promise.all([
            getAllTokensByIds(driverIds),
            getAllTokensByIds(customerId)
        ])
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
        res.sendResponse({
            rideData
        })
    },

    bookingSendNotifications: async function (req, res, next) {
        let reqObj = req.body
        /**
         * reqObj { needs vehicle_type,rideId}
         */
        console.log("bookingSendNotifications called body>>", reqObj)
        let rideData = await ridesDao.getRideByPk(reqObj.id)
        console.log("rideData>>>>", rideData.dataValues)
        if (rideData.state != 'FINDING') {
            throw new createHttpError.Conflict("ride is already " + rideData.state)
        }

        // ETA calculation
        let onAirDistance = calculateDistance(rideData.origin_lat, rideData.origin_long, rideData.destination_lat, rideData.destination_long, 'K')

        console.log("ride distance in Km=> ", onAirDistance)

        let response = await axios.post(process.env.LOCATION_SERVER + '/getNearbyDrivers', {
            "user_id": rideData.customer_id,
            "lat": rideData.origin_lat,
            "long": rideData.origin_long,
            "radius": process.env.RADIUS,
            "vehicle_type": reqObj.vehicle_type
        })


        console.log("Location server nearby driver get response ::", response.data)

        if (!response.data.success) throw new createHttpError.InternalServerError()

        if (response.data.data.count === 0) throw new createHttpError.NotFound("Nearby Drivers Not Found")
        response.data = response.data.data

        let array2 = []
        let driverIds = []

        let destinations = rideData.origin_lat + ',' + rideData.origin_long
        let origins = ''
        response.data.rows.forEach((element, index) => {
            origins += element.lat + ',' + element.long
            if (index != response.data.rows.length - 1) {
                origins += '|'
            }
        });

        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origins}&key=${process.env.MAPS_API_KEY}`

        console.log("distance matrix URL", url)

        let etaResult = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                destinations: destinations,
                origins: origins,
                key: process.env.MAPS_API_KEY
            }
        })

        if (!etaResult.data)
            throw new createHttpError.InternalServerError("Google distance Error")

        console.log("etaresult data", etaResult.data)

        etaResult.data.rows.forEach((element, index) => {
            response.data.rows[index].address = etaResult.data.origin_addresses[index]
            response.data.rows[index].distance = element.elements[0].distance.text
            response.data.rows[index].duration = element.elements[0].duration.text
        });


        response.data.rows.forEach(obj => {
            array2.push({
                driver_id: obj.user_id,
                rideId: rideData.id,
                driverDistance: obj.distance,
                driverDuration: obj.duration,
                status: "PENDING",
                range: parseInt(onAirDistance * obj.per_km),
            })
            driverIds.push(obj.user_id)
        });

        await ridesDao.createRideReq(array2, rideData.id)
        rideData.state = "BOOKED"
        await rideData.save()
        req.ride = {
            driverIds,
            customerId: rideData.customer_id
        }

        next()
    },

    getPendingRequests: async function (req, res, next) {
        let result = await ridesDao.getPendingRequests(req.params.driverId)
        res.sendResponse(result)
    },

    getUserTokens: async function (driverId, customerId) {

        console.log("get userTokens Service Called ::")

        let [driver_fcmtokens, customer_fcmtokens] = await Promise.all([
            getAllTokensByIds(driverId),
            getAllTokensByIds(customerId)
        ])
        console.log("driver_fcmtokens.data:: ", driver_fcmtokens)
        console.log("customer_fcmtokens.data:: ", customer_fcmtokens)

        if (driver_fcmtokens.length <= 0 && customer_fcmtokens.length <= 0)
            throw new createHttpError.NotFound("fcm tokens not found")
        return [
            driver_fcmtokens, customer_fcmtokens
        ]

    },
    startRide: async function (req, res, next) {
        console.log("req.body", req.body)
        let ride = await ridesDao.getRideByPk(req.body.id)
        if (ride.state != "ACCEPTED")
            throw new createHttpError.Conflict("Ride is already " + ride.state)
        let [driver_fcmtokens, customer_fcmtokens] = await module.exports.getUserTokens(ride.driver_id, ride.customer_id)

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
        await ridesDao.updateRide({
            id: ride.id,
            start_time: req.body.start_time,
            state: "STARTED"
        })
        res.sendResponse({
            msg: "success"
        })
    },

    endRide: async function (req, res, next) {
        console.log("req.body", req.body)
        let ride = await ridesDao.getRideByPk(req.body.id)
        if (ride.state != "STARTED")
            throw new createHttpError.Conflict("Ride is already " + ride.state)
        let [driver_fcmtokens, customer_fcmtokens] = await module.exports.getUserTokens(ride.driver_id, ride.customer_id)

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
        let result = await ridesDao.updateRide(
            {
                id: ride.id,
                end_time: req.body.end_time,
                state: "COMPLETED"

            })
        res.sendResponse({
            msg: "success"
        })
    },

    cancelRide: async function (req, res, next) {
        console.log("req.body", req.body)
        let ride = await ridesDao.getRideByPk(req.body.id)
        // 
        let [driver_fcmtokens, customer_fcmtokens] = await module.exports.getUserTokens(ride.driver_id, ride.customer_id)

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
        await ridesDao.updateRide({

            id: ride.id,
            state: "CANCELLED"
        })
        res.sendResponse({
            msg: "success"
        })
    },

    getRide: async function (req, res, next) {
        let { rideId } = req.params
        let result = await ridesDao.getRide(parseInt(rideId))
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

    postRideRequests: async function (req, res, next) {
        let { rideId, reqArray } = req.body
        let ride = await ridesDao.getRidesById(rideId)
        if (!ride) throw new createHttpError.FailedDependency("ride not found in post requests ride")
        let requests = await ridesDao.createRideReq(reqArray, rideId)
        console.log("ride>>><", ride, requests)
        res.sendResponse({
            msg: "success"
        })
    },

}



