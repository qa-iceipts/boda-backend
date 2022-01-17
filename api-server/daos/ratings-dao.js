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

const { ratings } = require('../models');

module.exports = {
    addRating: async function (reqObj) {
        let result = await ratings.create(reqObj)
        return result
    },

}