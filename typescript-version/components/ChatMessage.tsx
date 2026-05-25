import React from 'react';
import { Message } from '../types.ts';
import { MarkdownRenderer } from './MarkdownRenderer.tsx';
import { User, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-8`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-4`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-gray-100 text-gray-500' : 'bg-black text-white'
        }`}>
          {isUser ? <User size={18} /> : <Sparkles size={18} />}
        </div>

        {/* Message Bubble */}
        <div className={`px-6 py-5 rounded-2xl ${
          isUser 
            ? 'bg-black text-white rounded-tr-sm' 
            : 'bg-white border border-gray-200 text-gray-900 rounded-tl-sm shadow-sm'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
          ) : (
            <MarkdownRenderer content={message.text} />
          )}
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-black animate-pulse"></span>
          )}
        </div>
      </div>
    </div>
  );
};
