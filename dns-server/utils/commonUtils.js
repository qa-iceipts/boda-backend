'use strict';
module.exports = {

    responseUtil: function (error, data, code) {
        var constants = require('../constants/responseConstants');
        var message = require('../constants/messages');
        var response = {};
        if ((code == null || code == undefined) && (error == null || error == undefined)) {
            throw new Error("Please Send code or error message");
        } else if (code == null || code == undefined) {
            if (error.name === constants.SEQUELIZE_DATABASE_ERROR_NAME)
                code = constants.SEQUELIZE_DATABASE_ERROR_NAME_CODE;
            else if (error.name === constants.SEQUELIZE_VALIDATION_ERROR_NAME)
                code = constants.SEQUELIZE_VALIDATION_ERROR_NAME_CODE;
            else if (error.name === constants.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR_NAME)
                code = constants.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR_NAME_CODE;
            else if (error.name === constants.SEQUELIZE_CONSTRAINT_ERROR)
                code = constants.SEQUELIZE_CONSTRAINT_ERROR_CODE;
            else
                code = constants.UNDEFINED_DATABASE_ERROR;
        }
        response.status = code;
        response.message = message.getMessage(code);
        if (error != null) {
            response.error = error;
            if (error.message != null || error.message != undefined) {
                response.message = response.message + ' :: ' + error.message;
            }

        }
        if (data != null) {
            if (!data.hasOwnProperty('rows')) {
                response.data = data;
            }
            else {
                response.count = data.count;
                response.data = data.rows;
            }
        }
        return response;
    },
    sendResponse: function (data, status) {
        return {
            success: true, status: status ? status : 200, data: data
        };
    },

    getMinMaxLatLong: function (latitude, longitude, RadiusInKm) {

        let minLattitude, maxLattitude, minLongitude, maxLongitude = 0

        // minLattitude = parseFloat(latitude) - (RadiusInKm/111.12);
        // maxLattitude = parseFloat(latitude) +  (RadiusInKm/111.12);
        // minLongitude =  (parseFloat(longitude) - (RadiusInKm/111.12)) * Math.abs(Math.cos(parseFloat(latitude)));
        // maxLongitude = (parseFloat(longitude) +  (RadiusInKm/111.12)) * Math.abs(Math.cos(parseFloat(latitude)));

        let kmInLongitudeDegree, deltaLat, deltaLong

        kmInLongitudeDegree = 111.320 * Math.cos(parseFloat(latitude) / 180.0 * Math.PI)

        deltaLat = parseFloat(RadiusInKm) / 111.1;
        deltaLong = parseFloat(RadiusInKm) / parseFloat(kmInLongitudeDegree);
        minLattitude = parseFloat(latitude) - parseFloat(deltaLat);
        maxLattitude = parseFloat(latitude) + parseFloat(deltaLat);
        minLongitude = parseFloat(longitude) - parseFloat(deltaLong);
        maxLongitude = parseFloat(longitude) + parseFloat(deltaLong);

        let returnObj = {
            minLattitude: minLattitude,
            maxLattitude: maxLattitude,
            minLongitude: minLongitude,
            maxLongitude: maxLongitude,
        }

        return returnObj
    }

    ,

    //This function takes in latitude and longitude of two locations
    // and returns the distance between them as the crow flies (in meters)
    calculateDistance: function distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist
    }

}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
