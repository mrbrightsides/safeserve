
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area
} from 'recharts';
import { 
  Scale, Leaf, TrendingUp, TrendingDown, Sparkles, BrainCircuit, Activity,
  Droplets, Utensils, AlertTriangle, ChevronRight, Info, Zap, Globe,
  Package, History, BarChart3, Clock, Target, Loader2, CheckCircle2, 
  ArrowRight, ShieldCheck, Database, Fingerprint, Lock, Layers, RefreshCw,
  Cpu, Gavel, Microscope, Network, Shield, HelpCircle
} from 'lucide-react';
import { getSustainabilityImpact, getSustainabilityActions } from '../geminiService';

const mockVendorWaste = [
  { name: 'Bunda Catering', waste: 8.2 },
  { name: 'Dapur Sehat', waste: 15.4 },
  { name: 'Lembang Co-op', waste: 5.1 },
  { name: 'Barokah Foods', waste: 22.8 },
  { name: 'Sari Rasa', waste: 11.2 },
];

const SustainabilityPortal: React.FC = () => {
  const [impact, setImpact] = useState<any>(null);
  const [actions, setActions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [processingState, setProcessingState] = useState<'IDLE' | 'APPLYING' | 'SIMULATING' | 'SUCCESS'>('IDLE');
  const [showSimPanel, setShowSimPanel] = useState(false);
  const [simData, setSimData] = useState<any>(null);

  const fetchImpactAndActions = async () => {
    setIsLoading(true);
    const [impactRes, actionsRes] = await Promise.all([
      getSustainabilityImpact(),
      getSustainabilityActions()
    ]);
    setImpact(impactRes);
    setActions(actionsRes);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchImpactAndActions();
  }, []);

  const handleApplyAction = (id: string) => {
    setActiveActionId(id);
    setProcessingState('APPLYING');
    setTimeout(() => {
      setProcessingState('SUCCESS');
      setActions(prev => prev.map(a => a.id === id ? { 
        ...a, 
        status: 'Verified Effective', 
        verifiedDelta: { waste: "-9.1%", improvement: "Significant", confidence: "0.91" } 
      } : a));
      setTimeout(() => {
        setProcessingState('IDLE');
        setActiveActionId(null);
      }, 3000);
    }, 2000);
  };

  const handleSimulate = (action: any) => {
    setActiveActionId(action.id);
    setProcessingState('SIMULATING');
    setTimeout(() => {
      setSimData(action.projectedDelta);
      setShowSimPanel(true);
      setProcessingState('IDLE');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-left animate-in fade-in duration-700 pb-20">
      
      {/* Simulation Delta Panel (Decision Support Overlay) */}
      {showSimPanel && simData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
          <div className="bg-white p-10 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] w-full max-w-2xl border border-slate-100">
             <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-100 rotate-3 transition-transform hover:rotate-0">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-900 leading-none">Simulation Delta Panel</h3>
                    <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-2">7-Day Projected Impact Analysis</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowSimPanel(false); setActiveActionId(null); }} 
                  className="p-3 hover:bg-slate-100 rounded-2xl transition-all hover:scale-110 active:scale-90"
                >
                  <History className="w-6 h-6 text-slate-300" />
                </button>
             </div>

             <div className="grid grid-cols-2 gap-6 mb-10">
                <DeltaCard label="Waste Reduction" value={simData.waste} color="text-red-500" sub="Forecasted Delta" icon={<Scale className="w-4 h-4" />} />
                <DeltaCard label="CO₂ Saved" value={simData.co2} color="text-emerald-500" sub="Carbon Offset Est." icon={<Leaf className="w-4 h-4" />} />
                <DeltaCard label="Meals Recovered" value={simData.meals} color="text-blue-500" sub="Total Volume (7d)" icon={<Utensils className="w-4 h-4" />} />
                <DeltaCard label="Vendor Score" value={simData.score} color="text-indigo-600" sub="Governance Boost" icon={<TrendingUp className="w-4 h-4" />} />
             </div>

             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 mb-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><BrainCircuit className="w-24 h-24" /></div>
                <div className="flex items-center gap-2 mb-4">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Decision Support Logic</span>
                </div>
                <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                  "Advanced Monte Carlo modeling suggests a high probability of these results based on current school-district demand curves. Proceeding will lock these targets into the next audit cycle."
                </p>
             </div>

             <div className="flex gap-4">
                <button 
                  onClick={() => { setShowSimPanel(false); setActiveActionId(null); }} 
                  className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-all active:scale-95"
                >
                  Discard Simulation
                </button>
                <button 
                  onClick={() => { handleApplyAction(activeActionId!); setShowSimPanel(false); }} 
                  className="flex-[2] py-5 bg-indigo-600 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  Commit Governance Policy <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Governance Mode Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Network className="w-64 h-64 text-indigo-400" /></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20">
              <Gavel className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">Active Governance Mode</h2>
              <div className="flex items-center gap-3 mt-1.5">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">AUTO-POLICY: ENABLED</span>
                </div>
                {/* Upgrade: Compliance Mode Badge */}
                <div className="px-2.5 py-1 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-[10px] text-indigo-400 font-black uppercase tracking-widest">
                  BPOM SPEC MODE: ACTIVE
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 relative z-10">
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-colors">
                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Policy Latency</span>
                <span className="text-sm font-black text-white tracking-tight">42ms</span>
             </div>
             <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center hover:bg-white/10 transition-colors">
                <span className="text-[9px] font-black text-slate-500 uppercase block mb-1">Engine Trust</span>
                <span className="text-sm font-black text-white tracking-tight">0.98</span>
             </div>
          </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KPIItem label="Waste Rate" value="11.4%" sub="-2.1% from LW" icon={<Scale className="text-emerald-600" />} />
        <KPIItem label="Meals Wasted" value="4.2k" sub="Est. This Week" icon={<Utensils className="text-red-500" />} color="bg-red-50" />
        <KPIItem label="Menu Waste Risk" value="High" sub="Fish Stew Alert" icon={<AlertTriangle className="text-orange-500" />} />
        <KPIItem label="Sustainability ROI" value="92/100" sub="System Efficiency" icon={<Leaf className="text-emerald-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Recommendation Column */}
        <div className="lg:col-span-8 space-y-8">
          
          <div className="bg-slate-900 p-8 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -rotate-12"><Layers className="w-72 h-72" /></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-500/20">
                  <BrainCircuit className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">AI Action Loop Pipeline</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Self-Optimizing Sustainability Engine</p>
                </div>
              </div>
              <button 
                onClick={fetchImpactAndActions}
                disabled={isLoading}
                className="p-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="space-y-8 relative z-10">
              {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="w-16 h-16 text-emerald-500 animate-spin relative" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Parsing supply node inefficiencies...</p>
                </div>
              ) : actions.map((action, idx) => (
                <div 
                  key={action.id} 
                  className={`p-10 rounded-[3rem] border transition-all duration-500 ${activeActionId === action.id ? 'bg-white text-slate-900 scale-[1.02] shadow-[0_30px_80px_rgba(0,0,0,0.4)]' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
                    <div className="flex-1 space-y-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest border ${action.priority === 'HIGH' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'}`}>
                          {action.priority} PRIORITY
                        </span>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border border-white/10 px-3 py-1.5 rounded-xl">ID: {action.id}</span>
                        
                        {/* Decision Confidence Pill */}
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 shadow-inner">
                          <Fingerprint className="w-3 h-3 text-indigo-400" />
                          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">AI Confidence: {action.confidence}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-3xl font-black tracking-tight mb-2">{action.vendor}</h4>
                          <p className="text-base font-bold text-slate-400 leading-relaxed italic">
                            "{action.action}"
                          </p>
                        </div>
                        
                        {/* Why This Action? Tooltip Enhancement */}
                        <div className="group relative">
                          <div className={`p-4 rounded-2xl cursor-help transition-all duration-300 shadow-lg ${activeActionId === action.id ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-800 text-indigo-400 hover:bg-slate-700'}`}>
                            <HelpCircle className="w-6 h-6" />
                            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Why Suggested?</span>
                          </div>
                          
                          {/* Tooltip Content */}
                          <div className="absolute bottom-full right-0 mb-4 w-80 p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none translate-y-3 group-hover:translate-y-0 z-50">
                             <div className="flex items-center gap-2 mb-4">
                               <Microscope className="w-4 h-4 text-indigo-400" />
                               <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Why Suggested? (Explainability)</span>
                             </div>
                             <ul className="space-y-3">
                               {action.whySuggested?.map((reason: string, i: number) => (
                                 <li key={i} className="text-[11px] font-bold leading-relaxed flex items-start gap-3 text-slate-300">
                                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                                   {reason}
                                 </li>
                               ))}
                             </ul>
                             <div className="mt-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between">
                                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Decision Trust Score</span>
                                  <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">High (0.94)</span>
                                </div>
                             </div>
                             <div className="absolute top-full right-7 -translate-y-px border-[12px] border-transparent border-t-slate-900" />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-6 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-2 text-slate-500"><Target className="w-4 h-4 text-indigo-400" /> Target: {action.target}</div>
                        <div className="flex items-center gap-2 text-emerald-400"><TrendingDown className="w-4 h-4" /> Est. Reduction: {action.expectedReduction}</div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[220px]">
                      {activeActionId === action.id && processingState !== 'IDLE' ? (
                        <div className="flex flex-col items-center gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-200">
                          {processingState === 'APPLYING' && (
                            <div className="flex flex-col items-center gap-3">
                              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Applying Policy...</span>
                            </div>
                          )}
                          {processingState === 'SIMULATING' && (
                            <div className="flex flex-col items-center gap-3">
                              <Zap className="w-8 h-8 text-amber-500 animate-pulse" />
                              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Simulating...</span>
                            </div>
                          )}
                          {processingState === 'SUCCESS' && (
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Policy Locked</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleApplyAction(action.id)}
                            className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                              action.status === 'Verified Effective' ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                            }`}
                          >
                            {action.status === 'Verified Effective' ? <ShieldCheck className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
                            {action.status === 'Verified Effective' ? 'Locked & Verified' : 'Execute Policy'}
                          </button>
                          <button 
                            onClick={() => handleSimulate(action)}
                            disabled={action.status === 'Verified Effective'}
                            className="w-full py-5 bg-white/5 text-slate-400 border border-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-white hover:bg-white/10 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <Zap className="w-4 h-4" /> Simulate Impact
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     {/* Logic Breakdown Card */}
                     <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${activeActionId === action.id ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                        <div className="flex items-center justify-between mb-6">
                           <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-xl ${activeActionId === action.id ? 'bg-indigo-600 text-white' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                <Microscope className="w-4 h-4" />
                              </div>
                              <h5 className="text-[11px] font-black uppercase tracking-widest">Evidence Reasoning</h5>
                           </div>
                           <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border transition-colors ${activeActionId === action.id ? 'bg-indigo-100 text-indigo-600 border-indigo-200' : 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'}`}>
                             Proof Score: {action.evidenceScore}
                           </span>
                        </div>
                        <ul className="space-y-3">
                           {action.whySuggested?.map((reason: string, i: number) => (
                             <li key={i} className={`text-xs font-bold leading-relaxed flex items-start gap-3 transition-colors ${activeActionId === action.id ? 'text-slate-600' : 'text-slate-400'}`}>
                               <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                               {reason}
                             </li>
                           ))}
                        </ul>
                     </div>

                     {/* Post-Execution Feedback Slot */}
                     <div className={`p-8 rounded-[2.5rem] border transition-all duration-700 overflow-hidden relative ${action.status === 'Verified Effective' ? 'bg-emerald-500/10 border-emerald-500/20 shadow-inner' : 'bg-white/5 border-white/5 opacity-40'}`}>
                        {action.status === 'Verified Effective' && <div className="absolute top-0 right-0 p-10 opacity-5 -rotate-12"><ShieldCheck className="w-48 h-48" /></div>}
                        <div className="flex items-center gap-3 mb-6 relative z-10">
                           <div className={`p-2 rounded-xl ${action.status === 'Verified Effective' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-500'}`}>
                             <Activity className="w-4 h-4" />
                           </div>
                           <h5 className={`text-[11px] font-black uppercase tracking-widest ${action.status === 'Verified Effective' ? 'text-emerald-400' : 'text-slate-500'}`}>Post-Execution Feedback</h5>
                        </div>
                        {action.status === 'Verified Effective' ? (
                           <div className="space-y-4 relative z-10">
                              <VerificationMetric label="Result Status" value="Locked" color="text-emerald-400" />
                              <VerificationMetric label="Measured Waste Δ" value={action.verifiedDelta?.waste || 'N/A'} />
                              <VerificationMetric label="Confidence Evolution" value={`${action.confidence} → ${action.verifiedDelta?.confidence || 'N/A'}`} />
                              <div className="pt-4 mt-4 border-t border-emerald-500/10">
                                <p className="text-[10px] font-bold text-emerald-600 leading-tight">AI verified 9.1% improvement in resource allocation after portion shift.</p>
                              </div>
                           </div>
                        ) : (
                           <div className="flex flex-col items-center justify-center h-32 text-center opacity-50">
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Result: Pending</p>
                              <span className="text-[8px] text-slate-600 font-bold mt-2 leading-relaxed">System will auto-validate metrics 24h after implementation.</span>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Flow Steps */}
                  <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FlowStep 
                      icon={<SchoolIcon className="w-5 h-5" />} 
                      label="School District" 
                      status={action.status === 'Verified Effective' ? 'Completed' : 'Validated'} 
                      desc="Inventory match verified"
                      dark={activeActionId !== action.id}
                    />
                    <FlowStep 
                      icon={<TruckIcon className="w-5 h-5" />} 
                      label="Supply Node" 
                      status={action.status === 'Verified Effective' ? 'Completed' : 'Awaiting Lock'} 
                      desc="Prep batch re-allocated"
                      dark={activeActionId !== action.id}
                    />
                    <FlowStep 
                      icon={<ShieldCheck className="w-5 h-5" />} 
                      label="Governance Hub" 
                      status={action.status === 'Verified Effective' ? 'Completed' : 'Queued'} 
                      desc="Policy hash published"
                      dark={activeActionId !== action.id}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Waste Chart Panel */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-200 shadow-sm transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                 <div className="p-4 bg-emerald-50 rounded-[1.5rem] shadow-inner"><BarChart3 className="text-emerald-600 w-6 h-6" /></div>
                 <div>
                   <h3 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Vendor Inefficiency Benchmark</h3>
                   <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-2">Waste Variance per Supply Node</p>
                 </div>
               </div>
               <div className="flex items-center gap-3">
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 px-4 py-2 rounded-full shadow-sm">Global Limit: 10%</span>
               </div>
            </div>
            
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockVendorWaste}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontBold: '900', fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontBold: '900', fill: '#94a3b8'}} unit="%" />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '16px' }} />
                  <Bar dataKey="waste" radius={[12, 12, 0, 0]}>
                    {mockVendorWaste.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.waste > 15 ? '#ef4444' : '#10b981'} className="transition-all hover:opacity-80" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Info Column */}
        <div className="lg:col-span-4 space-y-8">
           
           {/* Policy Trigger Panel */}
           <div className="bg-indigo-600 p-10 rounded-[3.5rem] border border-indigo-400 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000 group-hover:scale-110"><Sparkles className="w-56 h-56" /></div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                 <div className="p-3 bg-white/20 rounded-2xl shadow-inner border border-white/10"><Cpu className="w-7 h-7" /></div>
                 <h3 className="text-xl font-black tracking-tight leading-none">Explainable Policy Trigger</h3>
              </div>
              <div className="space-y-8 relative z-10">
                 <p className="text-base font-bold text-indigo-50 leading-relaxed italic">
                    "AI Policy Cluster 04: Automatically adjusting lunch logistics based on <span className="text-white font-black px-1.5 py-0.5 bg-indigo-500 rounded-md">Cluster A-12</span> spatial variance. Expected waste reduction: 14% across 8 schools."
                 </p>
                 <div className="pt-8 border-t border-white/20">
                    <div className="flex items-center justify-between mb-4">
                       <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Inference Grounding</span>
                       <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-xl text-[10px] font-black border border-emerald-500/30">0.98 Verified</span>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl">
                      <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0"><Package className="w-6 h-6 text-indigo-100" /></div>
                      <p className="text-[11px] font-bold text-indigo-100 leading-snug">Synced with national BPOM v2.1 sanitation and portion compliance ledger.</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Governance History */}
           <div className="bg-white p-10 rounded-[3.5rem] border border-gray-200 shadow-sm transition-all hover:shadow-lg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-3"><History className="w-5 h-5 text-indigo-600" /> Compliance Trail</h3>
                <span className="text-[9px] font-black text-slate-300">BLOCK: 209,102</span>
              </div>
              <div className="space-y-4">
                {actions.map((action, i) => (
                  <div key={i} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group hover:border-indigo-200 transition-all cursor-default">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg border ${
                        action.status === 'Verified Effective' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                        action.status === 'In Progress' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                      }`}>
                        {action.status}
                      </span>
                      <span className="text-[9px] font-mono text-slate-400">0x{action.id.split('-').pop()}</span>
                    </div>
                    <p className="text-xs font-black text-slate-700 leading-snug mb-3 group-hover:text-indigo-600 transition-colors">{action.action}</p>
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200/50">
                      <Fingerprint className="w-3.5 h-3.5 text-slate-300" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">TX: {Math.random().toString(36).substring(7).toUpperCase()}...</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-100">
                Generate Audit Proof
              </button>
           </div>

           {/* Sustainability ROI */}
           <div className="bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden border border-emerald-500/20">
               <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none"><Globe className="w-56 h-56 text-emerald-400" /></div>
               <div className="flex items-center gap-4 mb-10 relative z-10">
                  <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg"><Scale className="w-6 h-6 text-white" /></div>
                  <div>
                    <h3 className="text-xl font-black tracking-tight leading-none">Sustainability ROI</h3>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1.5">Ecological Impact Matrix</p>
                  </div>
               </div>
               <div className="space-y-8 relative z-10">
                  <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors">
                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">CO₂ Avoided Overall</p>
                     <p className="text-4xl font-black text-emerald-400 tracking-tighter">{impact?.co2AvoidedKg || '2,430'} Kg</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors text-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase block mb-2">Meals Saved</span>
                        <span className="text-2xl font-black text-white">{impact?.mealsSaved || '14,205'}</span>
                     </div>
                     <div className="p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-colors text-center">
                        <span className="text-[9px] font-black text-slate-500 uppercase block mb-2">Waste Rate Δ</span>
                        <span className="text-2xl font-black text-emerald-400">-{impact?.wasteReductionPct || '18.4'}%</span>
                     </div>
                  </div>
               </div>
            </div>

        </div>
      </div>
    </div>
  );
};

const VerificationMetric = ({ label, value, color = "text-emerald-400" }: any) => (
   <div className="flex items-center justify-between">
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      <span className={`text-[11px] font-black ${color}`}>{value}</span>
   </div>
);

const DeltaCard = ({ label, value, color, sub, icon }: any) => (
   <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 hover:shadow-lg transition-all hover:bg-white">
      <div className="flex items-center gap-2 mb-3">
        <div className={`p-1.5 rounded-lg bg-white shadow-sm ${color.replace('text', 'text')}`}>{icon}</div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">{label}</span>
      </div>
      <span className={`text-3xl font-black tracking-tighter ${color}`}>{value}</span>
      <span className="text-[9px] font-bold text-slate-400 block mt-1 uppercase tracking-tight">{sub}</span>
   </div>
);

const KPIItem = ({ label, value, sub, icon, color = 'bg-white' }: any) => (
  <div className={`${color} p-8 rounded-[2.5rem] border border-gray-200 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group cursor-default text-left relative overflow-hidden`}>
    <div className="absolute -bottom-4 -right-4 p-4 opacity-5 group-hover:scale-125 transition-transform">{icon}</div>
    <div className="flex items-start justify-between relative z-10">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-gray-600 transition-colors">{label}</p>
        <h4 className="text-4xl font-black text-gray-900 tracking-tighter">{value}</h4>
        <div className="flex items-center gap-1.5 mt-3">
          {sub.includes('-') || sub.includes('High') ? <TrendingDown className="w-3.5 h-3.5 text-red-500" /> : <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{sub}</span>
        </div>
      </div>
      <div className="p-4 bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-50 group-hover:rotate-12 transition-transform">{icon}</div>
    </div>
  </div>
);

const FlowStep = ({ icon, label, status, desc, dark = true }: any) => (
  <div className={`flex flex-col items-center text-center p-5 rounded-[2rem] border transition-all ${dark ? 'bg-white/5 border-white/5 opacity-30 scale-95' : 'bg-slate-50 border-slate-200 scale-100 shadow-sm'}`}>
    <div className={`p-3 rounded-2xl mb-4 transition-all ${status === 'Completed' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : dark ? 'bg-white/10 text-slate-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'}`}>
      {status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : icon}
    </div>
    <span className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-slate-500' : 'text-slate-900'}`}>{label}</span>
    <span className={`text-[8px] font-bold leading-tight ${dark ? 'text-slate-600' : 'text-slate-400'}`}>{desc}</span>
    <div className={`mt-3 px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border ${
      status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-200 text-slate-500 border-slate-300'
    }`}>{status}</div>
  </div>
);

const SchoolIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
);

const TruckIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="2" y="6" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

export default SustainabilityPortal;
