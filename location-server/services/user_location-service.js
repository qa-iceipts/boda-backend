'use strict';

const logger = require('../utils/logger');
const util = require('../utils/commonUtils')
const axios = require('axios');
var responseConstant = require("../constants/responseConstants");
const {
    user_location
} = require('../models');
const {Op} = require("sequelize")

// export module
module.exports = {

    updateLocation: function (req) {
        return new Promise(function (resolve, reject) {
            let {user_id,lat,long,online,vehicle_type,user_type} = req.body
            let insertObj = {
                user_id : user_id,
                vehicle_type : vehicle_type,
                user_type : user_type,
                lat : lat ,
                long : long,
                time : new Date(),
                online : online
              }
           user_location.findOrCreate({
            where: { user_id: user_id },
            defaults: insertObj
          }).then(([result,created])=>{
            //  console.log(created)
             if(!created){
                user_location.update(insertObj,{where:{user_id : result.user_id}}).then(()=>{
                    return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
                })
             }else{
                return resolve(util.responseUtil(null, null, responseConstant.SUCCESS));
             } 
          }).catch(err=>{
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
            where: { user_id: user_id }
          }).then((result)=>{
                if(result){
                    return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                }else{
                    return reject(util.responseUtil(null, null, responseConstant.USER_NOT_FOUND));
                }
          }).catch(err=>{
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

    getNearbyDriversold2 : function (req) {
        return new Promise(function (resolve, reject) {
             let {user_id,lat,long} = req.body
             let destinations = lat + ',' + long 
             let result = util.getMinMaxLatLong(lat,long,2)
             let obj1 = {
                lat : result.minLattitude,
                lng : result.minLongitude
             }
             let obj2 = {
                lat : result.maxLattitude,
                lng : result.maxLongitude
             }
            let distance_KM = util.calculateDistance(obj1.lat, obj1.lng, obj2.lat, obj2.lng,"K")
            console.log(result,distance_KM);

            user_location.findAndCountAll({where:{
                lat:{
                    [Op.between]: [result.minLattitude, result.maxLattitude]
                },
                long:{
                    [Op.between]: [result.minLongitude, result.maxLongitude]  
                },
                status : true
            }}).then((nearbyUsers)=>{
                console.log(nearbyUsers)
                if(nearbyUsers.count >0){
                console.log("users::",nearbyUsers.rows[0].dataValues)
                let origins = ''
                nearbyUsers.rows.forEach((element,index )=> {
                    origins += element.lat + ',' +element.long 
                    if(index != nearbyUsers.rows.length-1){
                        origins += '|'
                    }
                });
                console.log(destinations,"origins",origins)

                let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origins}&key=${process.env.MAPS_API_KEY}`

                console.log(url)

                axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                    params: {
                      destinations: destinations,
                      origins : origins,
                      key : process.env.MAPS_API_KEY
                    }
                  })
                  .then(function (response) {
                   
                    if(response.data)
                    console.log(response.data);

                    nearbyUsers.rows.forEach((element,index )=> {
                        nearbyUsers.rows[index].dataValues.distance = response.data.rows[index].elements[0].distance.text
                       nearbyUsers.rows[index].dataValues.duration = response.data.rows[index].elements[0].duration.text
                    });
                    console.log(nearbyUsers.rows[0].dataValues)
                    return resolve({
                        result,
                        distance_KM,
                        data : response.data,
                        nearbyUsers : nearbyUsers.rows
                    });
                  })
                  .catch(function (error) {
                    console.log(error);
                    return reject(err);
                  })

                }
                else{
                    return reject({msg:"No Nearby Drivers Found"});
                }
            }).catch(err=>console.log(err))
          
        }, function (err) {
            logger.error('error in location update', err);
            return reject(err);
        });

    },

    getNearbyDrivers : function (req) {
        return new Promise(function (resolve, reject) {
             let {user_id,lat,long,radius,vehicle_type} = req.body
            //  let destinations = lat + ',' + long
            
             let result = util.getMinMaxLatLong(lat,long,radius)
             let minLoc = {
                lat : result.minLattitude,
                lng : result.minLongitude
             }
             let maxLoc = {
                lat : result.maxLattitude,
                lng : result.maxLongitude
             }
            let distance_KM = util.calculateDistance(minLoc.lat, minLoc.lng, maxLoc.lat, maxLoc.lng,"K")
            console.log(result,distance_KM);

            let whereObj = {
                lat:{
                    [Op.between]: [result.minLattitude, result.maxLattitude]
                },
                long:{
                    [Op.between]: [result.minLongitude, result.maxLongitude]  
                },
                online : true,
                user_type : 2,
                user_id : {
                    [Op.not]: user_id
                },
                // vehicle_type :  vehicle_type ? vehicle_type : "attributeTwoToo"
            }
            if(vehicle_type !='all'){
                whereObj.vehicle_type = vehicle_type
            }
            user_location.findAndCountAll({where:whereObj}).then((nearbyUsers)=>{

                if(nearbyUsers.count > 0){
                    
                    nearbyUsers.VehicleCount = nearbyUsers.rows.reduce(function(obj, v) {
                        // increment or set the property
                        // `(obj[v.status] || 0)` returns the property value if defined
                        // or 0 ( since `undefined` is a falsy value
                        obj[v.dataValues.vehicle_type] = (obj[v.dataValues.vehicle_type] || 0) + 1;
                        // return the updated object
                        return obj;
                        // set the initial value as an object
                      }, {})
                      
                    return resolve(nearbyUsers)
                // let origins = ''
                // nearbyUsers.rows.forEach((element,index )=> {
                //     origins += element.lat + ',' +element.long 
                //     if(index != nearbyUsers.rows.length-1){
                //         origins += '|'
                //     }
                // });
                // console.log(destinations,"origins",origins)

                // let url = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${destinations}&origins=${origins}&key=${process.env.MAPS_API_KEY}`

                // console.log(url)

                // axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
                //     params: {
                //       destinations: destinations,
                //       origins : origins,
                //       key : process.env.MAPS_API_KEY
                //     }
                //   })
                //   .then(function (response) {
                   
                //     if(response.data)
                //     console.log(response.data);

                //     nearbyUsers.rows.forEach((element,index )=> {
                //         nearbyUsers.rows[index].dataValues.distance = response.data.rows[index].elements[0].distance.text
                //        nearbyUsers.rows[index].dataValues.duration = response.data.rows[index].elements[0].duration.text
                //     });
                //     console.log(nearbyUsers.rows[0].dataValues)
                //     return resolve({
                //         result,
                //         distance_KM,
                //         data : response.data,
                //         nearbyUsers : nearbyUsers.rows
                //     });
                //   })
                //   .catch(function (error) {
                //     console.log(error);
                //     return reject(err);
                //   })

                }
                else{
                    return reject({msg:"No Nearby Drivers Found"});
                }
            }).catch(err=>{
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
