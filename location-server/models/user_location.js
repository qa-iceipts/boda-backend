'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  user_location.init({
    user_id: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    vehicle_type: {
      type: DataTypes.INTEGER
    },
    user_type: {
      type: DataTypes.INTEGER,
      required: true
    },
    lat: DataTypes.STRING,
    per_km: DataTypes.FLOAT,
    long: DataTypes.STRING,
    // time: DataTypes.DATE,
    online: DataTypes.BOOLEAN
  }, {
    // scopes
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
    scopes: {},
    sequelize,
    modelName: 'user_location',
  });
  return user_location;
};