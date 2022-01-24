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
const {
    user_subscriptions, sequelize
} = require('../models');
const { Op } = require('sequelize')

/**
 * export module
 */
module.exports = {

    getSubscriptionReport: async function () {
        let query = "SELECT s.name,count(us.id) as totalSub FROM boda_db.subscriptions s left join boda_db.user_subscriptions us ON us.subscriptionType = s.type AND us.start<= now() AND us.end>= now() AND us.is_active = true group by s.name"
        let result = await sequelize.query(query, { type: sequelize.QueryTypes.SELECT })
        return result
    },

    getTotalSubscribers: async function () {
        let result = await user_subscriptions.count({
            where: {
                start: {
                    [Op.lte]: new Date(),
                },
                end: {
                    [Op.gte]: new Date()
                },
                is_active: true
            },

        })
        return result

    },

    unsubscribeUser: async function (userId) {
        let result = await user_subscriptions.update({ is_active: false }, { where: { userId: userId } })
        return result
    },


}


