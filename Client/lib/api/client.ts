// API client for CarbonCompass backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  /**
   * Get recommendations for a business type
   */
  async getRecommendations(businessType, limit = 20) {
    const response = await fetch(`${API_BASE_URL}/recommend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessType, limit }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get recommendations: ${response.statusText}`);
    }

    const data = await response.json();
    return data.recommendations;
  }

  /**
   * Get score for a specific location
   */
  async getScore(lat, lng, businessType) {
    const response = await fetch(`${API_BASE_URL}/recommend/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, businessType }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get score: ${response.statusText}`);
    }

    const data = await response.json();
    return data.score;
  }

  /**
   * Get available business types
   */
  async getBusinessTypes() {
    const response = await fetch(`${API_BASE_URL}/recommend/business-types`);

    if (!response.ok) {
      throw new Error(`Failed to get business types: ${response.statusText}`);
    }

    const data = await response.json();
    return data.businessTypes;
  }

  /**
   * Calculate environmental impact
   */
  async getImpact(lat, lng, businessType) {
    const response = await fetch(`${API_BASE_URL}/impact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lat, lng, businessType }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get impact: ${response.statusText}`);
    }

    const data = await response.json();
    return data.impact;
  }

  /**
   * Send chat message
   */
  async sendChatMessage(message, context = {}) {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.statusText}`);
    }

    const data = await response.json();
    return data.response;
  }

  /**
   * Get chat suggestions
   */
  async getChatSuggestions() {
    const response = await fetch(`${API_BASE_URL}/chat/suggestions`);

    if (!response.ok) {
      throw new Error(`Failed to get suggestions: ${response.statusText}`);
    }

    const data = await response.json();
    return data.suggestions;
  }

  /**
   * Health check
   */
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`);
    
    if (!response.ok) {
      throw new Error('API is not healthy');
    }

    const data = await response.json();
    return data;
  }
}

export const apiClient = new ApiClient();
