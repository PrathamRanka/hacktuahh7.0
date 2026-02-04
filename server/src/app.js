/**
 * app.js
 * Express application setup
 * Configures middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config } = require('./config/env');
const logger = require('./utils/logger.util');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');
const { sanitizeBody } = require('./middlewares/validate.middleware');

// Import routes
const healthRoutes = require('./routes/health.routes');
const recommendRoutes = require('./routes/recommend.routes');
const impactRoutes = require('./routes/impact.routes');
const chatRoutes = require('./routes/chat.routes');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(logger.requestLogger());

// Sanitize input
app.use(sanitizeBody);

// API routes
const apiPrefix = config.apiPrefix;

app.use(`${apiPrefix}/health`, healthRoutes);
app.use(`${apiPrefix}/recommend`, recommendRoutes);
app.use(`${apiPrefix}/impact`, impactRoutes);
app.use(`${apiPrefix}/chat`, chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CarbonCompass API',
    version: '1.0.0',
    endpoints: {
      health: `${apiPrefix}/health`,
      recommend: `${apiPrefix}/recommend`,
      impact: `${apiPrefix}/impact`,
      chat: `${apiPrefix}/chat`
    },
    documentation: 'https://github.com/carboncompass/api'
  });
});

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

module.exports = app;
