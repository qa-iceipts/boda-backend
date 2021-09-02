require('dotenv').config();
module.exports = {
  "activeEnv" : "development",
    "development": {
      "username": process.env.dbusername,
      "password":process.env.dbpassword,
      "database": process.env.dbdatabase,
      "host": process.env.dbhost,
      "dialect":  process.env.dbdialect,
      "JWT_SECRET" : process.env.JWT_SECRET,
      "JWT_SECRET_EXPIRY_SEC": process.env.JWT_SECRET_EXPIRY_SEC,
      "JWT_TOKEN_ALGORITHM_TYPE": process.env.JWT_TOKEN_ALGORITHM_TYPE,
    },
    "test": {
      "username": "root",
      "password": null,
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
      
    },
    "production": {
      "username": "root",
      "password": null,
      "database": "database_production",
      "host": "127.0.0.1",
      "dialect": "mysql"
    }
  }
  
  