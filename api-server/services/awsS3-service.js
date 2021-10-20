'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module AWS-S3-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
// const {
//     fcm_keys
// } = require('../models');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");

// image 
// const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require("../utils/aws-S3")
/**
 * export module
 */

module.exports = {

    uploadProfile: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("uploadProfile Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)

            uploadFile('profile/', req.file).then((result) => {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(err => {
                console.log(err)
                logger.error('error in uploadProfile', err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            })
        }, function (err) {
            console.log(err)
            logger.error('error in add uploadProfile promise', err);
            return reject(err);
        });

    },

    sss: function () {

        multer({
            storage: multerS3({
                s3: s3,
                acl: 'public-read',
                bucket: 'xxxxxxxx',
                metadata: (req, file, callBack) => {
                    callBack(null, { fieldName: file.fieldname })
                },
                key: (req, file, callBack) => {
                    var fullPath = 'products/' + file.originalname;//If you want to save into a folder concat de name of the folder to the path
                    callBack(null, fullPath)
                }
            }),
            limits: { fileSize: 2000000 }, // In bytes: 2000000 bytes = 2 MB
            fileFilter: function (req, file, cb) {
                checkFileType(file, cb);
            }
        }).array('photos', 10);

    },
    

}
