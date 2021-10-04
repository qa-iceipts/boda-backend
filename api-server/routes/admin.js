const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const subscriptionsService = require('../services/subscriptions-service');
const {login} = require('../services/user-service');
const {validate,superSchema}  = require('../utils/validator')
const bcrypt = require('bcrypt');

const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")

const {
    User
} = require('../models');


router.post('/signup', (req, res) => {
    
    let userObj = req.body
    const saltRounds = 10;
    bcrypt.hash(userObj.password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
        if(err){
            res.status(500).json({
                message: "Something Went Wrong!!",
                error : err
            });
        }else{
            User.findOrCreate({
                where: { email: userObj.email },
                defaults: {
                    name : userObj.name,
                    email : userObj.email,
                    password : hash,
                    roleType : 1, //admin
                }
            }).then(result => {
                if (result[1] == false) {
                    res.status(409).json({
                        message: "User already exists !!"

                    });
                } else {
                    res.status(200).json({
                        message: "User Admin Created Successfully",
                        result: result
                    });
                }

            }).catch(error => {
                res.status(500).json({
                    message: "Something Went Wrong!!",
                    error : error
                });
            });
        }
    });
}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/login',validate(superSchema.adminloginSchema), (req,res)=>{
    login(req,'admin').then(result=>{
        res.send(result);
    }).catch(err=>{
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(err);
    })
}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

// router.get('/subscriptions', verifyAccessToken, (req, res) => {

//     verifyUser(req,'admin').then(() => {

//         subscriptionsService.getSubscriptions(req).then((result) => {
//             res.status(HttpStatus.StatusCodes.OK).send(result);
//         }).catch(err => {
//             if (err.status = 1114) {
//                 res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err);
//             } else {
//                 res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
//             }
//         });

//     }).catch(err => {
//         res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(err);
//     })
// }, (err) => {
//     res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
// });





module.exports = router;