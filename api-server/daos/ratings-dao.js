"use strict";
/**
 *  This module is used to define Data access operations for UserVehicles 
 *  @module Ratings-dao
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */
/**
 *  import project modules
 */

const logger = require('../utils/logger');
const {
    ratings
} = require('../models');
// const {
//     Op
// } = require("sequelize");
/**
 * export module
 */
module.exports = {
    addRating: function (reqObj) {
        return new Promise(function (resolve, reject) {

            console.log("addRating dao called");

            ratings.create(reqObj).then((result) => {
                return resolve(result);
            }).catch(err => {
                console.log(err)
                return reject(err);
            })

            console.log("addRating dao returned");

        }, function (err) {
            console.log(err)
            logger.error('error in addRating promise', err);
            return reject(err);
        });
    },

}