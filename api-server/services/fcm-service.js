'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module fcm-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
// const fcmDao = require('../daos/fcm-dao');
const {
    fcm_keys
} = require('../models');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const createHttpError = require('http-errors');
/**
 * export module
 */

module.exports = {

    addFcmKey: async function (req) {
        console.log("addFcmKey Service Called ::")
        let reqObj = req.body
        console.log("reqObj::", reqObj)
        let [result, created] = await fcm_keys.findOrCreate({
            where: { device_id: reqObj.device_id, UserId: reqObj.UserId },
            defaults: reqObj,
            raw: true
        }).
            console.log(created)
        if (!created)
            await fcm_keys.update(reqObj, { where: { id: result.id } })
        res.sendResponse("success")



    },
    getTokensByIds: async function (req, res, next) {
        let { Ids } = req.body
        console.log("getTokensByIds Service Called ::")
        let result = await fcm_keys.findAll({
            where: { UserId: Ids },
            attributes: ['fcm_key'],
        })
        if (result.length <= 0) throw new createHttpError.NotFound()
        let fcmtokens = []
        result.forEach(element => {
            fcmtokens.push(element.dataValues.fcm_key)
        });
        res.sendResponse(result)
    }
}