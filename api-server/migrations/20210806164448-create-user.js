'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      password :{
        type:Sequelize.STRING
      },
      type: {
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.STRING,
        unique:true
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      address: {
        type: Sequelize.STRING
      },
      country: {
        type: Sequelize.STRING
      },
      state: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      station: {
        type: Sequelize.STRING
      },
      profile_image: {
        type: Sequelize.STRING
      },
      about_me: {
        type: Sequelize.STRING
      },
      license: {
        type: Sequelize.STRING
      },
      payment_mode: {
        type: Sequelize.INTEGER
      },
      otp:{
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};