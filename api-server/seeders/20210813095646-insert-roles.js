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

     await queryInterface.bulkInsert('roles', [{
     
         roleName: 'Admin',
         type: 1,
         createdAt: new Date(),
         updatedAt: new Date()
       },{
     
        roleName: 'Driver',
        type: 2,
        createdAt: new Date(),
        updatedAt: new Date()
       },{
    
        roleName: 'Customer',
        type: 3,
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

     await queryInterface.bulkDelete('roles', null, {});
  }
};
