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
      transactions.belongsTo(models.user_subscriptions);
    }
  };
  transactions.init({
    merchantTransactionID: {
      type: DataTypes.STRING,
      unique: true
    },
    requestAmount: {
      type: DataTypes.FLOAT,
      unique: false
    },
    currencyCode: {
      type: DataTypes.STRING,
      unique: false
    },
    accountNumber: {
      type: DataTypes.STRING,
      unique: false
    },
    dueDate: {
      type: DataTypes.STRING,
      unique: false
    },
    requestDescription: {
      type: DataTypes.STRING,
      unique: false
    },
    countryCode: {
      type: DataTypes.STRING,
      unique: false
    },
    customerFirstName: {
      type: DataTypes.STRING,
      unique: false
    },
    customerLastName: {
      type: DataTypes.STRING,
      unique: false
    },
    MSISDN: {
      type: DataTypes.STRING,
      unique: false
    },
    customerEmail: {
      type: DataTypes.STRING,
      unique: false
    },
    status: DataTypes.BOOLEAN,
    checkoutRequestID: {
      type: DataTypes.STRING,
      unique: false
    },
    conversionRate: {
      type: DataTypes.STRING,
      unique: false
    },
    originalCurrencyCode: {
      type: DataTypes.STRING,
      unique: false
    },
    convertedCurrencyCode: {
      type: DataTypes.STRING,
      unique: false
    },
    convertedAmount: {
      type: DataTypes.STRING,
      unique: false
    },
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};