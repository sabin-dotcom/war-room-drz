import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

// GET - Fetch all context entries
export async function GET() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ entries: [], error: 'Supabase not configured' });
    }

    const { data, error } = await supabase
      .from('war_room_context')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ entries: [], error: error.message });
    }

    return NextResponse.json({ entries: data || [] });
  } catch (error) {
    console.error('Context GET error:', error);
    return NextResponse.json({ entries: [], error: 'Failed to fetch context' });
  }
}

// POST - Add new context entry
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const { content, type = 'text', source = 'manual' } = await req.json();

    if (!content) {
      return NextResponse.json({ error: 'Content required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('war_room_context')
      .insert([{ content, type, source }])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ entry: data });
  } catch (error) {
    console.error('Context POST error:', error);
    return NextResponse.json({ error: 'Failed to add context' }, { status: 500 });
  }
}

// DELETE - Remove context entry
export async function DELETE(req: NextRequest) {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('war_room_context')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Context DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete context' }, { status: 500 });
  }
}
