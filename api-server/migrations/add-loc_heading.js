"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn("user_locations", "loc_heading", {
      type: DataTypes.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn("user_locations", "loc_heading", {
      /* query options */
    });
  },
};
