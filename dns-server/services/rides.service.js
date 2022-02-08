'use strict';

const createHttpError = require('http-errors')
const { rides } = require('../models');

module.exports = {
    getRideById: async function (id) {
        let result = await rides.findByPk(id)
        if (!result) throw new createHttpError.NotFound()
        return result
    },
}