'use strict';

const axios = require('axios');
const logger = require('../utils/logger');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const {
    dns_connections,
    rides
} = require('../models');
const { Op } = require("sequelize")
const { sendNotifications } = require('../services/notifications-service')
const {
    getTokensByIds,
} = require('../services/socket-io-service')
module.exports = {
    getPickupRequests: function (reqObj) {
        return new Promise(function (resolve, reject) {
            rides.findAll({
                where: {
                    status: 0,
                    price: 0,
                    driverId: reqObj.driverId
                },
                raw: true,
                limit: 20,
                order: [
                    ['createdAt', 'DESC'],
                ],
            }).then(result => {
                if (result.length > 0) {
                    console.log("result ==> ", result)
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
                    axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                        params: {
                            destinations: destinations,
                            origins: origins,
                            key: process.env.MAPS_API_KEY
                        }
                    }).then(etaResult => {

                        if (etaResult.data) {
                            console.log(etaResult.data)

                            etaResult.data.rows.forEach((element, index) => {
                                // console.log(element)
                                result[index].distance = element.elements[0].distance.text
                                result[index].duration = element.elements[0].duration.text
                                result[index].origin_address = etaResult.data.origin_addresses

                            });

                            // console.log(result)

                            axios.post(process.env.API_SERVER + `/users/getAllUsersByIds`, {
                                "Ids": customerIds
                            }).then(customerData => {
                                if (customerData.data && customerData.data.data) {
                                    console.log(customerData.data.data)
                                    let merged = []
                                    for (let i = 0; i < customerData.data.data.length; i++) {
                                        merged.push({
                                            profile_image: customerData.data.data[i].profile_image,
                                            ...(result.find((itmInner) => itmInner.customerId === customerData.data.data[i].id)),
                                        }
                                        );
                                    }
                                    console.log("merged =>  ", merged)
                                    return resolve(util.responseUtil(null, merged, responseConstant.SUCCESS));
                                    // return resolve(merged)

                                } else {
                                    return reject("users not found !!")
                                }

                            }).catch(err => {
                                console.log(err)
                                return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                            })


                        }
                    }).catch(err => {
                        console.log(err)
                        return reject(util.responseUtil(null, null, responseConstant.RUN_TIME_ERROR));
                    })



                } else {
                    return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                }

                // if (result.length > 0) {
                //     return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                // } else {
                //     return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                // }
            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        });
    },

    quotePrice: function (req) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            // console.log(Object.keys(req.io.sockets.sockets))

                rides.findOne({
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
                .then((rideData) => {
                    if (rideData) {
                        // return rideData
                        return Promise.all([axios.post(process.env.API_SERVER + `/users/getAllUsersByIds`, {
                            "Ids": reqObj.driverId
                        }), axios.post(process.env.LOCATION_SERVER + `/getLocationByIds`, {
                            "Ids": reqObj.driverId
                        }), rideData])

                    } else {
                        // throw new Error("ride not found")
                        return Promise.reject("ride not found")
                    }
                })
                .then(([driverUser, driverLocation, rideData]) => {
                    if (driverUser.data.data && driverLocation.data.length > 0) {
                        // console.log("driverUser data =>", driverUser.data.data)
                        // console.log("driverLocation data =>", driverLocation.data)

                        // map eta
                        let destinations = rideData.pick_lat + ',' + rideData.pick_long
                        let origins = driverLocation.data[0].lat + ',' + driverLocation.data[0].long
                        console.log("destinations:: ", destinations, "origins :: ", origins)

                        return Promise.all([axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                            params: {
                                destinations: destinations,
                                origins: origins,
                                key: process.env.MAPS_API_KEY
                            }
                        }), driverUser, driverLocation])
                    } else {
                        return Promise.reject("users not found quote price")
                    }
                })
                .then(function ([etaResult, driverUser, driverLocation]) {

                    if (etaResult.data) {
                        //  console.log("etaResult.data =>",etaResult.data.rows[0].elements[0].distance.text)

                        var mergedData = {
                            driverLocation: driverLocation.data[0],
                            driverUser: driverUser.data.data[0],
                            distance: etaResult.data.rows[0].elements[0].distance.text,
                            duration: etaResult.data.rows[0].elements[0].duration.text
                        }

                        return Promise.all([rides.update({ price: reqObj.price, quoteOption: reqObj.quoteOption, status: 1 }, {
                            where: {
                                id: reqObj.id,
                                driverId: reqObj.driverId,
                                rideId: reqObj.rideId,
                            }
                        }), mergedData])
                    }
                    else {
                        return Promise.reject("users not found quote price")
                    }
                })
                .then(([updateResult, mergedData]) => {

                    return Promise.all([rides.findOne({
                        raw: true,
                        where: {
                            id: reqObj.id,
                            driverId: reqObj.driverId,
                            rideId: reqObj.rideId,
                            customerId: reqObj.customerId
                        }
                    }), getTokensByIds(req.body.customerId), mergedData])
                    // return getTokensByIds(req.body.customerId)
                })
                .then(([updatedRideData, fcmtokens, mergedData]) => {

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
                    let notify = sendNotifications(message)

                    return Promise.all([sendQuoteEvent, notify])

                })
                .then(([, notifyResponse]) => {
                    return resolve(util.responseUtil(null, `${notifyResponse.successCount} messages were sent successfully`, responseConstant.SUCCESS));
                })
                .catch(err => {
                    if (err.isAxiosError) {
                        return reject(err.response.data)
                    }
                    else if (err.message) {
                        console.log(err)
                        return reject(err.message)
                    }
                    else {
                        console.log("inside chain error => ", err)
                        return reject(err)
                    }
                })

            // rides.update({ price: reqObj.price, status: 1 }, {
            //     where: {
            //         id: reqObj.id,
            //         driverId: reqObj.driverId,
            //         rideId: reqObj.rideId,
            //     }
            // }).then(result => {
            //     if (result.length > 0) {
            //         return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            //     } else {
            //         return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
            //     }
            // }).catch(err => {
            //     console.log(err)
            //     return reject(err)
            // })
        }, function (err) {
            console.log(err)
            return reject(err)
        });
    }
}