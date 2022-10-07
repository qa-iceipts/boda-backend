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
    transactions, sequelize
} = require('../models');
var moment = require('moment');
/**
 * export module
 */
module.exports = {

    getCurrentMonthRevenue: async function () {
        let result = await transactions.findAll({
            attributes: [[sequelize.fn('SUM', sequelize.col('transactions.amount')), 'revenue']],
            where: {
                status: true,
                andOp: sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), moment().format("MM")),
                andOp: sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), moment().format("YYYY"))
            },
            raw: true
        })
        if (!result[0].revenue) result[0].revenue = 0
        return result[0].revenue
    },

}
