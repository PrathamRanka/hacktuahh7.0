// Chat controller

/**
 * POST /api/chat
 * Handle chat messages
 */
async function sendMessage(req, res) {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'message is required',
          code: 'MISSING_MESSAGE',
        },
      });
    }

    // Simple rule-based responses
    let response = '';

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('green score') || lowerMessage.includes('score')) {
      response = 'Green scores are calculated based on proximity to parks, transit access, and environmental factors. Higher scores indicate more sustainable locations.';
    } else if (lowerMessage.includes('park') || lowerMessage.includes('green space')) {
      response = 'Parks and green spaces are crucial for sustainability. They improve air quality, provide recreation areas, and enhance overall wellbeing.';
    } else if (lowerMessage.includes('transit') || lowerMessage.includes('bus')) {
      response = 'Good public transit access reduces carbon emissions by encouraging people to use sustainable transportation instead of personal vehicles.';
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('best')) {
      response = 'Our recommendations are ranked by green score, which considers park proximity, transit access, and environmental impact. Higher-ranked locations offer better sustainability benefits.';
    } else if (lowerMessage.includes('how') || lowerMessage.includes('why')) {
      response = 'We analyze multiple environmental factors including distance to parks, public transit availability, and overall green infrastructure to determine the best sustainable locations for your business.';
    } else {
      response = 'I can help you understand green scores, sustainability factors, and location recommendations. Ask me about parks, transit, or why certain locations are recommended!';
    }

    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to process message',
        code: 'CHAT_ERROR',
      },
    });
  }
}

/**
 * GET /api/chat/suggestions
 * Get suggested questions
 */
function getSuggestions(req, res) {
  const suggestions = [
    'What makes a location sustainable?',
    'How is the green score calculated?',
    'Why are parks important?',
    'What role does transit play?',
    'How can I improve my location choice?',
  ];

  res.json({
    success: true,
    suggestions,
  });
}

module.exports = {
  sendMessage,
  getSuggestions,
};
