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
    transactions,sequelize
} = require('../models');
const {Op} = require('sequelize')
var moment = require('moment');
/**
 * export module
 */
module.exports = {

    getCurrentMonthRevenue: function () {
        return new Promise(function (resolve, reject) {
            console.log("getCurrentMonthRevenue dao called");

            transactions.findAll({
                
                attributes : [[sequelize.fn('SUM', sequelize.col('transactions.amount')), 'revenue']],
                where: {
                    status: true,
                    andOp:sequelize.where(sequelize.fn('MONTH', sequelize.col('createdAt')), moment().format("MM")),
                    andOp:sequelize.where(sequelize.fn('YEAR', sequelize.col('createdAt')), moment().format("YYYY"))    
                 },
                 raw: true
            }).then((result) => {
                console.log(result)
                return resolve(result[0].revenue);
            }).catch(err => {
                console.log(err)
                return reject(err);
            }) 
            console.log("getCurrentMonthRevenue dao returned");

        }, function (err) {
            logger.error('error in getCurrentMonthRevenue promise', err);
            return reject(err);
        });
    },

}
