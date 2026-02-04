/**
 * chat.routes.js
 * Routes for chat/AI explanation endpoints
 */

const express = require('express');
const router = express.Router();
const {
  chatController,
  getSuggestionsController
} = require('../controllers/chat.controller');

/**
 * POST /chat
 * Process a chat message and get AI response
 */
router.post('/', chatController);

/**
 * GET /chat/suggestions
 * Get suggested questions based on context
 */
router.get('/suggestions', getSuggestionsController);

module.exports = router;
