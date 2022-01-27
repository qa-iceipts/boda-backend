'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const users_vehiclesDao = require('../daos/user_vehicles-dao');
const createHttpError = require('http-errors');
/**
 * export module
 */

module.exports = {

    addUserVehicles: async function (req, res, next) {
        let reqObj = req.body
        if (req.user.id != reqObj.userId) {
            throw new createHttpError.Forbidden("Session userId mismatch")
        }
        let result = await users_vehiclesDao.addUserVehicles(reqObj)
        res.sendResponse(result)
    },

    getUserVehicles: async function (req, res, next) {
        let { userId } = req.params
        let result = await users_vehiclesDao.getUserVehicles(userId)
        res.sendResponse(result)
    },

    updateUserVehicles: async function (req) {
        let result = await users_vehiclesDao.updateUserVehicles(req.payload.id)
        res.sendResponse(result)
    },

}