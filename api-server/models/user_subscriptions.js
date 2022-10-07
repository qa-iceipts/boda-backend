'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_subscriptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_subscriptions.belongsTo(models.users);
      user_subscriptions.belongsTo(models.subscriptions, { foreignKey: 'subscriptionType', targetKey: 'type' });
      user_subscriptions.hasMany(models.transactions)
    }
  };
  user_subscriptions.init({
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    is_active: DataTypes.BOOLEAN,
    paymentStatus: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user_subscriptions',
  });
  return user_subscriptions;
};