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
const {getPagination,getPagingData} = require('../utils/pagination')
/**
 * export module
 */
module.exports = {
    getSubscriptions: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("getSubscriptions dao called");

            if(req.query.type && req.query.type == 'all'){
                subscriptions.findAndCountAll().then((result) => {
                    if (result) {
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
            // console.log(page,size)
            var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
            const { limit, offset } = getPagination(page, size);
            // console.log(limit,offset)
            subscriptions.findAndCountAll({
                offset: offset,
                limit: limit
            }).then((result) => {
                if (result) {
                    const response = getPagingData(result, page, limit);
                    return resolve(response);
                } else {
                    return reject("No subscriptions found !");
                }
            }).catch(err => {
                return reject(err);
            })
        }
            console.log("getSubscriptions dao returned");

        }, function (err) {
            logger.error('error in getSubscriptions promise', err);
            return reject(err);
        });
    },
    
}