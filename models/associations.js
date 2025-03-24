const User = require('./users');
const Chat = require('./chat');

// Define User associations
User.hasMany(Chat, {
    foreignKey: 'senderId',
    as: 'sentMessages'
});

User.hasMany(Chat, {
    foreignKey: 'receiverId',
    as: 'receivedMessages'
});

// Define Chat associations
Chat.belongsTo(User, {
    foreignKey: 'senderId',
    as: 'sender'
});

Chat.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'receiver'
});

module.exports = {
    User,
    Chat
}; 