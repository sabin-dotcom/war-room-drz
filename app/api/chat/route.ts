import { NextRequest, NextResponse } from 'next/server';
import { CONTRACT_TEXT } from '@/lib/contract';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { question, userIntel, dealDataContext } = await req.json();
    
    if (!question) {
      return NextResponse.json({ error: 'Question required' }, { status: 400 });
    }

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'API key not configured. Check Vercel env vars.' }, { status: 500 });
    }

    console.log('API key present:', OPENROUTER_API_KEY.slice(0, 10) + '...');

    // Build user intel section if provided
    const userIntelSection = userIntel ? `

=== USER-ADDED INTELLIGENCE (Recent Updates) ===
${userIntel}
=== END USER INTEL ===
` : '';

    // Include deal data context (user-updated numbers)
    const dealDataSection = dealDataContext || '';

    const systemPrompt = `You are a legal contract analyst specializing in joint venture agreements. You have access to the full DRZ Joint Venture Agreement between AIMS (Dr. Zamakhshary) and Humans AG.

Your role is to:
1. Answer questions about specific clauses, terms, and provisions
2. Explain the meaning and implications of contract language
3. Highlight lawyer comments and objections from Amr & Partners
4. Point out red flags and risks from Humans AG's perspective
5. Be precise - quote exact clause numbers and text when relevant

Important context:
- This is a 50/50 JV to create "Humans AI Arabia" in Saudi Arabia
- AIMS (51%) is Dr. Zamakhshary's company
- Humans AG (49%) is Sabin's company providing AI technology
- There are significant disputes about funding (€123k/month), scope, and exit protections
- Zamakhshary's lawyers (Amr & Partners) have made many objections
- Dr. Zamakhshary personally commented that the budget is "obsolete" and wants to defer all commitments

CONTRACT TEXT:
${CONTRACT_TEXT}
${dealDataSection}
${userIntelSection}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://war-room-drz.vercel.app',
        'X-Title': 'DRZ War Room'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-haiku',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        max_tokens: 1500,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter error:', response.status, errorText);
      return NextResponse.json({ 
        error: `AI error (${response.status}): ${errorText.slice(0, 100)}` 
      }, { status: 500 });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || 'No response generated';

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
