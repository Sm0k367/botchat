// lib/groq.ts
import Groq from 'groq-sdk';

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is required');
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fire tools for media gen (Fal.ai integration - add FAL_KEY to Vercel env for real gen)
const tools = [
  {
    type: 'function',
    function: {
      name: 'generate_image',
      description: 'Generate cyberpunk/neon/glitch/smoke style images from prompt. Perfect for Sm0ken42O vibes.',
      parameters: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'Detailed image prompt with neon, cyberpunk, glitch, smoke effects.',
          },
          style: {
            type: 'string',
            enum: ['neon', 'glitch', 'cyberpunk', 'smoke', 'fire'],
            description: 'Art style (default: cyberpunk)',
          },
        },
        required: ['prompt'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'generate_video',
      description: 'Generate short glitchy cyberpunk videos (8s max).',
      parameters: {
        type: 'object',
        properties: {
          prompt: { type: 'string', description: 'Video prompt' },
        },
        required: ['prompt'],
      },
    },
  },
];

export async function chatStream(
  messages: Array<{ role: 'user' | 'assistant' | 'system' | 'tool'; content: string; tool_calls?: any[] }>,
  streamHandler: (chunk: string) => void
) {
  const stream = await groq.chat.completions.create({
    model: 'llama-3-groq-70b-versatile-tool-use-preview', // 🔥 Tool-enabled Llama3 for media gen
    messages,
    tools,
    tool_choice: 'auto',
    stream: true,
    temperature: 0.8,
    top_p: 0.9,
  });

  let fullContent = '';
  let toolCallActive = false;

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      fullContent += delta;
      streamHandler(delta);
    }

    // Handle tool calls (image/video gen)
    const toolCalls = chunk.choices[0]?.delta?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      toolCallActive = true;
      // In real app, parse & call Fal.ai here, stream result back
      streamHandler('\n🔥 Generating media... (Fal.ai integration)');
    }
  }

  return { content: fullContent, tool_calls: toolCallActive };
}
