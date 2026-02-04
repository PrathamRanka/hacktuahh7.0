'use client';

import { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { ChatMessage as ChatMessageType, Recommendation } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

interface ChatPanelProps {
  businessType: string | null;
  selectedBuilding: Recommendation | null;
}

export default function ChatPanel({ businessType, selectedBuilding }: ChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      message: 'Hi! I\'m Eco Spirit, your sustainability assistant. Ask me anything about green scores, locations, or environmental impact!',
      type: 'assistant',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      message,
      type: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const context = {
        businessType,
        selectedBuilding: selectedBuilding ? {
          id: selectedBuilding.id,
          greenScore: selectedBuilding.greenScore,
          tier: selectedBuilding.tier,
        } : null,
      };

      const response = await apiClient.sendChatMessage(message, context);

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        message: response.response || 'I apologize, but I couldn\'t process that request.',
        type: 'assistant',
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        message: 'Sorry, I encountered an error. Please try again.',
        type: 'assistant',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <div className="p-4 border-b border-emerald-200 bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">🌱</span>
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Eco Spirit</h3>
            <p className="text-xs text-slate-500">Sustainability Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
}
