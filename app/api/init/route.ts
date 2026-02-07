import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST() {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ 
        success: false, 
        error: 'Supabase not configured',
        sql: `CREATE TABLE IF NOT EXISTS war_room_context (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        content text NOT NULL,
        type text DEFAULT 'text',
        source text DEFAULT 'manual',
        created_at timestamp with time zone DEFAULT now()
      );`
      });
    }

    // Try to create the table using raw SQL via RPC
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS war_room_context (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        content text NOT NULL,
        type text DEFAULT 'text',
        source text DEFAULT 'manual',
        created_at timestamp with time zone DEFAULT now()
      );
    `;

    // Try using the query method if available
    const { error } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (error) {
      // RPC not available, return manual SQL
      return NextResponse.json({ 
        success: false, 
        message: 'Please create the table manually in Supabase SQL Editor',
        sql: createTableSQL
      });
    }

    return NextResponse.json({ success: true, message: 'Table created' });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error),
      sql: `CREATE TABLE IF NOT EXISTS war_room_context (
        id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
        content text NOT NULL,
        type text DEFAULT 'text',
        source text DEFAULT 'manual',
        created_at timestamp with time zone DEFAULT now()
      );`
    });
  }
}
