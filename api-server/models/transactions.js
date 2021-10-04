'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.belongsTo(models.User); 
      transactions.belongsTo(models.subscriptions, {foreignKey: 'subscriptionType', targetKey: 'type'});
      transactions.belongsTo(models.user_subscriptions);
      transactions.belongsTo(models.payment_modes, {foreignKey: 'paymentMode', targetKey: 'type'});   
    }
  };
  transactions.init({
    time: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
      // This way, the current date/time will be used to populate this column (at the moment of insertion)
    },
    transaction_id: {
      type: DataTypes.STRING,
      unique:true
    },
    MerchantRequestID :{
      type: DataTypes.STRING,
      unique:true
    },
    CheckoutRequestID :{
      type: DataTypes.STRING,
      unique:true
    },
    ResponseDescription :DataTypes.STRING,
    CustomerMessage : DataTypes.STRING,
    amount: DataTypes.FLOAT,
    currency: DataTypes.STRING,
    status : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};