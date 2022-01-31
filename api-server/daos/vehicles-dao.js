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
    vehicles
} = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination')
const {
    Op
} = require("sequelize");
const createHttpError = require('http-errors')

/**
 * export module
 */
module.exports = {
    getVehicles: async function (reqObj) {
        let { page, size, name,type } = reqObj;
        if (type && type == 'all') {
            let result = await vehicles.findAll()
            if (result.length <= 0) throw new createHttpError.NotFound("No Vehicles Found")
            return {
                vehicles : result
            }
        }
        else {
            let condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
            let { limit, offset } = getPagination(page, size);
            let result = await vehicles.findAndCountAll({
                where: condition,
                offset: offset,
                limit: limit
            })
            if (!result) throw new createHttpError.NotFound("No Vehicles Found")
            return getPagingData(result, page, limit);
        }
    },
}