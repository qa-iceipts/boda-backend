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
const { Op } = require("sequelize")
const {
    ratings, rides, users, user_vehicles, ride_requests, sequelize
} = require('../models');
const createHttpError = require('http-errors');
const db = require('../models');
/**
 * export module
 */
module.exports = {
    addRide: async function (reqObj) {
        console.log("addRide dao called");
        let result = await rides.create(reqObj)
        return result
    },
    updateRide: async function (reqObj) {
        let result = await rides.update(reqObj, {
            where: {
                id: reqObj.id
            }
        })
        return result
    },

    getRideByPk: async function (rideId) {
        return await rides.findByPk(rideId)
    },
    getRide: async function (rideId) {

        let result = await rides.findOne({
            where: {
                id: rideId
            },
            include: [
                {
                    model: users,
                    as: 'driver',
                    required: false,
                    attributes: ["id", "name", "phone", "email", "profile_image"]
                },
                {
                    model: users,
                    as: 'customer',
                    required: false,
                    attributes: ["id", "name", "phone", "email", "profile_image"]
                },
                {
                    model: user_vehicles,
                    required: false
                },


            ]
        })
        // console.log(result)
        if (!result) throw new createHttpError.NotFound()
        return result
    },

    getRidesById: async function (rideId) {
        let result = await rides.findOne({
            where: {
                id: rideId
            },
        })
        return result
    },
    getRidesByUserId: async function (userid) {
        let result = await rides.findAll({
            attributes: {
                include: [
                    [sequelize.col("rating.driver_rating"), "ratings"],
                ]
            },
            where: {
                customer_id: userid,
                state: ['BOOKED', 'ACCEPTED', 'STARTED', 'CANCELLED', 'COMPLETED'],

            },
            include: [
                {
                    model: users,
                    as: 'driver',
                    required: false,
                    attributes: ["id", "name", "phone", "email", "profile_image", "ratings"]
                },
                {
                    model: ratings,
                    required: false,
                    attributes: []
                },
            ],
            order: [["createdAt", "DESC"]],
            // raw:true
        })
        // console.log(Object.keys(result.__proto__));
        // console.log(await result.hasRatings())
        return result
    },

    getDriverRideHistory: async function (userid) {
        let result = await rides.findAll({
            attributes: {
                include: [
                    [sequelize.col("rating.driver_rating"), "ratings"],
                ]
            },
            where: {
                driver_id: userid,
                state: ['BOOKED', 'ACCEPTED', 'STARTED', 'CANCELLED', 'COMPLETED']
            },
            include: [
                {
                    model: users,
                    as: 'customer',
                    required: false,
                    attributes: ["id", "name", "phone", "email", "profile_image"]
                },
                {
                    model: ratings,
                    required: false,
                    attributes: []
                },
            ],
            order: [["createdAt", "DESC"]],
            // raw:true
        })
        // console.log(await result.getRatings())
        return result
    },

    getDayWiseReport: async function () {
        let dayquery = `with recursive cte(dt) as (select '${moment().subtract(6, 'days').format("YYYY-MM-DD")}' dt union all select dt + interval 1 day from cte where dt + interval 1 day <= '${moment().format("YYYY-MM-DD")}') select @rownum := @rownum + 1 AS seq,dayname(d.dt) AS dayname,d.dt date, COUNT(\`id\`) AS 'totalRides' from (SELECT @rownum := 0) r,cte d left join \`boda_db\`.rides t ON date(t.createdAt) = d.dt and t.state = "COMPLETED"  group by  d.dt  order by d.dt`
        // query to find last week data
        // console.log(dayquery)
        let result = await sequelize.query(dayquery, { type: sequelize.QueryTypes.SELECT })
        //  console.log(result)
        return result
    },

    getWeekWiseReport: async function () {

        let query = `
            with recursive cte(dt) as (
                -- anchor
                select '${moment().subtract(6, 'week').format("YYYY-MM-DD")}' dt
                    union all 
                -- recursion with stop condition
                select dt + interval 1 week from cte where dt + interval 1 week <= '${moment().format("YYYY-MM-DD")}'
            ) 
            select @rownum := @rownum + 1 AS seq,dayname(d.dt) AS dayname,d.dt weekstart,d.dt + interval 6 day weekend, COUNT(\`id\`) AS \`totalRides\` from (SELECT @rownum := 0) r,cte d left join \`rides\` t ON week(date(t.createdAt)) = week(d.dt) AND  MONTH(date(t.createdAt)) = MONTH(d.dt)  AND t.state = "COMPLETED" group by  week(d.dt)  order by d.dt `

        let result = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result
    },

    getMonthWiseReport: async function () {
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
        let result = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result

    },

    getTodaysBooking: async function () {
        let result = await rides.count({
            // attributes : [[sequelize.fn('COUNT', 'id'), 'todaysBookings']],
            where: {
                state: 'COMPLETED',
                andOp: sequelize.where(sequelize.fn('DATE', sequelize.col('createdAt')), moment().format("YYYY-MM-DD"))
            },
            raw: true
        })
        return result

    },

    getRideState: async function (userId, userType) {
        console.log("getRideState dao called", userType, userId);
        let whereObj = { state: ['BOOKED', 'ACCEPTED', 'STARTED'] }
        if (userType === 'customer') {
            whereObj['customer_id'] = userId
        } else {
            whereObj['driver_id'] = userId
        }
        let result = await rides.findOne({ where: whereObj, include: { model: user_vehicles }, order: [['createdAt', 'desc']] })
        if (!result) {
            return {}
            // throw new createHttpError.NotFound()
        }
        return result
    },


    getPendingRequests: async function (driver_id) {
        let result = await db.ride_requests.findAndCountAll({
            attributes: [
                "id",
                "status",
                "price",
                "range",
                "driverDuration",
                "driverDistance",
                "rideId",
            ],
            where: {
                driver_id: driver_id,
                status: "PENDING",
                createdAt: {
                    [Op.gte]: sequelize.literal("DATE_SUB(NOW(), INTERVAL 5 MINUTE)"),
                }
            }, include: [
                {
                    model: rides,
                    attributes: [
                        "origin_lat",
                        "origin_long",
                        "destination_lat",
                        "destination_long",
                        "origin_location",
                        "destination_location",
                        "state",
                        "amount_estimated",
                        "amount_actual",
                        "distance",
                        "eta",
                        "start_time",
                        "end_time",
                        "customer_id"
                    ],
                    include: {
                        model: users,
                        as: 'customer',
                        attributes: [
                            "name",
                            "phone",
                            "email",
                            "address",
                            "country",
                            "state",
                            "city",
                            "station",
                            "profile_image",
                        ]
                    }

                },

            ],
            order: [
                ["driverDuration", "asc"]
            ]
        })
        if (!result) {
            return {}
        }
        return result
    },

    createRideReq: async function (rideArray, rideId) {
        await db.ride_requests.destroy({
            where: {
                rideId: rideId
            }
        })
        let result = await db.ride_requests.bulkCreate(rideArray)
        return result
    },

}
