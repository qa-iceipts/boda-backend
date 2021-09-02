'use strict';

var crypto = require('crypto');
// var nodemailer = require('nodemailer');
var https = require('http');
var constant = require("../constants/constants");
const secret = 'm@b1l1y@';
const razorSecret='BLGtVSmbK75hTS6yeYIPKGGP'
var md5 = require('md5');

/**
 * export module
 */
module.exports = {
    //ToDo This is a business login, needs to be moved in common-service
    /**
     * Utility function for encrypt password
     */
    encryptPassword: function (password) {
        const hash = crypto.createHmac('sha256', secret).update(password).digest('hex');
        return hash;
    },

    encryptInvoiceNumber:function(value){
        const hash = md5(value);
        //console.log("hash value ::",hash)
        return hash;
    },

    sendOtp:function(phone){
        let number = (Math.floor(100000 + Math.random() * 9000000)).toString()
        
    },

    //ToDo Needs to be verified if required, I suppose compare strings will work. Needs to be moved in common-service
    /**
     *  function for compare strings
     */
    comparePasswords: function (oldPassword, decryptPassword) {
        if (oldPassword === decryptPassword) return true;

        return false;
    },

    
    // hasing for payment signature 
    generateSignature:function(ConcatRazorString){
        const hash = crypto.createHmac('sha256', razorSecret).update(ConcatRazorString).digest('hex');
        return hash;
    },

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

    //Send throgh nodemailer
    sendMail: function (emailId, subject, msg, callback) {
        console.log(emailId, subject, msg);
        var transporter = nodemailer.createTransport({
            // service: 'gmail',
            // auth: {
            //     user: "shivanimistry3014@gmail.com",
            //     pass: "***"
            // }
            host: 'mail.iceipts.com',
            port: 587,
            //secure: true,
            auth: {
                user: "contact@iceipts.com",
                pass: "iceipts123"
            },
            tls: { 
                rejectUnauthorized: false 
            }
        });
        var mailOptions = {                                             // setup e-mail data with unicode symbols
            from: 'contact@iceipts.com',                                       // sender address
            to: emailId,                           // list of receivers
            subject: subject,                                     // Subject line
            text: 'Hello',                                            // plaintext body
            html: msg
        };
        transporter.sendMail(mailOptions, function (error, info) {       // send mail with defined transport object
            if (error) {
                console.log("error", error);
                return callback(error);
            } else {
                return callback(null, info.response);
            }
        });
    },

    /**
    * httpRequest utility function
    * @param  {Object} req
    */
    httpRequest: function (reqData, options, callback) {
        var getReq = https.request(options, function (res) {
            var responseObj = '';
        res.setEncoding('utf8');
            res.on('data', function (chunk) {
            responseObj += chunk ;     
          });
            res.on('end', function () {    
                return callback(null, JSON.parse(responseObj));  
                });
       });
    
    getReq.write(reqData); 
        //end the request
        getReq.end();
    getReq.on('error', function (err) {
        //console.log("Error: ", err);
        return callback(err);
    });
},

    
}

