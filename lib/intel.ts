export interface IntelEntry {
  id: string
  content: string
  category: string
  created_at: string
}

const STORAGE_KEY = 'war_room_intel'

export function getIntelEntries(): IntelEntry[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function addIntelEntry(content: string, category: string): IntelEntry {
  const entries = getIntelEntries()
  const newEntry: IntelEntry = {
    id: Date.now().toString(),
    content,
    category,
    created_at: new Date().toISOString()
  }
  entries.unshift(newEntry)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  return newEntry
}

export function deleteIntelEntry(id: string): boolean {
  const entries = getIntelEntries()
  const filtered = entries.filter(e => e.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  return true
}

export function getAllIntelAsText(): string {
  const entries = getIntelEntries()
  if (entries.length === 0) return ''
  
  return entries.map(e => {
    const date = new Date(e.created_at).toLocaleDateString()
    return `[${date}] [${e.category}] ${e.content}`
  }).join('\n\n')
}
