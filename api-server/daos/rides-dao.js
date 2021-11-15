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
var moment = require('moment');
const logger = require('../utils/logger');
const {
    rides, User, user_vehicles, sequelize
} = require('../models');
const { getPagination, getPagingData } = require('../utils/pagination')
const {
    Op
} = require("sequelize");
const {AppError} =  require('../utils/error_handler')
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

            rides.update(reqObj, {
                where: {
                    id: reqObj.id
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
                where: {
                    id: rideId
                },
                include: [
                    {
                        model: User,
                        as: 'driver',
                        required: true,
                        attributes: ["id", "name", "phone", "email", "profile_image"]
                    },
                    {
                        model: User,
                        as: 'customer',
                        required: false,
                        attributes: ["id", "name", "phone", "email", "profile_image"]
                    },
                    {
                        model: user_vehicles,
                        required: true
                    },

                ]
            }).then((result) => {
                // console.log(result)
                if (result) {
                    return resolve(result);
                } else {
                    return reject("Not Found")
                }

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
                where: {
                    customer_id: userid,
                    state: ['BOOKED' ,'STARTED', 'CANCELLED','COMPLETED']
                },
                include: [
                    {
                        model: User,
                        as: 'driver',
                        required: false,
                        attributes: ["id", "name", "phone", "email", "profile_image"]
                    },
                ],
                // raw:true
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

    getDayWiseReport: function () {
        return new Promise(function (resolve, reject) {

            let dayquery = `with recursive cte(dt) as (select '${moment().subtract(6, 'days').format("YYYY-MM-DD")}' dt union all select dt + interval 1 day from cte where dt + interval 1 day <= '${moment().format("YYYY-MM-DD")}') select @rownum := @rownum + 1 AS seq,dayname(d.dt) AS dayname,d.dt date, COUNT(\`id\`) AS 'totalRides' from (SELECT @rownum := 0) r,cte d left join \`boda_db\`.rides t ON date(t.createdAt) = d.dt and t.state = "COMPLETED"  group by  d.dt  order by d.dt`
            // query to find last week data
            // console.log(dayquery)
                sequelize.query(dayquery,{ type: sequelize.QueryTypes.SELECT })
                .then((result) => {
                    //  console.log(result)
                    return resolve(result);
                }).catch(err => {
                    console.log(err)
                    return reject(err);
                })
          

        }, function (err) {
            console.log(err)
            logger.error('error in getLastWeekReport promise', err);
            return reject(err);
        })
    },


    getWeekWiseReport: function () {
        return new Promise(function (resolve, reject) {

            let query = `
            with recursive cte(dt) as (
                -- anchor
                select '${moment().subtract(6, 'week').format("YYYY-MM-DD")}' dt
                    union all 
                -- recursion with stop condition
                select dt + interval 1 week from cte where dt + interval 1 week <= '${moment().format("YYYY-MM-DD")}'
            ) 
            select @rownum := @rownum + 1 AS seq,dayname(d.dt) AS dayname,d.dt weekstart,d.dt + interval 6 day weekend, COUNT(\`id\`) AS \`totalRides\` from (SELECT @rownum := 0) r,cte d left join \`rides\` t ON week(date(t.createdAt)) = week(d.dt) AND  MONTH(date(t.createdAt)) = MONTH(d.dt)  AND t.state = "COMPLETED" group by  week(d.dt)  order by d.dt `
            // console.log(query)
            // sequelize.query("SET @week_row_number = 0;").then(() => {
                sequelize.query(query,{ type: sequelize.QueryTypes.SELECT })
                .then((result) => {
                    // console.log(result)
                    return resolve(result);
                }).catch(err => {
                    console.log(err)
                    return reject(err);
                })
            // })
          

        }, function (err) {
            console.log(err)
            logger.error('error in getLastWeekReport promise', err);
            return reject(err);
        })
    },

    getMonthWiseReport: function () {
        return new Promise(function (resolve, reject) {

             let query = `
             with recursive cte(dt) as (
                 -- anchor
                 select '${moment().subtract(11, 'months').format("YYYY-MM-DD")}' dt
                     union all 
                 -- recursion with stop condition
                 select dt + interval 1 month from cte where dt + interval 1 month <= '${moment().format("YYYY-MM-DD")}'
             ) 
             select @rownum := @rownum + 1 AS seq,d.dt as date ,month(d.dt) as month,monthname(d.dt) as monthname, COUNT(\`id\`) AS \`totalRides\` from (SELECT @rownum := 0) r,cte d left join \`rides\` t ON month(date(t.createdAt)) = month(d.dt) AND  year(date(t.createdAt)) = year(d.dt)  AND t.state = "COMPLETED" group by  (d.dt)  order by d.dt `
            // query to find last week data
            // console.log(query)
            // sequelize.query("SET @month_row_number = 0;").then(() => {
                sequelize.query(query,{ type: sequelize.QueryTypes.SELECT })
                .then((result) => {
                    //  console.log(result)
                    return resolve(result);
                }).catch(err => {
                    console.log(err)
                    return reject(err);
                })
            // })
          

        }, function (err) {
            console.log(err)
            logger.error('error in getLastWeekReport promise', err);
            return reject(err);
        })
    },

    getTodaysBooking: function () {
        return new Promise(function (resolve, reject) {


            rides.count({
                // attributes : [[sequelize.fn('COUNT', 'id'), 'todaysBookings']],
                where: {
                    state: 'COMPLETED',
                    andOp:sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), moment().format("YYYY-MM-DD"))   
                 },
                 raw: true
            }).then((result) => {
                // console.log(result)
                return resolve(result);
            }).catch(err => {
                console.log(err)
                return reject(err);
            })          
        }, function (err) {
            console.log(err)
            logger.error('error in getLastWeekReport promise', err);
            return reject(err);
        })
    },

    getRideState: async function (userId,userType) {
        console.log("getRideState dao called",userType,userId);
        let whereObj = { state : 'BOOKED' }
        if(userType === 'customer'){
            whereObj['customer_id']= userId
        }else{
            whereObj['driver_id'] = userId
        }
        let result = await rides.findOne({ where: whereObj,raw:true })
        console.log(result)
        if (!result) {
            throw new AppError(404, "Not Found");
        }
        return result
    },


}
