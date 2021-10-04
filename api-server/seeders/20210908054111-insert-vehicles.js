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

    await queryInterface.bulkInsert('vehicles', [{

      type: 1,
      name: "HONDA",
      rate: 85,
      min_rate: 55,
      max_rate :70,
      persons: 2,
      currency: "rs",
      service_type: "ride",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      type: 2,
      name: "BAJAJ",
      rate: 70,
      min_rate: 55,
      max_rate :75,
      persons: 2,
      currency: "rs",
      service_type: "ride",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      type: 3,
      name: "TVS",
      rate: 90,
      min_rate: 65,
      max_rate :80,
      persons: 3,
      currency: "rs",
      service_type: "ride",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      type: 4,
      name: "ACTIVA",
      rate: 80,
      min_rate: 70,
      max_rate :100,
      persons: 2,
      currency: "rs",
      service_type: "ride",
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('vehicles', null, {});
  }
};
