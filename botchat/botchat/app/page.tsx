'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Scene from '@/components/Scene';
import { chatStream } from '@/lib/groq';
import { cn } from '@/lib/utils';
import { Send, Loader2, Image, Video } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  media?: string; // Image/video URL from tool call
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStream, setCurrentStream] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = useCallback(async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setCurrentStream('');

    try {
      const allMessages = [
        ...messages,
        userMessage,
        { role: 'assistant' as const, content: '' },
      ];

      await chatStream(
        allMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        (chunk: string) => {
          setCurrentStream((prev) => prev + chunk);
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg.role === 'assistant' && !msg.id
            ? { ...msg, content: currentStream, id: Date.now().toString() }
            : msg
        )
      );
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Error: Could not connect to AI. Check your GROQ_API_KEY.',
        },
      ]);
    } finally {
      setIsLoading(false);
      setCurrentStream('');
    }
  }, [input, messages, currentStream, isLoading]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <main className="min-h-screen w-full relative overflow-hidden">
      <Scene />
      
      {/* Chat Container */}
      <div className="relative z-50 flex flex-col h-screen max-w-4xl mx-auto p-6 pt-20 pb-20">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-4 mb-4 custom-scrollbar">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex animate-in slide-in-from-bottom-2 duration-200',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'chat-bubble max-w-[80%] p-5 relative group',
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 text-right'
                    : 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/40'
                )}
              >
                {message.role === 'assistant' && message.media && (
                  <div className="mb-3">
                    {message.media.endsWith('.mp4') ? (
                      <video
                        src={message.media}
                        controls
                        className="w-full rounded-xl shadow-neon-glow"
                        autoPlay
                      />
                    ) : (
                      <img
                        src={message.media}
                        alt="Generated media"
                        className="w-full rounded-xl shadow-neon-glow cursor-pointer hover:scale-105 transition-all"
                      />
                    )}
                  </div>
                )}
                <p className="font-rajdhani text-lg leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.isStreaming && (
                  <div className="flex items-center mt-2 space-x-1">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="text-xs opacity-75 font-mono">streaming...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </div>
          ))}
          {currentStream && (
            <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-200">
              <div className="chat-bubble bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/40 p-5 max-w-[80%]">
                <p className="font-rajdhani text-lg leading-relaxed whitespace-pre-wrap glitch">
                  {currentStream}
                </p>
                <div className="flex items-center mt-2 space-x-1">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  <span className="text-xs opacity-75 font-mono">generating...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex items-end space-x-3 p-4 bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 neon-glow">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... or ask for neon art, glitch videos 🔥"
            className="flex-1 bg-transparent border-none outline-none text-lg font-rajdhani text-white placeholder:text-white/60 resize-none max-h-24"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={cn(
              'cyber-button flex items-center space-x-2 p-4 rounded-2xl shadow-neon-glow hover:animate-pulse',
              (!input.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Quick actions */}
        <div className="flex space-x-2 pt-4 opacity-80">
          <button className="cyber-button flex-1 flex items-center justify-center space-x-2 p-3 text-xs">
            <Image className="w-4 h-4" />
            <span>Neon Art</span>
          </button>
          <button className="cyber-button flex-1 flex items-center justify-center space-x-2 p-3 text-xs">
            <Video className="w-4 h-4" />
            <span>Glitch Vid</span>
          </button>
        </div>
      </div>
    </main>
  );
}
