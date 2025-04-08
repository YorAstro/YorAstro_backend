'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {id: {
            type: Sequelize.CHAR(36),
            primaryKey: true
        },
        userId:{
          type: Sequelize.CHAR(36),
          references: {
            model: 'Users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
      },
        fullName: {
            type: Sequelize.CHAR(36),
            allowNull : false,
        },
        phoneNumber: {
            type: Sequelize.CHAR(36),
            allowNull: false,
        },
        addressLine1: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        addressLine2: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        city: {
            type: Sequelize.TEXT,
            defaultValue: false
        },
        state: {
            type: Sequelize.TEXT,
            defaultValue: false
        },
        postalCode: {
            type: Sequelize.TEXT,
            defaultValue: false
        },
        country: {
            type: Sequelize.TEXT,
            defaultValue: false
  }
})},

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Addresses');
  }
};
