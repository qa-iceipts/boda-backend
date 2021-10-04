'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ratings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ratings.belongsTo(models.rides); // Adds fk to ratings
      ratings.belongsTo(models.user_vehicles); // Adds fk to ratings
      ratings.belongsTo(models.User, {foreignKey: 'driver_id'}); // Adds fk to ratings
    }
  };
  ratings.init({
    vehicle_rating: DataTypes.FLOAT,
    driver_rating: DataTypes.FLOAT,
    feedback: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ratings',
  });
  return ratings;
};