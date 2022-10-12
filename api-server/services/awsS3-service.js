'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module AWS-S3-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const { addUserVehiclesImage } = require('../daos/user_vehicles_images-dao');
const { deleteFile, getUrl } = require("../utils/aws-S3")
const createHttpError = require('http-errors');
const { getUserWithId } = require('../daos/users-dao');
/**
 * export module
 */

module.exports = {
    // upload profile pic
    uploadProfile: async function (req, res, next) {
        console.log("req.file", req.file)
        if (req.file_error) {
            console.log("req.file_error", req.file_error)
            next(new createHttpError.UnprocessableEntity(req.file_error))
        }

        else if (req.file && req.file.key) {
            //profile/2022-09-29T08:25:10.639Z409a872e-4652-4e3e-a730-89c29880de28-25 User_Profile.png
            console.log("req.file.key :: ", req.file.key)
            let user = await getUserWithId(req.params.userId)
            console.log("profile_image=>", user.profile_image)
            if (user.profile_image) {
                deleteFile(user.profile_image)
            }
            user.profile_image = req.file.key
            await user.save()
            let awaits = await getUrl(req.file.key)
            res.sendResponse({
                file: awaits
            });
        }

        else {
            console.log("err")
            next(new createHttpError.InternalServerError("key error while uploading"))
        }
    },
    saveVehicleImage: async function (req, res, next) {
        console.log("req.file", req.file)
        if (req.file_error) {
            console.log("req.file_error", req.file_error)
            next(new createHttpError.UnprocessableEntity(req.file_error))
        }
        else if (req.file && req.file.key) {
            console.log("req.file.key :: ", req.file.key)
            let result = await addUserVehiclesImage({
                image: req.file.key,
                userVehicleId: req.params.userVehicleId
            })
            let awaits = await getUrl(result.image)
            res.sendResponse({
                file: awaits
            });
        }
        else {
            console.log("err")
            next(new createHttpError.InternalServerError("key error while uploading"))
        }
    },

}
