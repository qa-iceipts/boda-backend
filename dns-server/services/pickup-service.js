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
    getPickupRequests : function (reqObj){
        return new Promise(function (resolve,reject){
            rides.findAll({
                where : {
                    status : 0,
                    price : 0,
                    driverId : reqObj.driverId
                }
            }).then(result=>{

                // if (result.length > 0) {
                //     let destinations = result[0].pick_lat + ',' + result[0].pick_long
                //     let customerIds = []
                //     result.forEach(element => {
                //         customerIds.push(element.customerId)
                //     });
                //     console.log(driverIds)

                //     axios.post(process.env.API_SERVER+`/users/getAllUsersByIds`, {
                //         "Ids": driverIds
                //     }).then(driversData => {

                //         axios.post(process.env.LOCATION_SERVER+`/getLocationByIds`, {
                //             "Ids": [reqObj.driverId]
                //         }).then(driversLocationData => {
                //             // console.log(driversLocationData.data)
                //             let origins = ''
                //             driversLocationData.data.forEach((element, index) => {
                //                 origins += element.lat + ',' + element.long
                //                 if (index != driversLocationData.data.length - 1) {
                //                     origins += '|'
                //                 }
                //             });
                //             console.log("destinations:: ", destinations, "origins :: ", origins)

                //             // ETA GET
                //             axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                //                 params: {
                //                     destinations: destinations,
                //                     origins: origins,
                //                     key: process.env.MAPS_API_KEY
                //                 }
                //             }).then(function (etaResult) {
                //                 if (etaResult.data)
                //                     // console.log(etaResult.data.rows[0])

                //                     etaResult.data.rows.forEach((element, index) => {
                //                         console.log(element)
                //                         driversLocationData.data[index].distance = element.elements[0].distance.text
                //                         driversLocationData.data[index].duration = element.elements[0].duration.text
                //                     });
                //                 //console.log(driversLocationData.data)

                //                 let merged = [];

                //                 for (let i = 0; i < driversData.data.data.length; i++) {
                //                     merged.push({
                //                         ...driversData.data.data[i],
                //                         ...(result.find((itmInner) => itmInner.driverId === driversData.data.data[i].id)),
                //                         ...(driversLocationData.data.find((itmInner) => itmInner.user_id === driversData.data.data[i].id))
                //                     }
                //                     );
                //                 }
                //                 console.log(merged)
                //                 return resolve(merged)

                //             })
                //                 .catch(function (error) {
                //                     console.log(error);
                //                     return reject(error);
                //                 })
                //             // 
                //         }).catch(err => {
                //             if (err.isAxiosError == true) {
                //                 console.log(err.response.data)
                //                 // return resolve(err.response.data)
                //             } else {
                //                 console.log(err)
                //                 // return resolve(err)
                //             }
                //         })
                //         // return resolve(result.data)
                //     }).catch(err => {
                //         if (err.isAxiosError == true) {
                //             console.log(err.response.data)
                //             return resolve(err.response.data)
                //         } else {
                //             console.log(err)
                //             return resolve(err)
                //         }

                //     })
                //     // console.log("getResponse ::",result)  

                // } else {
                //     return reject("No Drivers reached")
                // }


                
                // if(result.length>0){
                //     return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                // }else{
                //     return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                // }
            }).catch(err=>{
                console.log(err)
                return reject(err)
            })
        });
    },

    quotePrice : function (reqObj){
        return new Promise(function (resolve,reject){
            rides.update({price:reqObj.price,status : 1},{
                where : {
                    id :reqObj.id,
                    driverId : reqObj.driverId,
                    rideId :reqObj.rideId,
                }
            }).then(result=>{
                if(result.length>0){
                    return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                }else{
                    return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                }
            }).catch(err=>{
                console.log(err)
                return reject(err)
            })
        });
    }
}