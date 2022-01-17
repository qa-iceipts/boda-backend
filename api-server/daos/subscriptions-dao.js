"use strict";
/**
 *  This module is used to define Data access operations for UserVehicles 
 *  @module Vehicles-dao
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

/**
 *  import project modules
 */

const logger = require('../utils/logger');
const {
    subscriptions
} = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination')
const createHttpError = require('http-errors')
/**
 * export module
 */
module.exports = {
    getAllSubscriptions: async function () {
        let result = await subscriptions.findAndCountAll()
        if (!result) throw new createHttpError.NotFound()
        return result
    },
    
    getAllSubscriptionsPage : async function ({ page, size, name}) {
        let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
        let { limit, offset } = getPagination(page, size);
        // console.log(limit,offset)
        let result = await subscriptions.findAndCountAll({
            offset: offset,
            limit: limit
        })
        if (!result) throw new createHttpError.NotFound("No subscriptions found !")
        const response = getPagingData(result, page, limit);
        return response
    },
}