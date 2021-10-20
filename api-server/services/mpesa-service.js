'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const {
    getOAuthToken,
    lipaNaMpesaOnline,
} = require('../utils/mpesa')
const {
    transactions,
    user_subscriptions,
    subscriptions,
    db
} = require('../models');

/**
 * export module
 */

module.exports = {

    mpesaSubscribe: function (req, res) {
        return new Promise(function (resolve, reject) {
            console.log("Insert Obj in mpesaSubscribe Service ::", req.body)
            let subscriptionType = req.body.subscriptionType
            subscriptions.findOne({
                where: {
                    Type: subscriptionType
                }
            }).then((subData) => {
                if (subData) {
                    getOAuthToken(req, res, () => {
                        console.log(req.token)
                        lipaNaMpesaOnline(req).then((result) => {
                            console.log(result)
                            if (result.success == true) {
                                let insertObj = {
                                    MerchantRequestID: result.message.MerchantRequestID,
                                    CheckoutRequestID: result.message.CheckoutRequestID,
                                    ResponseDescription: result.message.ResponseDescription,
                                    CustomerMessage: result.message.CustomerMessage,
                                    amount: subData.dataValues.rate,
                                    currency: subData.dataValues.currency,
                                    UserId: req.payload.id,
                                    status: false,
                                    subscriptionType: subData.dataValues.type,
                                    paymentMode: 1
                                }
                                console.log("insertObj ::", insertObj)
                                transactions.create(insertObj).then(() => {

                                    let obj = {
                                        MerchantRequestID: result.message.MerchantRequestID,            
                                        CheckoutRequestID: result.message.CheckoutRequestID,        
                                    }
                                    console.log(obj)
                                    module.exports.mpesaCallback(obj).then(result3=> {
                                        return resolve(result);
                                    }).catch(err => {
                                        return reject(err)
                                    })


                                    // return resolve(result);
                                }).catch(function (err) {
                                    logger.error('error in mpesaSubscribe', err);
                                    return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR));
                                });

                            } else {
                                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                            }
                        }).catch(err => {
                            logger.error('error in mpesaSubscribe1', err);
                            return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                        })
                    })

                } else {
                    return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                }
            }).catch(err => {
                logger.error('error in mpesaSubscribe subscriptions findOne', err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            })


        }, function (err) {
            logger.error('error in add mpesaSubscribe promise', err);
            return reject(err);
        });

    },
    

    mpesaCallback: function (obj) {
        return new Promise(function (resolve, reject) {
            // console.log("Insert Obj in mpesaCallback Service ::", req.body)
            transactions.findOne({
                where: obj,
                include: {
                    model: subscriptions,
                    attributes:['duration'],
                    required: true
                }}).then((result) => {
                    if(result && result.dataValues.status == false){
                        console.log(result.dataValues)
                        let duration = result.dataValues.subscription.dataValues.duration
                        let startDate = new Date();
                        let endDate = new Date(startDate)
                        let userSubObj = {
                            start: startDate,
                            end: endDate.setDate(endDate.getDate() + duration),
                            is_active: true,
                            UserId: result.dataValues.UserId,
                            subscriptionType: result.dataValues.subscriptionType
                        }
                       
                        user_subscriptions.create(userSubObj).then((USresult) => {
                           
                            let updateObj = {
                                userSubscriptionId: USresult.dataValues.id,
                                status : true
                            }
                            console.log(updateObj)
                            transactions.update(updateObj,{where : { id : result.dataValues.id}}).then(()=>{
                                return resolve(USresult);
                            }).catch(err => {
                                logger.error('error in mpesaCallback transactions update', err);
                                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR));
                            })
                        }).catch(err => {
                            logger.error('error in mpesaCallback', err);
                            return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR));
                        })
                    }else{
                        return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                    }
               

            }).catch(function (err) {
                logger.error('error in mpesaCallback', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            logger.error('error in add mpesaCallback promise', err);
            return reject(err);
        });

    }

    ,

    getUserSubscriptions: function (userId) {
        return new Promise(function (resolve, reject) {
            // console.log("Insert Obj in mpesaCallback Service ::", req.body)
            user_subscriptions.findAll({
                where: {
                    is_active:true,
                    UserId : userId
                },
                include: {
                    model: subscriptions,
                    required: true
                }}).then((result) => {
                    // console.log(result)
                    if(result.length > 0){
                       
                     return resolve(util.responseUtil(null, result, responseConstant.SUCCESS))
                      
                    }else{
                        return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                    }
               

            }).catch(function (err) {
                logger.error('error in mpesaCallback', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            logger.error('error in add mpesaCallback promise', err);
            return reject(err);
        });

    }

   

}