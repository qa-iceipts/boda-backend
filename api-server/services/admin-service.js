'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module AWS-S3-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const { getDayWiseReport, getWeekWiseReport, getMonthWiseReport, getTodaysBooking } = require('../daos/rides-dao');
const { getCurrentMonthRevenue } = require("../daos/transactions-dao")
const { getTotalSubscribers, getSubscriptionReport } = require("../daos/user_subscriptions-dao");
const commonUtils = require('../utils/commonUtils');
const createHttpError = require('http-errors');
const {users} = require('../models')
/**
 * export module
 */

module.exports = {
    adminDashboard: async function (req,res,next) {
        console.log("adminDashboard Service Called ::")
        let values = await Promise.all([
            getDayWiseReport(),
            // .catch(error => { return error; }), //0
            getWeekWiseReport(),
            // .catch(error => { return error; }), //1
            getMonthWiseReport(),
            // .catch(error => { return error; }), //2
            getTodaysBooking(),
            // .catch(error => { return error; }), //3
            getTotalSubscribers(),
            // .catch(error => { return error; }), //4
            getCurrentMonthRevenue(),
            // .catch(error => { return error; }),//5
            getSubscriptionReport(),
            // .catch(error => { return error; }),//6
        ])
        //  console.log("values ::" ,values);
        //  console.log(values[1]);
        //  console.log(values[2]);
        let result = {
            totalSubscribers: values[4],
            currentMonthRevenue: values[5],
            todaysBooking: values[3],
            lineChartCategoryWiseData: {
                daily: {
                    name: "Daily",
                    series: values[0]
                },
                weekly: {
                    name: "weekly",
                    series: values[1]
                },
                monthly: {
                    name: "monthly",
                    series: values[2]
                },
            },
            subscriptionData: values[6]

        }

        result = {
            "totalSubscribers": 20,
            "currentMonthRevenue": 4000,
            "todaysBooking": 50,
            "lineChartCategoryWiseData": {
                "daily": {
                    "name": "Daily",
                    "series": [
                        {
                            "seq": 1,
                            "dayname": "Tuesday",
                            "date": "2022-01-11",
                            "totalRides": 30
                        },
                        {
                            "seq": 2,
                            "dayname": "Wednesday",
                            "date": "2022-01-12",
                            "totalRides": 40
                        },
                        {
                            "seq": 3,
                            "dayname": "Thursday",
                            "date": "2022-01-13",
                            "totalRides": 55
                        },
                        {
                            "seq": 4,
                            "dayname": "Friday",
                            "date": "2022-01-14",
                            "totalRides":45
                        },
                        {
                            "seq": 5,
                            "dayname": "Saturday",
                            "date": "2022-01-15",
                            "totalRides": 70
                        },
                        {
                            "seq": 6,
                            "dayname": "Sunday",
                            "date": "2022-01-16",
                            "totalRides": 0
                        },
                        {
                            "seq": 7,
                            "dayname": "Monday",
                            "date": "2022-01-17",
                            "totalRides": 12
                        }
                    ]
                },
                "weekly": {
                    "name": "weekly",
                    "series": [
                        {
                            "seq": 1,
                            "dayname": "Monday",
                            "weekstart": "2021-12-06",
                            "weekend": "2021-12-12",
                            "totalRides": 45
                        },
                        {
                            "seq": 2,
                            "dayname": "Monday",
                            "weekstart": "2021-12-13",
                            "weekend": "2021-12-19",
                            "totalRides": 64
                        },
                        {
                            "seq": 3,
                            "dayname": "Monday",
                            "weekstart": "2021-12-20",
                            "weekend": "2021-12-26",
                            "totalRides": 75
                        },
                        {
                            "seq": 4,
                            "dayname": "Monday",
                            "weekstart": "2021-12-27",
                            "weekend": "2022-01-02",
                            "totalRides": 2
                        },
                        {
                            "seq": 5,
                            "dayname": "Monday",
                            "weekstart": "2022-01-03",
                            "weekend": "2022-01-09",
                            "totalRides": 10
                        },
                        {
                            "seq": 6,
                            "dayname": "Monday",
                            "weekstart": "2022-01-10",
                            "weekend": "2022-01-16",
                            "totalRides": 0
                        },
                        {
                            "seq": 7,
                            "dayname": "Monday",
                            "weekstart": "2022-01-17",
                            "weekend": "2022-01-23",
                            "totalRides": 0
                        }
                    ]
                },
                "monthly": {
                    "name": "monthly",
                    "series": [
                        {
                            "seq": 1,
                            "date": "2021-02-17",
                            "month": 2,
                            "monthname": "February",
                            "totalRides": 0
                        },
                        {
                            "seq": 2,
                            "date": "2021-03-17",
                            "month": 3,
                            "monthname": "March",
                            "totalRides": 54
                        },
                        {
                            "seq": 3,
                            "date": "2021-04-17",
                            "month": 4,
                            "monthname": "April",
                            "totalRides": 0
                        },
                        {
                            "seq": 4,
                            "date": "2021-05-17",
                            "month": 5,
                            "monthname": "May",
                            "totalRides": 33
                        },
                        {
                            "seq": 5,
                            "date": "2021-06-17",
                            "month": 6,
                            "monthname": "June",
                            "totalRides": 0
                        },
                        {
                            "seq": 6,
                            "date": "2021-07-17",
                            "month": 7,
                            "monthname": "July",
                            "totalRides": 33
                        },
                        {
                            "seq": 7,
                            "date": "2021-08-17",
                            "month": 8,
                            "monthname": "August",
                            "totalRides": 75
                        },
                        {
                            "seq": 8,
                            "date": "2021-09-17",
                            "month": 9,
                            "monthname": "September",
                            "totalRides": 0
                        },
                        {
                            "seq": 9,
                            "date": "2021-10-17",
                            "month": 10,
                            "monthname": "October",
                            "totalRides": 0
                        },
                        {
                            "seq": 10,
                            "date": "2021-11-17",
                            "month": 11,
                            "monthname": "November",
                            "totalRides": 34
                        },
                        {
                            "seq": 11,
                            "date": "2021-12-17",
                            "month": 12,
                            "monthname": "December",
                            "totalRides": 0
                        },
                        {
                            "seq": 12,
                            "date": "2022-01-17",
                            "month": 1,
                            "monthname": "January",
                            "totalRides": 0
                        }
                    ]
                }
            },
            "subscriptionData": [
                {
                    "name": "Yearly",
                    "totalSub": 201
                },
                {
                    "name": "Monthly",
                    "totalSub": 353
                },
                {
                    "name": "Weekly",
                    "totalSub": 688
                },
                {
                    "name": "Daily",
                    "totalSub": 103
                }
            ]
        }
        res.sendResponse(result)
    },


    singup: async function (req, res) {
        let userObj = req.body
        let hash = await commonUtils.getHash(userObj.password)

        let result = await users.findOrCreate({
            where: { email: userObj.email },
            defaults: {
                name: userObj.name,
                email: userObj.email,
                password: hash,
                roleType: 1, //admin
            }
        })
        if (!result[1])
            throw new createHttpError.Conflict("User already exists !!")

        res.sendResponse(result)
    }
}


