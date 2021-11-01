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
                limit : 20
            }).then(result => {
                if (result.length > 0) {

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
                                console.log(element)
                                result[index].distance = element.elements[0].distance.text
                                result[index].duration = element.elements[0].duration.text
                                result[index].origin_address = etaResult.data.origin_addresses

                            });

                            console.log(result)

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
                    status: [0, 1],
                    rideId: reqObj.rideId
                }
            })
                .then((rideData) => {
                    if (rideData) {
                        return rideData
                    } else {
                        return reject("ride not found")
                    }
                })
                .then((rideData) => {
                    // console.log("rideData =>", rideData)
                    return Promise.all([axios.post(process.env.API_SERVER + `/users/getAllUsersByIds`, {
                        "Ids": reqObj.driverId
                    }), axios.post(process.env.LOCATION_SERVER + `/getLocationByIds`, {
                        "Ids": reqObj.driverId
                    }), rideData,])
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
                        }), driverUser, driverLocation, rideData])
                    } else {
                        console.log("users not found quote price")
                        return reject("users not found quote price")
                    }
                })
                .then(function ([etaResult, driverUser, driverLocation, rideData]) {

                    if (etaResult.data)
                        //  console.log("etaResult.data =>",etaResult.data.rows[0].elements[0].distance.text)

                        var mergedData = {
                            rideData: rideData,
                            driverLocation: driverLocation.data[0],
                            driverUser: driverUser.data.data[0],
                            distance: etaResult.data.rows[0].elements[0].distance.text,
                            duration: etaResult.data.rows[0].elements[0].duration.text
                        }

                   

                    return Promise.all([rides.update({ price: reqObj.price, status: 1 }, {
                        where: {
                            id: reqObj.id,
                            driverId: reqObj.driverId,
                            rideId: reqObj.rideId,
                        }
                    }),mergedData])

                })
                .then(([updateResult,mergedData]) => {
                    console.log("mergedData => ", mergedData)
                    // console.log(updateResult)
                    req.io.to(req.body.customerId).emit("quoteResponse", {
                        data: mergedData
                    });

                    return getTokensByIds(req.body.customerId)
                }).then((fcmtokens)=>{
                    console.log(fcmtokens.data)
                     
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
                         data: req.body,
                       tokens: fcmtokens.data,
                   };

                   sendNotifications(message).then((result) => {
                    return resolve(util.responseUtil(null, `${result.successCount} messages were sent successfully`, responseConstant.SUCCESS));
                   })
                })
                .catch(err => {
                    if (err.isAxiosError) {
                        return reject(err.response.data)
                    } else {
                        console.log(err)
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