'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // chats.belongsTo(models.rides, { foreignKey: 'customer_id', as: 'customer' }); // Adds fk to chats
      // chats.belongsTo(models.rides, { foreignKey: 'driver_id', as: 'driver' }); // Adds fk to chats
      // chats.belongsTo(models.user_vehicles, { foreignKey: 'vehicle_id' }); // Adds fk to chats

    }
  };
  chats.init({
    msg: DataTypes.STRING,
    driverId: DataTypes.STRING,
    customer_id: DataTypes.STRING,
    rideId: DataTypes.STRING,
    user_type : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'chats',
  });
  return chats;
};