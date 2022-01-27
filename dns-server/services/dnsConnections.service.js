'use strict';

const { dns_connections } = require('../models');
const createHttpError = require('http-errors')

module.exports = {
    addDNSConnection: async function (reqObj) {
        console.log(reqObj)
        if (!reqObj.rideId || !reqObj.userId) {
            throw new createHttpError.BadRequest("INVALID REQUEST")
        }
        let [result, created] = await dns_connections.findOrCreate({
            where: { userId: reqObj.userId },
            defaults: reqObj
        })

        if (!created) {
            result.set(reqObj)
            await result.save()
        }
        return result
    },

}