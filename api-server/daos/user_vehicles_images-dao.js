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
const { user_vehicles_images } = require('../models');
const createHttpError = require('http-errors');
const { getUrl } = require('../utils/aws-S3');

/**
 * export module
 */
module.exports = {
    addUserVehiclesImage: async function (reqObj) {
        return await user_vehicles_images.create(reqObj)
    },

    getAllUserVehiclesImageById: async function (userVehicleId) {
        let result = await user_vehicles_images.findAndCountAll({
            where: {
                userVehicleId: userVehicleId
            },
            attibutes: ["id", "image"],
            raw: true
        })
        for (let index = 0; index < result.rows.length; index++) {
            result.rows[index].image = await getUrl(result.rows[index].image)
        }

        return result
    },

    checkUploadLimit: async function (userVehicleId) {
        let count = await user_vehicles_images.count({ where: { userVehicleId: userVehicleId } })
        console.log(count)
        if (count < 6) {
            return count
        } else {
            throw new createHttpError.NotAcceptable("Sorry ! Maximum 6 images are allowed")
        }
    },

    deleteVehicleImage: async function (vehicleImageId) {
        console.log("deleteVehicleImage dao called");
        let result = await user_vehicles_images.findOne({ where: { id: vehicleImageId }, raw: true })
        // console.log(result)
        if (!result) {
            throw new createHttpError.NotFound()
        }
        let imageKey = result.image.split(process.env.AWS_Cloudfront)[1];
        console.log("image Key => ", imageKey)
        console.log("add deleteVehicleImage dao returned");
        return result
    },

    getVehicleImageById: async function (vehicleImageId) {
        console.log("getVehicleImageById dao called");
        let result = await user_vehicles_images.findOne({ where: { id: vehicleImageId } })
        // console.log(result)
        if (!result) {
            throw new createHttpError.NotFound();
        }
        console.log("getVehicleImageById dao returned");
        return result
    },



}