'use strict';
/**
 *  This module is used to define service for user model 
 *  @module verify-token-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/Logger');
const db = require('../models')
var http = require("http");
var responseConstant = require("../constants/responseConstants");
const JWT = require('jsonwebtoken');
/**
 * export module
 */
module.exports = {

    signAccessToken: (user) => {
        console.log("users ::", user)
        let id = user.id
        let phone = user.phone
        let email = user.email
        let role = user.roleId
        return new Promise((resolve, reject) => {
            const payload = {
                role,
                id,
                phone,
                email
            }
            console.log("payload::", payload)
            const secret = process.env.JWT_SECRET
            const options = {
                expiresIn: '1h',
                audience: user.name
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(err.message)
                }

                resolve(token)
            })
        })
    },

    loginRefreshToken: (user) => {
        console.log("users ::", user)
        let id = user.id
        let phone = user.phone
        let email = user.email
        let role = user.roleId
        return new Promise((resolve, reject) => {
            const payload = {
                role,
                id,
                phone,
                email
            }
            const secret = process.env.JWT_REF_SECRET
            const options = {
                expiresIn: '1d',
                audience: user.name,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(err.message)
                    //   return
                }
                resolve(token)
            })
        })
    },

    verifyRefreshToken: (refToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refToken, process.env.JWT_REF_SECRET, (err, payload) => {
                if (err) return reject(401).send("Unauthorized")
                console.log("payload ::", payload)
                let name = payload.aud
                let id = payload.id
                let phone = payload.phone
                let email = payload.email
                let roleId = payload.role
                let user = {
                    name,
                    id,
                    phone,
                    email,
                    roleId
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
            JWT.verify(refToken, process.env.JWT_REF_SECRET, (err, payload) => {
                if (err) return reject(401).send("Unauthorized")
                console.log("exp ::", payload.exp)
                let exp = payload.exp
                resolve(exp)
            })
        })
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
                JWT.verify(token, process.env.JWT_SECRET, (err, payload) => {
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
    verifyUser: (req,roleName) => {
        return new Promise((resolve, reject) => {

            // console.log("in verifyDriver payload ::", req.payload)
            let userId = req.payload.id

            db.User.findOne({
                where: {
                    id: userId
                }
            }).then((user) => {
                if (user) {
                    // console.log("user::",user.dataValues)
                    // Driver User
                    if(roleName.toLowerCase() == 'admin'){
                        if (user.dataValues.roleId == '1') {
                            return resolve("User role is Admin")
                        } else {
                            return reject("Admin Role Required")
                        }
                    }
                    else if(roleName.toLowerCase() == 'driver'){
                        if (user.dataValues.roleId == '2') {
                            return resolve("User role is Driver")
                        } else {
                            return reject("Driver Role Required")
                        }
                    }
                    else if(roleName.toLowerCase() == 'customer'){
                        if (user.dataValues.roleId == '3') {
                            return resolve("User role is customer")
                        } else {
                            return reject("Driver Role Required")
                        }
                    }else{
                        return reject("Valid Role Required")
                    }
                    

                } else {
                    return reject("User Not found")
                }
            }).catch(err => {
                logger.error("error in verifyDriver findOne:: ", err)
                return reject(err)
            });


        });
    }


}