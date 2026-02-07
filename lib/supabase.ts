import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cxnwxquosiudobmztcpy.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface IntelEntry {
  id?: string
  content: string
  category: string
  created_at?: string
}

export async function getIntelEntries(): Promise<IntelEntry[]> {
  const { data, error } = await supabase
    .from('war_room_intel')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching intel:', error)
    return []
  }
  return data || []
}

export async function addIntelEntry(content: string, category: string): Promise<IntelEntry | null> {
  const { data, error } = await supabase
    .from('war_room_intel')
    .insert([{ content, category }])
    .select()
    .single()
  
  if (error) {
    console.error('Error adding intel:', error)
    return null
  }
  return data
}

export async function deleteIntelEntry(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('war_room_intel')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting intel:', error)
    return false
  }
  return true
}
