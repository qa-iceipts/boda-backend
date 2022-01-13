'use strict';

const logger = require('../utils/logger');
const util = require('../utils/commonUtils')
const axios = require('axios');
var responseConstant = require("../constants/responseConstants");
const {
    user_location
} = require('../models');
const { Op } = require("sequelize")

// export module
module.exports = {

    updateLocation: function (req) {
        return new Promise(function (resolve, reject) {
            let { user_id, lat, long, online, vehicle_type, user_type, per_km } = req.body
            let insertObj = {
                user_id,
                vehicle_type,
                user_type,
                lat,
                long,
                online,
                per_km,
            }
            user_location.findOrCreate({
                where: { user_id: user_id },
                defaults: insertObj
            }).then(([result, created]) => {
                //  console.log(created)
                if (!created) {
                    user_location.update(insertObj, { where: { user_id: result.user_id } }).then(() => {
                        return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
                    })
                } else {
                    return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
                }
            }).catch(err => {
                console.log(err)
                logger.error('error in location update', err);
                return reject(err);
            });
        }, function (err) {
            console.log(err)
            logger.error('error in location update', err);
            return reject(err);
        });

    },

    getUserStatus: function (user_id) {
        return new Promise(function (resolve, reject) {

            user_location.findOne({
                where: { user_id: user_id },
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }).then((result) => {
                if (result) {
                    return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                } else {
                    return reject(util.responseUtil(null, null, responseConstant.USER_NOT_FOUND));
                }
            }).catch(err => {
                console.log(err)
                logger.error('error in location update', err);
                return reject(err);
            });
        }, function (err) {
            console.log(err)
            logger.error('error in location update', err);
            return reject(err);
        });

    },

    getLocationByIds: function (Ids) {
        return new Promise(function (resolve, reject) {

            user_location.findAll({
                where: {
                    user_id: Ids
                },
                attributes: ["lat", "long", "user_id"]
            }).then(result => {
                if (result.length > 0) {
                    return resolve(result)
                } else {
                    return reject({ msg: "Not found" })
                }

            }).catch(err => {
                console.log(err)
                return reject(err)
            })


        }, function (err) {
            logger.error('error in  getLocationByIds', err);
            return reject(err);
        });

    },

    getNearbyDrivers: function (req) {
        return new Promise(function (resolve, reject) {

            let { user_id, lat, long, radius, vehicle_type } = req.body

            let result = util.getMinMaxLatLong(lat, long, radius)

            let minLoc = { lat: result.minLattitude, lng: result.minLongitude }
            let maxLoc = { lat: result.maxLattitude, lng: result.maxLongitude }

            let distance_KM = util.calculateDistance(minLoc.lat, minLoc.lng, maxLoc.lat, maxLoc.lng, "K")

            console.log(result, distance_KM);
            // query where Obj
            let whereObj = {
                lat: {
                    [Op.between]: [result.minLattitude, result.maxLattitude]
                },
                long: {
                    [Op.between]: [result.minLongitude, result.maxLongitude]
                },
                online: true,
                user_type: 2, // DRIVER === 2
                user_id: {
                    [Op.not]: user_id
                },
            }
            if (vehicle_type != 'all') {
                whereObj.vehicle_type = vehicle_type
            }

            user_location.findAndCountAll({
                where: whereObj, attributes: { exclude: ['createdAt', 'updatedAt'] },
                // include: {
                //     model : 
                // }
            }).then((nearbyUsers) => {

                if (nearbyUsers.count > 0) {
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
                    return resolve(nearbyUsers)
                }
                else {
                    return reject({ msg: "No Nearby Drivers Found" });
                }
            }).catch(err => {
                console.log(err)
                logger.error('error in location nearby', err);
                return reject(err);
            })

        }, function (err) {
            console.log(err)
            logger.error('error in location nearby', err);
            return reject(err);
        });

    },



}
