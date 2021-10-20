'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const users_vehiclesDao = require('../daos/user_vehicles-dao');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
/**
 * export module
 */

module.exports = {

    addUserVehicles: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("Insert Obj in addUserVehicles Service ::", req.body)
            
            if(req.payload.id != req.body.UserId){
                return reject(util.responseUtil("Access token id and body userId mismatch !!", null, responseConstant.ACCESS_DENIED));
            }
            users_vehiclesDao.addUserVehicles(req).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in addUserVehicles', err);
                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR));
            });
        }, function (err) {
            logger.error('error in add addUserVehicles promise', err);
            return reject(err);
        });

    },

    getUserVehicles: function (UserId) {
        return new Promise(function (resolve, reject) {

            users_vehiclesDao.getUserVehicles(UserId).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in getUserVehicles', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            logger.error('error in add getUserVehicles promise', err);
            return reject(err);
        });

    },

    updateUserVehicles: function (req) {
        return new Promise(function (resolve, reject) {

            users_vehiclesDao.updateUserVehicles(req).then(function (result) {
                return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in updateUserVehicles', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            logger.error('error in add updateUserVehicles promise', err);
            return reject(err);
        });

    },

}