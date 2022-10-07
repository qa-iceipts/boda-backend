'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_vehicles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // user_vehicles.belongsTo(models.vehicles); 
      user_vehicles.belongsTo(models.users); 
      user_vehicles.belongsTo(models.vehicles, {foreignKey: 'vehicleType', targetKey: 'type'});
      user_vehicles.hasMany(models.user_vehicles_images)
      user_vehicles.hasMany(models.rides, { foreignKey: 'vehicle_id'})

    }
  };
  user_vehicles.init({
    details: DataTypes.STRING,
    registration: DataTypes.STRING,
    images: DataTypes.STRING,
    is_insured: DataTypes.BOOLEAN,
    color : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_vehicles',
  });
  return user_vehicles;
};