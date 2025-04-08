const { DataTypes,Model } = require('sequelize');
const sequelize = require("../services/databaseConnection.js");

class Address extends Model {}

Address.init({
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true
    }, 
    userId: {
        type: DataTypes.CHAR(36),
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    fullName: {
        type: DataTypes.CHAR(36),
        allowNull : false,
    },
    phoneNumber: {
        type: DataTypes.CHAR(36),
        allowNull: false,
    },
    addressLine1: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    addressLine2: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    city: {
        type: DataTypes.TEXT,
        defaultValue: false
    },
    state: {
        type: DataTypes.TEXT,
        defaultValue: false
    },
    postalCode: {
        type: DataTypes.TEXT,
        defaultValue: false
    },
    country: {
        type: DataTypes.TEXT,
        defaultValue: false
    },
}, {
    sequelize,
    modelName: "Address",
    tableName: "addresses",
    timestamps: false,
      });

module.exports = Address; 