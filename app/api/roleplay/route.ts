import { NextResponse } from 'next/server';
import { DRZ_SYSTEM_PROMPT } from '../../../lib/persona';
import { CONTRACT_TEXT } from '../../../lib/contract';

export async function POST(request: Request) {
  try {
    const { messages, userContext } = await request.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array required' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    // Build enhanced system prompt with deal context
    const enhancedSystemPrompt = `${DRZ_SYSTEM_PROMPT}

DEAL CONTEXT FOR REFERENCE:
${CONTRACT_TEXT.substring(0, 10000)}

${userContext ? `ADDITIONAL CONTEXT FROM USER:\n${userContext}` : ''}

Remember: You ARE Dr. Zamakhshary. Respond naturally as he would in a WhatsApp/call conversation. Keep responses concise but in character.`;

    // Format messages for the API
    const formattedMessages = [
      { role: 'system', content: enhancedSystemPrompt },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    ];

    // Use Claude for high-quality persona simulation
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://war-room-drz.vercel.app',
        'X-Title': 'War Room - DRZ Roleplay'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: formattedMessages,
        max_tokens: 500,
        temperature: 0.8, // Slightly higher for more natural conversation
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', errorText);
      return NextResponse.json({ error: 'AI service error' }, { status: 500 });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'No response generated.';

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Roleplay API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
