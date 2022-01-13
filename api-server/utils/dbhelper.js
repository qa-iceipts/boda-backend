// const mysql = require('mysql2/promise');
// var config = require('.././config/config');
// config = config[config.activeEnv];

// module.exports = {
//     dbhelper: async function () {
//         await mysql.createConnection({
//             user: config.username,
//             password: config.password,
//             host: config.host,

//         })
//         await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`)
//         resolve("done")
//         console.log("db checked or created")
//     }
// }

require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const mysql = require('mysql2/promise');

console.log(config)

module.exports = (async function initialize() {

    console.log("Using Configuration =>", env)
    // create db if it doesn't already exist
    const connection = await mysql.createConnection({
        host: config.host,
        port: config.port,
        user: config.username,
        password: config.password
    });
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

    let db = require("../models/index")

    await db.sequelize.authenticate();
    console.log(" => Database Authenticated Successfully !!")
    // sync all models with database
    await db.sequelize.sync();
    console.log(" => Database Synced Successfully !!")
    db.hy = "hyy"
    return db
})()
