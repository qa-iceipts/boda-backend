'use strict';

var crypto = require('crypto');
const nodemailer = require('nodemailer');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const bcrypt = require('bcrypt');
/**
 * export module
 */
module.exports = {
    responseUtil: function (error, data, code) {
        var constants = require('../constants/responseConstants');
        var message = require('../constants/messages');
        var response = {};
        if ((code == null || code == undefined) && (error == null || error == undefined)) {
            throw new Error("Please Send code or error message");
        } else if (code == null || code == undefined) {
            if (error.name === constants.SEQUELIZE_DATABASE_ERROR_NAME)
                code = constants.SEQUELIZE_DATABASE_ERROR_NAME_CODE;
            else if (error.name === constants.SEQUELIZE_VALIDATION_ERROR_NAME)
                code = constants.SEQUELIZE_VALIDATION_ERROR_NAME_CODE;
            else if (error.name === constants.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR_NAME)
                code = constants.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR_NAME_CODE;
            else if (error.name === constants.SEQUELIZE_CONSTRAINT_ERROR)
                code = constants.SEQUELIZE_CONSTRAINT_ERROR_CODE;
            else
                code = constants.UNDEFINED_DATABASE_ERROR;
        }
        response.status = code;
        response.message = message.getMessage(code);
        if (error != null) {
            response.error = error;
            if (error.message != null || error.message != undefined) {
                response.message = response.message + ' :: ' + error.message;
            }

        }
        if (data != null) {
            if (!data.hasOwnProperty('rows')) {
                response.data = data;
            }
            else {
                response.count = data.count;
                response.data = data.rows;
            }
        }
        return response;
    },

    getHash: async function (password) {
        return await bcrypt.hash(password, 10)
    },

    comparePassword: async function (password1, password2) {
        return await bcrypt.compare(password1, password2)
    },


    getHash: async function (password) {
        return await bcrypt.hash(password, 10)
    },

    sendResponse: function (data, status) {
        return {
            success: true, status: status ? status : 200, data: data
        };
    },

    // sendResponse: function (res, data, message, status) {
    //     status = status ? status : 200
    //     res.status(status).send({
    //         success: true, message: message ? message : '', data: typeof (data) != 'object' ? { data } : data
    //     })
    // },

    randomTokenString: function () {
        return crypto.randomBytes(40).toString('hex');
    },

    sendEmail: async function ({ to, subject, html, from = config.emailFrom }) {
        const transporter = nodemailer.createTransport(config.smtpOptions);
        let result = await transporter.sendMail({ from, to, subject, html });
        console.log("mail response", result)

    },

    sendPasswordResetEmail: async function (user, origin) {
        let message;
        await module.exports.sendEmail({
            to: user.email,
            subject: 'Boda App Reset Password - OTP',
            html: `<h2>Boda App RESET PASSWORD REQUEST</h2><h4>Please enter this OTP in the APP</h4>
                   ${message}`
        });
    },

    getBasicDetails: function (user) {
        let { id, name,
            phone, email,
            address, country,
            state, city,
            station, profile_image,
            about_me, license,
            payment_mode, ratings,
            isActive } = user

        return {
            id, name,
            phone, email,
            address, country,
            state, city,
            station, profile_image,
            about_me, license,
            payment_mode, ratings,
            isActive
        }

    }
}

