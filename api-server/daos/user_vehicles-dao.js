"use strict";
/**
 *  This module is used to define Data access operations for UserVehicles 
 *  @module UserVehicles-dao
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

/**
 *  import project modules
 */

const logger = require('../utils/logger');
const {user_vehicles} = require('../models');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
/**
 * export module
 */
module.exports = {
    addUserVehicles: function (req) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            logger.debug("addUserVehicles dao called");
            user_vehicles.findOne({where: {UserId : reqObj.UserId}}).then((result)=>{
                if(result){
                    // console.log(result)
                    let err ={
                        message : "Sorry ! one User Can add only one vehicle !"
                    }
                     return reject(err)
                }else{
                    user_vehicles.create(reqObj).then(function (result) {
                        return resolve(result);
                    }).catch(function (err) {
                        logger.error('error inaddUserVehicles', err);
                        return reject(err);
                    });
                }
                })
           
            logger.debug("add addUserVehicles dao returned");

        }, function (err) {
            logger.error('error in addUserVehicles promise', err);
            return reject(err);
        });
    },

    updateUserVehicles: function (req) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            logger.debug("updateUserVehicles dao called");
            user_vehicles.update(reqObj,{where: {UserId : req.payload.id}}).then((result)=>{
                        return resolve(result);
                }).catch(err=>{
                    return reject(err)
                })
           
            logger.debug("updateUserVehicles dao returned");

        }, function (err) {
            logger.error('error in updateUserVehicles promise', err);
            return reject(err);
        });
    },

    getUserVehicles: function (UserId) {
        return new Promise(function (resolve, reject) {
            logger.debug("getUserVehicles dao called");
            user_vehicles.findOne({where: {UserId : UserId}}).then((result)=>{
                        if(result){
                            return resolve(result);
                        }else{
                            return reject("No vehicles found !!")
                        }
                }).catch(err=>{
                    return reject(err)
                })
           
            logger.debug("getUserVehicles dao returned");

        }, function (err) {
            logger.error('error in getUserVehicles promise', err);
            return reject(err);
        });
    },
}