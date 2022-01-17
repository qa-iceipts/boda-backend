'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const vehiclesDao = require('../daos/vehicles-dao');

/**
 * export module
 */

module.exports = {

    getVehicles: async function (req, res) {
        let result = await vehiclesDao.getVehicles(req.query)
        res.sendResponse(result)
    }

}