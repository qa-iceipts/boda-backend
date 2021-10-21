'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const ridesDao = require('../daos/rides-dao');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const { getTokensByIds } = require("../services/fcm-service")
const { sendNotifications } = require('../services/notifications-service')
/**
 * export module
 */

module.exports = {

    addRide: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("addRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)
            ridesDao.addRide(reqObj).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in addRide', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add addRide promise', err);
            return reject(err);
        });

    },

    updateRide: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("updateRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)
            ridesDao.updateRide(reqObj).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in updateRide', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add updateRide promise', err);
            return reject(err);
        });

    },
    bookRide: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("bookRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)
            ridesDao.updateRide(reqObj).then(function (result) {
                let IDS = [req.body.driver_id, req.body.customer_id]

                getTokensByIds(IDS).then(fcmtokens => {

                    console.log(fcmtokens.data)
                    let notificationObj1 = {
                        title: "Ride Booked By Customer",
                        body: "Customer is waiting at pickup location"
                    }
                    let notificationObj1DATA = {data :JSON.stringify({
                        rideId : req.body.id,
                        state : req.state
                    })}
                    let notificationObj2 = {
                        title: "Ride Booking Successfull",
                        body: "Driver is arriving soon at pickup location"

                    }
                
                    
                    if (fcmtokens.data.length > 0) {



                        sendNotifications([fcmtokens.data[0]], notificationObj1,notificationObj1DATA).then((result) => {

                            console.log("Notifications sent")

                            if (fcmtokens.data[1]) {


                                sendNotifications([fcmtokens.data[1]], notificationObj2,notificationObj1DATA).then((result) => {

                                    console.log("Notifications sent")

                                }).catch(err => {
                                    console.log(err)
                                    return reject(err)
                                });

                            }

                        }).catch(err => {
                            console.log(err)
                            return reject(err)
                        });
                    }

                    return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));


                }).catch(err => {

                    console.log(err)
                    return reject(err)


                })

            }).catch(function (err) {
                console.log(err)
                logger.error('error in bookRide', err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add bookRide promise', err);
            return reject(err);
        });

    },
    getRide: function (rideId) {
        return new Promise(function (resolve, reject) {
            console.log("getRide Service Called ::", rideId)
            ridesDao.getRide(rideId).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in getRide', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add getRide promise', err);
            return reject(err);
        });

    },

    getRidesByUserId: function (userid) {
        return new Promise(function (resolve, reject) {
            console.log("getRidesByUserId Service Called ::", userid)
            ridesDao.getRidesByUserId(userid).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in getRidesByUserId', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add getRidesByUserId promise', err);
            return reject(err);
        });

    },

}