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


module.exports = {
    addDNSConnection: function (reqObj) {
        return new Promise(function (resolve, reject) {
            if (reqObj.rideId) {
                dns_connections.findOrCreate({
                    where: { rideId: reqObj.rideId },
                    defaults: reqObj
                }).then(([result, created]) => {
                    //   console.log("created",created)
                    if (created == false) {
                        dns_connections.update(reqObj, { where: { id: result.dataValues.id } }).then(() => {
                            // console.log(updated)
                            return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                        }).catch(err => {
                            console.log(err)
                            logger.error(err)
                            return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                        })
                    } else {
                        return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                    }

                }).catch(err => {
                    console.log(err)
                    logger.error(err)
                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_DATABASE_ERROR));
                })
            } else {
                return reject(util.responseUtil("rideId required", null, responseConstant.INVALIDE_REQUEST_PARAMETERS));
            }

        })

    },

    getNearbyDrivers: function (reqObj) {
        return new Promise(function (resolve, reject) {
            axios.post('http://localhost:4000/getNearbyDrivers', {
                "user_id": reqObj.user_id,
                "lat": reqObj.pick_lat,
                "long": reqObj.pick_long,
                "radius": 5,
                "vehicle_type": reqObj.vehicle_type
            })
                .then(function (response) {
                    // ETA CODE
                    if (response.data.count > 0) {
                        let destinations = reqObj.pick_lat + ',' + reqObj.pick_long
                        let array = []
                        let driverIds = []
                        response.data.rows.forEach(obj => {
                            array.push({
                                driverId: obj.user_id,
                                rideId: reqObj.rideId,
                                pick_lat: reqObj.pick_lat,
                                pick_long: reqObj.pick_long,
                                drop_lat: reqObj.drop_lat,
                                drop_long: reqObj.drop_long,
                                status: 0,
                                price: 0,
                                customerId: reqObj.user_id,
                                range : 100
                            })
                            driverIds.push(obj.user_id)
                        });
                        rides.bulkCreate(array, { returning: true }).then((bulk) => {
                            // console.log(bulk)
                        }).catch(err => {
                            console.log(err)
                            return reject(err)
                        });
                        // console.log(array)
                        let origins = ''
                        response.data.rows.forEach((element, index) => {
                            origins += element.lat + ',' + element.long
                            if (index != response.data.rows.length - 1) {
                                origins += '|'
                            }
                        });
                        // console.log(destinations, "origins", origins)

                        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origins}&key=${process.env.MAPS_API_KEY}`

                        console.log(url)

                        axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                            params: {
                                destinations: destinations,
                                origins: origins,
                                key: process.env.MAPS_API_KEY
                            }
                        }).then(function (etaResult) {
                                if (etaResult.data)
                                    etaResult.data.rows.forEach((element, index) => {
                                        response.data.rows[index].distance = element.elements[0].distance.text
                                        response.data.rows[index].duration = element.elements[0].duration.text
                                    });
                                //   console.log(response.data,array)
                                axios.post('http://localhost:8080/users/getDriverMetrics', {
                                    "driverIds": driverIds
                                }).then(metrics => {

                                    console.log(metrics.data.data)
                                    let merged = [];

                                    for (let i = 0; i < metrics.data.data.length; i++) {
                                        merged.push({
                                            ...metrics.data.data[i],
                                            ...(response.data.rows.find((itmInner) => itmInner.user_id === metrics.data.data[i].id))
                                        }
                                        );
                                    }

                                    // console.log(merged);
                                    return resolve({
                                        // result,
                                        // distance_KM,
                                        data: merged,
                                        // response: response.data.rows
                                    });
                                })
                                    .catch(function (error) {
                                        console.log(error);
                                        return reject(error);
                                    })
                            })
                            .catch(function (error) {
                                console.log(error);
                                return reject(error);
                            })

                        // ETA ENDS
                    }
                })
                .catch(function (error) {
                    // console.log(error.response);
                    return reject(error)
                });
        })

    },

    fetchDrivers: function (req) {
        return new Promise(function (resolve, reject) {
            rides.findAll({
                where: {
                    rideId: req.rideId,
                    status: 0
                }
            }).then(result => {
                // console.log(result)
                if(result){
                    let driverIds = []
                result.forEach(element => {
                    driverIds.push(element.dataValues.driverId)
                });
                return resolve([result, driverIds])
                }else{
                    return reject("no drivers found")
                }
                
            }).catch(err => {
                console.log(err)
                return resolve(err)
            })
        });
    },

    getTokensByIds: function (Ids) {
        return new Promise(function (resolve, reject) {
            axios.post('http://localhost:8080/fcm/getTokensByIds', {
                "Ids": Ids
            }).then(result => {
                return resolve(result.data)
            }).catch(err => {
                console.log(err)
                return resolve(err)
            })
        })
    },

    getResponse : function(rideId){
        return new Promise(function (resolve,reject){
            rides.destroy({
                where:{
                    status : 0,
                    price : 0 ,
                    rideId:rideId
                }
            }).then(()=>{
                rides.findAll({
                    where : {
                        status : 1,
                        price : {
                            [Op.not]: 0
                        },
                        rideId : rideId
    
                    }
                }).then((result)=>{
                    console.log("getResponse ::",result)  
                    return resolve(result)       
                }).catch(err=>{
                    console.log("err ::",err)
                    return reject(err)  
                })
            }).catch(err=>{
                console.log("err ::",err)
                return reject(err)  
            })
           
        });
    }


}
