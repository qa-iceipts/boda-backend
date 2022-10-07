'use strict';
module.exports = {

    getMinMaxLatLong: function (latitude, longitude, RadiusInKm) {
        let minLattitude, maxLattitude, minLongitude, maxLongitude = 0
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
    },

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
    },
  

}

// Converts numeric degrees to radians
function toRad(Value) {
    return Value * Math.PI / 180;
}
