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
    user_subscriptions,subscriptions, sequelize
} = require('../models');
/**
 * export module
 */
module.exports = {

    getSubscriptionReport: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("getSubscriptionReport dao called");

            user_subscriptions.findAll({
                attributes: { 
                    include: [
                    [sequelize.fn("COUNT", sequelize.col("user_subscriptions.id")), "Count"],
                    // [sequelize.literal('"subscriptions"."name"'), 'subscriptions']
                ] 
                    
                },
                include: [{
                    model: subscriptions, attributes: ["name"],
                    required: true
                }],
                group: ['type']
          }).then(result=>{
            return resolve(result)
          }).catch(err=>{
              return reject(err)
          })

            console.log("getSubscriptionReport dao returned");

        }, function (err) {
            logger.error('error in getSubscriptionReport promise', err);
            return reject(err);
        });
    },

    // unsubscribeUser : function (userId) {
    //     return new Promise(function (resolve, reject) {
    //         console.log("updateUserSubscription dao called");

    //         user_subscriptions.update({
    //             where: { 
          
    //             },

    //       }).then(result=>{
    //         return resolve(result)
    //       }).catch(err=>{
    //           return reject(err)
    //       })

    //         console.log("updateUserSubscription dao returned");

    //     }, function (err) {
    //         logger.error('error in updateUserSubscription promise', err);
    //         return reject(err);
    //     });
    // },

    
}