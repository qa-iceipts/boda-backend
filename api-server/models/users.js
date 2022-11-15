'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // users.belongsTo(models.roles); 
      users.hasMany(models.refreshTokens, { onDelete: 'CASCADE' });
      users.belongsTo(models.roles, { foreignKey: 'roleType', targetKey: 'type' }); // Adds fk_role to users
      users.hasMany(models.user_subscriptions);
      // users.hasMany(models.rides);
      users.hasMany(models.rides, { foreignKey: 'customer_id', as: 'customer' });
      users.hasMany(models.rides, { foreignKey: 'driver_id', as: 'driver' });
      // users.hasMany(models.rides, {foreignKey: 'driver_id'});
      users.hasMany(models.fcm_keys);
      users.hasMany(models.user_vehicles)
    }
  };
  users.init({
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
      type: DataTypes.STRING,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
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
    ratings: DataTypes.FLOAT,
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    rideStatus: { type: DataTypes.ENUM("AVAILABLE", "NOT_AVAILABLE"), defaultValue: "AVAILABLE", allowNull: false },
    resetToken: { type: DataTypes.STRING },
    resetTokenExpires: { type: DataTypes.DATE },



  }, {

    // scopes
    defaultScope: {
      where: {
        isActive: true
      },
      attributes: {
        exclude: ['resetToken', 'resetTokenExpires', 'password', 'createdAt', 'updatedAt']
      }
    },
    scopes: {
      notActiveUsers: {
        where: {
          isActive: false
        }
      },
      allUsers: {
        where: {
        }
      },
    },
    sequelize,
    modelName: 'users',
  });
  return users;
};