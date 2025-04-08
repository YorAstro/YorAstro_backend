const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const http = require('http');
const connectDB = require('./services/databaseConnection');
const config = require('./config/config');
const { logRequest, logError } = require('./utils/logger');
const { errorHandler } = require('./utils/errorHandler');
const SocketHandler = require('./services/socketHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/user');
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const chatRoutes = require('./routes/chat');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const socketHandler = new SocketHandler(server);

// Security middleware
app.use(helmet());
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.env === 'development') {
    app.use(morgan('dev'));
}
app.use(logRequest);

// API routes
app.use(`${config.api.prefix}/auth`, authRoutes);
app.use(`${config.api.prefix}/users`, userRoutes);
app.use(`${config.api.prefix}/products`, productRoutes);
app.use(`${config.api.prefix}/categories`, categoryRoutes);
app.use(`${config.api.prefix}/chat`, chatRoutes);
// Error handling middleware
app.use(logError);
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Connect to database
connectDB;

// Export both app and server
module.exports = { app, server };