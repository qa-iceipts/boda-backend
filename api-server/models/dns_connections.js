'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class dns_connections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      dns_connections.belongsTo(models.rides);
    }
  };
  dns_connections.init({
    socketId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'dns_connections',
  });
  return dns_connections;
};