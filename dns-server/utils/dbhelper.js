const mysql = require('mysql2/promise');
var config = require('.././config/config');
config = config[config.activeEnv];

module.exports = {
    dbhelper : function(){
        return new Promise((resolve,reject)=>{
            mysql.createConnection({
                user     : config.username,
                password : config.password,
                host: config.host,
            }).then((connection) => {
                connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`).then(() => {
                    resolve("done")
                    console.log("db checked or created")
                }).catch(err=>{
                    console.log(err)
                    reject(err)
                });
            });
        });
    }
}