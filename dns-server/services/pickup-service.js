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