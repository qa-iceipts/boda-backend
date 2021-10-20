'use strict';

const axios = require('axios');
const logger = require('../utils/logger');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const {
    chats
} = require('../models');
const { Op } = require("sequelize")
module.exports = {
    addChat : function (reqObj){
        return new Promise(function (resolve,reject){
            chats.create(reqObj).then(result=>{
                if(result){
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
    getChats : function (reqObj){
        return new Promise(function (resolve,reject){
            chats.findAll({
                where:{
                    rideId : reqObj.rideId,
                    // customer_Id: {
                    //     [Op.or]: [ reqObj.customerId, reqObj.driverId ]
                    //   }
                    // customer_Id: {
                    //     [Op.or]: [ reqObj.customerId, reqObj.driverId ]
                    //   }

                    customer_Id : reqObj.customerId,
                    driverId : reqObj.driverId 
                },
                order:[["createdAt", "DESC"]],
                raw : true
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