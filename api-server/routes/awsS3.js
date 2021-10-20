const express = require('express');
const router = express.Router();
const AwsService = require('../services/awsS3-service');
const HttpStatus = require('http-status-codes');
const logger = require('../utils/logger')
const ROLE = require('../utils/roles')
const {uploadwithmulter} = require('../utils/aws-S3')
const {
    verifyAccessToken,
    authorize
} = require("../utils/verifytoken")
const multer = require('multer')
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
const { profileImage } = require('../utils/aws-S3'); 
// const upload2 = new FileUpload('image').upload('profile-images', 'image');
// exports.uploadUserPhoto = upload.array('photos', 10);

const {updateUser} = require('../daos/users-dao');

const upload =  profileImage.single('profile');


router.post('/uploadProfile', verifyAccessToken,authorize([ROLE.ADMIN, ROLE.DRIVER, ROLE.CUSTOMER]),
 function(req, res, next) {
    req.subdir = 'profile/';
    upload(req, res, function (err) {
        if(req.file_error){
            console.log(req.file_error)
            res.status(500).send({
               error: req.file_error
            })
        }
        else if (err) {
            console.log(err)
            res.send(500).send({
                error : "Internal Server Error while Uploading"
            })
            // your error handling goes here

        }else{
            // console.log(req)
            req.body.profile_image = 'https://d3aqd0lttt7b0w.cloudfront.net/' + req.file.key

            updateUser(req).then(function (result) {
                console.log(req.file)
                res.send({
                    file : req.body.profile_image
                })
            }).catch(function (err) {
                logger.error('error in updateUser', err);
                return reject(err);
            });   
        }
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