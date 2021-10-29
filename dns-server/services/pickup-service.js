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
var io 
module.exports = {
    setIO : function (io){
        io = io
    },

    getPickupRequests: function (reqObj) {
        return new Promise(function (resolve, reject) {
            rides.findAll({
                where: {
                    status: 0,
                    price: 0,
                    driverId: reqObj.driverId
                },
                raw: true
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
                                            profile_image :customerData.data.data[i].profile_image,
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



                }else{
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

    quotePrice: function (reqObj) {
        return new Promise(function (resolve, reject) {

            io.to(reqObj.id).emit("privateMsg", {
                data : "hyy price is 100 rs"
             });

            rides.update({ price: reqObj.price, status: 1 }, {
                where: {
                    id: reqObj.id,
                    driverId: reqObj.driverId,
                    rideId: reqObj.rideId,
                }
            }).then(result => {
                if (result.length > 0) {
                    return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                } else {
                    return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                }
            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        });
    }
}