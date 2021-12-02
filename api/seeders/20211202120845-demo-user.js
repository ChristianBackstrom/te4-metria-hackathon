'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.bulkInsert(
          'Users',
          [
              {
                  name: 'John Doe',
                  money: 20_000,
                  createdAt: new Date(),
                  updatedAt: new Date(),
              },
          ],
          {}
      );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
