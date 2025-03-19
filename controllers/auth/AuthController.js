const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { AuthenticationError, ValidationError } = require('../../utils/errorHandler');
const { logger } = require('../../utils/logger');
const ResponseHandler = require('../../utils/responseHandler');
const config = require('../../config/config');

class AuthController {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new ValidationError('Email already registered');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await User.create({
                email,
                password: hashedPassword,
                name
            });

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                config.jwtSecret,
                { expiresIn: '24h' }
            );

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return ResponseHandler.created(res, {
                user: userResponse,
                token
            }, 'User registered successfully');
        } catch (error) {
            logger.error(`Registration error: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Registration failed', 500);
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new AuthenticationError('Invalid credentials');
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new AuthenticationError('Invalid credentials');
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                config.jwtSecret,
                { expiresIn: '24h' }
            );

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return ResponseHandler.success(res, {
                user: userResponse,
                token
            }, 'Login successful');
        } catch (error) {
            logger.error(`Login error: ${error.message}`);
            if (error instanceof AuthenticationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Login failed', 500);
        }
    }

    async registerAstrologer(req, res) {
        try {
            const { email, password, name, expertise, experience } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new ValidationError('Email already registered');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create astrologer user
            const user = await User.create({
                email,
                password: hashedPassword,
                name,
                role: 'astrologer',
                expertise,
                experience
            });

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                config.jwtSecret,
                { expiresIn: '24h' }
            );

            // Remove password from response
            const userResponse = user.toJSON();
            delete userResponse.password;

            return ResponseHandler.created(res, {
                user: userResponse,
                token
            }, 'Astrologer registered successfully');
        } catch (error) {
            logger.error(`Astrologer registration error: ${error.message}`);
            if (error instanceof ValidationError) {
                return ResponseHandler.error(res, error.message, error.statusCode);
            }
            return ResponseHandler.error(res, 'Astrologer registration failed', 500);
        }
    }
}

module.exports = new AuthController(); 