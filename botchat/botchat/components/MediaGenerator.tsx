'use client';

import { useState, useCallback } from 'react';
import { Image as LucideImage, Loader2, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaGeneratorProps {
  prompt: string;
  onMediaGenerated: (url: string) => void;
  style?: 'neon' | 'glitch' | 'cyberpunk' | 'smoke' | 'fire';
}

const MediaGenerator = ({ prompt, onMediaGenerated, style = 'cyberpunk' }: MediaGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');

  const generateMedia = useCallback(async () => {
    if (!prompt || isGenerating) return;

    setIsGenerating(true);
    try {
      // 🔥 Real Fal.ai Flux integration (add FAL_KEY to Vercel env)
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `${prompt}, cyberpunk neon glitch smoke ${style} vibes, highly detailed, 8k, cinematic lighting, Sm0ken42O style`,
          style 
        }),
      });

      const { imageUrl } = await response.json();
      setGeneratedUrl(imageUrl);
      onMediaGenerated(imageUrl);
    } catch (error) {
      console.error('Media gen error:', error);
      onMediaGenerated('Error generating media. Check FAL_KEY.');
    } finally {
      setIsGenerating(false);
    }
  }, [prompt, isGenerating, style, onMediaGenerated]);

  return (
    <div className="flex flex-col items-center space-y-3 p-6 bg-black/50 backdrop-blur-xl rounded-2xl border border-purple-500/30 neon-glow max-w-sm mx-auto">
      <button
        onClick={generateMedia}
        disabled={isGenerating}
        className={cn(
          'cyber-button flex items-center space-x-2 p-4 w-full rounded-xl',
          isGenerating && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating 🔥</span>
          </>
        ) : (
          <>
            <LucideImage className="w-5 h-5" />
            <span>Generate {style.toUpperCase()} Art</span>
          </>
        )}
      </button>
      
      {generatedUrl && (
        <div className="relative group">
          <img
            src={generatedUrl}
            alt="Generated media"
            className="w-full h-64 object-cover rounded-xl shadow-2xl neon-glow hover:scale-105 transition-all cursor-pointer"
          />
          <button
            onClick={() => window.open(generatedUrl, '_blank')}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/70 p-2 rounded-full neon-glow transition-all"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaGenerator;
