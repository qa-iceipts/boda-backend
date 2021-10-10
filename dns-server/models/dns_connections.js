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
    }
  };
  dns_connections.init({
    rideId: {
      type : DataTypes.STRING,
      // unique : true
    },
    socketId:  {
      type : DataTypes.STRING,
      unique : true
    },
     userId :{
      type : DataTypes.STRING,
      unique : true
    },
    user_type :{
      type : DataTypes.INTEGER,
      unique : false
    }
    
  }, {
    sequelize,
    modelName: 'dns_connections',
  });
  return dns_connections;
};