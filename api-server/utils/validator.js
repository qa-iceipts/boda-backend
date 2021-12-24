const Validator = require("fastest-validator");
const v = new Validator();
var superSchema = {
    addUserSchema: {

        name: {
            type: "string",
            optional: false,
            max: "100",
            empty: false
        },
        email: {
            type: "email",
            optional: false,
            max: "500",
            empty: false
        },
        phone: {
            type: "string",
            optional: false,
            min: 10,
            empty: false
        },
        roleType: {
            type: "enum",
            optional: false,
            values: [2, 3]
        },
        password: {
            type: "string",
            optional: false,
            max: "500",
            empty: false
        }

    },
    loginSchema: {

        phone: {
            type: "string",
            optional: false,
            min: 10,
            empty: false
        }

    },
    logoutSchema: {
        refreshToken: {
            type: "string",
            optional: false,
            empty: false
        }
    },
    adminloginSchema: {
        username: {
            type: "string",
            optional: false,
            max: "100",
            empty: false
        },
        password: {
            type: "string",
            optional: false,
            max: "500",
            empty: false
        }
    }

}

const validate = (schema) => {
    return (req, res, next) => {
        let tempvalidator = v.compile(schema)
        result = tempvalidator(req.body);
        if (result != true) {
            console.log("validation error ::", result)
            return res.status(400).json(result);
        }
        next();
    }

}

module.exports = {
    validate,
    superSchema
}