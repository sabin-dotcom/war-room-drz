export interface DealData {
  // Financials
  monthlyBudget: number
  outstandingAmount: number
  razvanAsk: number
  paidToRazvan: number
  
  // Ownership
  aimsOwnership: number
  humansOwnership: number
  ngoshSplit: number
  jvSplit: number
  
  // Status
  aiInvestigationProgress: number
  aiTrainingProgress: number
  aiCounselorProgress: number
  wecareProgress: number
  
  // Key dates
  lastUpdated: string
  
  // Custom notes that override default text
  customNotes: Record<string, string>
}

const DEFAULT_DATA: DealData = {
  monthlyBudget: 123000,
  outstandingAmount: 246000,
  razvanAsk: 90000,
  paidToRazvan: 450000,
  
  aimsOwnership: 51,
  humansOwnership: 49,
  ngoshSplit: 30,
  jvSplit: 70,
  
  aiInvestigationProgress: 80,
  aiTrainingProgress: 50,
  aiCounselorProgress: 20,
  wecareProgress: 90,
  
  lastUpdated: new Date().toISOString(),
  customNotes: {}
}

const STORAGE_KEY = 'war_room_deal_data'

export function getDealData(): DealData {
  if (typeof window === 'undefined') return DEFAULT_DATA
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return { ...DEFAULT_DATA, ...JSON.parse(stored) }
  }
  return DEFAULT_DATA
}

export function updateDealData(updates: Partial<DealData>): DealData {
  const current = getDealData()
  const updated = { 
    ...current, 
    ...updates,
    lastUpdated: new Date().toISOString()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function resetDealData(): DealData {
  localStorage.removeItem(STORAGE_KEY)
  return DEFAULT_DATA
}

export function getDealDataAsContext(data: DealData): string {
  return `
=== CURRENT DEAL DATA (User-Updated Values) ===
Monthly Budget: €${data.monthlyBudget.toLocaleString()}
Outstanding Amount Owed to Humans: €${data.outstandingAmount.toLocaleString()}
Paid to Răzvan Costin: €${data.paidToRazvan.toLocaleString()}
Răzvan's Current Ask: €${data.razvanAsk.toLocaleString()}/month

Ownership Split:
- AIMS (Zamakhshary): ${data.aimsOwnership}%
- Humans AG: ${data.humansOwnership}%
- NGOSH Partnership: ${data.jvSplit}% JV / ${data.ngoshSplit}% NGOSH

Project Progress:
- AI Investigation: ${data.aiInvestigationProgress}%
- AI Training Center: ${data.aiTrainingProgress}%
- AI Counselor: ${data.aiCounselorProgress}%
- WeCare Platform: ${data.wecareProgress}%

Last Updated: ${new Date(data.lastUpdated).toLocaleString()}
=== END CURRENT DEAL DATA ===
`
}
