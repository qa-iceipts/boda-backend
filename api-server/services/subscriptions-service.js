'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const subscriptionsDao = require('../daos/subscriptions-dao');
const createHttpError = require('http-errors');
const db = require('../models')
/**
 * export module
 */

module.exports = {

    getSubscriptions: async function (req, res, next) {
        let result
        if (req.query.type && req.query.type === 'all') {
            result = await subscriptionsDao.getAllSubscriptions()
        } else {
            result = await subscriptionsDao.getAllSubscriptionsPage(req.query)
        }
        res.sendResponse(result)
    },

    getUserSubscriptions: async function (req, res, next) {
        let { userId } = req.params
        let result = await db.user_subscriptions.findAll({
            where: {
                is_active: true,
                userId: userId
            },
            include: {
                model: db.subscriptions,
                required: true
            }
        })
        // if (result.length <= 0) throw new createHttpError.NotFound()
        res.sendResponse({
            subscriptions: result
        })
    }
}