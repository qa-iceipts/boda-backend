'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const users_vehicles_imagesDao = require('../daos/user_vehicles_images-dao');
const { deleteFile } = require("../utils/aws-S3")

/**
 * export module
 */

module.exports = {

    getAllUserVehiclesImages: async function (req,res,next) {
        let {userVehicleId} = req.params
        let result = await users_vehicles_imagesDao.getAllUserVehiclesImageById(userVehicleId)
        res.sendResponse(result)
    },

    deleteUserVehicleImage: async (req,res,next) => {
        let result = await users_vehicles_imagesDao.getVehicleImageById(req.params.userVehicleImageId)
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