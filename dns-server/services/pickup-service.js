'use strict';
const createHttpError = require('http-errors')
const axios = require('axios');
const {
    rides,
    sequelize
} = require('../models');
const { Op } = require("sequelize")
const { sendNotifications } = require('../services/notifications-service')

const { getTokensByIds } = require('../services/socket-io-service')

module.exports = {

    getPickupRequests: async function (req, res, next) {
        let reqObj = req.body
        let result = await rides.findAll({
            where: {
                status: 0,
                //price: 0,
                driverId: reqObj.driverId,
                createdAt: {
                    [Op.gte]: sequelize.literal("DATE_SUB(NOW(), INTERVAL 30 MINUTE)"),
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            raw: true,
            limit: 20,
            order: [
                ['createdAt', 'DESC'],
            ],
        })
        if (result.length <= 0) return res.sendResponse({})
        console.log(result)

        console.log("rides result ==> ", result)
        let origins = reqObj.lat + ',' + reqObj.long
        let destinations = ''
        let customerIds = []
        result.forEach((element, index) => {
            customerIds.push(element.customerId)
            destinations += element.pick_lat + ',' + element.pick_long
            if (index != result.length - 1) {
                destinations += '|'
            }
        });
        console.log("cust_ids::", customerIds)
        console.log("destinations:: ", destinations, "=>origins :: ", origins)

        // ETA GET
        let etaResult = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                destinations: destinations,
                origins: origins,
                key: process.env.MAPS_API_KEY
            }
        })
        if (!etaResult || !etaResult.data)
            if (result.length <= 0) throw new createHttpError.InternalServerError("ETA RESULT")

        console.log(etaResult.data)
        // console.log(result)
        // throw err
        let customerData = await axios.post(process.env.API_SERVER + `/users/getAllUsersByIds`, {
            "Ids": customerIds
        })
        if (!customerData.data || !customerData.data.data) throw new createHttpError.InternalServerError("no customerData found")
        etaResult.data.rows[0].elements.forEach((element, index) => {
            let customer = (customerData.data.data.find((itmInner) => itmInner.id === result[index].customerId))
            result[index].distance = element.distance.text
            result[index].duration = element.duration.text
            result[index].origin_address = etaResult.data.destination_addresses[index]
            result[index].profile_image = customer.profile_image
            result[index].email = customer.email
            result[index].name = customer.name
            result[index].phone = customer.phone
            //eta duration
            console.log(etaResult.data.rows[0].elements)
            result[index].distance = etaResult.data.rows[0].elements[0].distance.text
            result[index].eta = etaResult.data.rows[0].elements[0].duration.text

        });
        res.sendResponse({
            data: result
        })
    },

    quotePrice: async function (req, res, next) {

        let reqObj = req.body
        // console.log(Object.keys(req.io.sockets.sockets))
        let rideData = await rides.findOne({
            raw: true,
            where: {
                id: reqObj.id,
                driverId: reqObj.driverId,
                rideId: reqObj.rideId,
                customerId: reqObj.customerId
                // status: [0, 1],
                // rideId: reqObj.rideId
            }
        })

        if (!rideData) throw new createHttpError.NotFound("ride not found")
        let [driverUser, driverLocation, metrics] = await Promise.all([
            axios.post(process.env.API_SERVER + `/users/getAllUsersByIds`, {
                "Ids": reqObj.driverId
            }),
            axios.post(process.env.LOCATION_SERVER + `/getLocationByIds`, {
                "Ids": reqObj.driverId
            }),
            axios.post(process.env.API_SERVER + '/users/getDriverMetrics', {
                "driverIds": reqObj.driverId,
                "customer_id": reqObj.customerId
            })
        ])

        console.log("pastExperience >>>", metrics.data.data[0].pastExperience)
        let pastExperience = metrics.data.data[0].pastExperience ? metrics.data.data[0].pastExperience : 0
        if (!driverUser.data.data || driverLocation.data.length <= 0)
            throw new createHttpError.NotFound("Users not found of quote price")

        console.log("driverUser data =>", driverUser.data.data)
        console.log("driverLocation data =>", driverLocation.data)
        // map eta
        let destinations = rideData.pick_lat + ',' + rideData.pick_long
        let origins = driverLocation.data.data[0].lat + ',' + driverLocation.data.data[0].long
        console.log("destinations:: ", destinations, "origins :: ", origins)

        let etaResult = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                destinations: destinations,
                origins: origins,
                key: process.env.MAPS_API_KEY
            }
        })


        if (!etaResult.data) throw new createHttpError.InternalServerError("ETA RESULT ERROR")
        //  console.log("etaResult.data =>",etaResult.data.rows[0].elements[0].distance.text)
        var mergedData = {
            driverLocation: driverLocation.data.data[0],
            driverUser: {
                ...driverUser.data.data[0],
                pastExperience
            },

            distance: etaResult.data.rows[0].elements[0].distance.text,
            duration: etaResult.data.rows[0].elements[0].duration.text
        }

        await rides.update({ price: reqObj.price, quoteOption: reqObj.quoteOption, status: 1 }, {
            where: {
                id: reqObj.id,
                driverId: reqObj.driverId,
                rideId: reqObj.rideId,
            }
        })
        let updatedRideData = await rides.findOne({
            raw: true,
            where: {
                id: reqObj.id,
                driverId: reqObj.driverId,
                rideId: reqObj.rideId,
                customerId: reqObj.customerId
            }
        })
        let fcmtokens = await getTokensByIds(req.body.customerId)

        mergedData.rideData = updatedRideData

        console.log("merged data => ", mergedData)

        console.log("fcm_tokens_data =>", fcmtokens.data)

        let message = {

            notification: {
                title: "Driver Quoted price",
                body: `Quoted ride price is ${req.body.price}`
            },
            android: {
                notification: {
                    clickAction: 'quote_intent'
                }
            },

            data: {
                data: JSON.stringify({
                    driverId: req.body.driverId,
                    rideId: req.body.rideid,
                    price: req.body.price
                })
            },
            tokens: fcmtokens.data,
        };

        let sendQuoteEvent = req.io.to(req.body.customerId).emit("quoteResponse", {
            data: mergedData
        });
        let notify = await sendNotifications(message)

        await Promise.all([sendQuoteEvent, notify])

        res.sendResponse({
            message: "success"
        })

    }
}