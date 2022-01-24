'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const subscriptionsDao = require('../daos/subscriptions-dao');
const createHttpError = require('http-errors');
/**
 * export module
 */

module.exports = {

    getSubscriptions: async function (req, res, next) {
        throw new createHttpError.Unauthorized("Custom error")
        let result
        if (req.query.type && req.query.type === 'all') {
            result = await subscriptionsDao.getAllSubscriptions()
        } else {
            result = await subscriptionsDao.getAllSubscriptionsPage(req.query)
        }
        res.sendResponse(result)
    }
}