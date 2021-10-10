'use strict';
/**
 *  This module is used to define service for user model 
 *  @module user-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

// var async = require('async');
// var http = require("http");
const logger = require('../utils/logger');
const usersDao = require('../daos/users-dao');
const db = require('../models')
const { Op } = require("sequelize");
const util = require('../utils/commonUtils')
const bcrypt = require('bcrypt');
var responseConstant = require("../constants/responseConstants");
const jwt = require('jsonwebtoken');
const {
    inValidateOneUser,
    signAccessToken,
    loginRefreshToken,
    verifyRefreshToken,
    returnRefreshTimestamp,
    inValidateAllUser,
    verifyRefreshTokenWithdb,
    returnTokens
} = require('../utils/verifytoken')
/**
 * export module
 */

module.exports = {

    addUser: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("Insert Obj in addUser Service ::", req.body)
            usersDao.addUser(req).then(function (result) {
                ;
                if (result) {
                    let req = {
                        body: {
                            phone: result.phone
                        }
                    }
                    module.exports.login(req).then(loginres => {
                        return resolve(util.responseUtil(null, loginres, responseConstant.SUCCESS));
                    }).catch(err => {
                        logger.error('error in signup login funct Call', err);
                        return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                    })
                }

            }).catch(function (err) {
                logger.error('error in useraddservice', err);
                return reject(util.responseUtil(err, null, responseConstant.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR));
            });
        }, function (err) {
            logger.error('error in add user promise', err);
            return reject(err);
        });

    },
    updateUser: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("Insert Obj in updateUser Service ::", req.body)
            usersDao.updateUser(req).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in updateUser', err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            });
        }, function (err) {
            logger.error('error in add user promise', err);
            return reject(err);
        });

    },

    getUser: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("Insert Obj in getUser Service ::", req.body)
            usersDao.getUser(req).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in getUser', err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            });
        }, function (err) {
            logger.error('error in add getUser promise', err);
            return reject(err);
        });

    },

    getUserById: function (id) {
        return new Promise(function (resolve, reject) {
            console.log("Insert Obj in getUserById Service ::")
            usersDao.getUserById(id).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in getUserById', err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            });
        }, function (err) {
            logger.error('error in getUserById promise', err);
            return reject(err);
        });

    },

    getAllUsers: function (req, res) {
        return new Promise(function (resolve, reject) {
            usersDao.getAllUsers(req).then(function (result) {
                // logger.debug('success ', result);
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in getAllUsers service', err);
                return reject(err);
            });
        }, function (err) {
            logger.error('error in getAllUsers promise', err);
            return reject(err);
        });
    },

    getAllUsersByIds : function (req, res) {
        return new Promise(function (resolve, reject) {
            usersDao.getAllUsersByIds(req.body.Ids).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in getAllUsersByIds service', err);
                return reject(err);
            });
        }, function (err) {
            logger.error('error in getAllUsersByIds promise', err);
            return reject(err);
        });
    },

    login: function (req, role) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            console.log(reqObj)
            let whereObj
            // login code start
            if (role == 'admin') {
                whereObj = {
                    [Op.or]: [
                        { phone: reqObj.username },
                        { email: reqObj.username }
                    ]
                }
            } else {
                whereObj = {
                    phone: reqObj.phone
                }
            }
            db.User.findOne({
                where: whereObj,
                include: {
                    model: db.roles,
                    attributes: ['roleName'],
                    required: true
                }
            }).then((user) => {

                if (!user) {
                    return reject(util.responseUtil(null, null, responseConstant.USER_NOT_FOUND));

                } else {
                    // console.log(user.dataValues)
                    if (role == 'admin') {
                        if (user.dataValues.roleType == 1) {
                            bcrypt.compare(req.body.password, user.dataValues.password, function (err, result) {
                                // console.log(result)
                                if (err) {
                                    return reject(err);
                                }
                                if (!result) {
                                    return reject(util.responseUtil(null, null, responseConstant.INVALIDE_CREDENTIAL));
                                } else {
                                    returnTokens(user).then(function (result) {
                                        return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                                    }).catch(function (err) {
                                        logger.error('error in returnTokens service', err);
                                        return reject(err);
                                    });
                                }
                            });
                        } else {
                            return reject(util.responseUtil("User role is not admin", null, responseConstant.UNAUTHORIZE));
                        }

                    } else {
                        returnTokens(user).then(function (result) {
                            return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                        }).catch(function (err) {
                            logger.error('error in returnTokens service', err);
                            return reject(err);
                        });
                    }

                }

            }).catch(err => {
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            });

            // login ends

        }, function (err) {
            logger.error('error in login user promise', err);
            return reject(err);
        });

    },
    checkUserExists: function (req, res) {
        return new Promise(function (resolve, reject) {
            usersDao.checkUserExists(req).then(function (result) {
                logger.debug('success ', result);
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in checkUserExists service', err);
                return reject(err);
            });
        }, function (err) {
            logger.error('error in checkUserExists promise', err);
            return reject(err);
        });
    },
    refreshToken: async (req, res, next) => {
        try {
            const {
                refreshToken
            } = req.body
            console.log("refreshtoken ::", refreshToken)
            if (!refreshToken) return res.status(400).send({
                status: 400,
                message: "Bad Request"
            })
            verifyRefreshToken(refreshToken).then(function (user) {
                console.log("result ::", user)
                verifyRefreshTokenWithdb(refreshToken).then(function (dbUser) {
                    if (dbUser.is_used == 0) {
                        signAccessToken(user).then(function (result) {
                            let accTok = result
                            loginRefreshToken(user).then(function (res1) {
                                let rT = res1
                                inValidateOneUser(refreshToken).then(() => {

                                    returnRefreshTimestamp(rT).then(function (exp) {
                                        if (exp) {
                                            let tokenObj = {
                                                userId: dbUser.userId,
                                                refresh_token: rT,
                                                timestamp: exp,
                                                is_used: '0'
                                            }

                                            db.tokens.create(tokenObj).then(() => {
                                                res.status(200).send({
                                                    accessToken: accTok,
                                                    refreshToken: rT
                                                })
                                            }).catch(err => {
                                                res.status(500).send(err)
                                            });
                                        }
                                    }).catch(err => {
                                        res.status(500).send(err)
                                    });

                                }).catch(err => {
                                    res.status(500).send(err)
                                });

                            }).catch(err => {
                                res.status(500).send(err)
                            });
                        }).catch(err => {
                            res.status(500).send(err)
                        });
                    } else {
                        inValidateAllUser(dbUser.userId).then((res2) => {
                            res.status(511).send(res2)
                        }).catch(err => {
                            return res.status(500).send(err)
                        });
                    }

                }).catch(err => {
                    return res.status(511).send(err)
                });

            }).catch(err => {
                return res.status(401).send(err)
            });
        } catch (error) {
            console.log(error)
            next(error)

        }
    },
    // loginss: function (req) {
    //     return new Promise(function (resolve, reject) {
    //         let reqObj = req.body
    //         // login code start
    //         db.User.findOne({
    //             where: {
    //                 phone: reqObj.phone
    //             }
    //         }).then(user => {

    //             if (!user) {
    //                 return reject(util.responseUtil(null, null, responseConstant.USER_NOT_FOUND));

    //             } else {

    //                 let accessToken, refreshToken
    //                 signAccessToken(user.dataValues).then(function (result) {
    //                     accessToken = result
    //                     console.log(accessToken)
    //                     loginRefreshToken(user.dataValues).then(function (result1) {
    //                         refreshToken = result1
    //                         console.log("refreshToken::", refreshToken)
    //                         return resolve({

    //                             tokens: {
    //                                 accesstoken: accessToken,
    //                                 refreshtoken: refreshToken
    //                             },
    //                             user: user.dataValues
    //                         });

    //                     });
    //                 });
    //             }

    //         }).catch(err => {
    //             return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
    //         });

    //         // login ends

    //     }, function (err) {
    //         logger.error('error in login user promise', err);
    //         return reject(err);
    //     });

    // },

    verifyjwttoken: function (req, res) {

        return new Promise(function (resolve, reject) {
            const authHeader = req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]

            jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
                if (err) {
                    return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                } else {
                    return resolve(util.responseUtil(null, decoded, responseConstant.SUCCESS));
                }

            });
        });


    },

    logout: function (req) {
        return new Promise(function (resolve, reject) {
            let reqObj = req.body
            console.log("reqObj in Logout Service :: ", reqObj)
            let refresh_token = reqObj.refreshToken
            inValidateOneUser(refresh_token).then(res => {
                console.log("logged out")
                return resolve(util.responseUtil(null, "Successfully Logged Out", responseConstant.SUCCESS));
            }).catch(err => {
                console.log(err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            })
        }, function (err) {
            logger.error('error in login user promise', err);
            return reject(err);
        });

    },
    getDriverMetrics : function (driverIds) {
        return new Promise(function (resolve, reject) {
            console.log("getDriverMetrics Service :: ")
            db.User.findAll({
                where: {
                    id : driverIds,
                    roleType : 2
                },
                attributes: {exclude: ['password']},
            }).then(result=>{
                // console.log(result)
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(err => {
                console.log(err);
                return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            })
        }, function (err) {
            logger.error('error in login user promise', err);
            return reject(err);
        });

    },

}