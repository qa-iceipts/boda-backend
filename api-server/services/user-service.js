'use strict';
/**
 *  This module is used to define service for user model 
 *  @module user-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */
const role = require('../utils/roles');
const logger = require('../utils/logger');
const usersDao = require('../daos/users-dao');
const db = require('../models')
const bcrypt = require('bcrypt');
const { getBasicDetails, getHash } = require('../utils/commonUtils');
const createHttpError = require('http-errors');
const {
    signAccessToken,
    generateRefreshToken,
    getRefreshToken
} = require('../utils/verifytoken');
const commonUtils = require('../utils/commonUtils');

/**
 * export module
 */

module.exports = {

    addUser: async function (req, res, next) {
        // console.log("Insert Obj in addUser Service ::", req.body)
        let { password } = req.body
        let hash = await commonUtils.getHash(password)
        req.body.password = hash

        let user = await usersDao.addUser(req.body)

        let roleName = await usersDao.getRoleName(user)

        req.params = { roleName: roleName }
        req.body = {
            "username": user.dataValues.email,
            "password": password
        }
        next()
    },

    // admin , gm , employee role based login
    login: async function (req, res, next) {

        let { roleName } = req.params
        let { username, password } = req.body

        console.log("login service called=>", req.body, "rolename=>", roleName)

        if (!Object.values(role).includes(roleName))
            throw new createHttpError.Forbidden("User role is not Valid " + roleName)

        let user = await usersDao.getUserByUsername(username)
        let DbRoleName = await usersDao.getRoleName(user)
        let matched = await commonUtils.comparePassword(password, user.password)

        if (!matched) throw new createHttpError.Unauthorized("Invalid Password")

        if (DbRoleName != roleName)
            throw new createHttpError.Forbidden("Unathorized! User role is " + DbRoleName)

        console.log(roleName, "===", DbRoleName)

        let jwtToken = signAccessToken(user);
        let refreshToken = generateRefreshToken(user, req.ip);
        // save refresh token
        await refreshToken.save();
        // return basic details and tokens
        res.sendResponse({
            user: getBasicDetails(user),
            accessToken: jwtToken,
            refreshToken: refreshToken.token
        })
    },

    refreshToken: async function (req, res, next) {
        let { userId } = req.body
        let token = req.body.refreshToken
        console.log("refresh Token called =>", token)

        const refreshToken = await getRefreshToken(token);
        const account = await refreshToken.getUser();

        if (account.id != userId) throw new createHttpError.Unauthorized("user verification failed for token")
        // replace old refresh token with a new one and save
        const newRefreshToken = generateRefreshToken(account, req.ip);
        refreshToken.revoked = Date.now();
        refreshToken.revokedByIp = req.ip;
        refreshToken.replacedByToken = newRefreshToken.token;
        await refreshToken.save();
        await newRefreshToken.save();

        // generate new jwt
        const jwtToken = signAccessToken(account);
        res.sendResponse({
            jwtToken,
            refreshToken: newRefreshToken.token
        });

    },

    updateUser: async function (req, res, next) {
        console.log("Insert Obj in updateUser Service ::", req.body)
        let reqObj = req.body
        let { userId } = req.params
        let user = await usersDao.getUserWithId(userId)
        user.set(reqObj)
        await user.save()
        res.sendResponse(getBasicDetails(user))
    },

    //throw off
    getUser: async function (req, res, next) {
        let result = await usersDao.getUser(req)
        res.sendResponse(result)
    },

    getUserById: async function (req, res) {
        console.log("getUserById called")
        let user = await usersDao.getUserById(req.params.id)
        res.sendResponse(user)
    },

    getAllUsers: async function (req, res) {
        const { page, size } = req.query;
        let userType = req.params.userType
        userType = userType.toString().toLowerCase()
        let roleName = userType === 'driver' ? 'driver' : 'customer'

        let users = await usersDao.getAllUsers({ roleName, page, size })
        res.sendResponse(users)

    },
    //dns server dependency
    getAllUsersByIds: async function (req, res) {
        let result = await usersDao.getAllUsersByIds(req.body.Ids)
        res.sendResponse(result)
    },

    //profile image
    getUserImageById: async function (req, res) {
        let result = usersDao.getUserImageById(req.body.Id)
        res.sendResponse(result)
    },

    checkUserExists: async function (req, res) {
        console.log("reqObj ::", req.body)
        let { email, phone } = req.body
        let result = await usersDao.checkUserExists({ email, phone })
        res.sendResponse(result)
    },

    logout: async function (req, res) {
        let reqObj = req.body
        console.log("reqObj in Logout Service :: ", reqObj)
        let refresh_token = reqObj.refreshToken
        // await inValidateOneUser(refresh_token)
        res.sendResponse("Successfully Logged Out")
    },
    
    //lookAtThis
    getDriverMetrics: async function ({ driverIds, customer_id }) {

        console.log("getDriverMetrics Service ", driverIds, customer_id)
        let result = await db.users.findAll({
            where: {
                id: driverIds,
                roleType: 2,
                isActive: true
            },
            attributes: ['id', 'name', 'phone', 'email', 'profile_image',
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
        // const model = db.users
        // for (let assoc of Object.keys(model.associations)) {
        //   for (let accessor of Object.keys(model.associations[assoc].accessors)) {
        //     console.log(model.name + '.' + model.associations[assoc].accessors[accessor]+'()');
        //   }
        // }
        console.log(result)
        res.sendResponse(result);
    },

    disableUser: async function (req, res, next) {
        let user = await usersDao.getUserUnscoped(req.params.userId)
        user.isActive = !user.isActive
        user.save()
        res.sendResponse({
            id: user.id,
            name: user.name,
            isActive: user.isActive
        })
    },

    forgotPassword: async function (req, res, next) {
        await usersDao.forgotPassword(req.body)
        res.sendResponse('Please check your email for password reset instructions')
    },

    verifyOTP: async function (req, res, next) {
        await usersDao.verifyOTP(req.body)
        res.sendResponse("verified")
    },

    changePassword: async function (req, res, next) {

        let user = await usersDao.verifyOTP(req.body)
        req.body.password = await getHash(req.body.password,)
        user.password = req.body.password
        user.resetToken = null
        user.resetTokenExpires = null
        user.save()
        res.sendResponse('Password Changed Successfully')
    }

}