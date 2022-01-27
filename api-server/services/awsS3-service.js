'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module AWS-S3-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const { addUserVehiclesImage, checkUploadLimit } = require('../daos/user_vehicles_images-dao');
const { uploadFile, getFileStream, deleteFile } = require("../utils/aws-S3")
const { getVehicleById } = require('../daos/user_vehicles-dao')
// upload single profile function
const uploadProfile = uploadFile.single('profile');
const upload = uploadFile.single('file');
const uploadVehicleImage = uploadFile.single('vehicle');
const createHttpError = require('http-errors');
/**
 * export module
 */

module.exports = {
    // upload profile pic
    uploadProfile: async function (req, res, next) {
        res.send(req.file)
        // (req, res, async function (err) {
        //     console.log("req.file", req.file)

        //     if (req.file_error) {
        //         console.log("req.file_error", req.file_error)
        //         next(new createHttpError.UnprocessableEntity(req.file_error))
        //     }
        //     else if (err) {
        //         console.log(err)
        //         next(new createHttpError.InternalServerError(err))
        //     }
        //     else if (req.file && req.file.key) {

        //         console.log("req.file.key :: ", req.file.key)
        //         let user = await getUserWithId(req.user.id)
        //         console.log("profile_image=>", user.profile_image)
        //         if (user.profile_image) {
        //             let profile_image_key = (user.profile_image.split(process.env.AWS_Cloudfront))[1];
        //             console.log(profile_image_key)
        //             if (profile_image_key) deleteFile(profile_image_key)
        //         }
        //         user.profile_image = process.env.AWS_Cloudfront + req.file.key
        //         await user.save()
        //         res.sendResponse({ file: user.profile_image });
        //     }

        //     else {
        //         console.log("err")
        //         next(new createHttpError.InternalServerError("key error while uploading"))
        //     }
        // })
    },

    uploadVehicleImage: async function (req, res, next) {

        let userVehicleId = req.params.userVehicleId

        await getVehicleById(userVehicleId)
        let count = await checkUploadLimit(userVehicleId)

        uploadVehicleImage(req, res, async function (err) {
            console.log(req.file)
            if (req.file_error || err)
                next(new createHttpError.UnprocessableEntity("Invalid File error"))
            else if (req.file.key) {
                console.log("req.file.key :: ", req.file.key)
                // update user database with new  image
                reqObj = {
                    image: process.env.AWS_Cloudfront + req.file.key,
                    userVehicleId: userVehicleId
                }
                let result = await addUserVehiclesImage(reqObj)
                res.sendResponse({ file: result.image });
            }
            else {
                next(new createHttpError.InternalServerError(err))
            }
        });




    },

    upload: async function (req, res, next) {
        upload(req, res, async function (err) {
            console.log(req.file)
            if (req.file_error) {
                next(new createHttpError.UnprocessableEntity("Invalid File error"))
            }
            else if (err) {
                console.log(err)
                next(new createHttpError.InternalServerError(err))
                // your error handling goes here
            } else if (req.file.key) {
                console.log("req.file.key :: ", req.file.key)
                let image = process.env.AWS_Cloudfront + req.file.key
                console.log(req.file)
                res.sendResponse({ file: image });
            }

        })

    }

}
