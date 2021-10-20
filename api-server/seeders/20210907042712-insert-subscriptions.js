'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('subscriptions', [
      {
        type: 1,
        name: "Yearly",
        rate: 599,
        description: "Includes a full year pack",
        currency: "rs",
        duration: 365, //DAYS
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 2,
        name: "Monthly",
        rate: 119,
        description: "Includes a full Month pack",
        currency: "rs",
        duration: 28, //DAYS
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 3,
        name: "Weekly",
        rate: 79,
        description: "Includes a full week pack",
        currency: "rs",
        duration: 7, //DAYS
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        type: 4,
        name: "Daily",
        rate: 19,
        description: "Includes a full day pack",
        currency: "rs",
        duration: 1, //DAYS
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('subscriptions', null, {});
  }
};
