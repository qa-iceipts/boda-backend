'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module fcm-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const {
    fcm_keys
} = require('../models');
const createHttpError = require('http-errors');
/**
 * export module
 */

module.exports = {

    addFcmKey: async function (req, res) {
        console.log("addFcmKey Service Called ::")
        let reqObj = req.body
        console.log("reqObj::", reqObj)
        let [result, created] = await fcm_keys.findOrCreate({
            where: { device_id: reqObj.device_id, userId: reqObj.userId },
            defaults: reqObj,
            raw: true
        })
        console.log(created)
        if (!created)
            await fcm_keys.update(reqObj, { where: { id: result.id } })
        res.sendResponse({
            msg:"success"
        })



    },
    getTokensByIds: async function (req, res, next) {
        console.log(req.body)
        let { Ids } = req.body
        console.log("getTokensByIds Service Called ::")
        let result = await fcm_keys.findAll({
            where: { userId: Ids },
            attributes: ['fcm_key'],
        })
        if (result.length <= 0) throw new createHttpError.NotFound("fcm tokens not found")
        let fcmtokens = []
        result.forEach(element => {
            fcmtokens.push(element.fcm_key)
        });
        res.sendResponse(fcmtokens)
    },

    getAllTokensByIds : async function (Ids) {
        console.log(Ids)
        console.log("getTokensByIds Service Called ::")
        let result = await fcm_keys.findAll({
            where: { userId: Ids },
            attributes: ['fcm_key'],
        })
        if (result.length <= 0) throw new createHttpError.NotFound("fcm tokens not found")
        let fcmtokens = []
        result.forEach(element => {
            fcmtokens.push(element.fcm_key)
        });
        return fcmtokens
    }
}