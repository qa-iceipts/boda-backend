const express = require('express');
const router = express.Router();
const logger = require('../utils/logger')
const { PromiseHandler } = require('../utils/errorHandler')
const ROLE = require('../utils/roles')
const adminService = require('../services/admin-service');
const { login } = require('../services/user-service');
const authorize = require("../middleware/authorize")

const { users } = require('../models');


router.post('/signup', PromiseHandler(adminService.singup))

router.post('/login', (req, res, next) => {
    req.params = {
        roleName: ROLE.ADMIN
    }
    next()
}, PromiseHandler(login))

router.get('/dashboard',authorize(ROLE.ADMIN),PromiseHandler(adminService.adminDashboard))

module.exports = router;