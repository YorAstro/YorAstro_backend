const chatService = require('../../services/chatService');
const { logger } = require('../../utils/logger');
const ResponseHandler = require('../../utils/responseHandler');
const { ValidationError } = require('../../utils/errorHandler');

class ChatController {
    async getAstrologerDetails(req, res) {
        try {
            const { astrologerId } = req.params;
            const astrologer = await chatService.getAstrologerDetails(astrologerId);
            return ResponseHandler.success(res, astrologer);
        } catch (error) {
            logger.error(`Error fetching astrologer details: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to fetch astrologer details', 500);
        }
    }

    async getChatHistory(req, res) {
        try {
            const { astrologerId } = req.params;
            const userId = req.user.id;

            // Validate chat participants
            await chatService.validateChatParticipants(userId, astrologerId);

            // Get chat history
            const messages = await chatService.getChatHistory(userId, astrologerId);
            return ResponseHandler.success(res, messages);
        } catch (error) {
            logger.error(`Error fetching chat history: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to fetch chat history', 500);
        }
    }

    async getActiveAstrologers(req, res) {
        try {
            const astrologers = await chatService.getActiveAstrologers();
            return ResponseHandler.success(res, astrologers);
        } catch (error) {
            logger.error(`Error fetching active astrologers: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch active astrologers', 500);
        }
    }

    async getActiveUsers(req, res) {
        try {
            const users = await chatService.getActiveUsers();
            return ResponseHandler.success(res, users);
        } catch (error) {
            logger.error(`Error fetching active users: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch active users', 500);
        }
    }
}

module.exports = new ChatController(); 