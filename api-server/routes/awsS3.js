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
    function (req, res,next) {

        req.subdir = 'profile/';
        AwsService.uploadProfile(req,res,next).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }).catch(err => {
            console.log(err)
            logger.error(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        });

    })


// router.post('/uploadProfile', verifyAccessToken,
//     authorize([ROLE.ADMIN, ROLE.DRIVER, ROLE.CUSTOMER]),
//     upload.single('profile'),

// router.post('/uploadProfile',
//     upload.single('profile'),
//     (req, res) => {
//         if(req.file){
//             console.log(req.file)
//             AwsService.uploadProfile(req).then((result) => {
//                 res.status(HttpStatus.StatusCodes.OK).send(result);
//             }).catch(err => {
//                 console.log(err)
//                 logger.error(err)
//                 res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
//             });
//         }else{
//             res.status(HttpStatus.StatusCodes.BAD_REQUEST).send({
//                 status : 400,
//                 error : "file required"
//             });
//         }

//     }, (err) => {
//         console.log(err)
//         res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
//     });


// router.post('/uploadProfile', upload.single('profile'), async (req, res, next) => {

//     const file = req.file

//     console.log(file)
//     //console.log("---",myFile,fileType)

//     uploadFile(file).then((result) => {
//         console.log(result)
//         res.status(200).send(result)
//     }).catch(err => {
//         console.log(err)
//         res.status(500).send("Server Error")
//     })
//     // await unlinkFile(file.path)

//     // const description = req.body.description
//     // res.send({imagePath: `/images/${result.Key}`})
//     // res.send("success")

// });

module.exports = router;