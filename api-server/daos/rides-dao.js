"use strict";
/**
 *  This module is used to define Data access operations for UserVehicles 
 *  @module Rides-dao
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

/**
 *  import project modules
 */

const logger = require('../utils/logger');
const {
    rides,User ,user_vehicles
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
    updateRide: function (reqObj) {
        return new Promise(function (resolve, reject) {

            console.log("updateRide dao called");

            rides.update(reqObj,{
                where : {
                    id : reqObj.id
                }
            }).then((result) => {
                return resolve(result);
            }).catch(err => {
                console.log(err)
                return reject(err);
            })

            console.log("updateRide dao returned");

        }, function (err) {
            console.log(err)
            logger.error('error in updateRide promise', err);
            return reject(err);
        });
    },
    getRide: function (rideId) {
        return new Promise(function (resolve, reject) {

            console.log("getRide dao called");

            rides.findOne({
                where : {
                    id : rideId
                },
                include: [
                    {
                        model: User,
                        as: 'driver',
                        required: true,
                        attributes : ["id","name","phone","email","profile_image"]
                    },
                    {
                        model: user_vehicles,
                        required: true
                    },

                ]
            }).then((result) => {
                return resolve(result);
            }).catch(err => {
                console.log(err)
                return reject(err);
            })

            console.log("getRide dao returned");

        }, function (err) {
            console.log(err)
            logger.error('error in getRide promise', err);
            return reject(err);
        });
    },
    
    getRidesByUserId: function (userid) {
        return new Promise(function (resolve, reject) {

            console.log("getRidesByUserId dao called");

            rides.findAll({
                where : {
                    customer_id : userid,
                    is_booked : 1
                },
                raw:true
            }).then((result) => {
                return resolve(result);
            }).catch(err => {
                console.log(err)
                return reject(err);
            })

            console.log("getRidesByUserId dao returned");

        }, function (err) {
            console.log(err)
            logger.error('error in getRidesByUserId promise', err);
            return reject(err);
        });
    },
}