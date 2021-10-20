'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const subscriptionsDao = require('../daos/subscriptions-dao');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
/**
 * export module
 */

module.exports = {

    getSubscriptions: function (req) {
        return new Promise(function (resolve, reject) {
            subscriptionsDao.getSubscriptions(req).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            logger.error('error in add getSubscriptions promise', err);
            return reject(err);
        });

    }

    

}