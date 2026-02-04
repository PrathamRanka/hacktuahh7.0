/**
 * chat.controller.js
 * Controller for chat/AI explanation endpoints
 * Handles conversational queries about sustainability
 */

const { processMessage, generateSuggestedQuestions } = require('../services/chat.service');

/**
 * POST /chat
 * Process a chat message and get AI response
 */
async function chatController(req, res, next) {
  try {
    const { message, context } = req.body;

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message',
        message: 'Please provide a non-empty message string'
      });
    }

    // Validate message length
    if (message.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Message too long',
        message: 'Message must be 500 characters or less'
      });
    }

    // Process message
    const response = processMessage(message, context || {});

    // Generate suggested follow-up questions
    const suggestions = generateSuggestedQuestions(context || {});

    // Return response
    return res.status(200).json({
      success: true,
      response: {
        message: response.message,
        type: response.type,
        timestamp: response.timestamp
      },
      suggestions: suggestions.slice(0, 3) // Return top 3 suggestions
    });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /chat/suggestions
 * Get suggested questions based on context
 */
async function getSuggestionsController(req, res, next) {
  try {
    const { hasLocation, hasBusinessType } = req.query;

    const context = {
      hasLocation: hasLocation === 'true',
      hasBusinessType: hasBusinessType === 'true'
    };

    const suggestions = generateSuggestedQuestions(context);

    return res.status(200).json({
      success: true,
      suggestions
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chatController,
  getSuggestionsController
};
