'use strict';

const createHttpError = require('http-errors')
const { chats } = require('../models');

module.exports = {
    addChat: async function (reqObj) {
        let result = await chats.create(reqObj)
        if (!result) throw new createHttpError.NotFound()
        return result
    },

    getChats: async function (req, res, next) {
        let reqObj = req.body
        let result = await chats.findAll({
            where: {
                rideId: reqObj.rideId,
                customer_Id: reqObj.customerId,
                driverId: reqObj.driverId
            },
            order: [["createdAt", "DESC"]],
            raw: true
        })
        if (result.length <= 0) throw new createHttpError.NotFound()
        return result
    }
}