const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const ROLE = require('../utils/roles')
const { PromiseHandler } = require('../utils/error_handler')
const HttpStatus = require('http-status-codes');
const userService = require('../services/user-service');
const { validate, superSchema } = require('../utils/validator')
const { authMiddleware } = require("../utils/firebase/firebase_middleware");
const {
    verifyAccessToken,
    authorize
} = require("../utils/verifytoken")

router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to Users');
});

// Routes
// router.post('/addUser', validate(superSchema.addUserSchema), PromiseHandler(userService.addUser),PromiseHandler(userService.login))

// add User Route For app with otp verify
router.post('/addUser', validate(superSchema.addUserSchema), PromiseHandler(userService.addUser))

// login route with Otp //commented removed MW -- authMiddleware
router.post('/login/:roleName', validate(superSchema.adminloginSchema), PromiseHandler(userService.login))

// // development add User without Otp
// router.post('/devaddUser', validate(superSchema.addUserSchema), PromiseHandler(userService.addUser), PromiseHandler(userService.login))

// // development Login without Otp
// router.post('/devlogin/:roleName', validate(superSchema.adminloginSchema), PromiseHandler(userService.login))

// disable User with userId
router.put('/disableUser/:userId',verifyAccessToken, authorize(ROLE.ADMIN) , PromiseHandler(userService.disableUser))


router.get('/getUser', verifyAccessToken, (req, res) => {

    console.log("Add User Route Called")

    userService.getUser(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1003) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get('/getUser/:id', verifyAccessToken, (req, res) => {

    console.log("getUserById Route Called")

    userService.getUserById(req.params.id).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1003) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            console.log(err)
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.get('/getAllUsers/:userType', verifyAccessToken,authorize(ROLE.ADMIN) , (req, res) => {
    console.log("Add User Route Called")
        userService.getAllUsers(req).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }, (err) => {
            if (err.status === 1003) {
                res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });
}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/getAllUsersByIds/', (req, res) => {
    console.log("getAllUsersByIds Route Called")

    userService.getAllUsersByIds(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1003) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.put('/updateUser', verifyAccessToken, (req, res) => {

    console.log("Add User Route Called")

    userService.updateUser(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1003) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/logout', validate(superSchema.logoutSchema), (req, res, next) => {

    console.log("Logout User Route Called")

    userService.logout(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1003) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/verifyjwttoken', (req, res, next) => {

    console.log("verifyjwttoken Route Called")

    userService.verifyjwttoken(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1102) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/refreshToken', userService.refreshToken);

router.post('/checkUserExists', (req, res, next) => {

    console.log("checkUserExists Route Called")

    userService.checkUserExists(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else if (err.status === 1102) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/verifyUser', verifyAccessToken, (req, res) => {
    verifyDriver(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(req.payload);
    }).catch(err => {
        logger.error("err::", err)
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(err);
    })

}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/getDriverMetrics', (req, res) => {

    console.log("getDriverMetrics Called")

    userService.getDriverMetrics(req.body.driverIds).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else if (err.status === 1102) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        } else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });
}, (err) => {
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

router.post('/forgotPassword', PromiseHandler(userService.forgotPassword));

router.post('/verifyOTP', PromiseHandler(userService.verifyOTP));

router.post('/changePassword', PromiseHandler(userService.changePassword));

module.exports = router;