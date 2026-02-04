// Chat controller for API interactions

import { apiClient } from '@/lib/api/client';

export interface ChatContext {
  businessType?: string | null;
  selectedBuilding?: {
    id: string;
    greenScore: number;
    tier: string;
  } | null;
}

export async function sendChatMessage(message: string, context?: ChatContext) {
  try {
    const response = await apiClient.sendChatMessage(message, context);
    return response;
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}

export async function getChatSuggestions(hasLocation: boolean = false, hasBusinessType: boolean = false) {
  try {
    const response = await apiClient.getChatSuggestions(hasLocation, hasBusinessType);
    return response;
  } catch (error) {
    console.error('Chat suggestions error:', error);
    return { suggestions: [] };
  }
}
