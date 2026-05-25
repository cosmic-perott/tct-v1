import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, RefreshCw } from 'lucide-react';
import { Message } from './types.ts';
import { SUGGESTIONS } from './constants.ts';
import { sendMessageStream, resetChat } from './services/geminiService.ts';
import { ChatMessage } from './components/ChatMessage.tsx';

const LOGO_URL = "https://storage.googleapis.com/gweb-cloud-vertex-ai-studio-prod/images/1740049223199_image.png";

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsgId = Date.now().toString();
    const userMessage: Message = { id: userMsgId, role: 'user', text: text.trim() };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'model', text: '', isStreaming: true }]);

    try {
      const stream = sendMessageStream(text);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMsgId 
              ? { ...msg, text: fullResponse } 
              : msg
          )
        );
      }
      
      // Remove streaming flag when done
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMsgId 
            ? { ...msg, isStreaming: false } 
            : msg
        )
      );
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === aiMsgId 
            ? { 
                ...msg, 
                text: `**Backend Connection Error:**\n\`${errorMessage}\`\n\n*Note: The frontend is trying to reach the local \`/api/agent\` proxy. Ensure your Next.js/Express backend is running, and that \`GOOGLE_APPLICATION_CREDENTIALS\` is properly configured in your server environment.*`, 
                isStreaming: false 
              } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(inputValue);
    }
  };

  const handleReset = () => {
    resetChat();
    setMessages([]);
  };

  const isChatEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900 font-sans selection:bg-gray-200 selection:text-black">
      
      {/* Header */}
      <header className="flex-shrink-0 p-4 md:px-8 md:py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex justify-between items-center">
        <div className="flex items-center">
          <img 
            src={LOGO_URL} 
            alt="IceBerg Travel Agent" 
            className="h-10 object-contain"
          />
        </div>
        {!isChatEmpty && (
          <button 
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-full transition-colors"
            title="Start new plan"
          >
            <RefreshCw size={18} />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto p-4 md:p-8 flex flex-col">
        <div className="max-w-4xl w-full mx-auto flex-grow flex flex-col">
          
          {isChatEmpty ? (
            // Hero Section (Empty State)
            <div className="flex-grow flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
              <img 
                src={LOGO_URL} 
                alt="IceBerg Travel Agent" 
                className="h-32 md:h-40 object-contain mb-6"
              />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight text-gray-900">
                Travel advice without the BS.
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl mb-12">
                Ignore the hype. Remove the internet noise. We show you which places can actually elevate your trip experience and which places are just social clout.
              </p>
              
              {/* Suggestions */}
              <div className="flex flex-wrap justify-center gap-3 w-full max-w-3xl">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSend(suggestion.text)}
                    className="px-5 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-600 hover:text-black hover:border-black hover:bg-gray-50 transition-all duration-200 shadow-sm"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Chat History
            <div className="flex flex-col pb-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input Area */}
      <footer className="flex-shrink-0 p-4 md:p-6 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto relative">
          <div className="relative flex items-center shadow-sm rounded-full">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Where do you want to go? (e.g., Rome, Kyoto, Mexico City)"
              disabled={isLoading}
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-4 pl-6 pr-14 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2 p-2.5 bg-black text-white rounded-full hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-colors flex items-center justify-center"
            >
              <Send size={18} className={isLoading ? 'opacity-0' : 'opacity-100'} />
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            AI-generated advice. Always double-check opening hours and current conditions.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
