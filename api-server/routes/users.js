const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const HttpStatus = require('http-status-codes');
const userService = require('../services/user-service');
const { validate, superSchema } = require('../utils/validator')
const { authMiddleware } = require("../utils/firebase/firebase_middleware");
const {
    verifyAccessToken,
    verifyUser
} = require("../utils/verifytoken")

router.get('/', function (req, res) {
    console.log("/user request called");
    res.send('Welcome to Users');
});

// Routes
/**
 * @swagger
 * /addUser:
 *   post:
 *     tags:
 *     - "Users"
 *     summary: "Add a new User/Signup"
 *     description: ""
 *     operationId: "addUser"
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - in: "body"
 *       name: "body"
 *       description: "User object that needs to be added"
 *       required: true
 *       schema:
 *         $ref: "#/definitions/Users"
 *     responses:
 *       "405":
 *         description: "Invalid input"
 *     security:
 *     - petstore_auth:
 *       - "write:pets"
 *       - "read:pets"
 * 
 * definitions:
 *  Users:
 *   type: object
 *   required:
 *     - name
 *     - phone
 *     - email
 *   properties:
 *     phone:
 *       type: string
 *       example: "8234567890"
 *     name:
 *       type: string
 *       example: "Deepesh Kushwaha"
 *     email:
 *       type: string
 *       example: "deepesh@gmail.com"
 *     roleId:
 *       type: string
 *       description: Role Driver(2) Or Customer(3)
 *       enum:
 *         - 2
 *         - 3
 */

router.post('/addUser', authMiddleware, validate(superSchema.addUserSchema), (req, res, next) => {

    console.log("Add User Route Called")

    userService.addUser(req).then((result) => {
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

router.post('/devaddUser', validate(superSchema.addUserSchema), (req, res, next) => {

    console.log("Add User Route Called")

    userService.addUser(req).then((result) => {
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

router.post('/devlogin', validate(superSchema.loginSchema), (req, res, next) => {

    console.log("login Route Called")

    userService.login(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1102) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        }
        else if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
            res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
        }
    });

}, (err) => {
    logger.error("router error", err);
    res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

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

router.get('/getAllUsers/:userType', verifyAccessToken, (req, res) => {
    console.log("Add User Route Called")
    
    verifyUser(req, 'admin').then(() => {
        userService.getAllUsers(req).then((result) => {
            res.status(HttpStatus.StatusCodes.OK).send(result);
        }, (err) => {
            if (err.status === 1003) {
                res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
            } else {
                res.status(HttpStatus.StatusCodes.INTERNAL_SERVER_ERROR).send(err);
            }
        });

    }).catch(err => {
        res.status(HttpStatus.StatusCodes.UNAUTHORIZED).send(err);
    })

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


router.post('/login', authMiddleware, validate(superSchema.loginSchema), (req, res, next) => {

    console.log("login Route Called")

    userService.login(req).then((result) => {
        res.status(HttpStatus.StatusCodes.OK).send(result);
    }, (err) => {
        if (err.status === 1102) {
            res.status(HttpStatus.StatusCodes.CONFLICT).send(err)
        }
        else if (err.status === 1130) {
            res.status(HttpStatus.StatusCodes.NOT_FOUND).send(err)
        }
        else {
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



module.exports = router;