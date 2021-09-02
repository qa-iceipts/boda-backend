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

const logger = require('../utils/Logger');
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
                    console.log(result)
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
}