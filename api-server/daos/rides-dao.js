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
    rides
} = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination')
const {
    Op
} = require("sequelize");
/**
 * export module
 */
module.exports = {
    addRide: function (reqObj) {
        return new Promise(function (resolve, reject) {

            console.log("addRide dao called");

            rides.create(reqObj).then((result) => {
                return resolve(result);
            }).catch(err => {
                console.log(err)
                return reject(err);
            })

            console.log("addRide dao returned");

        }, function (err) {
            console.log(err)
            logger.error('error in addRide promise', err);
            return reject(err);
        });
    },
}