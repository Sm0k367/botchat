'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Image as LucideImage, Video as LucideVideo, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  onGenerateImage: (prompt: string) => void;
  onGenerateVideo: (prompt: string) => void;
}

const ChatInput = ({
  input,
  setInput,
  onSend,
  isLoading,
  onGenerateImage,
  onGenerateVideo,
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions = [
    { icon: LucideImage, label: 'Neon Art', action: () => onGenerateImage('cyberpunk neon portrait') },
    { icon: LucideVideo, label: 'Glitch Vid', action: () => onGenerateVideo('glitch cyberpunk animation') },
    { icon: Sparkles, label: 'Smoke Effect', action: () => onGenerateImage('smoke nebula cyberpunk scene') },
  ];

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const focusInput = () => inputRef.current?.focus();

  return (
    <div className="flex flex-col space-y-4 p-6 bg-black/30 backdrop-blur-2xl rounded-3xl border border-white/10 neon-glow">
      {/* Quick Media Buttons */}
      <div className="flex space-x-3">
        {quickActions.map(({ icon: Icon, label, action }, i) => (
          <button
            key={i}
            onClick={action}
            className="flex-1 cyber-button flex items-center justify-center space-x-2 p-3 text-xs font-mono uppercase tracking-wider hover:animate-pulse group"
            disabled={isLoading}
          >
            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Main Input */}
      <div className="flex items-end space-x-3 pt-2">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything... 'generate neon cyber cat' or chat normally 🔥"
          className="flex-1 bg-transparent border-none outline-none text-xl font-rajdhani tracking-wide text-white placeholder:text-white/50 py-4 resize-none max-h-24"
          disabled={isLoading}
        />
        <button
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className={cn(
            'cyber-button p-5 rounded-2xl shadow-2xl hover:shadow-neon-glow flex items-center justify-center transition-all duration-300 hover:rotate-3 hover:scale-110',
            (!input.trim() || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
