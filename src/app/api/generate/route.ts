import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, systemPrompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    // Default system prompt for image generation
    const defaultSystemPrompt = `You are an expert AI image generator. Create high-quality, detailed images based on user prompts. Focus on artistic composition, proper lighting, and visual appeal. Generate photorealistic or artistic images as requested.`;

    const finalSystemPrompt = systemPrompt || defaultSystemPrompt;

    // Prepare the request payload for the custom endpoint
    const payload = {
      model: "replicate/black-forest-labs/flux-1.1-pro",
      messages: [
        {
          role: "system",
          content: finalSystemPrompt
        },
        {
          role: "user",
          content: `Generate an image: ${prompt.trim()}`
        }
      ]
    };

    // Make request to custom endpoint with fixed headers (no API keys required)
    const response = await fetch('https://oi-server.onrender.com/chat/completions', {
      method: 'POST',
      headers: {
        'CustomerId': 'cus_S16jfiBUH2cc7P',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer xxx'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Image generation failed: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Extract image URL from response
    let imageUrl = null;
    
    if (data?.choices?.[0]?.message?.content) {
      const content = data.choices[0].message.content;
      
      // Try to extract URL from various possible response formats
      if (typeof content === 'string') {
        // Look for URL patterns in the response
        const urlMatch = content.match(/https?:\/\/[^\s]+\.(jpg|jpeg|png|webp|gif)/i);
        if (urlMatch) {
          imageUrl = urlMatch[0];
        } else {
          // If no direct URL found, the content might be the URL itself
          if (content.startsWith('http')) {
            imageUrl = content;
          }
        }
      }
    }

    if (!imageUrl) {
      console.error('No image URL found in response:', data);
      return NextResponse.json(
        { error: 'Failed to generate image - no valid image URL received' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl,
      prompt: prompt.trim(),
      systemPrompt: finalSystemPrompt,
      model: "replicate/black-forest-labs/flux-1.1-pro",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: 'Internal server error during image generation' },
      { status: 500 }
    );
  }
}