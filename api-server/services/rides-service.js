'use strict';
/**
 *  This module is used to define service for user_vehicles model 
 *  @module user_vehicles-service
 *  @author Deepesh Kushwaha
 *  @version 1.0.0
 */

const logger = require('../utils/logger');
const ridesDao = require('../daos/rides-dao');
const util = require('../utils/commonUtils')
var responseConstant = require("../constants/responseConstants");
const { getTokensByIds } = require("../services/fcm-service")
const { sendNotifications } = require('../services/notifications-service')

/**
 * export module
 */

module.exports = {

    addRide: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("addRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)
            ridesDao.addRide(reqObj).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in addRide', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add addRide promise', err);
            return reject(err);
        });

    },

    updateRide: function (req) {
        return new Promise(function (resolve, reject) {
            console.log("updateRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)
            ridesDao.updateRide(reqObj).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in updateRide', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add updateRide promise', err);
            return reject(err);
        });

    },
    bookRide: function (req) {
        return new Promise(function (resolve, reject) {

            console.log("bookRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)

            getTokensByIds(req.body.driver_id).then(driver_fcmtokens => {
                getTokensByIds(req.body.customer_id).then(customer_fcmtokens => {

                    console.log("driver_fcmtokens.data:: ", driver_fcmtokens.data)
                    console.log("customer_fcmtokens.data:: ", customer_fcmtokens.data)

                    if (driver_fcmtokens.data.length > 0 && customer_fcmtokens.data.length > 0) {

                        let notificationdata = {
                            data: JSON.stringify({
                                rideId: req.body.id,
                                state: req.state
                            })
                        }

                        let driverMsg = {
                            notification: {
                                title: "Ride Booked By Customer",
                                body: "Customer is waiting at pickup location"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: driver_fcmtokens.data,
                        };

                        let customerMsg = {
                            notification: {
                                title: "Ride Booking Successfull",
                                body: "Driver is arriving soon at pickup location"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: customer_fcmtokens.data,
                        };

                        sendNotifications(driverMsg).then((result) => {
                            console.log("Notifications sent")
                            if (customer_fcmtokens.data) {
                                sendNotifications(customerMsg).then((result) => {
                                    console.log("Notifications sent")

                                    ridesDao.updateRide(reqObj, {
                                        where: {
                                            id: req.body.id
                                        }
                                    }).then(function (result) {
                                        return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                                    }).catch(function (err) {
                                        console.log(err)
                                        logger.error('error in bookRide', err);
                                        return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                                    });


                                }).catch(err => {
                                    console.log(err)
                                    return reject(err)
                                });
                            }
                        }).catch(err => {
                            console.log(err)
                            return reject(err)
                        });
                    } else {
                        return reject("notifications tokens not found for users")
                    }
                }).catch(err => {
                    console.log(err)
                    return reject(err)
                })
            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        }, function (err) {
            console.log(err)
            logger.error('error in add bookRide promise', err);
            return reject(err);
        });

    },
    getRide: function (rideId) {
        return new Promise(function (resolve, reject) {
            console.log("getRide Service Called ::", rideId)
            ridesDao.getRide(rideId).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in getRide', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add getRide promise', err);
            return reject(err);
        });

    },

    getRidesByUserId: function (userid) {
        return new Promise(function (resolve, reject) {
            console.log("getRidesByUserId Service Called ::", userid)
            ridesDao.getRidesByUserId(userid).then(function (result) {
                return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
            }).catch(function (err) {
                console.log(err)
                logger.error('error in getRidesByUserId', err);
                return reject(util.responseUtil(err, null, responseConstant.RECORD_NOT_FOUND));
            });
        }, function (err) {
            console.log(err)
            logger.error('error in add getRidesByUserId promise', err);
            return reject(err);
        });

    },
    startRide: function (req) {
        return new Promise(function (resolve, reject) {

            console.log("startRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)

            getTokensByIds(req.body.driver_id).then(driver_fcmtokens => {
                getTokensByIds(req.body.customer_id).then(customer_fcmtokens => {

                    console.log("driver_fcmtokens.data:: ", driver_fcmtokens.data)
                    console.log("customer_fcmtokens.data:: ", customer_fcmtokens.data)

                    if (driver_fcmtokens.data.length > 0 && customer_fcmtokens.data.length > 0) {

                        let notificationdata = {
                            data: JSON.stringify({
                                rideId: req.body.id,
                                state: req.state
                            })
                        }

                        let driverMsg = {
                            notification: {
                                title: "Ride Started",
                                body: "Reach Drop point to end ride"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: driver_fcmtokens.data,
                        };

                        let customerMsg = {
                            notification: {
                                title: "Ride Started by driver",
                                body: "You will reach your destination soon!"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: customer_fcmtokens.data,
                        };

                        sendNotifications(driverMsg).then(() => {
                            console.log("Notifications sent")
                            if (customer_fcmtokens.data) {
                                sendNotifications(customerMsg).then(() => {
                                    console.log("Notifications sent")

                                    ridesDao.updateRide(reqObj, {
                                        where: {
                                            id: req.body.id
                                        }
                                    }).then(function (result) {
                                        return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                                    }).catch(function (err) {
                                        console.log(err)
                                        logger.error('error in startRide', err);
                                        return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                                    });


                                }).catch(err => {
                                    console.log(err)
                                    return reject(err)
                                });
                            }
                        }).catch(err => {
                            console.log(err)
                            return reject(err)
                        });
                    } else {
                        return reject("notifications tokens not found for users")
                    }
                }).catch(err => {
                    console.log(err)
                    return reject(err)
                })
            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        }, function (err) {
            console.log(err)
            logger.error('error in add startRide promise', err);
            return reject(err);
        });

    },

    endRide: function (req) {
        return new Promise(function (resolve, reject) {

            console.log("endRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)

            getTokensByIds(req.body.driver_id).then(driver_fcmtokens => {
                getTokensByIds(req.body.customer_id).then(customer_fcmtokens => {

                    console.log("driver_fcmtokens.data:: ", driver_fcmtokens.data)
                    console.log("customer_fcmtokens.data:: ", customer_fcmtokens.data)

                    if (driver_fcmtokens.data.length > 0 && customer_fcmtokens.data.length > 0) {

                        let notificationdata = {
                            data: JSON.stringify({
                                rideId: req.body.id,
                                state: req.state
                            })
                        }

                        let driverMsg = {
                            notification: {
                                title: "Ride Ended",
                                body: "Ride is ended successfully"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: driver_fcmtokens.data,
                        };

                        let customerMsg = {
                            notification: {
                                title: "Ride Ended Successfully",
                                body: "Thank you, have a nice day!"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: customer_fcmtokens.data,
                        };

                        sendNotifications(driverMsg).then(() => {
                            console.log("Notifications sent")
                            if (customer_fcmtokens.data) {
                                sendNotifications(customerMsg).then(() => {
                                    console.log("Notifications sent")

                                    ridesDao.updateRide(reqObj, {
                                        where: {
                                            id: req.body.id
                                        }
                                    }).then(function (result) {
                                        return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                                    }).catch(function (err) {
                                        console.log(err)
                                        logger.error('error in endRide', err);
                                        return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                                    });


                                }).catch(err => {
                                    console.log(err)
                                    return reject(err)
                                });
                            }
                        }).catch(err => {
                            console.log(err)
                            return reject(err)
                        });
                    } else {
                        return reject("notifications tokens not found for users")
                    }
                }).catch(err => {
                    console.log(err)
                    return reject(err)
                })
            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        }, function (err) {
            console.log(err)
            logger.error('error in add endRide promise', err);
            return reject(err);
        });

    },
    cancelRide: function (req) {
        return new Promise(function (resolve, reject) {

            console.log("cancelRide Service Called ::")
            let reqObj = req.body
            console.log("reqObj::", reqObj)

            getTokensByIds(req.body.driver_id).then(driver_fcmtokens => {
                getTokensByIds(req.body.customer_id).then(customer_fcmtokens => {

                    console.log("driver_fcmtokens.data:: ", driver_fcmtokens.data)
                    console.log("customer_fcmtokens.data:: ", customer_fcmtokens.data)

                    if (driver_fcmtokens.data.length > 0 && customer_fcmtokens.data.length > 0) {

                        let notificationdata = {
                            data: JSON.stringify({
                                rideId: req.body.id,
                                state: req.state
                            })
                        }
                        let driverMsg = {
                            notification: {
                                title: "Ride is Cancelled",
                                body: "Customer cancelled the ride"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: driver_fcmtokens.data,
                        };
                        let customerMsg = {
                            notification: {
                                title: "Ride is Cancelled",
                                body: "Customer cancelled the ride"
                            },
                            android: {
                                notification: {
                                    clickAction: 'rideclick'
                                }
                            },
                            data: notificationdata ? notificationdata : "",
                            tokens: customer_fcmtokens.data,
                        };

                        sendNotifications(driverMsg).then((result) => {
                            console.log("Notifications sent")
                            if (customer_fcmtokens.data) {
                                sendNotifications(customerMsg).then((result) => {
                                    console.log("Notifications sent")

                                    ridesDao.updateRide(reqObj).then(function (result) {
                                        return resolve(util.responseUtil(null, result, responseConstant.SUCCESS));
                                    }).catch(function (err) {
                                        console.log(err)
                                        logger.error('error in bookRide', err);
                                        return reject(util.responseUtil(err, null, responseConstant.RUN_TIME_ERROR));
                                    });

                                }).catch(err => {
                                    console.log(err)
                                    return reject(err)
                                });
                            }
                        }).catch(err => {
                            console.log(err)
                            return reject(err)
                        });
                    } else {
                        return reject("notifications tokens not found for users")
                    }
                }).catch(err => {
                    console.log(err)
                    return reject(err)
                })
            }).catch(err => {
                console.log(err)
                return reject(err)
            })
        }, function (err) {
            console.log(err)
            logger.error('error in add bookRide promise', err);
            return reject(err);
        });

    },

  


}



