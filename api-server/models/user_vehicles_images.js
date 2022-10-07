'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_vehicles_images extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // user_vehicles_images.belongsTo(models.users); 
      user_vehicles_images.belongsTo(models.user_vehicles);
    }
  };
  user_vehicles_images.init({
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user_vehicles_images',
  });
  return user_vehicles_images;
};