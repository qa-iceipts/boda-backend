'use strict';
/**
 *  This module is used to define service for user model 
 *  @module verify-token-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const db = require('../models')
const jwt = require('jsonwebtoken');
const { getUser } = require('../daos/users-dao')
const crypto = require("crypto");
const createHttpError = require('http-errors');
/**
 * export module
 */
module.exports = {

    signAccessToken: (user) => {
        // console.log("users ::", user)
        return jwt.sign(
            {
                id: user.id,
                phone: user.phone,
                email: user.email,
                roleType: user.roleType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '30d',
                audience: user.name
            }
        )
    },

    loginRefreshToken: (user) => {
        // console.log("users ::", user)
        return jwt.sign(
            {
                id: user.id,
                phone: user.phone,
                email: user.email,
                roleType: user.roleType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1y',
                audience: user.name
            }
        )
    },

    verifyRefreshToken: (refToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refToken, process.env.JWT_REF_SECRET, (err, payload) => {
                if (err) return reject(401).send("Unauthorized")
                console.log("payload ::", payload)
                let name = payload.aud
                let id = payload.id
                let phone = payload.phone
                let email = payload.email
                let roleType = payload.roleType
                let user = {
                    name,
                    id,
                    phone,
                    email,
                    roleType
                }
                resolve(user)
            })
        })
    },

    verifyRefreshTokenWithdb: (refToken) => {
        return new Promise((resolve, reject) => {

            db.tokens.findOne({
                where: {
                    refresh_token: refToken
                }
            }).then(result => {
                if (result) {
                    return resolve(result.dataValues)
                } else {
                    return reject("Invalid Token")
                }

            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        })
    },

    inValidateAllUser: (userId) => {
        return new Promise((resolve, reject) => {

            db.tokens.update({
                is_used: '1'
            }, {
                where: {
                    userId: userId
                }
            }).then(result => {
                return resolve("All Users Invalidated! Login again")
            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        })
    },
    inValidateOneUser: (refresh_token) => {
        return new Promise((resolve, reject) => {
            db.tokens.update({
                is_used: '1'
            }, {
                where: {
                    refresh_token: refresh_token
                }
            }).then(result => {
                console.log("User Invalidated")
                return resolve("User Invalidated")

            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        })
    },

    returnRefreshTimestamp: (refToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(refToken, process.env.JWT_REF_SECRET, (err, payload) => {
                if (err) return reject(401).send("Unauthorized")
                console.log("exp ::", payload.exp)
                let exp = payload.exp
                resolve(exp)
            })
        })
    },

    returnTokens: async (user) => {

        let accessToken = module.exports.signAccessToken(user)
        console.log("accessToken::", accessToken)
        // let refreshToken = module.exports.loginRefreshToken(user)
        let refreshToken = module.exports.generateRefreshToken(user,'01')
        console.log("refreshToken::", refreshToken)
        // save refresh token
        await refreshToken.save();
        // let exp = await module.exports.returnRefreshTimestamp(refreshToken)
        // if (exp) {
        //     let tokenObj = {
        //         userId: user.id,
        //         refresh_token: refreshToken,
        //         timestamp: exp,
        //         is_used: '0'
        //     }
        //     delete user.password
        //     await db.tokens.create(tokenObj)
        //     return ({
        //         tokens: {
        //             accesstoken: accessToken,
        //             refreshtoken: refreshToken
        //         },
        //         user: user.dataValues
        //     });
        // }

        return ({
            accesstoken: accessToken,
            refreshtoken: refreshToken.token
        });
    },

    verifyAccessToken: (req, res, next) => {
        console.log("in verify token ")
        const authHeader = req.headers['authorization']

        if (!authHeader) {
            res.status(401).send({
                message: "No token provided"
            });
        } else if (authHeader && authHeader.split(" ")[0] !== "Bearer") {
            res.status(401).send({
                message: "Invalid token"
            });
        } else {
            const token = authHeader && authHeader.split(' ')[1]
            console.log("token..", token)
            if (token) {
                jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
                    if (err) {
                        res.status(401).send(err)
                    } else {
                        console.log("payload ::", payload)
                        req.payload = payload
                        next();
                    }
                })
            } else {
                res.status(401).send("Access denied!")
            }
        }

    },

    // rolename = ANY(driv)
    verifyUser: (req, roleName) => {
        return new Promise((resolve, reject) => {
            // console.log("in verifyDriver payload ::", req.payload)
            let userId = req.payload.id
            db.users.findOne({
                where: {
                    id: userId
                },
                include: {
                    model: db.roles,
                    attributes: ['roleName'],
                    required: true
                }
            }).then((user) => {
                if (user) {

                    if (roleName) {
                        //  console.log("verifyUser Values::",user.dataValues)
                        let DBroleName = user.dataValues.role.dataValues.roleName
                        if (!DBroleName) {
                            return reject("Valid roleType Required")
                        }
                        console.log("USER ROLE VALIDATION::", roleName.toLowerCase() + " == " + DBroleName.toLowerCase())

                        // Driver User
                        if (roleName.toLowerCase() == DBroleName.toLowerCase()) {

                            return resolve("User roleType is " + DBroleName)

                        } else {
                            return reject({
                                status: 401,
                                error: " Unauthorized ! " + roleName + " Account Required"
                            })
                        }
                    }
                    else {
                        return resolve(user.dataValues)
                    }


                } else {
                    return reject("User Not found")
                }
            }).catch(err => {
                logger.error("error in verifyDriver findOne:: ", err)
                return reject(err)
            });


        });
    },

    generateRefreshToken: function (user, ipAddress) {
        // create a refresh token that expires in 7 days
        return db.refreshTokens.build({
            userId: user.id,
            token: module.exports.randomTokenString(),
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdByIp: ipAddress
        });
    },
    randomTokenString: function () {
        return crypto.randomBytes(40).toString('hex');
    },

    getRefreshToken: async function (token) {
        const refreshToken = await db.refreshTokens.findOne({ where: { token } });
        if (!refreshToken || !refreshToken.isActive) throw new createHttpError.Forbidden('Invalid Refresh token');
        console.log("DBrefreshToken",refreshToken.dataValues)
        return refreshToken;
    },
    
    // new authorize user
    authorize: (roles = []) => {
        return (req, res, next) => {
            if (typeof roles === 'string') {
                roles = [roles];
            }
            getUser(req).then((user) => {
                if (user) {
                    if (roles) {
                        let DBroleName = user.role.dataValues.roleName.toLowerCase()
                        console.log("DBroleName :: ", DBroleName)
                        if (roles.length && !roles.includes(DBroleName)) {
                            // user's role is not authorized
                            return res.status(401).json({ message: 'Unauthorized Role' });
                        }
                        next()
                    }
                    else {
                        next()
                        // return resolve(user.dataValues)
                    }
                } else {
                    return res.status(401).json({ message: 'User Not Found' });
                }
            }).catch(err => {
                logger.error("error in authorize:: ", err)
                return res.status(401).json({ err: err });
            });
        }


    },

    DestroyCronJob: async function () {
        console.log("DestroyCronJob Service Called ::")
        return await db.tokens.destroy({
            where: {
                // timestamp < unix_timestamp
                timestamp: db.Sequelize.where(db.Sequelize.col("timestamp"), "<", db.Sequelize.fn("UNIX_TIMESTAMP"))
                // timestamp: Sequelize.where(Sequelize.fn("UPPER", Sequelize.col("columnWithFunction")), "=", "SOME UPPER CASE VALUE")
            }

        })
    },





}