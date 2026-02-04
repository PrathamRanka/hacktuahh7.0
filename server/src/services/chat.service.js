/**
 * chat.service.js
 * Chat/explanation service for answering sustainability questions
 * Provides conversational AI-like responses (placeholder logic)
 */

const { generateChatExplanation, generateImpactExplanation } = require('../logic/explanation.logic');
const { getScoreTier } = require('../logic/greenScore.logic');
const { getAvailableBusinessTypes } = require('../logic/businessFit.logic');
const { getDataStatistics } = require('./geo.service');

/**
 * Process a chat message and generate response
 * @param {string} message - User's message/question
 * @param {Object} context - Optional context (location data, scores, etc.)
 * @returns {Object} Chat response
 */
function processMessage(message, context = {}) {
  if (!message || typeof message !== 'string') {
    throw new Error('Message must be a non-empty string');
  }

  const lowerMessage = message.toLowerCase().trim();

  // Determine intent and generate response
  let response;
  let responseType;

  if (isGreeting(lowerMessage)) {
    response = generateGreeting();
    responseType = 'greeting';
  } else if (isAboutGreenScore(lowerMessage)) {
    response = generateChatExplanation(message, context);
    responseType = 'explanation';
  } else if (isAboutBusinessTypes(lowerMessage)) {
    response = generateBusinessTypesResponse();
    responseType = 'business_types';
  } else if (isAboutData(lowerMessage)) {
    response = generateDataResponse();
    responseType = 'data_info';
  } else if (isAboutImpact(lowerMessage)) {
    response = context.impactData 
      ? generateImpactExplanation(context.impactData)
      : 'I can explain environmental impact once you select a location. Impact includes carbon reduction, transit usage improvements, and wellbeing benefits.';
    responseType = 'impact';
  } else if (isAboutRecommendations(lowerMessage)) {
    response = generateRecommendationsResponse();
    responseType = 'recommendations';
  } else {
    response = generateChatExplanation(message, context);
    responseType = 'general';
  }

  return {
    message: response,
    type: responseType,
    timestamp: new Date().toISOString()
  };
}

/**
 * Check if message is a greeting
 * @param {string} message - Lowercase message
 * @returns {boolean} True if greeting
 */
function isGreeting(message) {
  const greetings = ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon'];
  return greetings.some(g => message.startsWith(g));
}

/**
 * Check if message is about green score
 * @param {string} message - Lowercase message
 * @returns {boolean} True if about green score
 */
function isAboutGreenScore(message) {
  return message.includes('green score') || 
         message.includes('sustainability') ||
         message.includes('how is') && message.includes('calculated');
}

/**
 * Check if message is about business types
 * @param {string} message - Lowercase message
 * @returns {boolean} True if about business types
 */
function isAboutBusinessTypes(message) {
  return message.includes('business type') || 
         message.includes('what businesses') ||
         message.includes('types of business');
}

/**
 * Check if message is about data
 * @param {string} message - Lowercase message
 * @returns {boolean} True if about data
 */
function isAboutData(message) {
  return message.includes('data') || 
         message.includes('how many') ||
         message.includes('coverage');
}

/**
 * Check if message is about impact
 * @param {string} message - Lowercase message
 * @returns {boolean} True if about impact
 */
function isAboutImpact(message) {
  return message.includes('impact') || 
         message.includes('carbon') ||
         message.includes('reduction') ||
         message.includes('emissions');
}

/**
 * Check if message is about recommendations
 * @param {string} message - Lowercase message
 * @returns {boolean} True if about recommendations
 */
function isAboutRecommendations(message) {
  return message.includes('recommend') || 
         message.includes('suggest') ||
         message.includes('best location');
}

/**
 * Generate greeting response
 * @returns {string} Greeting message
 */
function generateGreeting() {
  return 'Hello! I\'m CarbonCompass, your sustainability assistant. I can help you find eco-friendly business locations in Patiala, explain green scores, and estimate environmental impact. What would you like to know?';
}

/**
 * Generate business types response
 * @returns {string} Business types information
 */
function generateBusinessTypesResponse() {
  const types = getAvailableBusinessTypes();
  
  const typesList = types.map(t => `• ${t.name}`).join('\n');
  
  return `I can help you find sustainable locations for these business types:\n\n${typesList}\n\nEach business type has unique environmental preferences. Which one interests you?`;
}

/**
 * Generate data statistics response
 * @returns {string} Data information
 */
function generateDataResponse() {
  const stats = getDataStatistics();
  
  return `CarbonCompass currently covers Patiala, Punjab with:\n• ${stats.buildingsCount} commercial buildings\n• ${stats.parksCount} parks and green spaces\n• ${stats.transitStopsCount} public transit stops\n\nAll data is analyzed to provide sustainability recommendations.`;
}

/**
 * Generate recommendations response
 * @returns {string} Recommendations information
 */
function generateRecommendationsResponse() {
  return 'I can recommend sustainable locations based on your business type. Recommendations consider park proximity, transit access, and overall environmental impact. Simply specify your business type (like "eco_cafe" or "green_office") and I\'ll find the best locations for you.';
}

/**
 * Generate contextual help based on conversation state
 * @param {Object} conversationContext - Current conversation state
 * @returns {Array<string>} Suggested questions
 */
function generateSuggestedQuestions(conversationContext = {}) {
  const suggestions = [
    'What is a green score?',
    'How is sustainability calculated?',
    'What business types are supported?',
    'Tell me about environmental impact'
  ];

  if (conversationContext.hasLocation) {
    suggestions.push('What is the impact of this location?');
    suggestions.push('How does this compare to other locations?');
  }

  if (conversationContext.hasBusinessType) {
    suggestions.push('Show me the best locations for my business');
    suggestions.push('Why is this location recommended?');
  }

  return suggestions;
}

/**
 * Process batch messages (for testing or bulk queries)
 * @param {Array<string>} messages - Array of messages
 * @param {Object} context - Shared context
 * @returns {Array<Object>} Array of responses
 */
function processBatchMessages(messages, context = {}) {
  if (!Array.isArray(messages)) {
    throw new Error('Messages must be an array');
  }

  return messages.map(message => {
    try {
      return processMessage(message, context);
    } catch (error) {
      return {
        message: 'Sorry, I couldn\'t process that message.',
        type: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  });
}

module.exports = {
  processMessage,
  processBatchMessages,
  generateSuggestedQuestions
};
