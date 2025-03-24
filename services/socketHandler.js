const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const chatService = require('./chatService');
const { logger } = require('../utils/logger');
const { ValidationError } = require('../utils/errorHandler');

class SocketHandler {
    constructor(server) {
        this.io = socketIO(server, {
            cors: {
                origin: config.cors.origin,
                methods: ['GET', 'POST'],
                credentials: true
            }
        });

        this.setupMiddleware();
        this.setupEventHandlers();
    }

    setupMiddleware() {
        // Authentication middleware
        this.io.use(async (socket, next) => {
            try {
                // Log the entire handshake for debugging
                logger.info('Socket handshake:', {
                    auth: socket.handshake.auth,
                    headers: socket.handshake.headers,
                    query: socket.handshake.query
                });

                // Try to get token from different possible locations
                const token = socket.handshake.auth.token || 
                            socket.handshake.query.token || 
                            socket.handshake.headers.authorization?.split(' ')[1];

                if (!token) {
                    logger.error('No token found in socket connection');
                    throw new ValidationError('Authentication token required');
                }

                const decoded = jwt.verify(token, config.jwtSecret);
                socket.user = decoded;
                next();
            } catch (error) {
                logger.error(`Socket authentication error: ${error.message}`);
                next(new Error('Authentication failed'));
            }
        });
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            logger.info(`User connected: ${socket.user.id}`);

            // Store user connection
            chatService.storeConnection(socket.user.id, socket);

            // Handle joining chat with astrologer
            socket.on('joinChat', async (astrologerId) => {
                try {
                    // Validate chat participants
                    await chatService.validateChatParticipants(socket.user.id, astrologerId);

                    // Get chat history
                    const chatHistory = await chatService.getChatHistory(socket.user.id, astrologerId);

                    // Join room for this chat
                    const roomId = `chat_${socket.user.id}_${astrologerId}`;
                    socket.join(roomId);

                    // Send chat history to user
                    socket.emit('chatHistory', chatHistory);

                    logger.info(`User ${socket.user.id} joined chat with astrologer ${astrologerId}`);
                } catch (error) {
                    logger.error(`Error joining chat: ${error.message}`);
                    socket.emit('error', { message: error.message });
                }
            });

            // Handle new messages
            socket.on('sendMessage', async (data) => {
                try {
                    const { receiverId, message } = data;

                    // Validate chat participants
                    await chatService.validateChatParticipants(socket.user.id, receiverId);

                    // Save message to database
                    const savedMessage = await chatService.saveMessage(
                        socket.user.id,
                        receiverId,
                        message
                    );

                    // Get room ID for this chat
                    const roomId = `chat_${socket.user.id}_${receiverId}`;

                    // Emit message to room
                    this.io.to(roomId).emit('newMessage', {
                        ...savedMessage.toJSON(),
                        sender: {
                            id: socket.user.id,
                            name: socket.user.name,
                            role: socket.user.role
                        }
                    });

                    logger.info(`Message sent from ${socket.user.id} to ${receiverId}`);
                } catch (error) {
                    logger.error(`Error sending message: ${error.message}`);
                    socket.emit('error', { message: error.message });
                }
            });

            // Handle typing status
            socket.on('typing', (data) => {
                const { receiverId, isTyping } = data;
                const roomId = `chat_${socket.user.id}_${receiverId}`;
                socket.to(roomId).emit('userTyping', {
                    userId: socket.user.id,
                    isTyping
                });
            });

            // Handle disconnection
            socket.on('disconnect', () => {
                chatService.removeConnection(socket.user.id);
                logger.info(`User disconnected: ${socket.user.id}`);
            });
        });
    }

    // Method to emit events to specific users
    emitToUser(userId, event, data) {
        const userSocket = chatService.getConnection(userId);
        if (userSocket) {
            userSocket.emit(event, data);
        }
    }

    // Method to emit events to all users
    emitToAll(event, data) {
        this.io.emit(event, data);
    }
}

module.exports = SocketHandler; 