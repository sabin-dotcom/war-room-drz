'use client';

import { useState, useRef, useEffect } from 'react';
import { CONTRACT_TEXT, DEAL_HISTORY, CONTRACT_ISSUES } from '../lib/contract';

type Tab = 'overview' | 'stakeholders' | 'contract' | 'risks' | 'chat' | 'intel';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface DealNumbers {
  totalBudget: string;
  outstanding: string;
  humansOwnership: string;
  aimsOwnership: string;
}

export default function WarRoom() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [intelText, setIntelText] = useState('');
  const [intelItems, setIntelItems] = useState<string[]>([]);
  const [dealNumbers, setDealNumbers] = useState<DealNumbers>({
    totalBudget: '$3,000,000',
    outstanding: '$850,000',
    humansOwnership: '49%',
    aimsOwnership: '51%'
  });
  const [editingNumbers, setEditingNumbers] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('warroom-intel');
    if (saved) setIntelItems(JSON.parse(saved));
    const savedNumbers = localStorage.getItem('warroom-numbers');
    if (savedNumbers) setDealNumbers(JSON.parse(savedNumbers));
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
          message: userMessage, 
          history: messages,
          context: intelItems.join('\n\n'),
          dealNumbers
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
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

  const saveNumbers = () => {
    localStorage.setItem('warroom-numbers', JSON.stringify(dealNumbers));
    setEditingNumbers(false);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🎯' },
    { id: 'stakeholders', label: 'People', icon: '👥' },
    { id: 'contract', label: 'Contract', icon: '📜' },
    { id: 'risks', label: 'Risks', icon: '⚠️' },
    { id: 'chat', label: 'Ask AI', icon: '💬' },
    { id: 'intel', label: '+ Intel', icon: '📝' },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Dot pattern overlay */}
      <div className="fixed top-0 left-0 w-full h-96 dot-pattern pointer-events-none z-0" />
      
      {/* Header */}
      <nav className="relative z-50 w-full px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Humans.ai" className="h-10 w-auto" />
          <div>
            <h1 className="serif-font text-xl font-medium tracking-tight">War Room</h1>
            <p className="text-stone-500 text-xs">DRZ Deal — Saudi Arabia JV</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 backdrop-blur-md border border-white/40">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-stone-600">Active Negotiation</span>
        </div>
      </nav>

      <main className="relative z-10 px-4 pb-24 w-full max-w-6xl mx-auto">
        {/* Hero Card */}
        <div className="mesh-gradient-card rounded-[32px] p-8 shadow-sm border border-white/50 mb-8 relative overflow-hidden">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-white/40 mb-6">
            <span className="text-xs font-medium text-stone-600">Joint Venture Agreement</span>
          </div>
          
          <h1 className="serif-font text-4xl md:text-5xl leading-[1.1] text-stone-900 mb-4">
            Strategic Intelligence<br/>
            <span className="italic opacity-80">for the DRZ Deal.</span>
          </h1>
          
          <p className="text-stone-600 text-lg mb-6 leading-relaxed max-w-xl">
            Full contract analysis, stakeholder mapping, and negotiation strategy for the Humans AI Arabia joint venture with Dr. Zamakhshary and AIMS.
          </p>

          {/* Key Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {editingNumbers ? (
              <>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">Total Budget</span>
                  <input 
                    className="serif-font text-2xl text-stone-900 bg-transparent border-b border-stone-300 w-full"
                    value={dealNumbers.totalBudget}
                    onChange={e => setDealNumbers({...dealNumbers, totalBudget: e.target.value})}
                  />
                </div>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">Outstanding</span>
                  <input 
                    className="serif-font text-2xl text-amber-600 bg-transparent border-b border-stone-300 w-full"
                    value={dealNumbers.outstanding}
                    onChange={e => setDealNumbers({...dealNumbers, outstanding: e.target.value})}
                  />
                </div>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">Humans.ai</span>
                  <input 
                    className="serif-font text-2xl text-stone-900 bg-transparent border-b border-stone-300 w-full"
                    value={dealNumbers.humansOwnership}
                    onChange={e => setDealNumbers({...dealNumbers, humansOwnership: e.target.value})}
                  />
                </div>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">AIMS</span>
                  <input 
                    className="serif-font text-2xl text-stone-900 bg-transparent border-b border-stone-300 w-full"
                    value={dealNumbers.aimsOwnership}
                    onChange={e => setDealNumbers({...dealNumbers, aimsOwnership: e.target.value})}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">Total Budget</span>
                  <span className="serif-font text-2xl text-stone-900">{dealNumbers.totalBudget}</span>
                </div>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">Outstanding</span>
                  <span className="serif-font text-2xl text-amber-600">{dealNumbers.outstanding}</span>
                </div>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">Humans.ai</span>
                  <span className="serif-font text-2xl text-stone-900">{dealNumbers.humansOwnership}</span>
                </div>
                <div className="bg-white/50 rounded-2xl p-4">
                  <span className="text-xs text-stone-500 block mb-1">AIMS</span>
                  <span className="serif-font text-2xl text-stone-900">{dealNumbers.aimsOwnership}</span>
                </div>
              </>
            )}
          </div>
          <button 
            onClick={() => editingNumbers ? saveNumbers() : setEditingNumbers(true)}
            className="mt-4 text-sm text-stone-500 hover:text-stone-900"
          >
            {editingNumbers ? '✓ Save numbers' : '✎ Edit numbers'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto smooth-scroll pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id 
                  ? 'tab-active text-stone-900' 
                  : 'text-stone-500 hover:text-stone-900 hover:bg-white/50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-stone-100">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="serif-font text-2xl text-stone-900 mb-4">Deal Summary</h2>
                <div className="prose prose-stone max-w-none">
                  <p className="text-stone-600 leading-relaxed">
                    Joint venture between <strong>Humans.ai</strong> (technology provider) and <strong>Dr. Mohammed Zamakhshary / AIMS</strong> (Saudi partner) to create <strong>Humans AI Arabia</strong> for AI products in the Saudi market.
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-yellow rounded-[20px] p-5">
                  <h3 className="font-semibold text-stone-900 mb-2">Structure</h3>
                  <ul className="text-stone-600 text-sm space-y-1">
                    <li>• Humans AI Arabia: 51% AIMS / 49% Humans</li>
                    <li>• Partnership with NGOSH: 70% JV / 30% NGOSH</li>
                    <li>• Engineer Majid manages NGOSH relationship</li>
                  </ul>
                </div>
                <div className="card-peach rounded-[20px] p-5">
                  <h3 className="font-semibold text-stone-900 mb-2">Key Concern</h3>
                  <p className="text-stone-600 text-sm">
                    Zamakhshary hedging strategy: AI Investigation with Humans, AI Training with Egyptian company, WeCare with Răzvan (former partner who went rogue).
                  </p>
                </div>
              </div>

              <div className="card-blue rounded-[20px] p-5">
                <h3 className="font-semibold text-stone-900 mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex gap-4 text-sm">
                    <span className="text-stone-400 w-20">2023</span>
                    <span className="text-stone-600">Initial contact via Dr. OZ (Trump administration connection)</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-stone-400 w-20">Mid-2024</span>
                    <span className="text-stone-600">Răzvan Costin goes rogue, works directly with DRZ</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-stone-400 w-20">Late 2024</span>
                    <span className="text-stone-600">Edward joins as new tech partner</span>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span className="text-stone-400 w-20">Now</span>
                    <span className="text-stone-600">Contract under lawyer review (Amr & Partners)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stakeholders' && (
            <div className="space-y-4">
              <h2 className="serif-font text-2xl text-stone-900 mb-4">Key Players</h2>
              
              {[
                { name: 'Dr. Mohammed Zamakhshary (DRZ)', role: 'Saudi Partner / AIMS', color: 'card-purple', notes: 'Main decision maker. Hedging bets across multiple AI partners. "We will not commit to this budget" - wants to defer to first board meeting.' },
                { name: 'Engineer Majid', role: 'NGOSH Representative', color: 'card-blue', notes: 'Key relationship manager for NGOSH partnership. The 70/30 split goes through him.' },
                { name: 'Dr. OZ', role: 'Introducer', color: 'card-green', notes: 'Trump administration connection who introduced Humans.ai to DRZ. Political leverage.' },
                { name: 'Răzvan Costin', role: 'Former Partner (Rogue)', color: 'card-peach', notes: 'Went around Humans.ai to work directly with DRZ on WeCare. Trust broken.' },
                { name: 'Edward', role: 'New Tech Partner', color: 'card-yellow', notes: 'Replaced Răzvan. Now leading technical implementation.' },
                { name: 'Egyptian Company', role: 'Competitor', color: 'card-peach', notes: 'Got AI Training vertical. DRZ diversifying risk.' },
              ].map((person, i) => (
                <div key={i} className={`${person.color} rounded-[20px] p-5 hover:scale-[1.01] transition-transform cursor-pointer`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-stone-900">{person.name}</h3>
                    <span className="text-xs text-stone-500 bg-white/50 px-2 py-1 rounded-full">{person.role}</span>
                  </div>
                  <p className="text-stone-600 text-sm">{person.notes}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-4">
              <h2 className="serif-font text-2xl text-stone-900 mb-2">Contract Issues</h2>
              <p className="text-stone-500 text-sm mb-4">Lawyer comments from Amr & Partners review</p>
              
              {CONTRACT_ISSUES.map((issue, i) => (
                <div key={i} className="bg-stone-50 rounded-[16px] p-4 hover:bg-stone-100 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-stone-400">{issue.clause}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full severity-${issue.severity}`}>
                        {issue.severity}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-medium text-stone-900 mb-1">{issue.title}</h4>
                  <p className="text-stone-600 text-sm">{issue.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="space-y-4">
              <h2 className="serif-font text-2xl text-stone-900 mb-4">Risk Matrix</h2>
              
              {[
                { level: 'critical', title: 'Budget Non-Commitment', desc: 'DRZ explicitly stated they won\'t commit to the $3M budget until first board meeting. Creates uncertainty on project scope.' },
                { level: 'high', title: 'Partner Hedging', desc: 'DRZ working with Egyptian company (AI Training) and Răzvan (WeCare) simultaneously. Not exclusive to Humans.ai.' },
                { level: 'high', title: 'Răzvan\'s Shadow Operations', desc: 'Former partner still has DRZ relationship. May undermine Humans.ai position.' },
                { level: 'medium', title: 'IP Assignment Timing', desc: 'Contract clause 7.2 requires IP transfer before payment milestones. Risk of work without compensation.' },
                { level: 'medium', title: 'Saudi Law Jurisdiction', desc: 'All disputes under Saudi law. May be unfavorable for foreign tech company.' },
                { level: 'low', title: 'NGOSH Partnership Dependency', desc: '70/30 split relies on Engineer Majid relationship. Single point of failure.' },
              ].map((risk, i) => (
                <div key={i} className={`rounded-[16px] p-4 border-l-4 ${
                  risk.level === 'critical' ? 'bg-red-50 border-red-400' :
                  risk.level === 'high' ? 'bg-orange-50 border-orange-400' :
                  risk.level === 'medium' ? 'bg-amber-50 border-amber-400' :
                  'bg-green-50 border-green-400'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold uppercase ${
                      risk.level === 'critical' ? 'text-red-700' :
                      risk.level === 'high' ? 'text-orange-700' :
                      risk.level === 'medium' ? 'text-amber-700' :
                      'text-green-700'
                    }`}>{risk.level}</span>
                  </div>
                  <h4 className="font-medium text-stone-900 mb-1">{risk.title}</h4>
                  <p className="text-stone-600 text-sm">{risk.desc}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-4">
              <h2 className="serif-font text-2xl text-stone-900 mb-2">Ask About the Deal</h2>
              <p className="text-stone-500 text-sm mb-4">AI has full context of the 24-page contract + deal history</p>
              
              <div className="chat-container overflow-y-auto smooth-scroll space-y-3 bg-stone-50 rounded-[16px] p-4">
                {messages.length === 0 && (
                  <div className="text-center py-12 text-stone-400">
                    <p className="mb-2">Ask anything about the contract or deal</p>
                    <p className="text-sm">e.g., "What does clause 12.5 say?" or "What are Zamakhshary's main concerns?"</p>
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
                  placeholder="Ask about the contract, stakeholders, or strategy..."
                  className="flex-1 px-4 py-3 rounded-full bg-stone-100 border-0 focus:ring-2 focus:ring-stone-300 text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50 transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {activeTab === 'intel' && (
            <div className="space-y-4">
              <h2 className="serif-font text-2xl text-stone-900 mb-2">Add Context</h2>
              <p className="text-stone-500 text-sm mb-4">Add notes, meeting summaries, or new information. This gets included in AI context.</p>
              
              <textarea
                value={intelText}
                onChange={(e) => setIntelText(e.target.value)}
                placeholder="Paste meeting notes, new developments, or any relevant context..."
                className="w-full h-40 p-4 rounded-[16px] bg-stone-50 border border-stone-200 focus:ring-2 focus:ring-stone-300 text-sm resize-none"
              />
              <button
                onClick={addIntel}
                className="px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                + Add to Context
              </button>
              
              {intelItems.length > 0 && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium text-stone-900">Added Context ({intelItems.length})</h3>
                  {intelItems.map((item, i) => (
                    <div key={i} className="bg-stone-50 rounded-[12px] p-3 text-sm text-stone-600">
                      {item.slice(0, 200)}{item.length > 200 ? '...' : ''}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
