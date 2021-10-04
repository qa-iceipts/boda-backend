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
      User.belongsTo(models.roles, {foreignKey: 'roleType', targetKey: 'type'}); // Adds fk_role to User
      User.hasMany(models.user_subscriptions);
      // User.hasMany(models.rides);
       User.hasMany(models.rides,{foreignKey: 'customer_id',as: 'customer'});
       User.hasMany(models.rides,{foreignKey: 'driver_id',as: 'driver'});
      // User.hasMany(models.rides, {foreignKey: 'driver_id'});
      User.hasMany(models.fcm_keys);
      User.hasMany(models.user_vehicles)
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
    phone: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type:DataTypes.STRING,
      unique: true
    },
    password : {
      type:DataTypes.STRING,
    },
    address: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    station: DataTypes.STRING,
    profile_image: DataTypes.STRING,
    about_me: DataTypes.STRING,
    license: DataTypes.STRING,
    payment_mode: DataTypes.INTEGER,
    ratings : DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};