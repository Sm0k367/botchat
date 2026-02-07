import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, style = 'cyberpunk' } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    if (!process.env.FAL_KEY) {
      return NextResponse.json({ 
        error: 'FAL_KEY not set. Get free at fal.ai and add to Vercel env.' 
      }, { status: 500 });
    }

    // 🔥 Enhanced Sm0ken42O cyberpunk prompt
    const enhancedPrompt = `${prompt}, cyberpunk neon glitch smoke ${style} vibes, highly detailed, 8k, cinematic lighting, volumetric fog, emissive glow, futuristic, Sm0ken42O style, trending on artstation, unreal engine`;

    const response = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.FAL_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        image_size: 'square_hd', // 1024x1024 - fast/perf
        num_inference_steps: 28,
        seed: Math.floor(Math.random() * 1000000),
        safety_checker: 'none',
      }),
    });

    if (!response.ok) {
      throw new Error(`Fal.ai error: ${response.statusText}`);
    }

    const data = await response.json();
    const imageB64 = `data:image/png;base64,${data.images[0]}`;

    return NextResponse.json({ 
      imageUrl: imageB64,
      prompt: enhancedPrompt 
    });

  } catch (error) {
    console.error('Image gen error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate image. Check FAL_KEY or try again.' 
    }, { status: 500 });
  }
}
