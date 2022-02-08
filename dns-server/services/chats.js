'use strict';

const createHttpError = require('http-errors')
const { chats } = require('../models');
const { getRideById } = require('./rides.service');

module.exports = {
    addChat: async function (reqObj) {
        let result = await chats.create(reqObj)
        if (!result) throw new createHttpError.NotFound()
        return result
    },

    getChats: async function (req, res, next) {
        let { rideId } = req.params
        console.log("get chats called ::", rideId)
        let ride = await getRideById(rideId)
        let result = await chats.findAll({
            where: {
                rideId: ride.rideId,
                customer_Id: ride.customerId,
                driverId: ride.driverId
            },
            attributes: ["id", "msg", "driverId", "customer_id", "rideId", "user_type"],
            order: [["createdAt", "DESC"]],
            raw: true
        })
        // if (result.length <= 0) 
        // throw new createHttpError.NotFound()
        res.sendResponse({
            chats: result
        })
    }
}