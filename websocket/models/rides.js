'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rides extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  rides.init({
    driverId: DataTypes.STRING,
    rideId: DataTypes.STRING,
    status: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    customerId: DataTypes.STRING,
    pick_lat: DataTypes.STRING,
    pick_long: DataTypes.STRING,
    drop_lat: DataTypes.STRING,
    drop_long: DataTypes.STRING,
    range : DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'rides',
  });
  return rides;
};