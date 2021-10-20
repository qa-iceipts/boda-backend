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
      rides.belongsTo(models.User, {foreignKey: 'customer_id',as: 'customer'}); // Adds fk to rides
      rides.belongsTo(models.User, {foreignKey: 'driver_id',as: 'driver'}); // Adds fk to rides
      rides.belongsTo(models.user_vehicles, {foreignKey: 'vehicle_id'}); // Adds fk to rides
    }
  };
  rides.init({
    origin_lat: DataTypes.STRING,
    origin_long: DataTypes.STRING,
    destination_lat: DataTypes.STRING,
    destination_long: DataTypes.STRING,
    origin_location: DataTypes.STRING,
    destination_location: DataTypes.STRING,
    is_booked: {
      defaultValue: false,
      type : DataTypes.BOOLEAN
    },
    amount_estimated: DataTypes.FLOAT,
    amount_actual: DataTypes.FLOAT,
    distance: DataTypes.FLOAT,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'rides',
  });
  return rides;
};