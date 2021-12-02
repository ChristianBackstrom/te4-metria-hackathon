'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('Points', [
            {
                plotId: 1,
                lat: 39.44327862025557,
                lng: 18.00852601173419,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                plotId: 1,
                lat: 39.44300070208638,
                lng: 18.00877636202855,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                plotId: 1,
                lat: 39.443266536879975,
                lng: 18.00899541853611,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                plotId: 1,
                lat: 39.44327862025557,
                lng: 18.00852601173419,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Points', null, {});
    },
};
