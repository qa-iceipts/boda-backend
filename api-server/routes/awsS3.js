// /aws/ route file
const express = require('express');
const router = express.Router();
const AwsService = require('../services/awsS3-service');
const HttpStatus = require('http-status-codes');
const logger = require('../utils/logger')
const ROLE = require('../utils/roles')
const {
    verifyAccessToken,
    authorize
} = require("../utils/verifytoken")



router.post('/uploadProfile', verifyAccessToken, authorize([ROLE.ADMIN, ROLE.DRIVER, ROLE.CUSTOMER]),
    function (req, res, next) {

        req.subdir = 'profile/';
        AwsService.uploadProfile(req, res, next).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }).catch(err => {
            console.log(err)
            logger.error(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        });

    })
//, verifyAccessToken, authorize([ROLE.ADMIN, ROLE.DRIVER])
router.post('/uploadVehicleImage/:userVehicleId',
    function (req, res, next) {
        
        req.subdir = 'vehicles/';
        AwsService.uploadVehicleImage(req, res, next).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }).catch(err => {
            console.log(err)
            logger.error(err)
            if(err.status == 1114){
                 res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
            }else{
                    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
           
        });

    })

router.post('/upload645748', function (req, res, next) {

    req.subdir = 'files/';
    AwsService.upload(req, res, next).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }).catch(err => {
        console.log(err)
        logger.error(err)
        res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
    });

})


module.exports = router;