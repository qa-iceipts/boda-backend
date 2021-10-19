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
/**
 * export module
 */

module.exports = {

    addRide: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("addRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::",reqObj)
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

    updateRide : function (req) {
        return new Promise(function (resolve, reject) {
            console.log("updateRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::",reqObj)
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
    getRide : function (rideId) {
        return new Promise(function (resolve, reject) {
            console.log("getRide Service Called ::" ,rideId)
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

    getRidesByUserId : function (userid) {
        return new Promise(function (resolve, reject) {
            console.log("getRidesByUserId Service Called ::" ,userid)
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