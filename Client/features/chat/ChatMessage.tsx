'use client';

import type { ChatMessage as ChatMessageType } from '@/lib/types';

interface ChatMessageProps {
  message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-emerald-600 text-white'
            : 'bg-white border border-slate-200 text-slate-900'
        }`}
      >
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
        <p className={`text-xs mt-1 ${isUser ? 'text-emerald-100' : 'text-slate-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
