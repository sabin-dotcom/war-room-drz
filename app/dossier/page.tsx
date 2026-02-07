'use client';

import { useState } from 'react';
import { INTELLIGENCE_DOSSIER } from '../../lib/intelligence-dossier';
import Link from 'next/link';

type ViewMode = 'network' | 'timeline' | 'psych' | 'financial' | 'intel';

export default function DossierVisualization() {
  const [viewMode, setViewMode] = useState<ViewMode>('network');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showClassified, setShowClassified] = useState(false);

  const d = INTELLIGENCE_DOSSIER;

  // Network nodes
  const networkNodes = [
    // Center - DRZ
    { id: 'drz', x: 50, y: 50, type: 'subject', label: 'Dr. Zamakhshary', size: 'lg' },
    
    // Family
    { id: 'mother', x: 30, y: 30, type: 'family', label: 'Mother (Egyptian)', size: 'sm' },
    { id: 'wife', x: 70, y: 25, type: 'family', label: 'Wife & Children', size: 'sm' },
    
    // Business
    { id: 'ahs', x: 75, y: 45, type: 'business', label: 'AHS (CEO)', size: 'md' },
    { id: 'humans', x: 25, y: 55, type: 'business', label: 'Humans.ai', size: 'md' },
    { id: 'egyptians', x: 20, y: 75, type: 'hostile', label: 'Egyptian Co.', size: 'md' },
    { id: 'razvan', x: 35, y: 85, type: 'hostile', label: 'Răzvan Costin', size: 'md' },
    
    // Government
    { id: 'ngosh', x: 80, y: 70, type: 'government', label: 'NGOSH', size: 'md' },
    { id: 'majid', x: 90, y: 60, type: 'government', label: 'Eng. Majid', size: 'sm' },
    { id: 'moh', x: 85, y: 30, type: 'government', label: 'Min. of Health', size: 'sm' },
    
    // International
    { id: 'droz', x: 15, y: 35, type: 'political', label: 'Dr. OZ (Trump)', size: 'sm' },
    { id: 'eha', x: 10, y: 55, type: 'business', label: 'Egyptian Health Auth.', size: 'sm' },
    { id: 'hopkins', x: 60, y: 20, type: 'education', label: 'Johns Hopkins', size: 'sm' },
    { id: 'toronto', x: 45, y: 15, type: 'education', label: 'U of Toronto', size: 'sm' },
    { id: 'dalhousie', x: 30, y: 12, type: 'education', label: 'Dalhousie U', size: 'sm' },
  ];

  // Connections
  const connections = [
    // Family
    { from: 'drz', to: 'mother', type: 'family', label: 'Son' },
    { from: 'drz', to: 'wife', type: 'family', label: 'Husband' },
    { from: 'mother', to: 'eha', type: 'indirect', label: 'Egyptian ties' },
    { from: 'mother', to: 'egyptians', type: 'indirect', label: 'Cultural link' },
    
    // Business
    { from: 'drz', to: 'ahs', type: 'owns', label: 'Chairman/CEO' },
    { from: 'drz', to: 'humans', type: 'negotiating', label: 'JV 51/49' },
    { from: 'drz', to: 'egyptians', type: 'parallel', label: 'AI Training deal' },
    { from: 'drz', to: 'razvan', type: 'hostile', label: 'Back-channel' },
    { from: 'ahs', to: 'eha', type: 'partnership', label: 'Training collab' },
    { from: 'ahs', to: 'hopkins', type: 'partnership', label: 'Accreditation' },
    
    // Government
    { from: 'drz', to: 'ngosh', type: 'business', label: '70/30 split' },
    { from: 'drz', to: 'majid', type: 'relationship', label: 'Key contact' },
    { from: 'drz', to: 'moh', type: 'former', label: 'Deputy Minister' },
    { from: 'majid', to: 'ngosh', type: 'controls', label: 'Leads' },
    { from: 'majid', to: 'egyptians', type: 'forced', label: 'Pushed deal' },
    
    // Political
    { from: 'drz', to: 'droz', type: 'connection', label: 'Introduced by' },
    { from: 'droz', to: 'humans', type: 'introduced', label: 'Introduced' },
    
    // Education
    { from: 'drz', to: 'toronto', type: 'education', label: 'Fellowship' },
    { from: 'drz', to: 'dalhousie', type: 'education', label: 'Residency' },
  ];

  const getNodeColor = (type: string) => {
    switch(type) {
      case 'subject': return 'bg-red-500';
      case 'family': return 'bg-pink-400';
      case 'business': return 'bg-blue-500';
      case 'hostile': return 'bg-orange-500';
      case 'government': return 'bg-emerald-500';
      case 'political': return 'bg-purple-500';
      case 'education': return 'bg-cyan-400';
      default: return 'bg-gray-500';
    }
  };

  const getConnectionColor = (type: string) => {
    switch(type) {
      case 'family': return 'stroke-pink-400';
      case 'owns': return 'stroke-blue-400';
      case 'negotiating': return 'stroke-yellow-400';
      case 'parallel': return 'stroke-orange-400';
      case 'hostile': return 'stroke-red-500';
      case 'partnership': return 'stroke-green-400';
      case 'relationship': return 'stroke-emerald-400';
      case 'former': return 'stroke-gray-400';
      case 'connection': return 'stroke-purple-400';
      case 'education': return 'stroke-cyan-400';
      case 'controls': return 'stroke-emerald-500';
      case 'forced': return 'stroke-orange-500';
      case 'introduced': return 'stroke-purple-300';
      case 'indirect': return 'stroke-gray-500';
      default: return 'stroke-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white text-sm">← War Room</Link>
            <div className="h-6 w-px bg-slate-700" />
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="font-mono text-sm text-red-400">CLASSIFIED</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">INTEL-SYS v2.4</span>
            <button 
              onClick={() => setShowClassified(!showClassified)}
              className={`px-3 py-1 text-xs rounded font-mono ${showClassified ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'}`}
            >
              {showClassified ? '🔓 DECLASSIFIED' : '🔒 SHOW ALL'}
            </button>
          </div>
        </div>
      </header>

      {/* Subject Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 rounded-lg bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-6xl">
              👤
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">Dr. Mohammed Fouad Zamakhshary</h1>
                <span className="px-2 py-0.5 bg-red-600 text-xs font-bold rounded">HIGH PRIORITY</span>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-slate-400 mb-3">
                <span>📍 Diplomatic Quarter, Riyadh</span>
                <span>•</span>
                <span>🎂 Age: 55-62</span>
                <span>•</span>
                <span>🏛️ Former Deputy Minister of Health</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">MD</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">MEd</span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">FRCSC</span>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">7,433 Citations</span>
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">Saudi-Egyptian</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">TRUST SCORE</div>
              <div className="text-5xl font-bold text-amber-500">3<span className="text-2xl text-slate-600">/10</span></div>
              <div className="text-xs text-amber-500 mt-1">⚠️ CAUTION</div>
            </div>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {[
              { id: 'network', label: '🕸️ Network Map', icon: '🕸️' },
              { id: 'timeline', label: '📅 Timeline', icon: '📅' },
              { id: 'psych', label: '🧠 Psych Profile', icon: '🧠' },
              { id: 'financial', label: '💰 Financial', icon: '💰' },
              { id: 'intel', label: '🔍 Raw Intel', icon: '🔍' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as ViewMode)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  viewMode === tab.id 
                    ? 'text-white border-b-2 border-blue-500 bg-slate-800/50' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Network Map View */}
        {viewMode === 'network' && (
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Relationship Network</h2>
                <div className="flex gap-2 text-xs">
                  {[
                    { color: 'bg-red-500', label: 'Subject' },
                    { color: 'bg-pink-400', label: 'Family' },
                    { color: 'bg-blue-500', label: 'Business' },
                    { color: 'bg-emerald-500', label: 'Government' },
                    { color: 'bg-orange-500', label: 'Hostile/Competitor' },
                    { color: 'bg-purple-500', label: 'Political' },
                    { color: 'bg-cyan-400', label: 'Education' },
                  ].map(leg => (
                    <div key={leg.label} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${leg.color}`} />
                      <span className="text-slate-500">{leg.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Network Visualization */}
              <div className="relative h-[600px] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
                  backgroundSize: '30px 30px'
                }} />
                
                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {connections.map((conn, i) => {
                    const from = networkNodes.find(n => n.id === conn.from);
                    const to = networkNodes.find(n => n.id === conn.to);
                    if (!from || !to) return null;
                    
                    const isDashed = ['indirect', 'former'].includes(conn.type);
                    
                    return (
                      <g key={i}>
                        <line
                          x1={`${from.x}%`}
                          y1={`${from.y}%`}
                          x2={`${to.x}%`}
                          y2={`${to.y}%`}
                          className={`${getConnectionColor(conn.type)} opacity-40`}
                          strokeWidth="2"
                          strokeDasharray={isDashed ? '5,5' : undefined}
                        />
                        <text
                          x={`${(from.x + to.x) / 2}%`}
                          y={`${(from.y + to.y) / 2}%`}
                          className="fill-slate-600 text-[8px]"
                          textAnchor="middle"
                          dy="-5"
                        >
                          {conn.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
                
                {/* Nodes */}
                {networkNodes.map(node => (
                  <div
                    key={node.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                      selectedNode === node.id ? 'z-20 scale-110' : 'z-10'
                    }`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
                  >
                    <div className={`
                      ${node.size === 'lg' ? 'w-20 h-20' : node.size === 'md' ? 'w-14 h-14' : 'w-10 h-10'}
                      ${getNodeColor(node.type)}
                      rounded-full flex items-center justify-center
                      border-2 ${selectedNode === node.id ? 'border-white' : 'border-slate-700'}
                      shadow-lg
                    `}>
                      {node.type === 'subject' && <span className="text-2xl">👤</span>}
                      {node.type === 'family' && <span className="text-lg">👥</span>}
                      {node.type === 'business' && <span className="text-lg">🏢</span>}
                      {node.type === 'hostile' && <span className="text-lg">⚠️</span>}
                      {node.type === 'government' && <span className="text-lg">🏛️</span>}
                      {node.type === 'political' && <span className="text-lg">🎖️</span>}
                      {node.type === 'education' && <span className="text-lg">🎓</span>}
                    </div>
                    <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="text-xs font-medium bg-slate-900/90 px-2 py-0.5 rounded text-slate-300">
                        {node.label}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Selected Node Info */}
                {selectedNode && (
                  <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-700 rounded-lg p-4">
                    <h3 className="font-bold text-white mb-2">{networkNodes.find(n => n.id === selectedNode)?.label}</h3>
                    <div className="text-sm text-slate-400">
                      {selectedNode === 'drz' && 'Primary subject. Chairman & CEO of AHS. Former Deputy Minister of Health. Controls 51% of proposed JV.'}
                      {selectedNode === 'humans' && 'Humans.ai - Sabin Dima\'s company. Negotiating 49% JV stake. Bringing AI technology and expertise.'}
                      {selectedNode === 'egyptians' && 'COMPETITOR. Signed parallel deal for AI Training. Cloned Humans.ai platform. Engineer Majid pushed this deal.'}
                      {selectedNode === 'razvan' && 'HOSTILE. Former partner who went rogue. Contacted DRZ behind Sabin\'s back. €450K paid, delivered garbage.'}
                      {selectedNode === 'ngosh' && 'Government agency. 70/30 split with JV. Mandatory compliance = captive market.'}
                      {selectedNode === 'majid' && 'NGOSH leader. Not technical. Forced DRZ to work with Egyptians. Political motivations.'}
                      {selectedNode === 'droz' && 'Dr. OZ - Trump administration. Introduced Sabin to DRZ. Potential leverage point.'}
                      {selectedNode === 'mother' && 'DRZ\'s Egyptian mother. Explains Egyptian business ties and cultural connections.'}
                      {selectedNode === 'ahs' && 'Advanced Health Solutions. DRZ\'s company. Healthcare training, partnerships with Johns Hopkins, EHA.'}
                      {selectedNode === 'toronto' && 'University of Toronto, Hospital for Sick Children. Pediatric surgery fellowship. 2-3 years training.'}
                      {selectedNode === 'dalhousie' && 'Dalhousie University, Halifax. General surgery residency. 5 years in Canada.'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-lg font-bold mb-6">Career & Deal Timeline</h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-700" />
              
              <div className="space-y-6">
                {[
                  { year: '~1965', event: 'Born in Saudi Arabia', detail: 'Saudi father, Egyptian mother', type: 'birth' },
                  { year: '~1990', event: 'Medical Degree', detail: 'Likely King Saud University', type: 'education' },
                  { year: '~1992-97', event: 'General Surgery Residency', detail: 'Dalhousie University, Halifax, Canada', type: 'education' },
                  { year: '~1998-2001', event: 'Pediatric Surgery Fellowship', detail: 'University of Toronto, Hospital for Sick Children', type: 'education' },
                  { year: '~2002', event: 'Returns to Saudi Arabia', detail: 'Joins King Abdulaziz Medical City', type: 'career' },
                  { year: '~2005-2015', event: 'Academic Career', detail: 'Faculty at King Saud bin Abdulaziz University. 7,400+ citations.', type: 'career' },
                  { year: '~2015', event: 'Deputy Minister of Health', detail: 'Government appointment. Builds political network.', type: 'government' },
                  { year: '~2020', event: 'Founds AHS', detail: 'Advanced Health Solutions. Healthcare training company.', type: 'business' },
                  { year: '2023', event: 'Dr. OZ Introduction', detail: 'Connected to Sabin Dima / Humans.ai', type: 'deal' },
                  { year: 'Early 2024', event: 'WeCare Project', detail: 'Engages Răzvan Costin. €450,000 paid.', type: 'deal' },
                  { year: 'Spring 2024', event: 'Răzvan Failure', detail: '"Garbage code" delivered. Project fails.', type: 'negative' },
                  { year: 'Mid 2024', event: 'Răzvan Goes Rogue', detail: 'Direct contact with DRZ behind Sabin\'s back', type: 'negative' },
                  { year: 'Fall 2024', event: 'Edward Joins', detail: 'Builds working AI Investigation platform', type: 'positive' },
                  { year: 'Dec 2024', event: 'Egyptian Deal Signed', detail: 'Parallel deal for AI Training. Competition.', type: 'negative' },
                  { year: 'Jan 2025', event: 'Contract Review', detail: 'Amr & Partners. 45+ aggressive comments.', type: 'deal' },
                  { year: 'Feb 2025', event: 'CURRENT: Negotiation', detail: 'Budget standoff. Exclusivity dispute.', type: 'current' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center shrink-0 ${
                      item.type === 'birth' ? 'bg-pink-500/20 text-pink-400' :
                      item.type === 'education' ? 'bg-cyan-500/20 text-cyan-400' :
                      item.type === 'career' ? 'bg-blue-500/20 text-blue-400' :
                      item.type === 'government' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.type === 'business' ? 'bg-purple-500/20 text-purple-400' :
                      item.type === 'deal' ? 'bg-yellow-500/20 text-yellow-400' :
                      item.type === 'positive' ? 'bg-green-500/20 text-green-400' :
                      item.type === 'negative' ? 'bg-red-500/20 text-red-400' :
                      item.type === 'current' ? 'bg-red-500 text-white animate-pulse' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      <span className="text-xs font-mono font-bold">{item.year}</span>
                    </div>
                    <div className="flex-1 bg-slate-800/50 rounded-lg p-4">
                      <h3 className="font-bold text-white">{item.event}</h3>
                      <p className="text-sm text-slate-400 mt-1">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Psychological Profile View */}
        {viewMode === 'psych' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Big Five */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold mb-4">Big Five (OCEAN) Model</h2>
              <div className="space-y-4">
                {[
                  { trait: 'Openness', score: 70, label: 'HIGH', desc: 'Embraces innovation, AI, international exposure' },
                  { trait: 'Conscientiousness', score: 90, label: 'VERY HIGH', desc: 'Surgeon discipline, multiple degrees' },
                  { trait: 'Extraversion', score: 65, label: 'MOD-HIGH', desc: 'Networking ability, not flashy' },
                  { trait: 'Agreeableness', score: 50, label: 'MODERATE', desc: 'Warm personally, hard in business' },
                  { trait: 'Neuroticism', score: 25, label: 'LOW', desc: 'Emotionally stable, calm under pressure' },
                ].map((t, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{t.trait}</span>
                      <span className="text-blue-400">{t.label}</span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden mb-1">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${t.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DISC Profile */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold mb-4">DISC Profile</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { letter: 'D', name: 'Dominance', score: 80, color: 'red' },
                  { letter: 'I', name: 'Influence', score: 45, color: 'yellow' },
                  { letter: 'S', name: 'Steadiness', score: 40, color: 'green' },
                  { letter: 'C', name: 'Conscientiousness', score: 75, color: 'blue' },
                ].map((d, i) => (
                  <div key={i} className={`bg-slate-800 rounded-lg p-4 border-l-4 border-${d.color}-500`}>
                    <div className="text-2xl font-bold text-white mb-1">{d.letter}</div>
                    <div className="text-xs text-slate-400">{d.name}</div>
                    <div className="text-lg font-bold text-${d.color}-400 mt-2">{d.score}%</div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-800 rounded-lg p-4">
                <div className="text-sm font-bold text-white mb-1">Profile Type: DC "The Challenger"</div>
                <p className="text-xs text-slate-400">Direct, skeptical, rigorous standards. Results-oriented with attention to quality.</p>
              </div>
            </div>

            {/* Enneagram */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold mb-4">Enneagram Type</h2>
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                  <span className="text-4xl font-bold">3w8</span>
                </div>
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white">The Achiever</h3>
                <p className="text-sm text-slate-400">with Challenger Wing</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-xs text-emerald-400 mb-1">Core Motivation</div>
                  <p className="text-sm text-white">To be successful and admired</p>
                </div>
                <div className="bg-slate-800 rounded-lg p-3">
                  <div className="text-xs text-red-400 mb-1">Core Fear</div>
                  <p className="text-sm text-white">Being worthless or without value</p>
                </div>
              </div>
            </div>

            {/* Cultural Dimensions */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold mb-4">Hofstede Cultural Dimensions</h2>
              <div className="space-y-3">
                {[
                  { dim: 'Power Distance', score: 85, desc: 'Respects hierarchy and status' },
                  { dim: 'Individualism', score: 40, desc: 'Collectivist but Western exposure' },
                  { dim: 'Masculinity', score: 80, desc: 'Achievement-oriented, competitive' },
                  { dim: 'Uncertainty Avoidance', score: 75, desc: 'Prefers structure, dislikes ambiguity' },
                  { dim: 'Long-Term Orientation', score: 55, desc: 'Balances tradition with pragmatism' },
                  { dim: 'Indulgence', score: 30, desc: 'Restrained, controlled' },
                ].map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-32 text-xs text-slate-400">{h.dim}</div>
                    <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${h.score}%` }} />
                    </div>
                    <div className="w-10 text-right text-xs text-purple-400">{h.score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Financial View */}
        {viewMode === 'financial' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold mb-4">Estimated Net Worth Breakdown</h2>
              
              <div className="relative h-64 mb-6">
                {/* Simplified bar chart */}
                <div className="absolute inset-0 flex items-end gap-4 px-4">
                  {[
                    { label: 'Real Estate', min: 1.5, max: 4, color: 'bg-blue-500' },
                    { label: 'Business Equity', min: 2, max: 10, color: 'bg-emerald-500' },
                    { label: 'Liquid Assets', min: 1, max: 3, color: 'bg-amber-500' },
                    { label: 'Other', min: 0.5, max: 3, color: 'bg-purple-500' },
                  ].map((item, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full ${item.color} rounded-t-lg relative`}
                        style={{ height: `${item.max * 20}px` }}
                      >
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-white whitespace-nowrap">
                          ${item.min}M - ${item.max}M
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 mt-2 text-center">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">TOTAL ESTIMATED NET WORTH</div>
                  <div className="text-3xl font-bold text-white">$5M - $20M</div>
                  <div className="text-xs text-amber-400 mt-1">⚠️ LOW CONFIDENCE (2/5)</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4">
                  <div className="text-xs text-slate-500 mb-1">ESTIMATED ANNUAL INCOME</div>
                  <div className="text-3xl font-bold text-white">$500K - $1.1M</div>
                  <div className="text-xs text-amber-400 mt-1">⚠️ ESTIMATED</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                <h3 className="font-bold text-white mb-3">Income Streams</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">AHS CEO</span>
                    <span className="text-white">$300K-600K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Board Seats</span>
                    <span className="text-white">$50K-200K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Consulting</span>
                    <span className="text-white">$100K-300K</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
                <h3 className="font-bold text-white mb-3">Property</h3>
                <div className="text-sm text-slate-400">
                  <div className="mb-2">📍 Diplomatic Quarter, Riyadh</div>
                  <div className="text-white font-bold">$1M - $2.5M</div>
                  <div className="text-xs text-slate-500 mt-1">Elite area. Requires govt approval.</div>
                </div>
              </div>
              
              <div className="bg-red-900/30 rounded-xl border border-red-800 p-4">
                <h3 className="font-bold text-red-400 mb-3">⚠️ Outstanding to You</h3>
                <div className="text-3xl font-bold text-white">€246,000</div>
                <div className="text-xs text-slate-400 mt-1">Unpaid. Lawyers trying to remove.</div>
              </div>
            </div>
          </div>
        )}

        {/* Raw Intel View */}
        {viewMode === 'intel' && (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 font-mono text-sm">
            <h2 className="text-lg font-bold mb-4 font-sans">Raw Intelligence Data</h2>
            <pre className="text-green-400 bg-slate-950 rounded-lg p-4 overflow-auto max-h-[600px]">
{`╔══════════════════════════════════════════════════════════════╗
║  INTELLIGENCE DOSSIER - DR. MOHAMMED FOUAD ZAMAKHSHARY       ║
║  Classification: CONFIDENTIAL                                 ║
║  Generated: 2026-02-07                                        ║
╚══════════════════════════════════════════════════════════════╝

[SECTION 1: IDENTITY]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULL_NAME      : Mohammed Fouad Zamakhshary
KNOWN_AS       : Dr. Zamakhshary, DRZ
NATIONALITY    : Saudi Arabian
ETHNICITY      : Saudi-Egyptian (mother Egyptian)
AGE_ESTIMATE   : 55-62 years
RELIGION       : Muslim (Sunni)
MARITAL_STATUS : Married w/ children (probable)
RESIDENCE      : Diplomatic Quarter, Riyadh
LANGUAGES      : Arabic (native), English (fluent)

[SECTION 2: CREDENTIALS]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MEDICAL_DEGREE : MD (likely King Saud University)
RESIDENCY      : Dalhousie University, Canada
FELLOWSHIP     : U of Toronto, Hospital for Sick Children
MASTERS        : MEd (Master of Education)
CERTIFICATION  : FRCSC
ORCID          : 0000-0001-8870-8684
CITATIONS      : 7,433+
PUBLICATIONS   : 18+

[SECTION 3: CAREER]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURRENT        : Chairman & CEO, Advanced Health Solutions
PREVIOUS       : Deputy Minister of Health, Saudi Arabia
PREVIOUS       : Pediatric Surgeon, King Abdulaziz Medical City
PREVIOUS       : Faculty, King Saud bin Abdulaziz University

[SECTION 4: FINANCIAL]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NET_WORTH      : $5,000,000 - $20,000,000 (EST)
REAL_ESTATE    : $1,500,000 - $4,000,000 (EST)
BUSINESS_EQUITY: $2,000,000 - $10,000,000 (EST)
ANNUAL_INCOME  : $500,000 - $1,100,000 (EST)
CONFIDENCE     : LOW (2/5)

[SECTION 5: PSYCHOLOGICAL PROFILE]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MBTI_ESTIMATE  : INTJ / ENTJ
DISC_TYPE      : DC (The Challenger)
ENNEAGRAM      : Type 3w8 (Achiever w/ Challenger wing)
ATTACHMENT     : Secure-Avoidant

BIG_FIVE:
  OPENNESS          : 70/100 (HIGH)
  CONSCIENTIOUSNESS : 90/100 (VERY HIGH)
  EXTRAVERSION      : 65/100 (MOD-HIGH)
  AGREEABLENESS     : 50/100 (MODERATE)
  NEUROTICISM       : 25/100 (LOW)

[SECTION 6: RED FLAGS]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[CRITICAL] Budget commitment refused
[HIGH]     Back-channel with Răzvan Costin
[HIGH]     Parallel deal with Egyptians
[HIGH]     Lawyers removing debt acknowledgment
[MEDIUM]   Warmth ≠ commitment pattern

[SECTION 7: TRUST ANALYSIS]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TRUST_SCORE    : 3/10
ASSESSMENT     : PROCEED WITH CAUTION
RECOMMENDATION : Verify all verbal agreements in writing

═══════════════════════════════════════════════════════════════
END OF DOSSIER
═══════════════════════════════════════════════════════════════`}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
