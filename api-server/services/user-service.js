'use strict';
/**
 *  This module is used to define service for user model 
 *  @module user-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const ROLE = require('../utils/roles');
const logger = require('../utils/logger');
const { AppError } = require('../utils/error_handler');
const usersDao = require('../daos/users-dao');
const HttpStatusCodes = require('http-status-codes').StatusCodes;
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
} = require('../utils/verifytoken');
const { sendResponse } = require('../utils/commonUtils');
/**
 * export module
 */

module.exports = {

    addUser: async function (req, res, next) {
        // console.log("Insert Obj in addUser Service ::", req.body)
        let { password } = req.body
        let hash = await bcrypt.hash(password, 10)
        req.body.password = hash

        let user = await usersDao.addUser(req.body)
        if (user) {
            // let roleName = await usersDao.getRoleName(user)
            // req.params = {
            //     roleName: roleName
            // }
            // req.body = {
            //     "username": user.dataValues.email,
            //     "password": password
            // }
            // next()
            return res.status(HttpStatusCodes.OK).send(sendResponse("signup"))
            // let roleName = await usersDao.getRoleName(user)
            // if (!roleName) throw new AppError(HttpStatusCodes.UNAUTHORIZED, "Role Undefined")
            // req.body = { username: user.phone, password: password }
            // req.params = { roleName }
            // await module.exports.login(req, userRoleName)
            // next()
            // res.status(HttpStatusCodes.OK).send(sendResponse(result))
            // module.exports.login(req, result.roleType).then(loginres => {
            //     return resolve(loginres);
            // }).catch(err => {
            //     logger.error('error in signup login funct Call', err);
            //     return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
            // })
        } else {
            throw new AppError((HttpStatusCodes.INTERNAL_SERVER_ERROR), "something went wrong")
        }
    },

    // admin , gm , employee role based login
    login: async function (req, res, next) {

        let roleName = req.params.roleName
        let { username, password } = req.body
        console.log("login service called=>", req.body, "rolename=>", roleName)
        if (!Object.values(ROLE).includes(roleName)) {
            throw new AppError(HttpStatusCodes.UNAUTHORIZED, "User role is not Valid " + roleName)
        }
        let whereObj
        // if (roleName === ROLE.ADMIN) {
        //     if (!reqObj.username) {
        //         throw new AppError(HttpStatusCodes.UNAUTHORIZED, "Username/Password Required for admin")
        //     }
        whereObj = {
            [Op.or]: [
                { phone: username },
                { email: username }
            ]
        }
        // } else {
        //     if (!reqObj.phone) throw new AppError(HttpStatusCodes.UNAUTHORIZED, "phone no. Required !!")
        //     whereObj = {
        //         phone: reqObj.phone
        //     }
        // }
        let user = await db.User.findOne({
            where: whereObj,
            include: {
                model: db.roles,
                attributes: ['roleName'],
                required: true
            },
        })
        if (!user) throw new AppError(HttpStatusCodes.NOT_FOUND, "USER_NOT_FOUND")
        // console.log("user = >", user.dataValues)
        let DbRoleName = user.dataValues.role.roleName.toLowerCase()

        // if (roleName === ROLE.ADMIN) {
        let matched = await bcrypt.compare(req.body.password, user.dataValues.password)
        if (!matched) throw new AppError(HttpStatusCodes.BAD_REQUEST, "INVALID CREDENTIALS-PASSWORD")
        // }

        if (DbRoleName === roleName) {
            console.log(roleName, "++==", DbRoleName)
            let data = await returnTokens(user)
            res.status(HttpStatusCodes.OK).send(sendResponse(data))
        }
        else {
            throw new AppError(HttpStatusCodes.UNAUTHORIZED, "Unathorized api ! User role is  " + DbRoleName)
        }
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

    getAllUsersByIds: function (req, res) {
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
    getUserImageById: function (req, res) {
        return new Promise(function (resolve, reject) {
            usersDao.getUserImageById(req.body.Id).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                logger.error('error in getUserImageById service', err);
                return reject(err);
            });
        }, function (err) {
            logger.error('error in getUserImageById promise', err);
            return reject(err);
        });
    },


    // login: function (req, role) {
    //     return new Promise(function (resolve, reject) {
    //         if (!Object.values(ROLE).includes(role)) {
    //             return reject(util.responseUtil("User role is not Valid :: " + role, null, responseConstant.UNAUTHORIZE));
    //         }
    //         let reqObj = req.body
    //         console.log(reqObj)
    //         let whereObj
    //         // login code start
    //         if (role === ROLE.ADMIN) {
    //             if (!reqObj.username) {
    //                 return reject(util.responseUtil("Username Required :: ", null, responseConstant.UNAUTHORIZE));
    //             }
    //             whereObj = {
    //                 [Op.or]: [
    //                     { phone: reqObj.username },
    //                     { email: reqObj.username }
    //                 ]
    //             }
    //         } else {
    //             if (!reqObj.phone) {
    //                 return reject(util.responseUtil("phone no. Required :: ", null, responseConstant.UNAUTHORIZE));
    //             }
    //             whereObj = {
    //                 phone: reqObj.phone
    //             }
    //         }
    //         db.User.findOne({
    //             where: whereObj,
    //             include: {
    //                 model: db.roles,
    //                 attributes: ['roleName'],
    //                 required: true
    //             },
    //             // raw: true
    //         }).then((user) => {

    //             if (!user) {
    //                 return reject(util.responseUtil(null, null, responseConstant.USER_NOT_FOUND));
    //             } else {
    //                 console.log("user = >", user.dataValues)
    //                 let DbRoleName = user.dataValues.role.dataValues.roleName.toLowerCase()
    //                 let ReqRoleName = role.toLowerCase()
    //                 if (ReqRoleName === ROLE.ADMIN && DbRoleName === ReqRoleName) {

    //                     bcrypt.compare(req.body.password, user.dataValues.password, function (err, result) {
    //                         // console.log(result)
    //                         if (err) {
    //                             return reject(err);
    //                         }
    //                         if (!result) {
    //                             return reject(util.responseUtil(null, null, responseConstant.INVALIDE_CREDENTIAL));
    //                         } else {
    //                             returnTokens(user).then(function (result) {
    //                                 return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
    //                             }).catch(function (err) {
    //                                 logger.error('error in returnTokens service', err);
    //                                 return reject(err);
    //                             });
    //                         }
    //                     });
    //                     // } else {
    //                     //     return reject(util.responseUtil("User role is not " +role, null, responseConstant.UNAUTHORIZE));
    //                     // }

    //                 } else if (DbRoleName === ReqRoleName) {
    //                     returnTokens(user).then(function (result) {
    //                         return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
    //                     }).catch(function (err) {
    //                         logger.error('error in returnTokens service', err);
    //                         return reject(err);
    //                     });
    //                 }
    //                 else {
    //                     return reject(util.responseUtil("User role is not " + ReqRoleName, null, responseConstant.UNAUTHORIZE));
    //                 }
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
    getDriverMetrics: function (driverIds) {
        return new Promise(function (resolve, reject) {
            console.log("getDriverMetrics Service :: ")
            db.User.findAll({
                where: {
                    id: driverIds,
                    roleType: 2
                },
                attributes: { exclude: ['password'] },
            }).then(result => {
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

    disableUser: async function (req, res, next) {
        let result = await usersDao.disableUser(req.params.userId)
        res.status(HttpStatusCodes.OK).send(sendResponse(result))
    },

    forgotPassword: async function (req, res, next) {
        await usersDao.forgotPassword(req.body)
        res.send(sendResponse('Please check your email for password reset instructions'))
    },

    verifyOTP: async function (req, res, next) {
        await usersDao.verifyOTP(req.body)
        res.send(util.sendResponse("verified"))
    },

    changePassword: async function (req, res, next) {

        let user = await usersDao.verifyOTP(req.body)
        req.body.password = await bcrypt.hash(req.body.password, 10)

        user.password = req.body.password
        user.resetToken = null
        user.resetTokenExpires = null
        user.save()
        res.send(sendResponse('Password Changed Successfully'))
    }

}