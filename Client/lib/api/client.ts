// API client for CarbonCompass backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  async getRecommendations(businessType: string, limit: number = 10) {
    return this.request('/recommend', {
      method: 'POST',
      body: JSON.stringify({ businessType, limit }),
    });
  }

  async getLocationScore(lat: number, lng: number, businessType?: string) {
    return this.request('/recommend/score', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, businessType }),
    });
  }

  async getBusinessTypes() {
    return this.request('/recommend/business-types', {
      method: 'GET',
    });
  }

  async calculateImpact(lat: number, lng: number, businessType?: string) {
    return this.request('/impact', {
      method: 'POST',
      body: JSON.stringify({ lat, lng, businessType }),
    });
  }

  async sendChatMessage(message: string, context?: any) {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async getChatSuggestions(hasLocation: boolean = false, hasBusinessType: boolean = false) {
    return this.request(`/chat/suggestions?hasLocation=${hasLocation}&hasBusinessType=${hasBusinessType}`, {
      method: 'GET',
    });
  }

  async healthCheck() {
    return this.request('/health', {
      method: 'GET',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
