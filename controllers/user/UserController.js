const BaseController = require('../base/BaseController');
const { User } = require('../../models');
const { ValidationError } = require('../../utils/errorHandler');
const { logger } = require('../../utils/logger');
const ResponseHandler = require('../../utils/responseHandler');
const bcrypt = require('bcrypt');

class UserController extends BaseController {
    constructor() {
        super(User);
    }

    async getProfile(req, res) {
        try {
            const user = await this.model.findByPk(req.user.id, {
                attributes: { exclude: ['password'] }
            });
            
            if (!user) {
                return ResponseHandler.error(res, 'User not found', 404);
            }

            return ResponseHandler.success(res, user);
        } catch (error) {
            logger.error(`Error fetching profile: ${error.message}`);
            return ResponseHandler.error(res, 'Failed to fetch profile', 500);
        }
    }

    async updateProfile(req, res) {
        try {
            const { name, email } = req.body;
            const user = await this.model.findByPk(req.user.id);

            if (!user) {
                return ResponseHandler.error(res, 'User not found', 404);
            }

            // Check if email is being changed and if it's already taken
            if (email && email !== user.email) {
                const existingUser = await this.model.findOne({ where: { email } });
                if (existingUser) {
                    throw new ValidationError('Email already in use');
                }
            }

            await user.update({ name, email });
            
            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return ResponseHandler.success(res, userResponse, 'Profile updated successfully');
        } catch (error) {
            logger.error(`Error updating profile: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to update profile', 500);
        }
    }

    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await this.model.findByPk(req.user.id);

            if (!user) {
                return ResponseHandler.error(res, 'User not found', 404);
            }

            // Verify current password
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new ValidationError('Current password is incorrect');
            }

            // Hash new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            // Update password
            await user.update({ password: hashedPassword });

            return ResponseHandler.success(res, null, 'Password changed successfully');
        } catch (error) {
            logger.error(`Error changing password: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Failed to change password', 500);
        }
    }
}

module.exports = new UserController(); 