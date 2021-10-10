require('dotenv').config();
module.exports = {
  "activeEnv" : process.env.NODE_ENV,
    "development": {
      "username": process.env.DEV_DB_USERNAME,
      "password":process.env.DEV_DB_PASSWORD,
      "database": process.env.DEV_DB_DATABASE,
      "host": process.env.DEV_DB_HOST,
      "dialect":  process.env.DEV_DB_DIALECT,
      "JWT_SECRET" : process.env.JWT_SECRET,
      "JWT_SECRET_EXPIRY_SEC": process.env.JWT_SECRET_EXPIRY_SEC,
      "JWT_TOKEN_ALGORITHM_TYPE": process.env.JWT_TOKEN_ALGORITHM_TYPE,
    },
    "test": {
      "username": process.env.TEST_DB_USERNAME,
      "password":process.env.TEST_DB_PASSWORD,
      "database": process.env.TEST_DB_DATABASE,
      "host": process.env.TEST_DB_HOST,
      "dialect":  process.env.TEST_DB_DIALECT,
      "JWT_SECRET" : process.env.JWT_SECRET,
      "JWT_SECRET_EXPIRY_SEC": process.env.JWT_SECRET_EXPIRY_SEC,
      "JWT_TOKEN_ALGORITHM_TYPE": process.env.JWT_TOKEN_ALGORITHM_TYPE,
      
    },
    "production": {
      "username": process.env.PROD_DB_USERNAME,
      "password":process.env.PROD_DB_PASSWORD,
      "database": process.env.PROD_DB_DATABASE,
      "host": process.env.PROD_DB_HOST,
      "dialect":  process.env.PROD_DB_DIALECT,
      "JWT_SECRET" : process.env.JWT_SECRET,
      "JWT_SECRET_EXPIRY_SEC": process.env.JWT_SECRET_EXPIRY_SEC,
      "JWT_TOKEN_ALGORITHM_TYPE": process.env.JWT_TOKEN_ALGORITHM_TYPE,
    }
  }
  
  