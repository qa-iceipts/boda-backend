'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const {
    lipaNaMpesaOnline,
} = require('../utils/mpesa')
const db = require('../models')
const createHttpError = require('http-errors');

/**
 * export module
 */

module.exports = {

    mpesaSubscribe: async function (req, res) {

        console.log("Insert Obj in mpesaSubscribe Service ::", req.body)
        let subscriptionType = req.body.subscriptionType
        let subData = await db.subscriptions.findOne({
            where: {
                Type: subscriptionType
            }
        })
        if (!subData) throw new createHttpError.NotFound()
        console.log(req.token)
        let result = await lipaNaMpesaOnline(req)
        console.log(result)
        if (!result.success) throw new createHttpError.InternalServerError()

        let insertObj = {
            MerchantRequestID: result.message.MerchantRequestID,
            CheckoutRequestID: result.message.CheckoutRequestID,
            ResponseDescription: result.message.ResponseDescription,
            CustomerMessage: result.message.CustomerMessage,
            amount: subData.dataValues.rate,
            currency: subData.dataValues.currency,
            userId: req.user.id,
            status: false,
            subscriptionType: subData.dataValues.type,
            paymentMode: 1
        }
        console.log("insertObj ::", insertObj)
        await db.transactions.create(insertObj)

        let obj = {
            MerchantRequestID: result.message.MerchantRequestID,
            CheckoutRequestID: result.message.CheckoutRequestID,
            status: false
        }
        console.log(obj)
        result = await module.exports.mpesaCallback(obj)
        res.sendResponse(result)
    },

    mpesaCallback: async function (obj) {
        let result = await transactions.findOne({
            where: obj,
            include: {
                model: subscriptions,
                attributes: ['duration'],
                required: true,
            }
        })
        if (!result) throw new createHttpError.NotFound()

        console.log(result.dataValues)

        let duration = result.dataValues.subscription.dataValues.duration
        let startDate = new Date();
        let endDate = new Date(startDate)
        let userSubObj = {
            start: startDate,
            end: endDate.setDate(endDate.getDate() + duration),
            is_active: true,
            userId: result.dataValues.userId,
            subscriptionType: result.dataValues.subscriptionType
        }

        let USresult = await db.user_subscriptions.create(userSubObj)
        let updateObj = {
            userSubscriptionId: USresult.dataValues.id,
            status: true
        }
        console.log(updateObj)
        await transactions.update(updateObj, { where: { id: result.dataValues.id } })
        return USresult

    },
}