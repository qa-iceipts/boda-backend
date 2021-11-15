"use strict";
/**
 *  This module is used to define Data access operations for UserVehicles 
 *  @module UserVehiclesImages-dao
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

/**
 *  import project modules
 */
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const logger = require('../utils/logger');
const { user_vehicles_images } = require('../models');
const {AppError} =  require('../utils/error_handler')
/**
 * export module
 */
module.exports = {
    addUserVehiclesImage: function (req) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            console.log("addUserVehiclesImage dao called");
            user_vehicles_images.create(reqObj).then(function (result) {
                return resolve(result);
            }).catch(function (err) {
                logger.error('error in addUserVehiclesImage', err);
                return reject(err);
            });

            console.log("add addUserVehiclesImage dao returned");

        }, function (err) {
            logger.error('error in addUserVehiclesImage promise', err);
            return reject(err);
        });
    },

    getAllUserVehiclesImageById: function (userVehicleId) {
        return new Promise(function (resolve, reject) {
            console.log("getUserVehiclesImage dao called");
            user_vehicles_images.findAndCountAll({
                where: {
                    userVehicleId: userVehicleId
                }
            }).then(function (result) {
                return resolve(result);
            }).catch(function (err) {
                logger.error('error in getUserVehiclesImage', err);
                return reject(err);
            });

            console.log("add getUserVehiclesImage dao returned");

        }, function (err) {
            logger.error('error in getUserVehiclesImage promise', err);
            return reject(err);
        });
    },

    checkUploadLimit: function (userVehicleId) {
        return new Promise(function (resolve, reject) {
            console.log("getUserVehiclesImage dao called");

            let uploadLimit = 6
            user_vehicles_images.count({ where: { userVehicleId: userVehicleId } }).then((count) => {
                console.log(count)
                if (count < uploadLimit) {
                    return resolve(count)
                } else {

                    return reject("Sorry ! Maximum 6 images are allowed")
                }
            })
            console.log("add getUserVehiclesImage dao returned");

        }, function (err) {
            logger.error('error in getUserVehiclesImage promise', err);
            return reject(err);
        });
    },

    deleteVehicleImage: async function (vehicleImageId) {
        console.log("deleteVehicleImage dao called");
        let result = await user_vehicles_images.findOne({ where: { id: vehicleImageId },raw:true })
        // console.log(result)
        if (!result) {
            throw new AppError(404, "Not Found");
        }
        let imageKey = result.image.split(process.env.AWS_Cloudfront)[1];
        console.log("image Key => ", imageKey)
        console.log("add deleteVehicleImage dao returned");
        return util.responseUtil(null, result, responseConstant.SUCCESS)
    },

    getVehicleImageById: async function (vehicleImageId) {
        console.log("getVehicleImageById dao called");
        let result = await user_vehicles_images.findOne({ where: { id: vehicleImageId },raw:true })
        // console.log(result)
        if (!result) {
            throw new AppError(404, "Not Found");
        }
        // let imageKey = result.image.split(process.env.AWS_Cloudfront)[1];
        // console.log("image Key => ", imageKey)
        console.log("getVehicleImageById dao returned");
        return util.responseUtil(null, result, responseConstant.SUCCESS)
    },



}