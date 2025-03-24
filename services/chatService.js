const  Chat  = require('../models/chat.js');
const  User  = require('../models/users.js');
const { logger } = require('../utils/logger');
const { ValidationError } = require('../utils/errorHandler');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
class ChatService {
    constructor() {
        this.activeConnections = new Map(); // Store active socket connections
    }

    // Store user socket connection
    storeConnection(userId, socket) {
        this.activeConnections.set(userId, socket);
        logger.info(`User ${userId} connected`);
    }

    // Remove user socket connection
    removeConnection(userId) {
        this.activeConnections.delete(userId);
        logger.info(`User ${userId} disconnected`);
    }

    // Get user's socket connection
    getConnection(userId) {
        return this.activeConnections.get(userId);
    }

    // Fetch astrologer details
    async getAstrologerDetails(astrologerId) {
        try {
            const astrologer = await User.findByPk(astrologerId, {
                attributes: ['id', 'name', 'email', 'expertise', 'experience', 'role'],
                where: { role: 'astrologer' }
            });

            if (!astrologer) {
                throw new ValidationError('Astrologer not found');
            }

            return astrologer;
        } catch (error) {
            logger.error(`Error fetching astrologer details: ${error.message}`);
            throw error;
        }
    }

    // Save chat message
    async saveMessage(senderId, receiverId, message) {
        try {
            const chat = await Chat.create({
                id: uuidv4(),
                senderId,
                receiverId,
                message,
                timestamp: new Date()
            });

            return chat;
        } catch (error) {
            logger.error(`Error saving chat message: ${error.message}`);
            throw error;
        }
    }

    // Get chat history
    async getChatHistory(userId, astrologerId) {
        try {
            const messages = await Chat.findAll({
                where: {
                    [sequelize.Op.or]: [
                        { senderId: userId, receiverId: astrologerId },
                        { senderId: astrologerId, receiverId: userId }
                    ]
                },
                order: [['timestamp', 'ASC']],
                include: [
                    {
                        model: User,
                        as: 'sender',
                        attributes: ['id', 'name', 'role']
                    },
                    {
                        model: User,
                        as: 'receiver',
                        attributes: ['id', 'name', 'role']
                    }
                ]
            });

            return messages;
        } catch (error) {
            logger.error(`Error fetching chat history: ${error.message}`);
            throw error;
        }
    }

    // Send message to specific user
    async sendMessageToUser(userId, message) {
        try {
            const userSocket = this.getConnection(userId);
            if (userSocket) {
                userSocket.emit('newMessage', message);
            }
        } catch (error) {
            logger.error(`Error sending message to user: ${error.message}`);
            throw error;
        }
    }

    // Validate chat participants
    async validateChatParticipants(userId, astrologerId) {
        try {
            const [user, astrologer] = await Promise.all([
                User.findByPk(userId),
                User.findByPk(astrologerId)
            ]);

            if (!user || !astrologer) {
                throw new ValidationError('User or astrologer not found');
            }

            if (astrologer.role !== 'astrologer') {
                throw new ValidationError('Invalid astrologer');
            }

            return { user, astrologer };
        } catch (error) {
            logger.error(`Error validating chat participants: ${error.message}`);
            throw error;
        }
    }

    // Mark message as read
    async markMessageAsRead(messageId, senderId, receiverId) {
        try {
            const message = await Chat.findOne({
                where: {
                    id: messageId,
                    senderId,
                    receiverId,
                    isRead: false
                }
            });

            if (!message) {
                throw new ValidationError('Message not found or already read');
            }

            await message.update({ isRead: true });
            return message;
        } catch (error) {
            logger.error(`Error marking message as read: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new ChatService(); 