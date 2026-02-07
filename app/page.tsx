'use client';

import { useState, useRef, useEffect } from 'react';
import { CONTRACT_TEXT, CONTRACT_ISSUES } from '../lib/contract';

type Tab = 'overview' | 'dealmap' | 'stakeholders' | 'scope' | 'timeline' | 'risks' | 'contract' | 'strategy' | 'chat' | 'intel';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function WarRoom() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
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
          message: userMessage, 
          history: messages,
          context: intelItems.join('\n\n')
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: '🎯 Overview' },
    { id: 'dealmap', label: '🗺️ Deal Map' },
    { id: 'stakeholders', label: '👥 Stakeholders' },
    { id: 'scope', label: '📋 Scope of Work' },
    { id: 'timeline', label: '📅 Timeline' },
    { id: 'risks', label: '⚠️ Risk Matrix' },
    { id: 'contract', label: '📜 Contract' },
    { id: 'strategy', label: '🎯 Strategy' },
    { id: 'chat', label: '💬 Ask AI' },
    { id: 'intel', label: '➕ Add Intel' },
  ];

  return (
    <div className="min-h-screen relative">
      <div className="fixed top-0 left-0 w-full h-96 dot-pattern pointer-events-none z-0" />
      
      {/* Header */}
      <nav className="relative z-50 w-full px-6 py-4 flex justify-between items-center border-b border-stone-200 bg-[#FAF9F6]/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="Humans.ai" className="h-8 w-auto" />
          <div>
            <h1 className="serif-font text-lg font-medium">War Room</h1>
            <p className="text-stone-500 text-xs">DRZ Deal — Zamakhshary / Saudi Arabia</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-medium text-amber-700">Negotiation Phase</span>
        </div>
      </nav>

      {/* Tabs */}
      <div className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200 px-4">
        <div className="flex gap-1 overflow-x-auto smooth-scroll py-2 max-w-6xl mx-auto">
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

      <main className="relative z-10 px-4 py-6 w-full max-w-6xl mx-auto">
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Deal Summary */}
            <div className="mesh-gradient-card rounded-[24px] p-6 border border-white/50">
              <h2 className="serif-font text-2xl text-stone-900 mb-4">Deal Summary</h2>
              <p className="text-stone-600 leading-relaxed">
                Joint venture between <strong>Humans.ai</strong> and <strong>Dr. Mohammed Zamakhshary</strong> (via AIMS) to develop and sell AI products for workplace safety compliance in Saudi Arabia, in partnership with <strong>NGOSH</strong> (National Occupational Safety & Health agency).
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/60 rounded-xl p-4">
                  <span className="text-xs text-stone-500 block">Structure</span>
                  <span className="font-semibold text-stone-900">Zamakhshary + Humans = JV (51/49)</span>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <span className="text-xs text-stone-500 block">JV + NGOSH Partnership</span>
                  <span className="font-semibold text-stone-900">70% JV / 30% NGOSH</span>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <span className="text-xs text-stone-500 block">Target Company</span>
                  <span className="font-semibold text-stone-900">Humans AI Arabia</span>
                </div>
                <div className="bg-white/60 rounded-xl p-4">
                  <span className="text-xs text-stone-500 block">Jurisdiction</span>
                  <span className="font-semibold text-stone-900">KSA (Saudi Arabia)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key Financials */}
              <div className="bg-white rounded-[24px] p-6 border border-stone-200">
                <h3 className="font-semibold text-stone-900 mb-4">💰 Key Financials</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-stone-600">Outstanding owed to Humans</span>
                    <span className="font-semibold text-red-600">€246,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-stone-600">Răzvan's fee (paid by DRZ)</span>
                    <span className="font-semibold text-stone-900">€450,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-stone-600">DRZ Advance</span>
                    <span className="font-semibold text-green-600">€90,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-stone-100">
                    <span className="text-stone-600">Monthly Budget Agreement</span>
                    <span className="font-semibold text-stone-900">€123,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-stone-600">After Răzvan's cut</span>
                    <span className="font-semibold text-amber-600">€33,000 left</span>
                  </div>
                </div>
              </div>

              {/* Products & Services */}
              <div className="bg-white rounded-[24px] p-6 border border-stone-200">
                <h3 className="font-semibold text-stone-900 mb-4">🛠️ Products & Services</h3>
                <div className="space-y-3">
                  <div className="card-peach rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-stone-900">WeCare & ShareCare</span>
                        <p className="text-xs text-stone-500 mt-1">Localized platforms for workplace safety</p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">With Răzvan (legacy)</span>
                    </div>
                  </div>
                  <div className="card-blue rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-stone-900">AI Training Center</span>
                        <p className="text-xs text-stone-500 mt-1">Multi-language safety training platform</p>
                      </div>
                      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">With Egyptians</span>
                    </div>
                  </div>
                  <div className="card-green rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-stone-900">AI Investigation</span>
                        <p className="text-xs text-stone-500 mt-1">Automated incident reporting & analysis</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">PRIMARY FOCUS</span>
                    </div>
                  </div>
                  <div className="card-yellow rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-medium text-stone-900">AI Counselor</span>
                        <p className="text-xs text-stone-500 mt-1">Automated compliance reporting</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">📊 Current Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-2xl">✅</span>
                  <div>
                    <span className="font-medium text-stone-900 block">Contract negotiation</span>
                    <span className="text-xs text-stone-500">In Progress</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                  <span className="text-2xl">⏳</span>
                  <div>
                    <span className="font-medium text-stone-900 block">Lawyer review</span>
                    <span className="text-xs text-stone-500">Amr & Partners</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-2xl">🎯</span>
                  <div>
                    <span className="font-medium text-stone-900 block">Next step</span>
                    <span className="text-xs text-stone-500">Resolve budget commitment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dealmap' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Deal Structure Map</h2>
            
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <div className="flex flex-col items-center gap-4">
                {/* Top Level */}
                <div className="card-purple rounded-xl p-4 text-center w-64">
                  <span className="font-semibold text-stone-900">Dr. Zamakhshary (DRZ)</span>
                  <p className="text-xs text-stone-500 mt-1">Saudi Partner / AIMS Owner</p>
                </div>
                
                <div className="text-2xl text-stone-400">↓</div>
                
                {/* JV Level */}
                <div className="mesh-gradient-card rounded-xl p-4 text-center w-80">
                  <span className="font-semibold text-stone-900">Humans AI Arabia (JV)</span>
                  <div className="flex justify-center gap-4 mt-2">
                    <span className="text-sm bg-white/60 px-2 py-1 rounded-lg">51% AIMS</span>
                    <span className="text-sm bg-white/60 px-2 py-1 rounded-lg">49% Humans.ai</span>
                  </div>
                </div>
                
                <div className="text-2xl text-stone-400">↓</div>
                
                {/* NGOSH Partnership */}
                <div className="card-blue rounded-xl p-4 text-center w-96">
                  <span className="font-semibold text-stone-900">NGOSH Partnership</span>
                  <p className="text-xs text-stone-500 mt-1">National Occupational Safety & Health</p>
                  <div className="flex justify-center gap-4 mt-2">
                    <span className="text-sm bg-white/60 px-2 py-1 rounded-lg">70% JV</span>
                    <span className="text-sm bg-white/60 px-2 py-1 rounded-lg">30% NGOSH (Gov)</span>
                  </div>
                </div>
                
                <div className="text-2xl text-stone-400">↓</div>
                
                {/* Products */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
                  <div className="card-green rounded-xl p-3 text-center">
                    <span className="text-sm font-medium">AI Investigation</span>
                    <span className="block text-xs text-green-600">✓ Humans</span>
                  </div>
                  <div className="card-peach rounded-xl p-3 text-center">
                    <span className="text-sm font-medium">WeCare</span>
                    <span className="block text-xs text-red-600">⚠ Răzvan</span>
                  </div>
                  <div className="card-yellow rounded-xl p-3 text-center">
                    <span className="text-sm font-medium">AI Training</span>
                    <span className="block text-xs text-orange-600">⚠ Egyptians</span>
                  </div>
                  <div className="card-blue rounded-xl p-3 text-center">
                    <span className="text-sm font-medium">AI Counselor</span>
                    <span className="block text-xs text-blue-600">○ Pending</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Insight */}
            <div className="bg-amber-50 border border-amber-200 rounded-[20px] p-5">
              <h3 className="font-semibold text-amber-800 mb-2">⚠️ Critical Insight: DRZ Hedging Strategy</h3>
              <p className="text-amber-700 text-sm">
                Zamakhshary is diversifying risk by working with multiple partners: Humans.ai for AI Investigation, Egyptian company for AI Training, and Răzvan (former rogue partner) for WeCare. This reduces Humans.ai's leverage and creates competition within the same ecosystem.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stakeholders' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-4">Key Stakeholders</h2>
            
            {[
              { name: 'Dr. Mohammed Zamakhshary (DRZ)', role: 'Saudi Partner / AIMS', color: 'card-purple', emoji: '👑', notes: 'Former surgeon with WORLD RECORDS in Siamese twin separations. Trained in Canada. Called back by Saudi government, became Deputy Minister of Health. Half Egyptian (mother). Now has training company in Diplomatic Quarter. EXTREMELY connected: knows ministers, secretaries of state. Main decision maker. Critical comment: "We will not commit to this budget - will defer to first board meeting."' },
              { name: 'Engineer Majid', role: 'NGOSH Representative', color: 'card-blue', emoji: '🏛️', notes: 'Key relationship manager for NGOSH partnership. Has power to ensure all companies comply with safety regulations. The 70/30 split goes through him. Critical government connection.' },
              { name: 'Dr. OZ', role: 'Introducer / Political Connection', color: 'card-green', emoji: '🇺🇸', notes: 'Now in Trump administration. Introduced Humans.ai to DRZ. Said: "If you want to do AI in Saudi Arabia, you should meet Dr. Zamakhshary." Political leverage asset.' },
              { name: 'Răzvan Costin', role: 'Former CTO (ROGUE)', color: 'card-peach', emoji: '⚠️', notes: 'Sabin\'s former partner in outsourcing. Received €450,000 for WeCare localization. "The mobile app code was absolute garbage" - failed to deliver. Went around Humans.ai to work directly with DRZ. Trust completely broken. Still has DRZ relationship.' },
              { name: 'Edward ("Bedouard")', role: 'New Tech Partner', color: 'card-yellow', emoji: '💻', notes: 'Joined Fall 2025. Closed his similar company to join Humans. Built modern clone of WeCare with latest technology. Developed AI Investigation platform. Now leading technical implementation. Reliable replacement for Răzvan.' },
              { name: 'Egyptian Company', role: 'Competitor (AI Training)', color: 'card-peach', emoji: '🇪🇬', notes: 'Got AI Training vertical from DRZ. Part of Zamakhshary\'s hedging strategy. Reduces Humans.ai scope.' },
              { name: 'Amr & Partners', role: 'Law Firm', color: 'card-blue', emoji: '⚖️', notes: 'Reviewing the JV contract. Provided 45+ comments on various clauses. Key issues flagged around IP, jurisdiction, and budget commitments.' },
            ].map((person, i) => (
              <div key={i} className={`${person.color} rounded-[20px] p-5`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{person.emoji}</span>
                    <h3 className="font-semibold text-stone-900">{person.name}</h3>
                  </div>
                  <span className="text-xs text-stone-500 bg-white/50 px-2 py-1 rounded-full">{person.role}</span>
                </div>
                <p className="text-stone-600 text-sm">{person.notes}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'scope' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Scope of Work</h2>
            
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">7 AI Products Requested by NGOSH</h3>
              <div className="space-y-4">
                {[
                  { name: 'AI Investigation', desc: 'Automated incident reporting & root cause analysis', status: 'In Development', owner: 'Humans.ai (Edward)', color: 'green' },
                  { name: 'AI Training Center', desc: 'Multi-language safety training platform with AI-generated content', status: 'With Egyptians', owner: 'Egyptian Company', color: 'orange' },
                  { name: 'AI Counselor', desc: 'Automated compliance reporting and advisory', status: 'Planned', owner: 'Humans.ai', color: 'blue' },
                  { name: 'WeCare/ShareCare', desc: 'Localized workplace safety platform', status: 'Legacy - Failed', owner: 'Răzvan (failed delivery)', color: 'red' },
                  { name: 'Risk Assessment AI', desc: 'Predictive workplace hazard identification', status: 'Planned', owner: 'TBD', color: 'gray' },
                  { name: 'Compliance Dashboard', desc: 'Real-time regulatory compliance monitoring', status: 'Planned', owner: 'TBD', color: 'gray' },
                  { name: 'Incident Prediction', desc: 'ML-based accident prevention system', status: 'Planned', owner: 'TBD', color: 'gray' },
                ].map((product, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-stone-50 rounded-xl">
                    <div>
                      <span className="font-medium text-stone-900">{product.name}</span>
                      <p className="text-xs text-stone-500 mt-1">{product.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.color === 'green' ? 'bg-green-100 text-green-700' :
                        product.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                        product.color === 'red' ? 'bg-red-100 text-red-700' :
                        product.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                        'bg-stone-100 text-stone-600'
                      }`}>{product.status}</span>
                      <p className="text-xs text-stone-400 mt-1">{product.owner}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">Revenue Potential</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <span className="serif-font text-3xl text-green-700">€50M+</span>
                  <p className="text-xs text-stone-500 mt-1">Estimated total potential</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <span className="serif-font text-3xl text-blue-700">1M+</span>
                  <p className="text-xs text-stone-500 mt-1">Companies in Saudi Arabia</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <span className="serif-font text-3xl text-purple-700">Mandatory</span>
                  <p className="text-xs text-stone-500 mt-1">NGOSH compliance required</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Deal Timeline</h2>
            
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <div className="space-y-6">
                {[
                  { date: '2023', title: 'Initial Contact', desc: 'Dr. OZ introduces Sabin to Dr. Zamakhshary. "If you want to do AI in Saudi Arabia, you should meet Dr. Zamakhshary."', color: 'blue' },
                  { date: 'Early 2024', title: 'WeCare Project Starts', desc: 'DRZ engages Răzvan Costin for WeCare localization. €450,000 fee paid through Sabin.', color: 'yellow' },
                  { date: 'Spring 2024', title: 'Răzvan Failure', desc: '6 months to deliver but "the mobile app code was absolute garbage." Team "did absolutely nothing."', color: 'red' },
                  { date: 'Mid 2024', title: 'Răzvan Goes Rogue', desc: 'Răzvan bypasses Humans.ai, works directly with DRZ on WeCare. Trust broken.', color: 'red' },
                  { date: 'Fall 2024', title: 'Edward Joins', desc: 'Edward ("Bedouard") closes his company to join Humans. Builds modern WeCare clone and AI Investigation platform.', color: 'green' },
                  { date: 'Late 2024', title: 'NGOSH Partnership', desc: 'Deal structure finalized: JV with NGOSH (70/30 split). Engineer Majid as key contact.', color: 'blue' },
                  { date: 'Jan 2025', title: 'Contract Review', desc: 'Amr & Partners begins legal review. 45+ comments on JV agreement.', color: 'yellow' },
                  { date: 'Feb 2025', title: 'Current: Negotiation', desc: 'Resolving lawyer comments. Critical issue: DRZ won\'t commit to budget until first board meeting.', color: 'amber' },
                ].map((event, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-4 h-4 rounded-full ${
                        event.color === 'green' ? 'bg-green-500' :
                        event.color === 'red' ? 'bg-red-500' :
                        event.color === 'yellow' ? 'bg-yellow-500' :
                        event.color === 'amber' ? 'bg-amber-500' :
                        'bg-blue-500'
                      }`} />
                      {i < 7 && <div className="w-0.5 h-full bg-stone-200 my-1" />}
                    </div>
                    <div className="pb-6">
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

        {activeTab === 'risks' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-4">Risk Matrix</h2>
            
            {[
              { level: 'critical', title: 'Budget Non-Commitment', desc: 'DRZ explicitly stated: "We will not commit to this budget. We will commit to a mutually agreed business plan that will be approved in the 1st board meeting." Creates massive uncertainty on project scope and resource allocation.', mitigation: 'Push for minimum guaranteed commitment or milestone-based funding.' },
              { level: 'critical', title: 'Partner Hedging Strategy', desc: 'DRZ working with 3 different partners simultaneously: Humans (AI Investigation), Egyptians (AI Training), Răzvan (WeCare). This dilutes Humans.ai\'s position and creates internal competition.', mitigation: 'Negotiate exclusivity for core products or first-right-of-refusal.' },
              { level: 'high', title: 'Răzvan Shadow Operations', desc: 'Former partner still has direct relationship with DRZ. Failed to deliver but retained trust. May continue to undermine Humans.ai position or provide competing solutions.', mitigation: 'Document Răzvan\'s failures, establish clear boundaries in contract.' },
              { level: 'high', title: 'IP Assignment Before Payment', desc: 'Contract clause 7.2 requires IP transfer before payment milestones are reached. Risk of delivering work without receiving compensation.', mitigation: 'Renegotiate to simultaneous IP transfer and payment, or escrow arrangement.' },
              { level: 'high', title: 'Outstanding Payment (€246K)', desc: '€246,000 owed to Humans.ai for prior work. Payment timeline unclear. Appendix 5 gives only 5 business days after trigger event.', mitigation: 'Secure payment schedule as precondition to new agreement.' },
              { level: 'medium', title: 'Saudi Law Jurisdiction', desc: 'All disputes governed by Saudi law and courts. May be unfavorable for foreign technology company. Limited legal recourse options.', mitigation: 'Consider arbitration clause (ICC/LCIA) or Dubai courts as alternative.' },
              { level: 'medium', title: 'NGOSH Dependency', desc: '70/30 split and mandatory compliance model relies entirely on NGOSH relationship managed by Engineer Majid. Single point of failure.', mitigation: 'Build direct relationships within NGOSH, document all commitments.' },
              { level: 'low', title: 'Technical Delivery Risk', desc: 'Edward\'s team must deliver 7 products. Complexity is high but team has proven capable with AI Investigation.', mitigation: 'Phase delivery, start with proven products, expand gradually.' },
            ].map((risk, i) => (
              <div key={i} className={`rounded-[16px] p-5 border-l-4 ${
                risk.level === 'critical' ? 'bg-red-50 border-red-500' :
                risk.level === 'high' ? 'bg-orange-50 border-orange-500' :
                risk.level === 'medium' ? 'bg-amber-50 border-amber-500' :
                'bg-green-50 border-green-500'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                    risk.level === 'critical' ? 'bg-red-100 text-red-700' :
                    risk.level === 'high' ? 'bg-orange-100 text-orange-700' :
                    risk.level === 'medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-green-100 text-green-700'
                  }`}>{risk.level}</span>
                  <h4 className="font-semibold text-stone-900">{risk.title}</h4>
                </div>
                <p className="text-stone-600 text-sm mb-3">{risk.desc}</p>
                <div className="bg-white/50 rounded-lg p-3">
                  <span className="text-xs font-medium text-stone-500">MITIGATION:</span>
                  <p className="text-sm text-stone-700 mt-1">{risk.mitigation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

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

        {activeTab === 'strategy' && (
          <div className="space-y-6">
            <h2 className="serif-font text-2xl text-stone-900">Negotiation Strategy</h2>
            
            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">🎯 Primary Objectives</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl">
                  <span className="text-xl">1️⃣</span>
                  <div>
                    <span className="font-medium text-stone-900">Secure Budget Commitment</span>
                    <p className="text-sm text-stone-600 mt-1">Push DRZ to commit to minimum budget before board meeting, or establish clear milestone-based funding triggers.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                  <span className="text-xl">2️⃣</span>
                  <div>
                    <span className="font-medium text-stone-900">Resolve Outstanding Payment</span>
                    <p className="text-sm text-stone-600 mt-1">Get €246,000 owed paid before or concurrent with new agreement signing.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-xl">
                  <span className="text-xl">3️⃣</span>
                  <div>
                    <span className="font-medium text-stone-900">Protect IP Rights</span>
                    <p className="text-sm text-stone-600 mt-1">Renegotiate clause 7.2 to ensure IP transfer happens simultaneously with payment, not before.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[24px] p-6 border border-stone-200">
              <h3 className="font-semibold text-stone-900 mb-4">💪 Leverage Points</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card-green rounded-xl p-4">
                  <span className="font-medium text-stone-900">Dr. OZ Connection</span>
                  <p className="text-sm text-stone-600 mt-1">Trump administration relationship provides political backing and credibility.</p>
                </div>
                <div className="card-blue rounded-xl p-4">
                  <span className="font-medium text-stone-900">Working AI Investigation</span>
                  <p className="text-sm text-stone-600 mt-1">Edward's team has delivered. Proven capability vs. Răzvan's failure.</p>
                </div>
                <div className="card-yellow rounded-xl p-4">
                  <span className="font-medium text-stone-900">Răzvan's Failure Record</span>
                  <p className="text-sm text-stone-600 mt-1">€450K spent with nothing to show. DRZ needs a reliable partner.</p>
                </div>
                <div className="card-purple rounded-xl p-4">
                  <span className="font-medium text-stone-900">NGOSH Mandate</span>
                  <p className="text-sm text-stone-600 mt-1">Compliance is mandatory. 1M+ companies must use approved solutions.</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6">
              <h3 className="font-semibold text-amber-800 mb-4">⚠️ Watch Out For</h3>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li>• DRZ using Egyptian company as leverage to lower Humans.ai's scope/pricing</li>
                <li>• Răzvan attempting to re-engage or badmouth Humans.ai to DRZ</li>
                <li>• Budget deferral becoming indefinite postponement</li>
                <li>• IP assignment clause being used to extract work without payment</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-2">Ask About the Deal</h2>
            <p className="text-stone-500 text-sm mb-4">AI has full context of the 24-page contract + deal history + all stakeholder info</p>
            
            <div className="h-96 overflow-y-auto smooth-scroll space-y-3 bg-stone-50 rounded-[16px] p-4">
              {messages.length === 0 && (
                <div className="text-center py-12 text-stone-400">
                  <p className="mb-2">Ask anything about the contract or deal</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['What does clause 12.5 say?', 'Summarize Zamakhshary\'s concerns', 'What leverage do we have?', 'Explain the NGOSH partnership'].map((q, i) => (
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
                placeholder="Ask about the contract, stakeholders, or strategy..."
                className="flex-1 px-4 py-3 rounded-full bg-white border border-stone-200 focus:ring-2 focus:ring-stone-300 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {activeTab === 'intel' && (
          <div className="space-y-4">
            <h2 className="serif-font text-2xl text-stone-900 mb-2">Add Intelligence</h2>
            <p className="text-stone-500 text-sm mb-4">Add meeting notes, new developments, or context. This gets included when you ask the AI questions.</p>
            
            <textarea
              value={intelText}
              onChange={(e) => setIntelText(e.target.value)}
              placeholder="Paste meeting notes, new developments, or any relevant context..."
              className="w-full h-40 p-4 rounded-[16px] bg-white border border-stone-200 focus:ring-2 focus:ring-stone-300 text-sm resize-none"
            />
            <button
              onClick={addIntel}
              className="px-6 py-3 rounded-full bg-stone-900 text-white text-sm font-medium hover:bg-stone-800"
            >
              + Add to Context
            </button>
            
            {intelItems.length > 0 && (
              <div className="mt-6 space-y-2">
                <h3 className="font-medium text-stone-900">Added Context ({intelItems.length})</h3>
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
