'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module AWS-S3-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const { getDayWiseReport ,getWeekWiseReport,getMonthWiseReport ,getTodaysBooking} = require('../daos/rides-dao');
const {getCurrentMonthRevenue} = require("../daos/transactions-dao")
const {getTotalSubscribers} = require("../daos/user_subscriptions-dao")
/**
 * export module
 */

module.exports = {
    adminDashboard: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("adminDashboard Service Called ::")

            Promise.all(
                [

                    getDayWiseReport().catch(error => { return error; }), //0
                    getWeekWiseReport().catch(error => { return error; }), //1
                    getMonthWiseReport().catch(error => { return error; }), //2
                    getTodaysBooking().catch(error => { return error; }), //3
                    getTotalSubscribers().catch(error => { return error; }), //4
                    getCurrentMonthRevenue().catch(error => { return error; }),//5
                ]

            ).then(values => {
                //  console.log("values ::" ,values);
                //  console.log(values[1]);
                //  console.log(values[2]);
                let result = {
                    totalSubscribers: values[3],
                    currentMonthRevenue: values[4],
                    todaysBooking: values[5],
                    rides: {
                        daywise: values[0],
                        weekwise: values[1],
                        monthwise: values[2]
                    }

                }
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in adminDashboard', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add adminDashboard promise', err);
            return reject(err);
        });

    },
}