const { DataTypes } = require('sequelize');
const sequelize = require("../services/databaseConnection.js");

const Chat = sequelize.define('Chat', {
    id: {
        type: DataTypes.CHAR(36),
        primaryKey: true,
    },
    senderId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    receiverId: {
        type: DataTypes.CHAR(36),
        allowNull: false,
        references: {
            model: 'User',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true,
    indexes: [
        {
            fields: ['senderId', 'receiverId']
        },
        {
            fields: ['timestamp']
        }
    ]
});

// Define associations
Chat.associate = (models) => {
    Chat.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender'
    });
    Chat.belongsTo(models.User, {
        foreignKey: 'receiverId',
        as: 'receiver'
    });
};

module.exports = Chat; 