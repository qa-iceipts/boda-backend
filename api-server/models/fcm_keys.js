'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class fcm_keys extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      fcm_keys.belongsTo(models.User); // Adds fk to rides
    }
  };
  fcm_keys.init({
    fcm_key: {
      type :DataTypes.STRING,
      unique : true
    },
    device_type : DataTypes.STRING,
    device_id : DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'fcm_keys',
  });
  return fcm_keys;
};