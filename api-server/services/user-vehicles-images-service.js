'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const users_vehicles_imagesDao = require('../daos/user_vehicles_images-dao');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
/**
 * export module
 */

module.exports = {

    getAllUserVehiclesImages: function (userVehicleId) {
        return new Promise(function (resolve, reject) {

            users_vehicles_imagesDao.getAllUserVehiclesImageById(userVehicleId).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in getUserVehiclesImages', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            logger.error('error in add getUserVehiclesImages promise', err);
            return reject(err);
        });

    },
}