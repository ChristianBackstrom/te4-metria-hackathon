'use strict';
const User = require('../models/user');

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert('Plots', [
          {
              userId: 1,
              color: '#ff0000',
              description: 'This is a demo plot',
              createdAt: new Date(),
              updatedAt: new Date(),
          },
      ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Plots', null, {});
  }
};
