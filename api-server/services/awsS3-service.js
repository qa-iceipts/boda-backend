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
const { updateUser,getUserImageById } = require('../daos/users-dao');
const multer = require('multer')
const { uploadFile, getFileStream,deleteFile } = require("../utils/aws-S3")

// upload single profile function
const uploadProfile = uploadFile.single('profile');

/**
 * export module
 */

module.exports = {

    uploadProfile : function(req,res,next){
        return new Promise(function (resolve,reject){
            uploadProfile(req, res, function (err) {
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
                    getUserImageById(req.payload.id).then(profile_image=>{
                       if(profile_image){

                       
                        const profile_image_key = (profile_image.split(process.env.AWS_Cloudfront))[1];
                        console.log(profile_image_key)

                        // delete the OLD image from S3
                        deleteFile(profile_image_key)
                        }
                        updateUser(req).then(function (result) {
                            console.log(req.file)
                            return resolve(util.responseUtil(null, {file: req.body.profile_image}, responseConstant.SUCCESS));
                        }).catch(function (err) {
                            console.log(err)
                            logger.error('error in updateUser', err);
                            return reject(util.responseUtil(err,null, responseConstant.RUN_TIME_ERROR));
                        });

                    }).catch(function (err) {
                        console.log(err)
                        logger.error('error in getUserImageById aws service', err);
                        return reject(util.responseUtil(err,null, responseConstant.RUN_TIME_ERROR));
                    });
                }
                else {
                    console.log(err)
                    return reject(util.responseUtil("key error while uploading",null, responseConstant.RUN_TIME_ERROR));
                }
            });
        }, function (err) {
            console.log(err)
            logger.error('error in uploadProfile promise', err);
            return reject(err);
        });
    }

}
