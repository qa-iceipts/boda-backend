'use strict';
/**
 *  This module is used to define service for Mpesa 
 *  @module Mpesa
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const db = require('../models')
var http = require("http");
var responseConstant = require("../constants/responseConstants");
const axios = require('axios').default
const TimeStamp = require('time-stamp');
/**
 * export module
 */

module.exports = {

    getOAuthToken: (req, res, next) => {
        console.log("/mpesa getOAuthToken request called");
        let consumer_key = process.env.mpesa_consumer_key;
        let consumer_secret = process.env.mpesa_consumer_secret;

        let url = process.env.mpesa_oauth_token_url;
        //form a buffer of the consumer key and secret
        let buffer = new Buffer.from(consumer_key + ":" + consumer_secret);

        let auth = `Basic ${buffer.toString('base64')}`;

        axios.get(url, {
            "headers": {
                "Authorization": auth
            }
        }).then(result => {
            req.token = result.data['access_token'];
            console.log("/mpesa getOAuthToken generated");
            return next();
        }).catch(err => {
            console.log(err.message)
            return res.status(400).send({
                success: false,
                message: err.message
            });
        });
    },

    lipaNaMpesaOnline: (req) => {
        return new Promise((resolve, reject) => {
            
            return resolve({
                    success: true,
                    message: {
                      MerchantRequestID: '950-96661027-12'+Math.random(),
                      CheckoutRequestID: 'ws_CO_0609202115503483942'+Math.random(),
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

            axios.post(url,{
                "BusinessShortCode":bs_short_code,
                "Password":password,
                "Timestamp":timestamp,
                "TransactionType":transcation_type,
                "Amount":amount,
                "PartyA":partyA,
                "PartyB":partyB,
                "PhoneNumber":phoneNumber,
                "CallBackURL":callBackUrl,
                "AccountReference":accountReference,
                "TransactionDesc":transaction_desc
            },{
                "headers":{
                    "Authorization":auth
                }
            }).then(result => {
                    let data = result.data
                    // console.log("/mpesa DATA RESPONSE",data);

                return resolve({
                    success:true,
                    message:data
                });
            }).catch(err=>{
                console.log("err",err.response.data)
                return reject(err.response.data)
        
                
            });
        }, function (err) {
            logger.error('error in add mpesa subscribe promise', err);
            return reject(err);
        });
    }


}

