'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CONTRACT_TEXT, CONTRACT_ISSUES } from '../lib/contract';
import { useAuth } from './components/AuthProvider';

type Tab = 'command' | 'psychology' | 'powermap' | 'intel' | 'stakeholders' | 'timeline' | 'risks' | 'contract' | 'strategy' | 'scenarios' | 'chat' | 'addcontext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function WarRoom() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('command');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [intelText, setIntelText] = useState('');
  const [intelItems, setIntelItems] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('warroom-intel');
    if (saved) setIntelItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: userMessage, 
          userIntel: intelItems.join('\n\n')
        })
      });
      const data = await res.json();
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error getting response.' }]);
    }
    setLoading(false);
  };

  const addIntel = () => {
    if (!intelText.trim()) return;
    const newItems = [...intelItems, intelText.trim()];
    setIntelItems(newItems);
    localStorage.setItem('warroom-intel', JSON.stringify(newItems));
    setIntelText('');
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'command', label: '🎯 Command Center' },
    { id: 'psychology', label: '🧠 Psychology' },
    { id: 'powermap', label: '⚡ Power Map' },
    { id: 'intel', label: '🔍 Intelligence' },
    { id: 'stakeholders', label: '👥 Stakeholders' },
    { id: 'timeline', label: '📅 Timeline' },
    { id: 'risks', label: '⚠️ Risks' },
    { id: 'contract', label: '📜 Contract' },
    { id: 'strategy', label: '♟️ Strategy' },
    { id: 'scenarios', label: '🎲 Scenarios' },
    { id: 'chat', label: '💬 AI Analyst' },
    { id: 'addcontext', label: '➕ Add Intel' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF9F6' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-0 left-0 w-full h-96 dot-pattern pointer-events-none z-0" />
      
      {/* Header */}
      <nav className="relative z-50 w-full px-6 py-4 flex justify-between items-center border-b border-stone-200 bg-[#FAF9F6]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Humans.ai" className="h-8 w-auto" />
          <div>
            <h1 className="serif-font text-lg font-medium">War Room</h1>
            <p className="text-stone-500 text-xs">DRZ Deal — Strategic Command</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-red-700">HIGH ALERT</span>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 hover:border-stone-300 transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xs font-medium text-purple-600">
                  {user?.email?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50">
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200 px-4">
        <div className="flex gap-1 overflow-x-auto smooth-scroll py-2 max-w-7xl mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'bg-white shadow-sm text-stone-900 border border-stone-200' 
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="relative z-10 px-4 py-6 w-full max-w-7xl mx-auto">
        
        {/* COMMAND CENTER TAB */}
        {activeTab === 'command' && (
          <div className="space-y-6">
            {/* Threat Level Banner */}
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-[24px] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-1">⚠️ DEAL STATUS: HIGH RISK</h2>
                  <p className="text-white/80">Multiple red flags detected. Strategic caution required.</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">3/10</div>
                  <div className="text-sm text-white/70">Trust Score</div>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-[20px] p-5 border border-stone-200">
                <div className="text-xs text-stone-500 mb-1">Outstanding Debt</div>
                <div className="text-2xl font-bold text-red-600">€246,000</div>
                <div className="text-xs text-stone-400 mt-1">Unpaid to Humans.ai</div>
              </div>
              <div className="bg-white rounded-[20px] p-5 border border-stone-200">
                <div className="text-xs text-stone-500 mb-1">Budget Commitment</div>
                <div className="text-2xl font-bold text-amber-600">€0</div>
                <div className="text-xs text-stone-400 mt-1">Deferred to "board meeting"</div>
              </div>
              <div className="bg-white rounded-[20px] p-5 border border-stone-200">
                <div className="text-xs text-stone-500 mb-1">Partners in Play</div>
                <div className="text-2xl font-bold text-purple-600">3</div>
                <div className="text-xs text-stone-400 mt-1">DRZ hedging bets</div>
              </div>
              <div className="bg-white rounded-[20px] p-5 border border-stone-200">
                <div className="text-xs text-stone-500 mb-1">Exclusivity Lock</div>
                <div className="text-2xl font-bold text-stone-900">3 years</div>
                <div className="text-xs text-stone-400 mt-1">With no guarantees</div>
              </div>
            </div>

            {/* Critical Intelligence */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Red Flags */}
              <div className="bg-white rounded-[24px] p-6 border border-red-200">
                <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
                  🚨 ACTIVE RED FLAGS
                </h3>
                <div className="space-y-3">
                  {[
                    { flag: 'Budget Commitment Refused', detail: '"We will not commit to this budget. We will commit to a mutually agreed business plan that will be approved in the 1st board meeting."', severity: 'critical' },
                    { flag: 'Partner Went Behind Your Back', detail: 'Răzvan contacted DRZ directly, offering services without Sabin\'s knowledge. DRZ entertained it.', severity: 'critical' },
                    { flag: 'Hedging with Competitors', detail: 'DRZ signed with Egyptian company for AI Training while still negotiating with Humans.ai', severity: 'high' },
                    { flag: 'Outstanding Debt Deletion', detail: 'Lawyers trying to remove €246K debt acknowledgment from contract', severity: 'high' },
                    { flag: 'Exclusivity Trap', detail: '3-year exclusivity but budget "to be determined later" = golden cage risk', severity: 'critical' },
                  ].map((item, i) => (
                    <div key={i} className={`p-3 rounded-xl ${item.severity === 'critical' ? 'bg-red-50' : 'bg-orange-50'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.severity === 'critical' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'}`}>
                          {item.severity.toUpperCase()}
                        </span>
                        <span className="font-medium text-stone-900 text-sm">{item.flag}</span>
                      </div>
                      <p className="text-xs text-stone-600">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deal Structure */}
              <div className="bg-white rounded-[24px] p-6 border border-stone-200">
                <h3 className="font-bold text-stone-900 mb-4">📊 Deal Architecture</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <div className="text-sm font-medium text-purple-800 mb-2">JV: Humans AI Arabia</div>
                    <div className="flex gap-4">
                      <div className="flex-1 text-center p-2 bg-white rounded-lg">
                        <div className="text-lg font-bold text-purple-600">51%</div>
                        <div className="text-xs text-stone-500">AIMS (DRZ)</div>
                      </div>
                      <div className="flex-1 text-center p-2 bg-white rounded-lg">
                        <div className="text-lg font-bold text-purple-600">49%</div>
                        <div className="text-xs text-stone-500">Humans.ai</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-stone-400">↓ Partners with ↓</div>
                  
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="text-sm font-medium text-blue-800 mb-2">NGOSH Partnership</div>
                    <div className="flex gap-4">
                      <div className="flex-1 text-center p-2 bg-white rounded-lg">
                        <div className="text-lg font-bold text-blue-600">70%</div>
                        <div className="text-xs text-stone-500">JV</div>
                      </div>
                      <div className="flex-1 text-center p-2 bg-white rounded-lg">
                        <div className="text-lg font-bold text-blue-600">30%</div>
                        <div className="text-xs text-stone-500">NGOSH (Gov)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-xl">
                  <div className="text-xs font-medium text-amber-800">⚠️ KEY INSIGHT</div>
                  <p className="text-xs text-amber-700 mt-1">DRZ controls board (51%). Can defer all decisions. You have minority stake with no veto power.</p>
                </div>
              </div>
            </div>

            {/* DRZ's Hedging Strategy Visualization */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-4">🎯 DRZ's Multi-Partner Strategy (Your Competition)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-green-50 border-2 border-green-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✅</span>
                    <span className="font-bold text-green-800">AI Investigation</span>
                  </div>
                  <div className="text-sm text-stone-600 mb-2">Assigned to: <strong>Humans.ai</strong></div>
                  <div className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded inline-block">PRIMARY FOCUS</div>
                  <p className="text-xs text-stone-500 mt-2">Your main value proposition. Edward built this. Working product.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-orange-50 border-2 border-orange-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">⚠️</span>
                    <span className="font-bold text-orange-800">AI Training Center</span>
                  </div>
                  <div className="text-sm text-stone-600 mb-2">Assigned to: <strong>Egyptian Company</strong></div>
                  <div className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded inline-block">LOST TO COMPETITOR</div>
                  <p className="text-xs text-stone-500 mt-2">Cloned your platform. Engineer Majid pushed this. DRZ is half-Egyptian.</p>
                </div>
                
                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">❌</span>
                    <span className="font-bold text-red-800">WeCare/ShareCare</span>
                  </div>
                  <div className="text-sm text-stone-600 mb-2">Assigned to: <strong>Răzvan Costin</strong></div>
                  <div className="text-xs text-red-700 bg-red-100 px-2 py-1 rounded inline-block">ROGUE PARTNER</div>
                  <p className="text-xs text-stone-500 mt-2">Betrayed you. Went directly to DRZ. €450K already paid. Garbage code.</p>
                </div>
              </div>
              <div className="mt-4 p-3 bg-stone-100 rounded-xl">
                <p className="text-sm text-stone-700"><strong>Pattern Recognition:</strong> DRZ is spreading risk across 3 partners. If one fails, he has backups. This reduces YOUR leverage significantly. He's not "all in" on Humans.ai.</p>
              </div>
            </div>

            {/* Immediate Actions Required */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-[24px] p-6 text-white">
              <h3 className="font-bold text-xl mb-4">🎯 IMMEDIATE ACTIONS REQUIRED</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">1. Secure Budget Floor</div>
                  <p className="text-sm text-white/80">Demand minimum €50K/month commitment BEFORE signing, regardless of board meeting.</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">2. Collect Outstanding Debt</div>
                  <p className="text-sm text-white/80">€246K must be paid or formally acknowledged in contract. Non-negotiable.</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">3. IP Protection</div>
                  <p className="text-sm text-white/80">No IP transfer until payment. Simultaneous exchange only.</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">4. Exclusivity Exit Clause</div>
                  <p className="text-sm text-white/80">Add: "If budget &lt;€X for 6 months, exclusivity terminates automatically."</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PSYCHOLOGY TAB */}
        {activeTab === 'psychology' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Psychological Profiles & Behavioral Analysis</h2>
            
            {/* DRZ Deep Profile */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-2xl">👑</div>
                  <div>
                    <h3 className="font-bold text-xl text-stone-900">Dr. Mohammed Zamakhshary (DRZ)</h3>
                    <p className="text-stone-500">Primary Decision Maker</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-500">Predictability</div>
                  <div className="text-2xl font-bold text-amber-600">4/10</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-stone-800 mb-3">🧬 Background & Identity</h4>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• <strong>Former surgeon</strong> with WORLD RECORDS in Siamese twin separations</li>
                    <li>• Trained in <strong>Canada</strong> (Western medical education, thinks globally)</li>
                    <li>• Called back by Saudi government → became <strong>Deputy Minister of Health</strong></li>
                    <li>• <strong>Half Egyptian</strong> (mother) - explains Egyptian business ties</li>
                    <li>• Lives in <strong>Diplomatic Quarter</strong> (requires government approval)</li>
                    <li>• Now runs training company - transitioned from medicine to business</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-stone-800 mb-3">🕸️ Power Network</h4>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• Personal relationships with <strong>Saudi ministers</strong></li>
                    <li>• Knows <strong>secretaries of state, deputy ministers</strong></li>
                    <li>• Connection to <strong>Dr. OZ</strong> (now Trump administration)</li>
                    <li>• <strong>Medical training contracts</strong> with Saudi government</li>
                    <li>• Business ties in <strong>Egypt</strong> through mother's side</li>
                    <li>• Introduced to Engineer Majid (NGOSH)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-3">🧠 Psychological Profile</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs font-medium text-amber-700 mb-1">PERSONALITY TYPE</div>
                    <p className="text-sm text-stone-700">Strategic Operator. High achiever (world records). Risk-averse in business (hedging with multiple partners). Values control.</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-amber-700 mb-1">DECISION STYLE</div>
                    <p className="text-sm text-stone-700">Deliberate, non-committal. Keeps options open. Will say "yes" without committing resources. Uses delay tactics ("board meeting").</p>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-amber-700 mb-1">TRUST INDICATORS</div>
                    <p className="text-sm text-stone-700">Went behind partner's back to contact Răzvan. Entertained competing offers while in negotiation. Actions don't match words.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <h5 className="font-medium text-green-800 mb-2">✅ What Motivates Him</h5>
                  <ul className="text-sm text-stone-600 space-y-1">
                    <li>• Building a legacy (training company, AI ventures)</li>
                    <li>• Staying connected to power (government relationships)</li>
                    <li>• Financial upside without financial risk</li>
                    <li>• Being seen as innovative (AI, technology)</li>
                    <li>• Control over outcomes and partners</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-xl">
                  <h5 className="font-medium text-red-800 mb-2">❌ What He Fears</h5>
                  <ul className="text-sm text-stone-600 space-y-1">
                    <li>• Being locked into bad deals (hence hedging)</li>
                    <li>• Losing money on unproven partners</li>
                    <li>• Reputational damage in Saudi circles</li>
                    <li>• Dependency on single technology provider</li>
                    <li>• Not having an exit if things go wrong</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-red-100 rounded-xl border border-red-300">
                <h5 className="font-medium text-red-800 mb-2">🚨 BEHAVIORAL RED FLAGS</h5>
                <ul className="text-sm text-stone-700 space-y-2">
                  <li><strong>1. Back-channel communication:</strong> Contacted Răzvan directly without telling Sabin, even though Sabin introduced them.</li>
                  <li><strong>2. Commitment avoidance:</strong> Explicit statement: "We will NOT commit to this budget" - pushing all risk to you.</li>
                  <li><strong>3. Parallel negotiations:</strong> Signed with Egyptian company while still negotiating with Humans.ai.</li>
                  <li><strong>4. Personal warmth ≠ business commitment:</strong> Visited Romania, BBQ with family, but still plays hardball on contract.</li>
                </ul>
              </div>
            </div>

            {/* Engineer Majid */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl">🏛️</div>
                  <div>
                    <h3 className="font-bold text-xl text-stone-900">Engineer Majid</h3>
                    <p className="text-stone-500">NGOSH Representative</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-500">Influence Level</div>
                  <div className="text-2xl font-bold text-blue-600">8/10</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-stone-800 mb-3">🎯 Role & Power</h4>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• Leads NGOSH (National Occupational Safety & Health)</li>
                    <li>• <strong>Government enforcement power</strong> - all companies must comply</li>
                    <li>• Controls which solutions get approved for compliance</li>
                    <li>• Can make or break any safety tech company in Saudi</li>
                    <li>• <strong>NOT technical</strong> - political/bureaucratic mindset</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800 mb-3">🧠 Psychology</h4>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• <strong>Risk-averse bureaucrat</strong> - wants multiple options</li>
                    <li>• Forced DRZ to sign with Egyptian company</li>
                    <li>• Doesn't care about tech quality - cares about political relationships</li>
                    <li>• Likely influenced by Egyptian business interests</li>
                    <li>• Will never put all eggs in one basket</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <p className="text-sm text-stone-700"><strong>Strategic Implication:</strong> Engineer Majid won't champion Humans.ai over others. He wants competition. Your strategy should focus on DRZ relationship, not expecting Majid to favor you.</p>
              </div>
            </div>

            {/* Răzvan Costin */}
            <div className="bg-white rounded-[24px] p-6 border border-red-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl">⚠️</div>
                  <div>
                    <h3 className="font-bold text-xl text-stone-900">Răzvan Costin</h3>
                    <p className="text-red-600 font-medium">HOSTILE ACTOR - Former CTO</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-500">Threat Level</div>
                  <div className="text-2xl font-bold text-red-600">9/10</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-stone-800 mb-3">📋 History</h4>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• Sabin's former CTO/partner in outsourcing business</li>
                    <li>• Introduced to DRZ by Sabin (betrayal of trust)</li>
                    <li>• Received <strong>€450,000</strong> for WeCare localization</li>
                    <li>• Had 6 months to deliver - <strong>"absolute garbage" code</strong></li>
                    <li>• Team "did absolutely nothing" productive</li>
                    <li>• Went directly to DRZ behind Sabin's back</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-stone-800 mb-3">🧠 Psychology</h4>
                  <ul className="space-y-2 text-sm text-stone-600">
                    <li>• <strong>Opportunist</strong> - will betray for money</li>
                    <li>• No loyalty to former partners</li>
                    <li>• Overcharges: €90K/month just for maintenance</li>
                    <li>• Uses threats: "Delete everything if not paid €200K"</li>
                    <li>• Has DRZ's ear - relationship still active</li>
                    <li>• Likely badmouthing Humans.ai to protect his position</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-red-50 rounded-xl">
                <h5 className="font-medium text-red-800 mb-2">🎯 Counter-Strategy</h5>
                <p className="text-sm text-stone-700">Document ALL of Răzvan's failures. If DRZ brings him up, be ready with: delivery timeline missed, code quality issues, €450K spent with no results. Make him radioactive. Don't attack him directly - let his track record speak.</p>
              </div>
            </div>

            {/* Edward */}
            <div className="bg-white rounded-[24px] p-6 border border-green-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl">💻</div>
                  <div>
                    <h3 className="font-bold text-xl text-stone-900">Edward ("Bedouard")</h3>
                    <p className="text-green-600 font-medium">ALLY - Tech Partner</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-stone-500">Reliability</div>
                  <div className="text-2xl font-bold text-green-600">9/10</div>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-xl">
                <h4 className="font-semibold text-green-800 mb-3">💪 Value Proposition</h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>• <strong>Closed his own company</strong> to join Humans (skin in the game)</li>
                  <li>• Built modern WeCare clone with <strong>latest technology</strong></li>
                  <li>• Developed <strong>AI Investigation platform</strong> (working product)</li>
                  <li>• Delivers on time - proven track record</li>
                  <li>• Direct contrast to Răzvan's failures</li>
                </ul>
              </div>
              
              <div className="mt-4 p-3 bg-stone-100 rounded-xl">
                <p className="text-sm text-stone-700"><strong>Negotiation Leverage:</strong> Edward is your ace. When DRZ mentions Răzvan or hesitates, show Edward's working product vs. Răzvan's €450K failure. Visual demo &gt; words.</p>
              </div>
            </div>
          </div>
        )}

        {/* POWER MAP TAB */}
        {activeTab === 'powermap' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Power Dynamics & Influence Map</h2>
            
            {/* Power Hierarchy */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-6">Influence Hierarchy</h3>
              
              <div className="flex flex-col items-center gap-4">
                {/* Top: Saudi Government */}
                <div className="w-full max-w-md p-4 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-xl text-white text-center">
                  <div className="text-xl font-bold">🏛️ Saudi Government</div>
                  <div className="text-sm opacity-80">Ultimate Authority - Sets Compliance Rules</div>
                </div>
                
                <div className="text-2xl text-stone-400">↓</div>
                
                {/* NGOSH */}
                <div className="w-full max-w-md p-4 bg-blue-500 rounded-xl text-white text-center">
                  <div className="text-xl font-bold">Engineer Majid / NGOSH</div>
                  <div className="text-sm opacity-80">Enforcement Power - Approves Solutions</div>
                  <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-xs inline-block">Forced DRZ to sign with Egyptians</div>
                </div>
                
                <div className="text-2xl text-stone-400">↓</div>
                
                {/* DRZ */}
                <div className="w-full max-w-md p-4 bg-purple-500 rounded-xl text-white text-center">
                  <div className="text-xl font-bold">Dr. Zamakhshary (DRZ)</div>
                  <div className="text-sm opacity-80">Deal Orchestrator - Controls JV</div>
                  <div className="mt-2 px-3 py-1 bg-white/20 rounded-full text-xs inline-block">51% ownership = Board control</div>
                </div>
                
                <div className="flex gap-8 w-full max-w-2xl">
                  <div className="flex-1 text-center text-stone-400">↙</div>
                  <div className="flex-1 text-center text-stone-400">↓</div>
                  <div className="flex-1 text-center text-stone-400">↘</div>
                </div>
                
                {/* Three Partners */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-2xl">
                  <div className="p-3 bg-green-100 rounded-xl text-center">
                    <div className="font-bold text-green-800">Humans.ai</div>
                    <div className="text-xs text-green-600">AI Investigation</div>
                    <div className="text-xs text-stone-500 mt-1">49% JV stake</div>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl text-center">
                    <div className="font-bold text-orange-800">Egyptians</div>
                    <div className="text-xs text-orange-600">AI Training</div>
                    <div className="text-xs text-stone-500 mt-1">Separate deal</div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-xl text-center">
                    <div className="font-bold text-red-800">Răzvan</div>
                    <div className="text-xs text-red-600">WeCare</div>
                    <div className="text-xs text-stone-500 mt-1">Legacy mess</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Leverage Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[24px] p-6 border border-green-200">
                <h3 className="font-bold text-green-800 mb-4">💪 YOUR Leverage</h3>
                <div className="space-y-3">
                  {[
                    { item: 'Working AI Investigation product', strength: 90 },
                    { item: 'Edward\'s proven delivery', strength: 85 },
                    { item: 'Dr. OZ connection (Trump admin)', strength: 70 },
                    { item: 'Răzvan\'s documented failures', strength: 75 },
                    { item: 'Technical expertise DRZ lacks', strength: 80 },
                  ].map((l, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone-700">{l.item}</span>
                        <span className="text-green-600 font-medium">{l.strength}%</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{width: `${l.strength}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-[24px] p-6 border border-red-200">
                <h3 className="font-bold text-red-800 mb-4">⚠️ DRZ's Leverage Over You</h3>
                <div className="space-y-3">
                  {[
                    { item: 'Controls 51% of JV (board decisions)', strength: 95 },
                    { item: 'Can work with Egyptians/Răzvan instead', strength: 80 },
                    { item: 'Saudi market access gate', strength: 90 },
                    { item: 'NGOSH relationship via Majid', strength: 85 },
                    { item: 'Can delay budget indefinitely', strength: 75 },
                  ].map((l, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-stone-700">{l.item}</span>
                        <span className="text-red-600 font-medium">{l.strength}%</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{width: `${l.strength}%`}} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Relationship Web */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-4">🕸️ Relationship Web & Hidden Connections</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">DRZ ↔ Egyptians</h4>
                  <p className="text-sm text-stone-600">DRZ's mother is Egyptian. Has business interests in Egypt. Natural affinity. Engineer Majid pushed this, but DRZ was open to it.</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">DRZ ↔ Răzvan</h4>
                  <p className="text-sm text-stone-600">Direct contact behind Sabin's back. Entertained Răzvan's offer despite failures. Still has active communication channel.</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">DRZ ↔ Dr. OZ</h4>
                  <p className="text-sm text-stone-600">Original introduction point. Dr. OZ now in Trump admin. Political credibility link. Can potentially be reactivated for pressure.</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">DRZ ↔ Sabin</h4>
                  <p className="text-sm text-stone-600">Personal relationship (Romania visits, BBQ, family). But warmth doesn't translate to business commitment. Compartmentalizes.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INTELLIGENCE TAB */}
        {activeTab === 'intel' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Deal Intelligence & Pattern Analysis</h2>
            
            {/* Key Quote Analysis */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-4">📢 Critical Statements Analysis</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-1 rounded">ZAMAKHSHARY</span>
                  </div>
                  <blockquote className="text-stone-800 italic mb-2">"We will not commit to this budget. We will commit to a mutually agreed business plan that will be approved in the 1st board meeting."</blockquote>
                  <div className="text-sm text-stone-600">
                    <strong>Translation:</strong> Zero financial commitment. All risk on you. "Board meeting" he controls (51%). Can defer forever.
                  </div>
                </div>
                
                <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded">CONTEXT</span>
                  </div>
                  <blockquote className="text-stone-800 italic mb-2">"After all this, he wants to invest in the company and be partners."</blockquote>
                  <div className="text-sm text-stone-600">
                    <strong>Analysis:</strong> Words vs. actions mismatch. Says "partner" but won't commit budget. Classic negotiation tactic - appear collaborative while extracting maximum value.
                  </div>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-1 rounded">SABIN'S FEAR</span>
                  </div>
                  <blockquote className="text-stone-800 italic mb-2">"I'm not afraid that he'll take me to Saudi and then drop me. I'm afraid he'll keep me CAPTIVE - if the Egyptians work out, he keeps me blocked in exclusivity. 3 years stuck in a golden cage."</blockquote>
                  <div className="text-sm text-stone-600">
                    <strong>Valid concern:</strong> 3-year exclusivity + no budget commitment = potential paralysis. DRZ gets optionality, you get locked.
                  </div>
                </div>
              </div>
            </div>

            {/* Pattern Recognition */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-4">🔍 Behavioral Patterns Detected</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">🎭 Pattern: Warm Front, Hard Back</h4>
                  <p className="text-sm text-stone-600 mb-2">DRZ maintains warm personal relationships (visits, dinners) but negotiates extremely hard on business terms. Don't confuse social warmth with business generosity.</p>
                  <div className="text-xs text-red-600 font-medium">⚠️ Risk: May use relationship to pressure concessions</div>
                </div>
                
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">🎲 Pattern: Diversification Play</h4>
                  <p className="text-sm text-stone-600 mb-2">Working with 3 partners simultaneously (Humans, Egyptians, Răzvan). Classic risk mitigation. Reduces dependency on any single partner.</p>
                  <div className="text-xs text-amber-600 font-medium">⚠️ Impact: Your leverage is diluted</div>
                </div>
                
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">⏰ Pattern: Strategic Delay</h4>
                  <p className="text-sm text-stone-600 mb-2">"Budget in first board meeting" = indefinite delay mechanism. Creates urgency for you (time investment) while preserving his optionality.</p>
                  <div className="text-xs text-red-600 font-medium">⚠️ Tactic: Sunk cost exploitation</div>
                </div>
                
                <div className="p-4 bg-stone-50 rounded-xl">
                  <h4 className="font-medium text-stone-800 mb-2">🚪 Pattern: Back-channel Operations</h4>
                  <p className="text-sm text-stone-600 mb-2">Contacted Răzvan directly without telling Sabin. Signs deals (Egyptian company) while still negotiating. Parallel tracks that you don't see.</p>
                  <div className="text-xs text-red-600 font-medium">⚠️ Trust: Low transparency</div>
                </div>
              </div>
            </div>

            {/* Financial Intelligence */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-bold text-stone-900 mb-4">💰 Financial Intelligence</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-2 text-stone-500">Item</th>
                      <th className="text-right py-2 text-stone-500">Amount</th>
                      <th className="text-left py-2 text-stone-500 pl-4">Status</th>
                      <th className="text-left py-2 text-stone-500 pl-4">Risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 text-stone-800">Outstanding debt to Humans</td>
                      <td className="py-3 text-right font-mono text-red-600">€246,000</td>
                      <td className="py-3 pl-4"><span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">UNPAID</span></td>
                      <td className="py-3 pl-4 text-xs text-stone-500">Lawyers trying to remove from contract</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 text-stone-800">Răzvan's fee (paid by DRZ)</td>
                      <td className="py-3 text-right font-mono text-stone-600">€450,000</td>
                      <td className="py-3 pl-4"><span className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded">PAID</span></td>
                      <td className="py-3 pl-4 text-xs text-stone-500">Sunk cost - garbage code delivered</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 text-stone-800">DRZ Advance</td>
                      <td className="py-3 text-right font-mono text-green-600">€90,000</td>
                      <td className="py-3 pl-4"><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">RECEIVED</span></td>
                      <td className="py-3 pl-4 text-xs text-stone-500">Already consumed</td>
                    </tr>
                    <tr className="border-b border-stone-100">
                      <td className="py-3 text-stone-800">Proposed monthly budget</td>
                      <td className="py-3 text-right font-mono text-stone-600">€123,000</td>
                      <td className="py-3 pl-4"><span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">UNCOMMITTED</span></td>
                      <td className="py-3 pl-4 text-xs text-stone-500">"Deferred to board meeting"</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-stone-800">Răzvan's ask (maintenance only)</td>
                      <td className="py-3 text-right font-mono text-red-600">€90,000/mo</td>
                      <td className="py-3 pl-4"><span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">REJECTED</span></td>
                      <td className="py-3 pl-4 text-xs text-stone-500">Would leave only €33K for all new dev</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 p-4 bg-amber-50 rounded-xl">
                <h4 className="font-medium text-amber-800 mb-2">💡 Financial Reality Check</h4>
                <p className="text-sm text-stone-700">If €123K budget is approved and Răzvan gets €90K, you have €33K to build 7 AI products. That's <strong>IMPOSSIBLE</strong>. Either cut Răzvan completely (recommended) or renegotiate the entire budget structure.</p>
              </div>
            </div>
          </div>
        )}

        {/* STAKEHOLDERS TAB */}
        {activeTab === 'stakeholders' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-4">Stakeholder Profiles</h2>
            
            {[
              { name: 'Dr. Mohammed Zamakhshary (DRZ)', role: 'Saudi Partner / AIMS', color: 'card-purple', emoji: '👑', alignment: 'Neutral-Cautious', notes: 'Former surgeon with WORLD RECORDS in Siamese twin separations. Trained in Canada, Deputy Minister of Health. Half Egyptian (mother). Lives in Diplomatic Quarter. EXTREMELY connected. Playing multiple partners against each other. Critical comment: "We will not commit to this budget."' },
              { name: 'Engineer Majid', role: 'NGOSH Representative', color: 'card-blue', emoji: '🏛️', alignment: 'Neutral', notes: 'Leads NGOSH. Government enforcement power. NOT technical - political mindset. Forced DRZ to work with Egyptians. Will not favor any single partner. Wants competition and options.' },
              { name: 'Dr. OZ', role: 'Trump Administration', color: 'card-green', emoji: '🇺🇸', alignment: 'Ally', notes: 'Original introducer. Now in Trump administration. Said: "If you want to do AI in Saudi Arabia, you should meet Dr. Zamakhshary." Potential leverage if relationship can be reactivated.' },
              { name: 'Răzvan Costin', role: 'Former CTO - HOSTILE', color: 'card-peach', emoji: '⚠️', alignment: 'Hostile', notes: 'Received €450K, delivered garbage. Went behind Sabin to DRZ directly. Threatened to "delete everything." Overcharges (€90K/month for maintenance). Still has DRZ relationship. ACTIVE THREAT.' },
              { name: 'Edward ("Bedouard")', role: 'Tech Partner', color: 'card-yellow', emoji: '💻', alignment: 'Strong Ally', notes: 'Closed his company to join Humans. Built modern WeCare clone and AI Investigation platform. DELIVERS. Proven track record. Your primary asset and Răzvan contrast.' },
              { name: 'Egyptian Company', role: 'Competitor', color: 'card-peach', emoji: '🇪🇬', alignment: 'Competitor', notes: 'Cloned Humans\' AI Training platform. Got the AI Training vertical from DRZ. Engineer Majid pushed this. DRZ\'s Egyptian connections (mother) made this easy. Reduces Humans scope.' },
              { name: 'Amr & Partners', role: 'DRZ\'s Law Firm', color: 'card-blue', emoji: '⚖️', alignment: 'Opposing', notes: 'Egyptian law firm. Provided 45+ comments trying to weaken Humans\' position. Trying to delete €246K debt acknowledgment. Rejected English law/LCIA arbitration. Pushing Saudi jurisdiction.' },
            ].map((person, i) => (
              <div key={i} className={`${person.color} rounded-[20px] p-5`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{person.emoji}</span>
                    <h3 className="font-semibold text-stone-900">{person.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      person.alignment === 'Hostile' ? 'bg-red-100 text-red-700' :
                      person.alignment === 'Strong Ally' || person.alignment === 'Ally' ? 'bg-green-100 text-green-700' :
                      person.alignment === 'Competitor' || person.alignment === 'Opposing' ? 'bg-orange-100 text-orange-700' :
                      'bg-stone-100 text-stone-700'
                    }`}>{person.alignment}</span>
                    <span className="text-xs text-stone-500 bg-white/50 px-2 py-1 rounded-full">{person.role}</span>
                  </div>
                </div>
                <p className="text-stone-600 text-sm">{person.notes}</p>
              </div>
            ))}
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Deal Timeline</h2>
            
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <div className="space-y-6">
                {[
                  { date: '2023', title: 'Initial Contact', desc: 'Dr. OZ introduces Sabin to Dr. Zamakhshary. "If you want to do AI in Saudi Arabia, you should meet Dr. Zamakhshary."', color: 'blue', type: 'positive' },
                  { date: 'Early 2024', title: 'WeCare Project Starts', desc: 'DRZ engages Răzvan Costin for WeCare localization. €450,000 fee paid through Sabin.', color: 'yellow', type: 'neutral' },
                  { date: 'Spring 2024', title: '❌ Răzvan Failure', desc: '6 months to deliver but "the mobile app code was absolute garbage." Team "did absolutely nothing."', color: 'red', type: 'negative' },
                  { date: 'Mid 2024', title: '🚨 Răzvan Goes Rogue', desc: 'Răzvan bypasses Humans.ai, writes directly to DRZ on WeCare. Offers €100K/month deal. Trust completely broken.', color: 'red', type: 'negative' },
                  { date: 'Fall 2024', title: '✅ Edward Joins', desc: 'Edward ("Bedouard") closes his company to join Humans. Builds modern WeCare clone and AI Investigation platform.', color: 'green', type: 'positive' },
                  { date: 'Late 2024', title: 'NGOSH Partnership Formed', desc: 'Deal structure: JV with NGOSH (70/30 split). Engineer Majid as key government contact.', color: 'blue', type: 'positive' },
                  { date: 'Dec 2024', title: '⚠️ Egyptian Company Signs', desc: 'DRZ signs with Egyptian company for AI Training. Claims Majid forced him. Humans loses AI Training vertical.', color: 'orange', type: 'negative' },
                  { date: 'Jan 2025', title: 'Contract Review Begins', desc: 'Amr & Partners (DRZ\'s lawyers) begin review. 45+ comments, mostly weakening Humans\' position.', color: 'yellow', type: 'neutral' },
                  { date: 'Feb 2025', title: '🔴 CURRENT: Budget Standoff', desc: 'DRZ refuses budget commitment: "We will not commit to this budget - will defer to first board meeting." Critical impasse.', color: 'red', type: 'negative' },
                ].map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        event.type === 'positive' ? 'bg-green-500' :
                        event.type === 'negative' ? 'bg-red-500' :
                        'bg-amber-500'
                      }`} />
                      {i < 8 && <div className="w-0.5 h-full bg-stone-200 my-1" />}
                    </div>
                    <div className="pb-6 flex-1">
                      <span className="text-xs text-stone-400 font-medium">{event.date}</span>
                      <h4 className="font-semibold text-stone-900">{event.title}</h4>
                      <p className="text-sm text-stone-600 mt-1">{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RISKS TAB */}
        {activeTab === 'risks' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-4">Risk Matrix</h2>
            
            {[
              { level: 'critical', title: 'Golden Cage Trap', desc: '3-year exclusivity with NO budget commitment. DRZ can keep you locked while working with Egyptians/Răzvan. You build nothing, can\'t work elsewhere.', mitigation: 'Add clause: "If monthly budget < €50K for 3 consecutive months, exclusivity automatically terminates."', probability: 'HIGH' },
              { level: 'critical', title: 'Budget Black Hole', desc: '"Budget in first board meeting" means ZERO commitment. DRZ controls 51% = controls board. Can defer forever.', mitigation: 'Demand minimum €50K/month commitment BEFORE signing, separate from board decisions.', probability: 'HIGH' },
              { level: 'critical', title: 'Debt Evaporation', desc: 'Lawyers trying to remove €246K debt acknowledgment from contract. If successful, you lose leverage and money.', mitigation: 'Non-negotiable: Debt must be in contract with payment schedule. Walk if removed.', probability: 'MEDIUM' },
              { level: 'high', title: 'IP Before Payment', desc: 'Clause 7.2 requires IP transfer before payment milestones. Could deliver work, never get paid.', mitigation: 'Renegotiate: IP transfers simultaneously with payment OR escrow arrangement.', probability: 'HIGH' },
              { level: 'high', title: 'Răzvan Sabotage', desc: 'Still has DRZ relationship. Can badmouth Humans.ai. Threatens to "delete everything." Active hostile actor.', mitigation: 'Document all failures. Have Edward\'s working demo ready. Don\'t attack - let record speak.', probability: 'MEDIUM' },
              { level: 'high', title: 'Parallel Replacement', desc: 'DRZ already working with Egyptians on AI Training. Could expand their scope to your products if you become "difficult."', mitigation: 'Deliver AI Investigation fast. Create dependency. Make switching costly.', probability: 'MEDIUM' },
              { level: 'medium', title: 'Saudi Law Jurisdiction', desc: 'All disputes governed by Saudi courts. Foreign company may face bias. Limited legal recourse.', mitigation: 'Push for LCIA arbitration or at minimum Dubai courts.', probability: 'LOW' },
            ].map((risk, i) => (
              <div key={i} className={`rounded-[16px] p-5 border-l-4 ${
                risk.level === 'critical' ? 'bg-red-50 border-red-500' :
                risk.level === 'high' ? 'bg-orange-50 border-orange-500' :
                'bg-amber-50 border-amber-500'
              }`}>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    risk.level === 'critical' ? 'bg-red-100 text-red-700' :
                    risk.level === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>{risk.level}</span>
                  <span className="text-xs text-stone-500">Probability: {risk.probability}</span>
                  <h4 className="font-semibold text-stone-900 w-full mt-1">{risk.title}</h4>
                </div>
                <p className="text-stone-600 text-sm mb-3">{risk.desc}</p>
                <div className="bg-white/60 rounded-lg p-3">
                  <span className="text-xs font-medium text-stone-500">MITIGATION:</span>
                  <p className="text-sm text-stone-700 mt-1">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTRACT TAB */}
        {activeTab === 'contract' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-2">Contract Analysis</h2>
            <p className="text-stone-500 text-sm mb-4">45+ lawyer comments from Amr & Partners review</p>
            
            {CONTRACT_ISSUES.map((issue, i) => (
              <div key={i} className="bg-white rounded-[16px] p-4 border border-stone-200 hover:border-stone-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-stone-100 px-2 py-1 rounded">{issue.clause}</span>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      issue.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      issue.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                      issue.severity === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                </div>
                <h4 className="font-medium text-stone-900 mb-1">{issue.title}</h4>
                <p className="text-stone-600 text-sm">{issue.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* STRATEGY TAB */}
        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Negotiation Strategy</h2>
            
            {/* Non-Negotiables */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-[24px] p-6 text-white">
              <h3 className="font-bold text-xl mb-4">🚫 NON-NEGOTIABLES (Walk Away Points)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">€246K Debt Acknowledgment</div>
                  <p className="text-sm text-white/80">Must remain in contract with payment schedule. If removed = no deal.</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">Minimum Budget Floor</div>
                  <p className="text-sm text-white/80">At least €50K/month guaranteed. "Board meeting" is not acceptable.</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">IP Protection</div>
                  <p className="text-sm text-white/80">No IP transfer before payment. Simultaneous exchange only.</p>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                  <div className="font-medium mb-2">Exclusivity Exit Clause</div>
                  <p className="text-sm text-white/80">If budget under threshold for 6 months, exclusivity terminates.</p>
                </div>
              </div>
            </div>

            {/* Leverage Points */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">💪 Your Leverage (Use These)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-xl">
                  <span className="font-medium text-green-800">Working AI Investigation Demo</span>
                  <p className="text-sm text-stone-600 mt-1">Edward built it. It works. Show it. Make DRZ see what he'd lose.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <span className="font-medium text-green-800">Răzvan's €450K Failure</span>
                  <p className="text-sm text-stone-600 mt-1">DRZ lost €450K on garbage code. You're the reliable alternative. Document it.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <span className="font-medium text-green-800">Dr. OZ Connection</span>
                  <p className="text-sm text-stone-600 mt-1">Trump administration backing. Political credibility in Saudi context.</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl">
                  <span className="font-medium text-green-800">Time Investment</span>
                  <p className="text-sm text-stone-600 mt-1">DRZ has 2 years invested. Switching now means starting over with new partner.</p>
                </div>
              </div>
            </div>

            {/* Tactical Moves */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">♟️ Tactical Moves</h3>
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium text-purple-800 mb-2">Tactic 1: Create Urgency</h4>
                  <p className="text-sm text-stone-600">Set deadline: "We need budget commitment by [date] or we pursue other opportunities." Make DRZ's delay strategy costly.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium text-purple-800 mb-2">Tactic 2: Demonstration &gt; Negotiation</h4>
                  <p className="text-sm text-stone-600">Every call, show working product. Visual proof beats arguments. Make him want what you have.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium text-purple-800 mb-2">Tactic 3: Name the Pattern</h4>
                  <p className="text-sm text-stone-600">"I notice budget keeps getting deferred. Help me understand what would make you comfortable committing." Force explicit discussion.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-medium text-purple-800 mb-2">Tactic 4: Reference Răzvan</h4>
                  <p className="text-sm text-stone-600">Not attacking, just facts: "The WeCare situation cost us both. Edward's approach has been different. Let's build on what works."</p>
                </div>
              </div>
            </div>

            {/* What NOT To Do */}
            <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6">
              <h3 className="font-semibold text-amber-800 mb-4">⚠️ What NOT To Do</h3>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li>• <strong>Don't accept "board meeting" budget:</strong> It's an infinite delay mechanism</li>
                <li>• <strong>Don't attack Răzvan directly:</strong> Let his failures speak. DRZ already knows</li>
                <li>• <strong>Don't confuse warmth with commitment:</strong> BBQs ≠ budget</li>
                <li>• <strong>Don't sign exclusivity without protection:</strong> Golden cage is real risk</li>
                <li>• <strong>Don't show desperation:</strong> You have alternatives too (Dr. OZ network, other markets)</li>
              </ul>
            </div>
          </div>
        )}

        {/* SCENARIOS TAB */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Scenario Planning</h2>
            
            {/* Best Case */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-[24px] p-6 text-white">
              <h3 className="font-bold text-xl mb-4">✅ BEST CASE SCENARIO</h3>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
                <p className="text-white/90">DRZ commits to €100K+/month budget. Outstanding debt paid. Exclusivity with exit clause. AI Investigation launches successfully. Egyptian company fails to deliver. DRZ consolidates with Humans.ai.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/70">Probability</div>
                  <div className="text-2xl font-bold">20%</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Upside</div>
                  <div className="text-2xl font-bold">€50M+ revenue</div>
                </div>
              </div>
            </div>

            {/* Base Case */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-[24px] p-6 text-white">
              <h3 className="font-bold text-xl mb-4">⚖️ BASE CASE SCENARIO</h3>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
                <p className="text-white/90">DRZ commits to modest budget (€50-80K/month). AI Investigation proceeds. Egyptian company handles AI Training. Coexistence model. Exclusivity limited to AI Investigation only. Debt acknowledged with payment plan.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/70">Probability</div>
                  <div className="text-2xl font-bold">50%</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Outcome</div>
                  <div className="text-2xl font-bold">€10-20M revenue</div>
                </div>
              </div>
            </div>

            {/* Worst Case */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-[24px] p-6 text-white">
              <h3 className="font-bold text-xl mb-4">❌ WORST CASE SCENARIO</h3>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4 mb-4">
                <p className="text-white/90">DRZ never commits budget. Keeps you in exclusivity while working with others. Debt removed from contract. You're locked out of Saudi market for 3 years. Egyptians and Răzvan capture all products. €246K never recovered.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/70">Probability</div>
                  <div className="text-2xl font-bold">30%</div>
                </div>
                <div>
                  <div className="text-sm text-white/70">Downside</div>
                  <div className="text-2xl font-bold">€246K loss + 3yr lock</div>
                </div>
              </div>
            </div>

            {/* Walk Away Scenario */}
            <div className="bg-white rounded-[24px] p-6 border-2 border-stone-300">
              <h3 className="font-bold text-xl mb-4 text-stone-800">🚪 WALK AWAY SCENARIO</h3>
              <div className="p-4 bg-stone-50 rounded-xl mb-4">
                <p className="text-stone-700">If non-negotiables not met: No deal. Pursue other markets (UAE, Egypt direct, other Gulf states). Use Dr. OZ connection for alternative Saudi entry. Offer AI Investigation to NGOSH competitors or other ministries.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 rounded-xl">
                  <div className="text-sm text-green-700 font-medium">PROS</div>
                  <ul className="text-xs text-stone-600 mt-1 space-y-1">
                    <li>• No 3-year exclusivity trap</li>
                    <li>• Preserve freedom to work elsewhere</li>
                    <li>• Avoid bad deal that drains resources</li>
                  </ul>
                </div>
                <div className="p-3 bg-red-50 rounded-xl">
                  <div className="text-sm text-red-700 font-medium">CONS</div>
                  <ul className="text-xs text-stone-600 mt-1 space-y-1">
                    <li>• Lose €246K (likely unrecoverable)</li>
                    <li>• 2+ years of relationship building lost</li>
                    <li>• NGOSH market harder to enter independently</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-2">AI Strategic Analyst</h2>
            <p className="text-stone-500 text-sm mb-4">Full context: 24-page contract + deal history + all stakeholder intelligence</p>
            
            <div className="h-96 overflow-y-auto smooth-scroll space-y-3 bg-stone-50 rounded-[16px] p-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-stone-400">
                  <p className="mb-2">Ask strategic questions about the deal</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['What\'s DRZ\'s likely next move?', 'How do I counter the budget delay?', 'What leverage do I have?', 'Should I walk away?'].map((q, i) => (
                      <button key={i} onClick={() => setInput(q)} className="text-xs bg-white px-3 py-1.5 rounded-full border border-stone-200 hover:border-stone-400">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-stone-900 text-white ml-auto' 
                    : 'bg-white text-stone-800 border border-stone-200'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              ))}
              {loading && (
                <div className="bg-white text-stone-800 border border-stone-200 p-3 rounded-2xl max-w-[85%]">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}} />
                    <span className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask about contract, stakeholders, strategy, scenarios..."
                className="flex-1 px-4 py-3 rounded-full bg-white border border-stone-200 focus:ring-2 focus:ring-stone-300 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
              >
                Analyze
              </button>
            </div>
          </div>
        )}

        {/* ADD CONTEXT TAB */}
        {activeTab === 'addcontext' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-2">Add Intelligence</h2>
            <p className="text-stone-500 text-sm mb-4">Add meeting notes, messages, or new intel. Gets included in AI analysis.</p>
            
            <textarea
              value={intelText}
              onChange={(e) => setIntelText(e.target.value)}
              placeholder="Paste meeting notes, WhatsApp messages, new developments..."
              className="w-full h-40 p-4 rounded-[16px] bg-white border border-stone-200 focus:ring-2 focus:ring-stone-300 text-sm resize-none"
            />
            <button
              onClick={addIntel}
              className="px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800"
            >
              + Add Intel
            </button>
            
            {intelItems.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="font-medium text-stone-900">Intelligence Database ({intelItems.length} items)</h3>
                {intelItems.map((item, i) => (
                  <div key={i} className="bg-stone-50 rounded-[12px] p-3 text-sm text-stone-600 border border-stone-100">
                    {item.slice(0, 300)}{item.length > 300 ? '...' : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
