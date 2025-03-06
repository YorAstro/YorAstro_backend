'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.CHAR(36),
        allowNull: false,
        primaryKey: true,
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      google_user: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      image: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      otp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      dateofbirth: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      timeofbirth: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      pincode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(36),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.ENUM('admin', 'astrologer', 'user'),
        allowNull: false,
        defaultValue: 'user',
      },
      reset_token: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      reset_token_expiry: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  },
};

