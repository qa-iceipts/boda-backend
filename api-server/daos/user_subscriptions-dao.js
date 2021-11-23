"use strict";
/**
 *  This module is used to define Data access operations for UserVehicles 
 *  @module user_subscriptions-dao
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

/**
 *  import project modules
 */

const logger = require('../utils/logger');
const {
    user_subscriptions, subscriptions, sequelize
} = require('../models');
const { Op } = require('sequelize')

/**
 * export module
 */
module.exports = {

    getSubscriptionReport: function () {
        return new Promise(function (resolve, reject) {
            console.log("getSubscriptionReport dao called");

            let query = "SELECT s.name,count(us.id) as totalSub FROM boda_db.subscriptions s left join boda_db.user_subscriptions us ON us.subscriptionType = s.type AND us.start<= now() AND us.end>= now() AND us.is_active = true group by s.name"
            sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
                .then((result) => {
                    //  console.log(result)
                    return resolve(result);
                }).catch(err => {
                    console.log(err)
                    return reject(err);
                })
            //     user_subscriptions.findAll({
            //         attributes: { 
            //             include: [
            //             [sequelize.fn("COUNT", sequelize.col("user_subscriptions.id")), "Count"],
            //             // [sequelize.literal('"subscriptions"."name"'), 'subscriptions']
            //         ] 
            //         },
            //         include: [{
            //             model: subscriptions, attributes: ["name"],
            //             required: true
            //         }],
            //         group: ['type']
            //   }).then(result=>{
            //     return resolve(result)
            //   }).catch(err=>{
            //       return reject(err)
            //   })

            console.log("getSubscriptionReport dao returned");

        }, function (err) {
            logger.error('error in getSubscriptionReport promise', err);
            return reject(err);
        });
    },

    getTotalSubscribers: function () {
        return new Promise(function (resolve, reject) {
            console.log("getTotalSubscribers dao called");

            user_subscriptions.count({
                where: {
                    start: {
                        [Op.lte]: new Date(),
                    },
                    end: {
                        [Op.gte]: new Date()
                    },
                    is_active: true
                },

            }).then(result => {
                return resolve(result)
            }).catch(err => {
                return reject(err)
            })

            console.log("getSubscriptionReport dao returned");

        }, function (err) {
            logger.error('error in getSubscriptionReport promise', err);
            return reject(err);
        });
    },

    unsubscribeUser: async function (userId) {
        let result = await user_subscriptions.update({ is_active: false }, { where: { UserId: userId } })
        return result
    },  


}


