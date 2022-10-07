
'use strict';
/**
 *  This module is used to define service for ratings model 
 *  @module ratings-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const ratingssDao = require('../daos/ratings-dao');
/**
 * export module
 */

module.exports = {

    addRatings: async function (req, res, next) {
        let reqObj = req.body
        let result = await ratingssDao.addRating(reqObj)
        res.sendResponse(result)
    }

}