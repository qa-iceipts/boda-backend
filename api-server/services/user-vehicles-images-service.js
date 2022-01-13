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
const { deleteFile } = require("../utils/aws-S3")

/**
 * export module
 */

module.exports = {

    getAllUserVehiclesImages: async function (userVehicleId) {
        let result = await users_vehicles_imagesDao.getAllUserVehiclesImageById(userVehicleId)
        return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
    },

    deleteUserVehicleImage: async (userVehicleImageId) => {
        // return Promise.reject(util.responseUtil("err", null, responseConstant.RECORD_NOT_FOUND));
        console.log("deleteUserVehicleImage Service Called")
        let result = await users_vehicles_imagesDao.getVehicleImageById(userVehicleImageId)

        if (result.dataValues.image) {
            let image_key = (result.dataValues.image.split(process.env.AWS_Cloudfront))[1];
            console.log(image_key)
            if (image_key) deleteFile(image_key)
        }
        result.destroy()
        result.save()
        console.log("deleteUserVehicleImage Service Returned")
        return 1
    }
}