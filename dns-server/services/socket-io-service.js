'use strict';
const axios = require('axios');
const {
    dns_connections,
    rides
} = require('../models');
const { Op } = require("sequelize");
const { calculateDistance } = require('../utils/commonUtils');
const createHttpError = require('http-errors')

module.exports = {
    addDNSConnection: async function (reqObj) {
        console.log(reqObj)
        if (!reqObj.rideId || !reqObj.userId) {
            throw new createHttpError.BadRequest("INVALID REQUEST")
        }
        let [result, created] = await dns_connections.findOrCreate({
            //rideId: reqObj.rideId,
            where: { userId: reqObj.userId },
            defaults: reqObj
        })

        if (!created) {
            result.set(reqObj)
            await result.save()
        }
        return result

    },


    getSocketId: async function (user_id) {

        let result = await dns_connections.findOne({
            //rideId: reqObj.rideId,
            where: { userId: user_id },
            attributes: ["socketId"],
            raw: true
        })
        if (!result) throw new createHttpError.NotFound("no user Found")
        return result

    },
    DeleteDNSConnection: async function (socketId) {
        return await dns_connections.destroy({
            where: { socketId: socketId },
        })

    },

    getNearbyDrivers: async function (reqObj) {
        console.log("getNearbyDrivers called", reqObj)


        let rideData = await axios.get(process.env.API_SERVER + '/rides/getRideById/' + reqObj.rideId)


        if (!rideData.data && rideData.data.data) {
            throw new createHttpError.FailedDependency("ride data not found on apiserver")
        }

        console.log("Response of process.env.API_SERVER + '/rides/getRideById ' => ", rideData.data.data)
        console.log(rideData.data.data.distance, rideData.data.data.eta)


        // ETA CODE

        let onAirDistance = calculateDistance(rideData.data.data.origin_lat, rideData.data.data.origin_long, rideData.data.data.destination_lat, rideData.data.data.destination_long, 'K')
        console.log("distance => ", onAirDistance)

        let response = await axios.post(process.env.LOCATION_SERVER + '/getNearbyDrivers', {
            "user_id": rideData.data.data.customer_id,
            "lat": rideData.data.data.origin_lat,
            "long": rideData.data.data.origin_long,
            "radius": reqObj.radius ? reqObj.radius : 20,
            "vehicle_type": reqObj.vehicle_type
        })


        console.log("Location server nearby driver get response ::", response.data)

        if (!response.data.success) throw new createHttpError.InternalServerError()
        if (Object.keys(response.data.data).count === 0) throw new createHttpError.NotFound("Nearby Drivers Not Found")
        response.data = response.data.data
        let destinations = rideData.data.data.origin_lat + ',' + rideData.data.data.origin_long
        let array = []
        let driverIds = []
        // throw new Error("World")
        response.data.rows.forEach(obj => {
            array.push({
                driverId: obj.user_id,
                rideId: reqObj.rideId,
                "user_id": rideData.data.data.customer_id,
                pick_lat: rideData.data.data.origin_lat,
                pick_long: rideData.data.data.origin_long,
                drop_lat: rideData.data.data.destination_lat,
                drop_long: rideData.data.data.destination_long,
                ridedistance: rideData.data.data.distance,
                eta: rideData.data.data.distance.eta,
                status: 0,
                price: 0,
                customerId: rideData.data.data.customer_id,
                range: parseInt(onAirDistance * obj.per_km),
            })
            driverIds.push(obj.user_id)
        });
        await rides.destroy({
            where: {
                rideId: reqObj.rideId
            }
        })
        await rides.bulkCreate(array)

        let origins = ''
        response.data.rows.forEach((element, index) => {
            origins += element.lat + ',' + element.long
            if (index != response.data.rows.length - 1) {
                origins += '|'
            }
        });

        let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origins}&key=${process.env.MAPS_API_KEY}`

        console.log("distance matrix URL", url)

        let etaResult = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                destinations: destinations,
                origins: origins,
                key: process.env.MAPS_API_KEY
            }
        })

        if (!etaResult.data) throw new createHttpError.InternalServerError("Google distance Error")

        console.log("etaresult data", etaResult.data)

        etaResult.data.rows.forEach((element, index) => {
            response.data.rows[index].address = etaResult.data.origin_addresses[index]
            response.data.rows[index].distance = element.elements[0].distance.text
            response.data.rows[index].duration = element.elements[0].duration.text
        });

        let metrics = await axios.post(process.env.API_SERVER + '/users/getDriverMetrics', {
            "driverIds": driverIds,
            "customer_id": rideData.data.data.customer_id
        })

        console.log("Response of /users/getDriverMetrics => ", metrics.data.data)
        if (metrics.data.data.length === 0) throw new createHttpError.NotFound("no drivers found or eta")
        let merged = [];

        for (let i = 0; i < metrics.data.data.length; i++) {
            merged.push({
                ...metrics.data.data[i],
                ...(response.data.rows.find((itmInner) => itmInner.user_id === metrics.data.data[i].id))
            });
        }
        console.log("merged::", merged);
        return ({ data: merged })
    },

    fetchDrivers: async function (req) {
        let result = await rides.findAll({
            where: {
                rideId: req.rideId,
                status: 0
            },
            attributes: ['driverId']
        })
        if (result.length <= 0) throw new createHttpError.NotFound("No drivers found")
        let driverIds = []
        result.forEach(element => {
            driverIds.push(element.driverId)
        });
        return driverIds
        // return [result, driverIds]
    },

    getTokensByIds: async function (Ids) {
        let result = await axios.post(process.env.API_SERVER + '/fcm/getTokensByIds', {
            "Ids": Ids
        })
        return result.data
    },

    getResponse: async function (rideId) {

        await rides.destroy({
            where: {
                status: 0,
                price: 0,
                rideId: rideId
            }
        })
        let result = await rides.findAll({
            raw: true,
            where: {
                status: 1,
                price: {
                    [Op.not]: 0
                },
                rideId: rideId

            }
        })
        if (result.length <= 0) throw new createHttpError.NotFound("Rides not found")

        let destinations = result[0].pick_lat + ',' + result[0].pick_long
        let driverIds = []
        result.forEach(element => {
            driverIds.push(element.driverId)
        })

        console.log(driverIds)

        let [driversData, driversLocationData] = await Promise.all([
            axios.post(process.env.API_SERVER + `/users/getAllUsersByIds`, {
                "Ids": driverIds
            }),
            axios.post(process.env.LOCATION_SERVER + `/getLocationByIds`, {
                "Ids": driverIds
            })
        ])

        let origins = ''
        driversLocationData.data.forEach((element, index) => {
            origins += element.lat + ',' + element.long
            if (index != driversLocationData.data.length - 1) {
                origins += '|'
            }
        });
        console.log("destinations:: ", destinations, "origins :: ", origins)

        // ETA GET
        let etaResult = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                destinations: destinations,
                origins: origins,
                key: process.env.MAPS_API_KEY
            }
        })
        if (!etaResult.data) console.log("eta result not found")

        etaResult.data.rows.forEach((element, index) => {
            console.log(element)
            driversLocationData.data[index].distance = element.elements[0].distance.text
            driversLocationData.data[index].duration = element.elements[0].duration.text
        });
        //console.log(driversLocationData.data)

        let merged = [];

        for (let i = 0; i < driversData.data.data.length; i++) {
            merged.push({
                ...driversData.data.data[i],
                ...(result.find((itmInner) => itmInner.driverId === driversData.data.data[i].id)),
                ...(driversLocationData.data.find((itmInner) => itmInner.user_id === driversData.data.data[i].id))
            });
        }
        console.log(merged)
        return merged
    }


}

// async function a() {
//     let reqObj = {
//         rideId: 2
//     }
//     let rideData = await axios.get(process.env.API_SERVER + '/rides/getRideById/' + reqObj.rideId)


//     if (!rideData.data.data) {
//         throw new createHttpError.FailedDependency("ride data not found on apiserver")
//     }

//     console.log("Response of process.env.API_SERVER + '/rides/getRideById ' => ", rideData.data.data)
//     console.log(rideData.data.data.distance, rideData.data.data.eta)

// }
// a()