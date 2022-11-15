'use strict';
const { user_location, Sequelize, favloc } = require('../models');
const { Op } = require("sequelize");
const createHttpError = require('http-errors');

// export module
module.exports = {

    findOrCreateByUserId: async function (reqObj) {
        return await user_location.findOrCreate({
            where: { user_id: reqObj.user_id },
            defaults: reqObj
        })
    },
    addFavLoc: async function (reqObj) {
        // reqObj.online = true
        let [result, created] = await favloc.findOrCreate({
            where: { user_id: reqObj.user_id, type: reqObj.type },
            defaults: reqObj
        })
        console.log(result)
        if (!created) {

            result.set(reqObj)
            await result.save()
        }

    },
    getFavLoc: async function (userId) {
        // reqObj.online = true
        return await favloc.findAll({
            where: {
                user_id: userId
            }
        })
    },

    getByUserId: async function (user_id) {
        let result = await user_location.findOne({
            where: { user_id: user_id },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            }
        })
        if (!result) return {}
        return result
    },

    getLocationByIds: async function (Ids) {
        let result = await user_location.findAll({
            where: {
                user_id: Ids
            },
            attributes: ["lat", "long", "user_id"]
        })
        if (result.length <= 0) throw new createHttpError.NotFound("location of user not found")
        return result
    },

    getNearbyDrivers: async function (reqObj) {
        let { minLoc, maxLoc, vehicle_type, user_id } = reqObj
        let whereObj = {
            rideStatus: "AVAILABLE",
            lat: {
                [Op.between]: [minLoc.lat, maxLoc.lat]
            },
            long: {
                [Op.between]: [minLoc.lng, maxLoc.lng]
            },
            online: true,
            updatedAt: {
                [Op.gte]: Sequelize.literal("(NOW() - INTERVAL 1 HOUR)"),
            },
            user_type: 2, // DRIVER === 2
            user_id: {
                [Op.not]: user_id
            },
        }
        if (vehicle_type != 'all') {
            whereObj.vehicle_type = vehicle_type
        }
        let nearbyUsers = await user_location.findAndCountAll({
            attributes: ["id", "user_id", "vehicle_type", "user_type", "lat", "per_km", "long", "online"],
            where: whereObj,

        })
        console.log(nearbyUsers)
        return nearbyUsers
    },



}
