'use strict';
/**
 *  This module is used to define service for Mpesa 
 *  @module Mpesa
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const axios = require('axios').default
const TimeStamp = require('time-stamp');
const { v4: uuidv4 } = require('uuid');
const createHttpError = require('http-errors');
/**
 * export module
 */

module.exports = {

    getOAuthToken: async (req, res, next) => {
        console.log("/mpesa getOAuthToken request called");
        let consumer_key = process.env.mpesa_consumer_key;
        let consumer_secret = process.env.mpesa_consumer_secret;

        let url = process.env.mpesa_oauth_token_url;
        //form a buffer of the consumer key and secret
        let buffer = new Buffer.from(consumer_key + ":" + consumer_secret);
        let auth = `Basic ${buffer.toString('base64')}`;
        let result = await axios.get(url, {
            "headers": {
                "Authorization": auth
            }
        })
        req.token = result.data['access_token'];
        console.log("=> mpesa getOAuthToken generated");
        return next();
    },

    lipaNaMpesaOnline: (req) => {
        return new Promise((resolve, reject) => {

            return resolve({
                success: true,
                message: {
                    MerchantRequestID: '950-96661027-12' + Math.random(),
                    CheckoutRequestID: 'ws_CO_0609202115503483942' + Math.random(),
                    ResponseCode: '0',
                    ResponseDescription: 'Success. Request accepted for processing',
                    CustomerMessage: 'Success. Request accepted for processing'
                }

            });

            let token = req.token;
            let auth = `Bearer ${token}`;
            //getting the timestamp
            let timestamp = TimeStamp('YYYYMMDDHHmmss');
            let url = process.env.mpesa_lipaNaMpesaOnline_url;
            let bs_short_code = process.env.mpesa_lipa_na_mpesa_shortcode;
            let passkey = process.env.mpesa_lipa_na_mpesa_passkey;

            let password = new Buffer.from(`${bs_short_code}${passkey}${timestamp}`).toString('base64');
            let transcation_type = "CustomerPayBillOnline";
            let amount = "1"; //you can enter any amount
            let partyA = "254708374149"; //should follow the format:2547xxxxxxxx
            let partyB = process.env.mpesa_lipa_na_mpesa_shortcode;
            let phoneNumber = "254708374149"; //should follow the format:2547xxxxxxxx
            let callBackUrl = "https://1318-150-129-164-73.ngrok.io/mpesa/lipa-na-mpesa-callback";
            let accountReference = "CompanyXLTD";
            let transaction_desc = "Payment of X";

            axios.post(url, {
                "BusinessShortCode": bs_short_code,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": transcation_type,
                "Amount": amount,
                "PartyA": partyA,
                "PartyB": partyB,
                "PhoneNumber": phoneNumber,
                "CallBackURL": callBackUrl,
                "AccountReference": accountReference,
                "TransactionDesc": transaction_desc
            }, {
                "headers": {
                    "Authorization": auth
                }
            }).then(result => {
                let data = result.data
                // console.log("/mpesa DATA RESPONSE",data);

                return resolve({
                    success: true,
                    message: data
                });
            }).catch(err => {
                console.log("err", err.response.data)
                return reject(err.response.data)


            });
        }, function (err) {
            logger.error('error in add mpesa subscribe promise', err);
            return reject(err);
        });
    },

    getBearerToken: async (req, res, next) => {
        console.log("/cellulant getBearerToken request called");
        let auth = `Bearer ${req.token}`;
        let url = "https://developer.tingg.africa/checkout/v2/custom/oauth/token";
        let a = {
            grant_type: "client_credentials",
            client_id: process.env.CLIENTID,
            client_secret: process.env.CLIENTSECRET
        }
        console.log(a)
        let result = await axios.post(url,
            a
        )
        console.log(result.data)
        // return res.send(result.data)
        req.token = result.data.access_token;
        return next();
    },

    processPayment: async (req, res, next) => {
        let url = "https://developer.tingg.africa/checkout/v2/custom/requests/initiate"
        let auth = `Bearer ${req.token}`
        console.log(auth)
        let result = await axios.post(url,
            {
                "merchantTransactionID": uuidv4(),
                "requestAmount": 100.50,
                "currencyCode": "TZS",
                "accountNumber": "ACC12345",
                "serviceCode": "BODDEV0450",
                "dueDate": "2030-12-01 00:00:00",
                "requestDescription": "Getting service/good x",
                "countryCode": "TZ",
                "customerFirstName": "John",
                "customerLastName": "Smith",
                "MSISDN": "255780000000",
                "customerEmail": "john.smith@cellulant.com",
                "paymentWebhookUrl": "https://my.url.com/webhook/receive",
                "successRedirectUrl": "https://my.url.com/webhook/receive",
                "failRedirectUrl": "https://my.url.com/webhook/receive",
            },
            {
                headers: {
                    Authorization: auth
                }
            }

        )
        console.log(result.data)
        if (result.data.status.statusCode != 200)
            throw new createHttpError.FailedDependency()
        res.sendResponse(result.data.results)
    },

    chargeRequest: async (req, res, next) => {
        let url = "https://developer.tingg.africa/checkout/v2/custom/requests/charge"
        let auth = `Bearer ${req.token}`
        console.log(auth)
        req.body.chargeMsisdn = "255780000000"
        let result = await axios.post(url,
            req.body,
            {
                headers: {
                    Authorization: auth
                }
            }
        )
        console.log(result)
        if (result.data.status.statusCode != 200)
            throw new createHttpError.FailedDependency()
        res.sendResponse(result.data)
    },

}

