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

const logger = require('../utils/logger');
const db = require('../models');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const { getPagination, getPagingData } = require('../utils/pagination')
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
            console.log("reqObj ::", req.body)
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
            logger.debug("update user dao called", req.payload);
            let email = req.payload.email
            let phone = req.payload.phone
            db.User.findOne({
                where: {
                    email: email,
                    phone: phone
                }
            }).then(function (result) {
                // console.log("res::", result)
                if (result) {

                    db.User.update(reqObj,
                        {
                            where: {
                                id: result.dataValues.id
                            }
                        }).then(res => {
                            console.log(res)
                            return resolve(res.dataValues);
                        }).catch(err => {
                            return reject(err);
                        })

                } else {
                    return reject("User Not Found");
                }

            }).catch(function (err) {
                logger.error('error in Update user', err);
                return reject(err);
            });
            logger.debug("Update user dao returned");

        }, function (err) {
            logger.error('error in Update user promise', err);
            return reject(err);
        });
    },

    getUser: function (req) {
        return new Promise(function (resolve, reject) {
            logger.debug("getUser dao called", req.payload);
            let email = req.payload.email
            let phone = req.payload.phone
            let id = req.payload.id
            db.User.findOne({
                where: {
                    email: email,
                    phone: phone,
                    id: id
                },
                include: {
                    model: db.roles,
                    attributes: ['roleName'],
                    required: true
                }
            }).then(function (result) {
                // console.log("res::", result)
                if (result) {
                    return resolve(result.dataValues);
                } else {
                    return reject("User Not Found");
                }

            }).catch(function (err) {
                logger.error('error in getUser user', err);
                return reject(err);
            });
            logger.debug("getUser user dao returned");

        }, function (err) {
            logger.error('error in getUser user promise', err);
            return reject(err);
        });
    },

    getUserById: function (id) {
        return new Promise(function (resolve, reject) {
            logger.debug("getUser dao called");
            db.User.findOne({
                where: {
                    id: id
                },
                attributes: { 
                    include: [[db.Sequelize.fn("COUNT", db.Sequelize.col("driver.id")), "totalRides"]],
                    
                },
                include: [
                    {
                        model: db.roles,
                        attributes: ['roleName'],
                        required: true
                    },
                    {
                        model: db.user_vehicles,
                        required: false
                    },
                    {
                        model: db.rides,
                        as: 'driver',
                        attributes :[],
                        where : {
                            is_booked:1 
                        },
                        required: false
                    },

                ]
            }).then(function (result) {
                // console.log("res::", result)
                if (result) {
                    return resolve(result.dataValues);
                } else {
                    return reject("User Not Found");
                }

            }).catch(function (err) {
                logger.error('error in getUser user', err);
                return reject(err);
            });
            logger.debug("getUser user dao returned");

        }, function (err) {
            logger.error('error in getUser user promise', err);
            return reject(err);
        });
    },



    getAllUsers: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("getAllUsers dao called");
            const { page, size, name } = req.query;
            // console.log(page,size)
            var condition = name ? { name: { [Op.like]: `%${name}%` } } : null;
            const { limit, offset } = getPagination(page, size);
            // console.log(limit,offset)
            let userType = req.params.userType
            userType = userType.toString().toLowerCase()
            // console.log(userType)
            let roleName
            if (userType == 'driver') {
                roleName = {
                    roleName: 'driver'
                }

            } else if (userType == 'customer') {
                roleName = {
                    roleName: 'customer'
                }
            }
            // console.log(roleName)

            db.User.findAndCountAll({
                include: [{
                    model: db.roles,
                    attributes: [],
                    where: roleName,
                    required: true
                }, {
                    model: db.user_subscriptions,
                    attributes: ['is_active', 'start', 'end'],
                    where: {
                        start: {
                            [Op.lte]: new Date(),
                        },
                        end: {
                            [Op.gte]: new Date()
                        },
                        is_active: true
                    },
                    required: false
                }],
                attributes: {
                    exclude: ['password'],
                    include: [
                        [db.sequelize.literal('role.roleName'), 'roleName'],
                        // [db.sequelize.literal('user_subscriptions'), 'is_active']
                    ]
                },

                offset: offset,
                limit: limit
            }).then((result) => {
                if (result) {
                    const response = getPagingData(result, page, limit);
                    return resolve(response);
                } else {
                    return reject("No getAllUsers found !");
                }
            }).catch(err => {
                return reject(err);
            })

            console.log("getAllUsers dao returned");

        }, function (err) {
            logger.error('error in getAllUsers promise', err);
            return reject(err);
        });
    },


}