'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module fcm-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
// const fcmDao = require('../daos/fcm-dao');
const {
    fcm_keys
} = require('../models');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
/**
 * export module
 */

module.exports = {

    addFcmKey: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("addFcmKey Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)
            fcm_keys.findOrCreate({
                where: { device_id: reqObj.device_id , UserId : reqObj.UserId},
                defaults: reqObj,
                raw: true
            }).then(function ([result, created]) {
                console.log(created)
                if (created) {
                    return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
                } else {
                    fcm_keys.update(reqObj, { where: { id: result.id } }).then((result) => {
                        return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
                    }).catch(function (err) {
                        console.log(err)
                        logger.error('error in addFcmKey', err);
                        return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
                    });
                }

            }).catch(function (err) {
                console.log(err)
                logger.error('error in addFcmKey', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add addFcmKey promise', err);
            return reject(err);
        });

    },
    getTokensByIds: function (Ids) {
        return new Promise(function (resolve, reject) {
            console.log("getTokensByIds Service Called ::")
            fcm_keys.findAll({
                where: { UserId: Ids },
                attributes: ['fcm_key'],
            }).then(function (result) {
                if (result.length > 0) {
                    let fcmtokens = []
                    result.forEach(element => {
                        fcmtokens.push(element.dataValues.fcm_key)
                    });
                    return resolve(util.responseUtil(null, fcmtokens, responseConstant.SUCCESS));
                } else {
                    return reject(util.responseUtil(null, null, responseConstant.RECORD_NOT_FOUND));
                }

            }).catch(function (err) {
                console.log(err)
                logger.error('error in getTokensByIds', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add getTokensByIds promise', err);
            return reject(err);
        });

    }
}