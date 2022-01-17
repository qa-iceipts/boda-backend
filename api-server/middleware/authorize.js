const jwt = require('express-jwt'); 
const createHttpError = require('http-errors');
const { PromiseHandler } = require('../utils/errorHandler');
const { getUserWithId,getRoleName } = require('../daos/users-dao');

module.exports = authorize;

function authorize(roles = []) {
    // roles param can be a single role string (e.g. Role.User or 'User') 
    // or an array of roles (e.g. [Role.Admin, Role.User] or ['Admin', 'User'])
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        // authenticate JWT token and attach user to request object (req.user)
        jwt({ secret: process.env.JWT_SECRET, algorithms: ['HS256'] }),

        // authorize based on user role
        PromiseHandler(async (req, res, next) => {

            console.log("authorize fn payload => ", req.user)
            let user = await getUserWithId(req.user.id)
            let roleName = await getRoleName(user)
            if ((roles.length && !roles.includes(roleName))) {
                // if user role not authorized
                throw new createHttpError.Unauthorized('Unauthorized Role')
            }
            console.log("roles", roles, "===", roleName)
            // authentication and authorization successful
            req.user.phone = user.dataValues.phone;
            req.user.roleType = user.dataValues.roleType;
            req.user.email = user.dataValues.email;
            //const refreshTokens = await user.getRefreshTokens({ raw: true });
            //req.user.ownsToken = token => !!refreshTokens.find(x => x.token === token);
            next();

        })
    ];
}