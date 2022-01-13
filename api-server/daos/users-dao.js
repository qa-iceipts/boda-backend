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
const HttpStatusCodes = require('http-status-codes').StatusCodes;
const logger = require('../utils/logger');
const { AppError } = require('../utils/error_handler');
const db = require('../models');
const util = require('../utils/commonUtils')

const { getPagingData } = require('../utils/pagination')
const { Op } = require("sequelize");
const createError = require('http-errors')

/**
 * export module
 */
module.exports = {

    addUser: async function (reqObj) {

        logger.info("Add user dao called")
        logger.debug(reqObj);
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
            throw new createError.Conflict("Email or Mobile Already Registered");
        }
        let user = await db.users.create(reqObj)
        logger.debug("add user dao returned");
        return user
    },

    getRoleName: async function (user) {
        return (await user.getRole({ attributes: ['roleName'], raw: true }))['roleName'].toLowerCase()
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
                [Op.or]: [{ phone: phone }, { email: req.body.email }]
            }
        }
        let user = await db.users.unscoped().findOne({ where: whereObj })
        // for signup part
        // console.log(user)
        if (user) {
            if (phone) return "User found! You can login"
            else return "signup first"
        }
        else {
            if (email) return "User Already exists with phone or email, please login!"
            else return "User not exists, you can signup!!"
        }
    },

    getUserByUsername: async function (username) {

        let user = await db.users.unscoped().findOne({
            where: {
                [Op.or]: [
                    { phone: username },
                    { email: username }
                ]
            },
        });
        if (!user) throw new createError.NotFound("User Not Found")
        return user
    },

    getUserWithId: async function (userId) {
        let user = await db.users.findByPk(userId)
        if (!user) throw new createError.NotFound("User Not Found")
        return user
    },

    // throw off
    getUser: async function (req) {

        logger.debug("getUser dao called", req.user);
        let email = req.user.email
        let phone = req.user.phone
        let id = req.user.id
        let result = db.users.findOne({
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
        })
        // console.log("res::", result)
        if (!result)
            throw new createError.NotFound("User Not Found")
        return result;

    },

    getUserImageById: async function (id) {
        logger.debug("getUserImageById dao called");
        let user = await db.users.findOne({
            where: {
                id: id
            },
            attributes: ["profile_image"],
            raw: true
        })
        if (!user) {
            throw new createError.NotFound()
        }
        return user
    },

    getUserById: async function (id) {

        logger.debug("getUser dao called");
        let user = await db.users.findOne({
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
                    attributes: [],
                    where: {
                        state: ['COMPLETED']
                        // is_booked:1 
                    },
                    required: false
                },

            ]
        })
        if (!user) {
            throw new createError.NotFound()
        }
        return user
    },

    getAllUsers: async function ({ roleName, limit, offset }) {
        console.log("getAllUsers dao called");

        let result = await db.users.unscoped().findAndCountAll({
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
                include: [
                    [db.sequelize.literal('role.roleName'), 'roleName'],
                    // [db.sequelize.literal('user_subscriptions'), 'is_active']
                ]
            },
            offset: offset,
            limit: limit
        })

        if (!result) throw new createError.NotFound("No getAllUsers found !")
        return getPagingData(result, page, limit);
    },

    getAllUsersByIds: async function (userIds) {
        console.log("getAllUsersByIds Dao Called ::")
        let result = await db.users.findAll({
            where: { id: userIds },
            attributes: { exclude: ['password'] },
        })
        if (result.length <= 0) throw new createError.NotFound()
        return (result);
    },

    forgotPassword: async function ({ email }) {

        const user = await db.users.unscoped().findOne({ where: { email } });
        // always return ok response to prevent email enumeration
        if (!user) throw new createError.NotFound(" User Not Found");
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
    },

    verifyOTP: async function ({ email, otp }) {

        const user = await db.users.unscoped().findOne({ where: { email }, attributes: ['resetToken', 'resetTokenExpires', 'id'] });

        if (!user) throw new AppError(HttpStatusCodes.NOT_FOUND, "Not Found");

        if (user.resetToken === otp) {
            if (user.resetTokenExpires > Date.now()) {
                return user
            }
            else {
                throw new AppError(HttpStatusCodes.NOT_ACCEPTABLE, "OTP EXPIRED");
            }
        } else {
            throw new AppError(HttpStatusCodes.BAD_REQUEST, "Wrong OTP");
        }

    },




}