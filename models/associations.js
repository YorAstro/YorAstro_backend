const User = require('./users');
const Chat = require('./chat');
const address = require('./address');
// Define User associations
User.hasMany(address, {
    foreignKey: 'userId',
    as: 'user'
});

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

address.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});
Chat.belongsTo(User, {
    foreignKey: 'receiverId',
    as: 'receiver'
});

module.exports = {
    User,
    Chat
}; 