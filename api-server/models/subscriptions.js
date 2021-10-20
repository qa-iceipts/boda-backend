'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  subscriptions.init({
    type: {
      type: DataTypes.INTEGER,
      unique: true
    },
    name: DataTypes.STRING,
    rate: DataTypes.FLOAT,
    description : DataTypes.STRING,
    currency: DataTypes.STRING,
    duration: {
      type: DataTypes.INTEGER //DAYS
    }
  }, {
    sequelize,
    modelName: 'subscriptions',
  });
  return subscriptions;
};