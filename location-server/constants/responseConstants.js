'use strict';

/**
 * npm modules
 */

/*
** Sequelize error code series starts from 1001
** undefined error code series starts from 3001
** Business logic error code series starts from 5001
** Internal error code series starts from 7001
*/

var constants = {};

constants.SUCCESS = 0;

constants.SEQUELIZE_DATABASE_ERROR = 1001;
constants.SEQUELIZE_VALIDATION_ERROR = 1002;
constants.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR = 1003;
constants.SEQUELIZE_DATABASE_TRANSACTION_ERROR = 1004;
constants.SEQUELIZE_CONSTRAINT_ERROR_CODE = 1005;
constants.UNDEFINED_DATABASE_ERROR = 1006;
constants.SEQUELIZE_DATABASE_ERROR_NAME_CODE = 1007;
constants.SEQUELIZE_VALIDATION_ERROR_NAME_CODE = 1008;
constants.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR_NAME_CODE = 1009;


constants.VALID_CREDENTIALS = 1101;
constants.USER_ALREADY_EXIST = 1102;
constants.ERROR_OCCURED_IN_GETTING_USER_LIST = 1103;
constants.UPDATE_DATA_ERROR = 1104;
constants.DELETE_DATA_ERROR = 1105;
constants.UNPROCESSABLE_ENTITY = 1106;
constants.INVALID_JSON_OBJECT = 1107;
constants.UNABLE_TO_SEND_EMAIL = 1108;
constants.RUN_TIME_ERROR = 1109;
constants.WRONG_PASSWORD = 1110;
constants.DUPLICATION_ERROR = 1111;
constants.SYSTEM_ERROR = 1112;
constants.ACCESS_DENIED = 1113;
constants.RECORD_NOT_FOUND = 1114;


constants.REQUEST_SENT_ALREADY = 1115;
constants.PAYMENT_FAILED=1116;
constants.NO_RECORD_DELETED = 1118;
constants.INVALIDE_REQUEST_URL = 1121;
constants.UNAUTHORIZE = 1122;
constants.INVALIDE_CREDENTIAL = 1123;
constants.INVALIDE_REQUEST_PARAMETERS = 1124;
constants.ROLE_NOT_FOUND = 1129;
constants.USER_NOT_FOUND = 1130;

constants.SEQUELIZE_DATABASE_ERROR_NAME = 'SequelizeDatabaseError';
constants.SEQUELIZE_VALIDATION_ERROR_NAME = 'SequelizeValidationError';
constants.SEQUELIZE_FOREIGN_KEY_CONSTRAINT_ERROR_NAME = 'SequelizeForeignKeyConstraintError';
constants.SEQUELIZE_CONSTRAINT_ERROR = 'SequelizeUniqueConstraintError';

/**
 * export module
 */
module.exports = constants;