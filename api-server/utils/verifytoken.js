'use strict';
/**
 *  This module is used to define service for user model 
 *  @module verify-token-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const db = require('../models')
const JWT = require('jsonwebtoken');
const {getUser} = require('../daos/users-dao')
/**
 * export module
 */
module.exports = {

    signAccessToken: (user) => {
        // console.log("users ::", user)
        let id = user.id
        let phone = user.phone
        let email = user.email
        let roleType = user.roleType
        return new Promise((resolve, reject) => {
            const payload = {
                roleType,
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
        // console.log("users ::", user)
        let id = user.id
        let phone = user.phone
        let email = user.email
        let roleType = user.roleType
        return new Promise((resolve, reject) => {
            const payload = {
                roleType,
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
            JWT.verify(refToken, process.env.JWT_REF_SECRET, (err, payload) => {
                if (err) return reject(401).send("Unauthorized")
                console.log("exp ::", payload.exp)
                let exp = payload.exp
                resolve(exp)
            })
        })
    },

    returnTokens: (user) => {
        return new Promise((resolve, reject) => {
            let accessToken, refreshToken
            module.exports.signAccessToken(user.dataValues).then(function (result) {
                accessToken = result
                console.log("accessToken::",accessToken)
                module.exports.loginRefreshToken(user.dataValues).then(function (result1) {
                    refreshToken = result1
                    console.log("refreshToken::", refreshToken)

                    module.exports.returnRefreshTimestamp(refreshToken).then(function (exp) {
                        if (exp) {
                            let tokenObj = {
                                userId: user.dataValues.id,
                                refresh_token: refreshToken,
                                timestamp: exp,
                                is_used: '0'
                            }
                            delete user.dataValues.password
                            db.tokens.create(tokenObj).then(() => {
                                return resolve({
                                    tokens: {
                                        accesstoken: accessToken,
                                        refreshtoken: refreshToken
                                    },
                                    user: user.dataValues
                                });

                            }).catch(err => {
                                console.log(err)
                            });

                        }


                    }).catch(err => {
                        console.log(err)
                        return reject(err)
                    })

                });
            });
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
                },
                include: {
                    model: db.roles,
                    attributes:['roleName'],
                    required: true
                }
            }).then((user) => {
                if (user) {
                        
                    if(roleName){
                         //  console.log("verifyUser Values::",user.dataValues)
                    let DBroleName = user.dataValues.role.dataValues.roleName
                    if(!DBroleName){
                        return reject("Valid roleType Required")
                    }
                    console.log("USER ROLE VALIDATION::",roleName.toLowerCase()  +" == " + DBroleName.toLowerCase())
                    
                    // Driver User
                    if(roleName.toLowerCase() == DBroleName.toLowerCase()){
        
                            return resolve("User roleType is " + DBroleName)
                        
                    }else {
                        return reject( {
                            status:401,
                            error:" Unauthorized ! "+ roleName +" Account Required"
                        })
                    }
                    }
                    else{
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


    // new authorize user
    authorize: (roles = [])=> {
            return (req,res,next)=>{
                if (typeof roles === 'string') {
                    roles = [roles];
                }
                getUser(req).then((user) => {
                    if (user) {
                        if(roles){
                        let DBroleName = user.role.dataValues.roleName
                        console.log("DBroleName :: ",DBroleName)
                        if (roles.length && !roles.includes(DBroleName.toLowerCase())) {
                            // user's role is not authorized
                            return res.status(401).json({ message: 'Unauthorized Role' });
                        }
                        next()
                        }
                        else{
                            next()
                            // return resolve(user.dataValues)
                        }
                    } else {
                        return res.status(401).json({ message: 'User Not Found' });
                    }
                }).catch(err => {
                    logger.error("error in authorize:: ", err)
                    return res.status(401).json({ err:err});
                });
            }
        

    }


}