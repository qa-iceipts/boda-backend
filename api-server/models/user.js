'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // User.belongsTo(models.roles); 
      User.belongsTo(models.roles, {foreignKey: 'type', targetKey: 'type'}); // Adds fk_role to User
    }
  };
  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    
    name: DataTypes.STRING,
    type: DataTypes.INTEGER,
    phone: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type:DataTypes.STRING,
      unique: true
    },
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    station: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    about_me: DataTypes.STRING,
    license: DataTypes.STRING,
    payment_mode: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};