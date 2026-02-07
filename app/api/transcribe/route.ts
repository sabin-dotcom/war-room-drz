import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert to base64 for Whisper API or use OpenRouter's transcription
    const arrayBuffer = await audioFile.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');

    // Use OpenAI Whisper via OpenRouter or direct
    // For now, return a message that audio needs local transcription
    // In production, you'd send to Whisper API
    
    // Try using Groq's Whisper (faster)
    const whisperResponse = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY || ''}`,
      },
      body: formData // Pass the original form data
    });

    if (!whisperResponse.ok) {
      // Fallback message
      return NextResponse.json({ 
        error: 'Audio transcription not configured. Please add text manually or set up GROQ_API_KEY.',
        needsManualTranscription: true
      }, { status: 400 });
    }

    const result = await whisperResponse.json();
    return NextResponse.json({ transcript: result.text });
  } catch (error) {
    console.error('Transcribe error:', error);
    return NextResponse.json({ 
      error: 'Transcription failed. Add the content as text instead.',
      needsManualTranscription: true
    }, { status: 500 });
  }
}
