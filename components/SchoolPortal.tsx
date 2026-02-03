
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, CheckCircle2, Package, MapPin, Search, Plus, 
  Send, X, ShieldCheck, ClipboardCheck, History, 
  TrendingUp, BadgeCheck, ShieldAlert, ChevronRight, 
  Fingerprint, Gauge, Info, Loader2, HeartPulse, ShieldIcon,
  School, AlertOctagon, Activity, HelpCircle, Thermometer,
  Stethoscope, ClipboardList, Lock, Database, BrainCircuit,
  UtensilsCrossed, Apple, Zap, Bell, ListChecks, ArrowUpRight,
  TrendingDown, Scale, Salad, Timer, Users2, Minus
} from 'lucide-react';
import { analyzeIncidentSeverity, getKnowledgeGraph } from '../geminiService';

const SchoolPortal: React.FC = () => {
  const [reportMode, setReportMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [severityResult, setSeverityResult] = useState<any>(null);
  const [knowledgeData, setKnowledgeData] = useState<any>(null);
  const [incidentHash, setIncidentHash] = useState('');
  
  // New States
  const [consumptionLevel, setConsumptionLevel] = useState<'LOW' | 'MED' | 'HIGH' | null>(null);
  const [showChecklist, setShowChecklist] = useState(false);

  const symptomsList = ['Nausea', 'Vomiting', 'Diarrhea', 'Fever', 'Dizziness', 'Abdominal Pain'];

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const generateHash = () => {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < 40; i++) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  };

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) return;
    
    setIsSubmitting(true);
    try {
      const [severity, knowledge] = await Promise.all([
        analyzeIncidentSeverity(selectedSymptoms),
        getKnowledgeGraph(selectedSymptoms)
      ]);
      
      setSeverityResult(severity);
      setKnowledgeData(knowledge);
      setIncidentHash(generateHash());
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to analyze incident:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setReportMode(false);
    setSubmitted(false);
    setSelectedSymptoms([]);
    setSeverityResult(null);
    setKnowledgeData(null);
    setIncidentHash('');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 relative pb-20 text-left animate-in fade-in duration-700">
      
      {/* Audit Trail Modal */}
      {showAuditTrail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-100"><ClipboardCheck className="text-white w-5 h-5" /></div>
                <h3 className="text-xl font-black">Vendor Audit Dossier</h3>
              </div>
              <button onClick={() => setShowAuditTrail(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Hygiene Index</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">98.4%</span>
                </div>
                <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Risk Factor</span>
                  <span className="text-2xl font-black text-emerald-600 tracking-tight">1.8/10</span>
                </div>
              </div>
              
              <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 space-y-4">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Digital Ledger Provenance</span>
                </div>
                <p className="text-[11px] text-indigo-700 font-bold leading-relaxed italic">
                  "Vendor Bunda Catering is verified in the national BGN whitelist. 12/12 passing hygiene scans. IoT Cold-chain COOL-042 reporting 100% stability in transport."
                </p>
              </div>
              <button onClick={() => setShowAuditTrail(false)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest transition-transform active:scale-95 shadow-xl shadow-slate-100">Close Audit Explorer</button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Report Flow */}
      {reportMode ? (
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-[0_40px_100px_rgba(0,0,0,0.1)] animate-in zoom-in-95 duration-500 text-center">
               <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                 <CheckCircle2 className="w-12 h-12" />
               </div>
               <h2 className="text-3xl font-black mb-3 tracking-tight">Incident Logged</h2>
               <p className="text-gray-500 font-bold mb-10 max-w-sm mx-auto">AI triage has categorized this report. Emergency protocols are now active.</p>
               
               <div className="mb-10 p-6 bg-slate-900 text-white rounded-[2rem] text-left border border-slate-700 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Lock className="w-20 h-20" /></div>
                  <div className="flex items-center gap-2 mb-3">
                    <Database className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Blockchain Integrity Hash</span>
                  </div>
                  <div className="text-[11px] font-mono break-all text-slate-400 font-bold leading-relaxed">{incidentHash}</div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] font-black uppercase text-emerald-400 tracking-widest">Immutable Chain Signature Recorded</span>
                  </div>
               </div>

               {severityResult && (
                 <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100 mb-10 text-left space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                         <BrainCircuit className="w-5 h-5 text-indigo-600" />
                         <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">AI Triage Results</span>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase border tracking-widest ${severityResult.severity > 7 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                        {severityResult.urgency}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-200">
                      <div className="flex flex-col items-center">
                        <div className="text-5xl font-black text-slate-900 tracking-tighter">{severityResult.severity}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Severity Index</div>
                      </div>
                      <div className="hidden md:block h-12 w-px bg-slate-200" />
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-600 leading-relaxed italic">
                          "Heuristic analysis of cluster symptoms suggests {knowledgeData?.likelyCauses[0] || 'pathogenic activity'}. Immediate suspension of batch logs recommended."
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-red-500" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clinical Profile</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedSymptoms.map((s, i) => (
                          <span key={i} className="px-3 py-1.5 bg-white text-red-600 text-[10px] font-black rounded-xl border border-red-100 shadow-sm">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {knowledgeData && (
                      <div className="p-6 bg-white border border-slate-200 rounded-[2rem] shadow-sm space-y-4">
                        <div className="flex items-center gap-2">
                           <Activity className="w-4 h-4 text-indigo-500" />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Medical Insights</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Potential Vectors</p>
                              <div className="space-y-1.5">
                                 {knowledgeData.likelyCauses.map((cause: string, i: number) => (
                                   <div key={i} className="text-xs font-bold text-slate-700 flex items-center gap-2">
                                     <div className="w-1 h-1 rounded-full bg-slate-300" />
                                     {cause}
                                   </div>
                                 ))}
                              </div>
                           </div>
                           <div>
                              <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Immediate Response</p>
                              <div className="space-y-1.5">
                                 {knowledgeData.suggestedProtocols.slice(0, 3).map((p: string, i: number) => (
                                   <div key={i} className="text-xs font-bold text-slate-600 flex items-center gap-2">
                                      <Plus className="w-3 h-3 text-indigo-400" />
                                      {p}
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      </div>
                    )}
                 </div>
               )}

               <button onClick={resetForm} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl active:scale-95">Return to School Portal</button>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-2xl animate-in slide-in-from-bottom-6 duration-500">
              <div className="flex items-center gap-5 mb-10">
                <div className="bg-red-50 p-4 rounded-3xl shadow-xl shadow-red-100">
                  <AlertCircle className="w-10 h-10 text-red-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">Symptom Reporting</h2>
                  <p className="text-xs text-red-600 font-black uppercase tracking-widest mt-1">Direct Emergency Response Line</p>
                </div>
              </div>
              <form onSubmit={handleSubmitReport} className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {symptomsList.map(s => (
                    <label key={s} className={`flex items-center gap-3 p-5 border rounded-2xl cursor-pointer transition-all group ${selectedSymptoms.includes(s) ? 'bg-red-50 border-red-500 ring-2 ring-red-100' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-red-500'}`}>
                      <input 
                        type="checkbox" 
                        checked={selectedSymptoms.includes(s)}
                        onChange={() => handleSymptomToggle(s)}
                        className="w-5 h-5 text-red-600 rounded-lg border-gray-300 focus:ring-red-500" 
                      />
                      <span className="text-xs font-black text-gray-700 uppercase tracking-tight">{s}</span>
                    </label>
                  ))}
                </div>
                <div className="p-5 bg-red-600 rounded-[2rem] text-white flex items-center gap-4 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform"><ShieldAlert className="w-24 h-24" /></div>
                  <div className="p-3 bg-white/20 rounded-2xl"><Info className="w-6 h-6" /></div>
                  <p className="text-xs font-bold leading-relaxed relative z-10">
                    Your report will immediately trigger cluster analysis for the district. All vendor supply chains in your zone will be prioritized for remote IoT telemetry inspection.
                  </p>
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setReportMode(false)} className="flex-1 py-5 bg-gray-100 text-gray-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting || selectedSymptoms.length === 0} className="flex-[2] py-5 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl flex items-center justify-center gap-3 hover:bg-red-700 transition-all active:scale-95 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Submit Cluster Data
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Header Identity Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-slate-900 p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between border border-slate-800">
               <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><School className="w-64 h-64 text-indigo-400" /></div>
               <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Online • Monitoring Active</span>
                  </div>
                  <h2 className="text-5xl font-black mb-4 tracking-tighter">SDN 01 Menteng</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-indigo-500" /> Jakarta Hub A-1</div>
                    <div className="flex items-center gap-1.5 border-l border-slate-800 pl-4"><Users2 className="w-4 h-4 text-indigo-500" /> 1,240 Beneficiaries</div>
                  </div>
               </div>
               <div className="mt-10 flex gap-4">
                  <button className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">Today's Attendance</button>
                  <button className="px-6 py-2.5 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Menu Calendar</button>
               </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-6">
               <button 
                  onClick={() => setReportMode(true)} 
                  className="flex-1 bg-red-600 p-8 rounded-[3rem] text-white shadow-2xl shadow-red-200 border border-red-500 flex flex-col items-center justify-center gap-4 group transition-all hover:bg-red-700 active:scale-95"
               >
                  <div className="p-4 bg-white/20 rounded-3 shadow-inner group-hover:scale-110 transition-transform">
                    <AlertOctagon className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-black leading-tight uppercase tracking-tight">SOS: Report Illness</h3>
                    <p className="text-[10px] font-bold text-red-200 uppercase tracking-widest mt-1">District Emergency Response</p>
                  </div>
               </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Main Center Column */}
            <div className="lg:col-span-8 space-y-8">
               
               {/* Daily Nutrition & Menu Spotlight */}
               <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><UtensilsCrossed className="w-64 h-64 text-indigo-400" /></div>
                  <div className="flex items-center justify-between mb-10 relative z-10">
                     <div className="flex items-center gap-4">
                        <div className="p-4 bg-indigo-50 rounded-3xl"><Apple className="w-6 h-6 text-indigo-600" /></div>
                        <div>
                           <h3 className="text-2xl font-black text-gray-900 tracking-tight">Menu Spotlight</h3>
                           <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest mt-1">National Nutrition Target: Verified</p>
                        </div>
                     </div>
                     <span className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest">Oct 26, 2025</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                     <div className="space-y-6">
                        <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                           <h4 className="text-3xl font-black text-gray-900 tracking-tighter leading-tight">Nasi Kuning <br/> & Ayam Penyet</h4>
                           <p className="text-sm font-bold text-slate-400 mt-2 italic leading-relaxed">Steamed turmeric rice, grilled protein, locally sourced greens, and fresh fruit.</p>
                           <div className="mt-6 flex gap-3">
                              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-widest">High Protein</span>
                              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-widest">Nut-Free</span>
                           </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                           <NutritionTinyStat label="Calories" value="740" unit="kcal" />
                           <NutritionTinyStat label="Protein" value="32" unit="g" />
                           <NutritionTinyStat label="Fiber" value="8" unit="g" />
                        </div>
                     </div>

                     <div className="flex flex-col justify-between p-8 bg-indigo-600 rounded-[3rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Zap className="w-32 h-32" /></div>
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-200 mb-6">Nutrition Compliance Gauge</h4>
                        <div className="space-y-6">
                           <NutritionBar label="Daily Vitamin A" pct={92} />
                           <NutritionBar label="Essential Minerals" pct={85} />
                           <NutritionBar label="Energy Balance" pct={98} />
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3">
                           <BadgeCheck className="w-5 h-5 text-emerald-400" />
                           <p className="text-[11px] font-bold text-indigo-100">BGN Nutrition Standard v3.1 Metadata Hash: 0xA1...22</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Shipment History */}
               <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-50 p-3 rounded-2xl shadow-sm"><Package className="text-blue-600 w-6 h-6" /></div>
                      <h3 className="text-2xl font-black text-gray-900 tracking-tight">Shipment Log</h3>
                    </div>
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      <History className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <ShipmentItem id="MBG-982" time="10:15 AM (Live)" vendor="Bunda Catering" status="Safe" score={98} active />
                    <ShipmentItem id="MBG-981" time="Yesterday, 10:10 AM" vendor="Bunda Catering" status="Optimal" score={94} />
                    <ShipmentItem id="MBG-978" time="Oct 24, 10:12 AM" vendor="Bunda Catering" status="Optimal" score={96} />
                  </div>
               </div>
            </div>

            {/* Right Sidebar Column */}
            <div className="lg:col-span-4 space-y-8">
               
               {/* Plate Waste / Consumption Tracker */}
               <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="p-2.5 bg-emerald-50 rounded-2xl shadow-sm"><Scale className="w-5 h-5 text-emerald-600" /></div>
                     <h3 className="text-lg font-black text-gray-900 tracking-tight">Plate Waste Tracking</h3>
                  </div>
                  <div className="space-y-8">
                     <p className="text-xs font-bold text-gray-500 leading-relaxed italic text-center">
                        "Your feedback feeds the AI supply loop to reduce future waste."
                     </p>
                     
                     <div className="flex flex-col gap-3">
                        <ConsumptionBtn 
                           label="Low Waste" 
                           desc="All eaten (Perfect)" 
                           active={consumptionLevel === 'LOW'} 
                           onClick={() => setConsumptionLevel('LOW')}
                           icon={<TrendingDown className="w-4 h-4" />}
                           color="emerald"
                        />
                        <ConsumptionBtn 
                           label="Moderate" 
                           desc="Some leftovers" 
                           active={consumptionLevel === 'MED'} 
                           onClick={() => setConsumptionLevel('MED')}
                           icon={<Minus className="w-4 h-4" />}
                           color="amber"
                        />
                        <ConsumptionBtn 
                           label="High Waste" 
                           desc="Lot of leftovers" 
                           active={consumptionLevel === 'HIGH'} 
                           onClick={() => setConsumptionLevel('HIGH')}
                           icon={<TrendingUp className="w-4 h-4" />}
                           color="red"
                        />
                     </div>

                     {consumptionLevel && (
                        <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] animate-in zoom-in-95 shadow-xl transition-all active:scale-95">
                           Sync Consumption Data
                        </button>
                     )}
                  </div>
               </div>

               {/* Safety Advisory / Alerts */}
               <div className="bg-red-600 p-10 rounded-[3.5rem] border border-red-500 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><Bell className="w-48 h-48" /></div>
                  <div className="flex items-center gap-3 mb-8 relative z-10">
                     <div className="p-3 bg-white/20 rounded-2xl shadow-inner border border-white/10"><Bell className="w-6 h-6" /></div>
                     <h3 className="text-lg font-black tracking-tight leading-none uppercase tracking-tight">District Alerts</h3>
                  </div>
                  <div className="space-y-6 relative z-10">
                     <div className="p-5 bg-white/10 rounded-[2rem] border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                           <AlertCircle className="w-3.5 h-3.5 text-red-200" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-red-200">Priority: Yellow</span>
                        </div>
                        <p className="text-sm font-bold text-white leading-relaxed italic">
                           "Allergy Alert: Ensure batch verification for peanut traces in District Hub A-Zone."
                        </p>
                     </div>
                     <div className="flex items-center gap-3 px-4 py-2 border border-white/10 rounded-2xl bg-white/5">
                        <Timer className="w-4 h-4 text-white/50" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Next Inspect: 14:00 PM</span>
                     </div>
                  </div>
               </div>

               {/* Operational Checklists */}
               <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><ListChecks className="w-5 h-5 text-blue-600" /> Daily Checklists</h3>
                     <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">2/3 Done</span>
                  </div>
                  <div className="space-y-4">
                     <CheckItem label="Vendor Hygiene Sync" done />
                     <CheckItem label="Staff Wellness Log" done />
                     <CheckItem label="Shipment Verification" onClick={() => setShowChecklist(true)} />
                  </div>
                  
                  {showChecklist && (
                    <div className="mt-8 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 animate-in slide-in-from-top-4">
                       <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Shipment Inspection</h4>
                       <div className="space-y-3">
                          <label className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-300 text-indigo-600" />
                             Seal Integrity Intact
                          </label>
                          <label className="flex items-center gap-3 text-xs font-bold text-slate-700 cursor-pointer">
                             <input type="checkbox" className="w-4 h-4 rounded-lg border-slate-300 text-indigo-600" />
                             Delivery Temp Checked
                          </label>
                          <button onClick={() => setShowChecklist(false)} className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">Verify Receipt</button>
                       </div>
                    </div>
                  )}
               </div>

               {/* Vendor Spotlight */}
               <div className="p-10 bg-slate-50 rounded-[3.5rem] border border-slate-100 flex flex-col items-center text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-125 transition-transform duration-1000"><BadgeCheck className="w-48 h-48" /></div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Vendor</h4>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Bunda Catering Jakarta</h3>
                  <div className="mt-6 w-full flex gap-3">
                     <div className="flex-1 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Safety Grade</span>
                        <span className="text-lg font-black text-emerald-600">A+</span>
                     </div>
                     <div className="flex-1 p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Risk Index</span>
                        <span className="text-lg font-black text-emerald-600">1.8</span>
                     </div>
                  </div>
                  <button onClick={() => setShowAuditTrail(true)} className="w-full mt-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95 group">
                     Dossier Explorer <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
};

const NutritionTinyStat = ({ label, value, unit }: any) => (
  <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-sm text-center">
     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
     <span className="text-lg font-black text-slate-900 leading-none">{value}</span>
     <span className="text-[9px] font-bold text-slate-400 block mt-0.5 uppercase">{unit}</span>
  </div>
);

const NutritionBar = ({ label, pct }: any) => (
  <div className="space-y-2">
     <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">{label}</span>
        <span className="text-[10px] font-black text-white">{pct}%</span>
     </div>
     <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${pct}%` }} />
     </div>
  </div>
);

const ConsumptionBtn = ({ label, desc, active, onClick, icon, color }: any) => {
   const colorClasses: any = {
      emerald: active ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100',
      amber: active ? 'bg-amber-600 border-amber-600 text-white' : 'bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100',
      red: active ? 'bg-red-600 border-red-600 text-white' : 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100',
   };

   return (
      <button 
         onClick={onClick}
         className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all group ${colorClasses[color]}`}
      >
         <div className="flex items-center gap-4">
            <div className={`p-2 rounded-xl transition-colors ${active ? 'bg-white/20' : 'bg-white shadow-sm'}`}>
               {icon}
            </div>
            <div className="text-left">
               <h5 className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{label}</h5>
               <p className={`text-[9px] font-bold uppercase ${active ? 'text-white/70' : 'text-gray-400'}`}>{desc}</p>
            </div>
         </div>
         {active && <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>}
      </button>
   );
};

const CheckItem = ({ label, done, onClick }: any) => (
   <div 
      onClick={onClick}
      className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${done ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-blue-100 cursor-pointer hover:border-blue-400 shadow-sm hover:shadow-md'}`}
   >
      <span className={`text-[11px] font-black uppercase tracking-widest ${done ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{label}</span>
      <div className={`w-5 h-5 rounded-lg flex items-center justify-center ${done ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'}`}>
         {done ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </div>
   </div>
);

const ShipmentItem = ({ id, time, vendor, status, score, active }: any) => (
  <div className={`flex items-center justify-between p-6 rounded-[2.5rem] border transition-all group cursor-pointer ${active ? 'bg-white shadow-xl border-blue-100 ring-4 ring-blue-50' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-lg'}`}>
    <div className="flex items-center gap-5">
      <div className={`p-4 rounded-3xl transition-all duration-300 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white border text-slate-400 group-hover:bg-blue-50'}`}>
        <Package className="w-6 h-6" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h5 className="font-black text-base text-gray-900 tracking-tight">{id}</h5>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest border border-slate-200 px-2 py-0.5 rounded-lg">{vendor}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5">
           <Timer className="w-3.5 h-3.5 text-slate-300" />
           <p className="text-[10px] text-gray-500 font-bold uppercase">{time}</p>
        </div>
      </div>
    </div>
    <div className="text-right">
      <div className={`text-[10px] font-black uppercase tracking-widest flex items-center justify-end gap-1.5 mb-2 ${status === 'Safe' || status === 'Optimal' ? 'text-emerald-600' : 'text-amber-600'}`}>
         <ShieldCheck className="w-4 h-4" /> {status}
      </div>
      <div className="flex items-center gap-3 justify-end">
        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${score}%` }} />
        </div>
        <span className="text-[11px] font-black text-slate-400">{score}%</span>
      </div>
    </div>
  </div>
);

export default SchoolPortal;
