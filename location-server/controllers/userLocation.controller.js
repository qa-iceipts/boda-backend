'use strict';
const util = require('../utils/commonUtils')
const userLocationService = require('../services/userLocation.service');
const createHttpError = require('http-errors');

// export module
module.exports = {

    updateLocation: async function (req, res, next) {
        let reqObj = req.body
        if (reqObj.user_id == 'bd803b69-0b92-4766-aa9b-e1dad80719b3')
            throw new createHttpError.BadRequest("false")
        let [result, created] = await userLocationService.findOrCreateByUserId(reqObj)
        console.log("location Post Data :: ", reqObj, created)
        if (!created) {
            result.set(reqObj)
            result.save()
        }
        res.sendResponse(result)
    },

    getUserStatus: async function (req, res, next) {
        let { user_id } = req.params
        let result = await userLocationService.getByUserId(user_id)
        res.sendResponse(result)
    },

    getLocationByIds: async function (req, res) {
        let result = await userLocationService.getLocationByIds(req.body.Ids)
        res.sendResponse(result)
    },

    getNearbyDrivers: async function (req, res, next) {

        let { user_id, lat, long, radius, vehicle_type } = req.body
        let result = util.getMinMaxLatLong(lat, long, radius)
        let minLoc = { lat: result.minLattitude, lng: result.minLongitude }
        let maxLoc = { lat: result.maxLattitude, lng: result.maxLongitude }
        let distance_KM = util.calculateDistance(minLoc.lat, minLoc.lng, maxLoc.lat, maxLoc.lng, "K")

        let nearbyUsers = await userLocationService.getNearbyDrivers({ minLoc, maxLoc, vehicle_type, user_id })

        if (Object.getOwnPropertyNames(nearbyUsers).length > 0) {
            //vehicle count
            nearbyUsers.VehicleCount = nearbyUsers.rows.reduce(function (obj, v) {
                // increment or set the property
                // `(obj[v.status] || 0)` returns the property value if defined
                // or 0 ( since `undefined` is a falsy value
                obj[v.dataValues.vehicle_type] = (obj[v.dataValues.vehicle_type] || 0) + 1;
                obj[1] = (obj[1] || 0);
                obj[2] = (obj[2] || 0);
                obj[3] = (obj[3] || 0);
                obj[4] = (obj[4] || 0);
                // return the updated object
                return obj;
                // set the initial value as an object
            }, {})

            console.log(nearbyUsers.VehicleCount)
        }

        res.sendResponse(nearbyUsers)
    },

    addFavLoc: async function (req, res) {
        let result = await userLocationService.addFavLoc(req.body)
        res.sendResponse(result)
    },
    getFavLoc: async function (req, res) {
        let result = await userLocationService.getFavLoc(req.params.userId)
        res.sendResponse(result)
    },
}
