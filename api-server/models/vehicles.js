'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class vehicles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  vehicles.init({
    name: DataTypes.STRING,
    type: {
      type: DataTypes.INTEGER,
      unique: true
    },
    rate: DataTypes.FLOAT,
    min_rate : DataTypes.FLOAT,
    max_rate : DataTypes.FLOAT,
    persons : DataTypes.INTEGER,
    currency: DataTypes.STRING,
    service_type: DataTypes.STRING,
    
  }, {
    sequelize,
    modelName: 'vehicles',
  });
  return vehicles;
};