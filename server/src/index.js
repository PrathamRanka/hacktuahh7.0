/**
 * index.js
 * Server entry point
 * Starts the Express server
 */

const app = require('./app');
const { config } = require('./config/env');
const logger = require('./utils/logger.util');

const PORT = config.port;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 CarbonCompass API server started`);
  logger.info(`📍 Environment: ${config.nodeEnv}`);
  logger.info(`🌐 Server running on port ${PORT}`);
  logger.info(`📊 API available at http://localhost:${PORT}${config.apiPrefix}`);
  logger.info(`❤️  Health check: http://localhost:${PORT}${config.apiPrefix}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', { promise, reason });
  process.exit(1);
});

module.exports = server;
