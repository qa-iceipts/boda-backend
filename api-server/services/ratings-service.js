
'use strict';
/**
 *  This module is used to define service for ratings model 
 *  @module ratings-service
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

    addRatings: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("addRatings Service Called ::")
            let reqObj = req.body
            console.log("reqObj::",reqObj)
            ratingssDao.addRatings(reqObj).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in addRatings', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add addRatings promise', err);
            return reject(err);
        });

    },

}