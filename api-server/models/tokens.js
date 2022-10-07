'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tokens.init({
    userId: DataTypes.UUID,
    refresh_token: DataTypes.TEXT,
    timestamp: DataTypes.STRING,
    is_used: DataTypes.ENUM('0', '1')

  }, {
    sequelize,
    modelName: 'tokens',
  });
  return tokens;
};