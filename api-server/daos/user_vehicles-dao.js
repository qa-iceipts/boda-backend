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
const { user_vehicles, vehicles } = require('../models');
const createHttpError = require('http-errors')

/**
 * export module
 */
module.exports = {
    addUserVehicles: async function (reqObj) {
        let count = await user_vehicles.count({ where: { userId: reqObj.userId } })
        if (count) throw new createHttpError.NotAcceptable("Sorry ! one User Can add only one vehicle !")
        let result = user_vehicles.create(reqObj)
        return result
    },

    updateUserVehicles: async function (reqObj) {
        let result = await user_vehicles.update(reqObj, { where: { userId: req.user.id } })
        return result
    },

    getUserVehicles: async function (userId) {
        let result = await user_vehicles.findOne({
            where: {
                userId: userId
            },
            include: {
                model: vehicles,
                required: true
            }
        })
        // if (!result) throw new createHttpError.NotFound("No vehicles found !!")
        if (!result) return {}
        return result

    },

    getVehicleById: async function (vehicleId) {
        console.log("getVehicleById dao called");
        let result = user_vehicles.findOne({
            where: {
                id: vehicleId
            },
            include: {
                model: vehicles,
                required: true
            }
        })
        if (!result) throw new createHttpError.NotFound("No vehicles found !!")
        return result
    },
}