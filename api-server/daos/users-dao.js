"use strict";
/**
 *  This module is used to define Data access operations for user 
 *  @module user-dao
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

/**
 *  import project modules
 */

const logger = require('../utils/Logger');
const db = require('../models');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const {
    signAccessToken,
    loginRefreshToken,
    verifyRefreshToken
} = require('../utils/verifytoken')
const {
    Op
} = require("sequelize");
/**
 * export module
 */
module.exports = {
    addUser: function (req) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            logger.debug("Add user dao called");
            db.User.findAll({
                where: {
                    email: reqObj.email
                }
            }).then(function (result) {
                console.log("res::", result.length)
                if (result.length > 0) {
                    return reject("Email Already Registered");

                } else {
                    db.User.findAll({
                        where: {
                            phone: reqObj.phone
                        }
                    }).then(function (result) {
                        // console.log("res::", result.length)
                        if (result.length > 0) {
                            return reject("Mobile Already Registered");
                        } else {
                            db.User.create(reqObj).then(res => {
                                 return resolve(res.dataValues);
                                // let accessToken, refreshToken
                                // signAccessToken(res.dataValues).then(function (result) {
                                //     accessToken = result
                                //     console.log(accessToken)
                                //     loginRefreshToken(res.dataValues).then(function (result1) {
                                //         refreshToken = result1
                                //         console.log("refreshToken::", refreshToken)
                                //         return resolve({

                                //             tokens: {
                                //                 accesstoken: accessToken,
                                //                 refreshtoken: refreshToken
                                //             },
                                //             user: res.dataValues
                                //         });

                                //     });
                                // });

                            }).catch(err => {
                                return reject(err);
                            })
                        }

                    }).catch(function (err) {
                        logger.error('error in add user', err);
                        return reject(err);
                    });
                }

            }).catch(function (err) {
                logger.error('error in add user', err);
                return reject(err);
            });
            logger.debug("add user dao returned");

        }, function (err) {
            logger.error('error in add user promise', err);
            return reject(err);
        });
    },

    checkUserExists: function (req, res) {
        return new Promise(function (resolve, reject) {
            console.log("reqObj ::",req.body)
            let phone = req.body.phone
           
            // let email = !req.body.email?"":req.body.email
            let whereObj
            if (req.body.email) {
                // for signup whereObj
                whereObj = {
                    [Op.or]: [{
                            phone: phone
                        },
                        {
                            email: req.body.email
                        }
                    ]
                }
            }
            // for login whereObj
            else {
                whereObj = {
                    phone: phone
                }
            }

            db.User.findAll({
                where: whereObj

            }).then(user => {
                // for signup part
                if (req.body.email) {
                    if (user.length > 0) {

                        return reject(util.responseUtil("User Already exists with phone or email, please try login!", null, responseConstant.USER_ALREADY_EXIST));
                       
                    } else {
                        return resolve("User not exists, you can signup!!")
                    }
                }
                // for login part
                else {
                    if (user.length > 0) {
                        return resolve("User Found with phone!");
                       
                    } else {
                        return reject(util.responseUtil("User not found, please signup first !!", null, responseConstant.USER_NOT_FOUND));
                    }
                }


            }).catch(err => {
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            });

        });
    },

    updateUser: function (req) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            logger.debug("update user dao called");
            db.User.findAll({
                where: {
                    email: reqObj.email
                }
            }).then(function (result) {
                console.log("res::", result.length)
                if (result.length > 0) {
                    return reject("Email Already Registered");

                } else {
                    db.User.findAll({
                        where: {
                            phone: reqObj.phone
                        }
                    }).then(function (result) {
                        // console.log("res::", result.length)
                        if (result.length > 0) {
                            return reject("Mobile Already Registered");
                        } else {
                            db.User.create(reqObj).then(res => {
                                 return resolve(res.dataValues);
                                
                            }).catch(err => {
                                return reject(err);
                            })
                        }

                    }).catch(function (err) {
                        logger.error('error in add user', err);
                        return reject(err);
                    });
                }

            }).catch(function (err) {
                logger.error('error in add user', err);
                return reject(err);
            });
            logger.debug("add user dao returned");

        }, function (err) {
            logger.error('error in add user promise', err);
            return reject(err);
        });
    },

}