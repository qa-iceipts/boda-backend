'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class payment_modes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  payment_modes.init({
   type: {
      type: DataTypes.INTEGER,
      unique: true
    },
   
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'payment_modes',
  });
  return payment_modes;
};