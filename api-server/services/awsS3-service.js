'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module AWS-S3-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const { updateUser, getUserImageById } = require('../daos/users-dao');
const { addUserVehiclesImage, checkUploadLimit } = require('../daos/user_vehicles_images-dao');
const { uploadFile, getFileStream, deleteFile } = require("../utils/aws-S3")
const {getVehicleById} = require('../daos/user_vehicles-dao')
// upload single profile function
const uploadProfile = uploadFile.single('profile');
const upload = uploadFile.single('file');

const uploadVehicleImage = uploadFile.single('vehicle');

/**
 * export module
 */

module.exports = {

    uploadProfile: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            uploadProfile(req, res, function (err) {
                console.log(req.file)
                if (req.file_error) {
                    console.log(req.file_error)
                    return reject(util.responseUtil(req.file_error, null, responseConstant.UNPROCESSABLE_ENTITY));
                }
                else if (err) {
                    console.log(err)
                    return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                    // your error handling goes here
                } else if (req.file.key) {

                    console.log("req.file.key :: ", req.file.key)

                    // update user database with new profile image
                    req.body.profile_image = process.env.AWS_Cloudfront + req.file.key
                    getUserImageById(req.payload.id).then(profile_image => {
                        console.log("profile_image", profile_image)
                        if (profile_image) {

                            const profile_image_key = (profile_image.split(process.env.AWS_Cloudfront))[1];
                            console.log(profile_image_key)

                            if (profile_image_key) {
                                // delete the OLD image from S3
                                deleteFile(profile_image_key)
                            }

                        }
                        updateUser(req).then(function (result) {
                            console.log(req.file)
                            return resolve(util.responseUtil(null, { file: req.body.profile_image }, responseConstant.SUCCESS));
                        }).catch(function (err) {
                            console.log(err)
                            logger.error('error in updateUser', err);
                            return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                        });

                    }).catch(function (err) {
                        console.log(err)
                        logger.error('error in getUserImageById aws service', err);
                        return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                    });
                }
                else {
                    console.log(err)
                    return reject(util.responseUtil("key error while uploading", null, responseConstant.RUN_TIME_ERROR));
                }
            });
        }, function (err) {
            console.log(err)
            logger.error('error in uploadProfile promise', err);
            return reject(err);
        });
    },

    uploadVehicleImage: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            let userVehicleId = req.params.userVehicleId
            
            getVehicleById(userVehicleId).then(function () {
                checkUploadLimit(userVehicleId).then(function (count) {

                    uploadVehicleImage(req, res, function (err) {
                        console.log(req.file)
                        if (req.file_error) {
                            console.log(req.file_error)
                            return reject(util.responseUtil(req.file_error, null, responseConstant.UNPROCESSABLE_ENTITY));
                        }
                        else if (err) {
                            console.log(err)
                            return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                            // your error handling goes here
                        } else if (req.file.key) {
    
                            console.log("req.file.key :: ", req.file.key)
    
                            // update user database with new profile image
                            req.body = {
                                image: process.env.AWS_Cloudfront + req.file.key,
                                userVehicleId: userVehicleId
                            }
                            addUserVehiclesImage(req).then(function (result) {
                                console.log(req.file)
                                return resolve(util.responseUtil(null, { file: req.body.image }, responseConstant.SUCCESS));
                            }).catch(function (err) {
                                console.log(err)
                                logger.error('error in addUserVehiclesImage', err);
                                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                            });
    
    
                        }
                        else {
                            console.log(err)
                            return reject(util.responseUtil("key error while uploading", null, responseConstant.RUN_TIME_ERROR));
                        }
                    });
                }).catch(function (err) {
                    // console.log(err)
                    return reject(util.responseUtil(err, null, responseConstant.DUPLICATION_ERROR));
                });
            }).catch(function (err) {
                console.log(err)
                return reject(util.responseUtil("Vehicle Not found first add vehicle", null, responseConstant.RECORD_NOT_FOUND));
            });
           
        }, function (err) {
            console.log(err)
            logger.error('error in uploadProfile promise', err);
            return reject(err);
        });
    },

    upload: function (req, res, next) {
        return new Promise(function (resolve, reject) {
            upload(req, res, function (err) {
                console.log(req.file)
                if (req.file_error) {
                    console.log(req.file_error)
                    return reject(util.responseUtil(req.file_error, null, responseConstant.UNPROCESSABLE_ENTITY));
                }
                else if (err) {
                    console.log(err)
                    return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                    // your error handling goes here
                } else if (req.file.key) {

                    console.log("req.file.key :: ", req.file.key)

                    let image = process.env.AWS_Cloudfront + req.file.key

                    console.log(req.file)
                    return resolve(util.responseUtil(null, { file: image }, responseConstant.SUCCESS));
                }

            })
        }, function (err) {
            console.log(err)
            logger.error('error in uploadProfile promise', err);
            return reject(err);
        });
    }

}
