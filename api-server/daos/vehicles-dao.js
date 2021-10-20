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
/**
 * export module
 */
module.exports = {
    getVehicles: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("getVehicles dao called");
            if(req.query.type && req.query.type == 'all'){
                vehicles.findAll().then((result) => {
                    if (result.length > 0) {
                        return resolve(result);
                    } else {
                        return reject("No Vehicles Found ");
                    }
                }).catch(err => {
                    return reject(err);
                })
            }
            else{
                const { page, size, name } = req.query;
                var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
                const { limit, offset } = getPagination(page, size);
                vehicles.findAndCountAll({
                    where :condition,
                    offset: offset,
                    limit: limit
                }).then((result) => {
                    if (result) {
                        const response = getPagingData(result, page, limit);
                        return resolve(response);
                    } else {
                        return reject("No vehicles found !");
                    }
                }).catch(err => {
                    return reject(err);
                })
            }
          
            console.log("getVehicles dao returned");

        }, function (err) {
            logger.error('error in getVehicles promise', err);
            return reject(err);
        });
    },
}