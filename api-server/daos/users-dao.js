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

const { getPagingData, getPagination } = require('../utils/pagination')
const { Op } = require("sequelize");
const createHttpError = require('http-errors')

/**
 * export module
 */
module.exports = {

    getUserByUsername: async function (username, roleType) {

        let user = await db.users.unscoped().findOne({
            where: {
                [Op.or]: [
                    { phone: username },
                    { email: username }
                ],
                roleType
            },
        });
        if (!user) throw new createHttpError.NotFound("User Not Found")
        return user
    },

    login_register: async function (phone, roleType) {

        let user = await db.users.unscoped().findOne({
            where: {
                [Op.or]: [
                    { phone: phone },
                    { email: phone }
                ],
                roleType
            },
        });
        if (!user) {
            let userNew = await db.users.create({
                phone: phone,
                roleType
            })

            return userNew
        } else
            return user
    },

    getUserWithId: async function (userId) {
        let user = await db.users.findByPk(userId)
        if (!user) throw new createHttpError.NotFound("User Not Found")
        return user
    },

    getUserUnscoped: async function (userId) {
        let user = await db.users.unscoped().findByPk(userId)
        if (!user) throw new createHttpError.NotFound("User Not Found")
        return user
    },

    getRoleName: async function (user) {
        return (await user.getRole({ attributes: ['roleName'], raw: true }))['roleName'].toLowerCase()
    },

    addUser: async function (reqObj) {
        let result = await db.users.unscoped().findAll({
            where: {
                [Op.or]: {
                    email: reqObj.email,
                    phone: reqObj.phone
                }
            },
            raw: true
        })
        if (result.length > 0) {
            throw new createHttpError.Conflict("Email or Mobile Already Registered");
        }
        let user = await db.users.create(reqObj)
        return user
    },

    checkUserExists: async function (reqObj) {
        let { email, phone } = reqObj
        console.log("reqObj ::", reqObj)
        // for login
        let whereObj = {
            phone: phone
        }
        if (email) {
            // for signup whereObj
            whereObj = {
                [Op.or]: [{ phone: phone }, { email: email }]
            }
        }
        let user = await db.users.unscoped().findOne({ where: whereObj })
        // for signup part
        // console.log(user)
        if (email) {
            if (user) throw new createHttpError.Conflict("User Already Exists")
            else return "User not exists, you can signup!!"
        }
        else {
            if (user) return "User exists, you can login!!"
            else throw new createHttpError.Conflict("User not exists,signup first!!")
        }
    },

    getDriverProfile: async function (id) {

        logger.debug("getUser dao called");
        logger.debug(id)
        let user = await db.users.findOne({
            where: {
                id: id
            },
            attributes: {
                // include: [[db.Sequelize.fn("COUNT", db.Sequelize.col("driver.id")), "totalRides"]],
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
                    attributes: ['id'],
                    group: ['id'],
                    where: {
                        state: ['COMPLETED']
                        // is_booked:1 
                    },
                    required: false
                },

            ],
        })
        if (!user || !user.id) {
            return {}
            // throw new createHttpError.NotFound()
        }
        user.dataValues.totalRides = 0
        if (user.dataValues.driver.length > 0)
            user.dataValues.totalRides = user.dataValues.driver.length
        delete user.dataValues.driver
        return user
    },

    getAllUsers: async function ({ roleName, page, size }) {
        console.log("getAllUsers dao called", roleName);
        const { limit, offset } = getPagination(page, size);
        let result = await db.users.unscoped().findAndCountAll({
            include: [{
                model: db.roles,
                attributes: [],
                where: {
                    roleName: roleName
                },
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
                include: [
                    [db.sequelize.literal('role.roleName'), 'roleName'],
                    // [db.sequelize.literal('user_subscriptions'), 'is_active']
                ]
            },
            offset: offset,
            limit: limit
        })
        if (!result) throw new createHttpError.NotFound("No getAllUsers found !")
        return getPagingData(result, page, limit);
    },

    getAllUsersByIds: async function (userIds) {
        console.log("getAllUsersByIds Dao Called ::")
        let result = await db.users.findAll({
            where: { id: userIds },
            attributes: { exclude: ['password'] },
        })
        if (result.length <= 0) throw new createHttpError.NotFound()
        return (result);
    },

    forgotPassword: async function ({ email }) {

        const user = await db.users.unscoped().findOne({ where: { email } });
        // always return ok response to prevent email enumeration
        if (!user) throw new createHttpError.NotFound(" User Not Found");
        // create reset token that expires after 24 hours
        let otp = Math.floor(100000 + Math.random() * 900000)
        user.resetToken = otp;
        user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();
        console.log(otp)
        await util.sendEmail({
            to: user.email,
            subject: 'Boda App Reset Password - OTP',
            html: `<h4>Boda App RESET PASSWORD REQUEST</h4><h4>Please enter this OTP in the APP</h4>
                   <h3>${user.resetToken}</h3>`
        });
        return user.resetToken

    },

    verifyOTP: async function ({ email, otp }) {

        const user = await db.users.unscoped().findOne({ where: { email }, attributes: ['resetToken', 'resetTokenExpires', 'id'] });

        if (!user) throw new createHttpError.NotFound()

        if (user.resetToken === otp) {
            if (user.resetTokenExpires > Date.now()) {
                return user
            }
            else {
                throw new createHttpError.NotAcceptable("OTP EXPIRED");
            }
        } else {
            throw new createHttpError.BadRequest("Wrong OTP");
        }

    },


    getDriverMetrics: async function ({ driverIds, customer_id }) {
        console.log("getDriverMetrics Service ", driverIds, customer_id)
        let result = await db.users.findAll({
            where: {
                id: driverIds,
                roleType: 2,
                isActive: true
            },
            attributes: ['id', 'name', 'phone', 'email', 'profile_image', 'ratings', 'city', 'station',
                [db.sequelize.fn("COUNT", db.sequelize.col("driver.id")), "pastExperience"]
            ],
            include: {
                model: db.rides,
                as: 'driver',
                where: {
                    customer_id: customer_id
                },
                attributes: [],
                required: false,
                // group : ['driver_id']
            },
            group: ['driver_id']
        })
        return result
    },


}