
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Camera, ClipboardCheck, Thermometer, Truck, Loader2, 
  CheckCircle2, AlertCircle, History, TrendingUp, 
  Package, ShieldCheck, MapPin, ChevronRight,
  Database, Leaf, Store, UserCheck, BarChart3,
  Clock, ArrowUpRight, BrainCircuit, Plus, Fingerprint, Info,
  ShieldAlert, Activity, Gauge, Zap, X, Save, ThermometerSnowflake,
  Stethoscope, Users2, MessageSquareText, Sparkles, Sun, Utensils,
  Search, Filter, SlidersHorizontal, Calendar, XCircle, FileText, ExternalLink,
  Download, RefreshCw, Smartphone, Eye, Award, FileSearch, Shield, Verified,
  Printer, Share
} from 'lucide-react';
import { analyzeKitchenPhoto } from '../geminiService';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip, CartesianGrid, XAxis, AreaChart, Area } from 'recharts';

const mockTempData = [
  { time: '08:00', temp: 4.1 },
  { time: '09:00', temp: 4.3 },
  { time: '10:00', temp: 4.2 },
  { time: '11:00', temp: 3.9 },
  { time: '12:00', temp: 4.5 },
  { time: '13:00', temp: 4.2 },
  { time: '14:00', temp: 4.1 },
];

const VendorPortal: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showNewBatchModal, setShowNewBatchModal] = useState(false);
  const [showWellnessModal, setShowWellnessModal] = useState(false);
  const [showPrepLogModal, setShowPrepLogModal] = useState(false);
  const [showBatchDetailModal, setShowBatchDetailModal] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);
  const [auditRequested, setAuditRequested] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [currentTemp, setCurrentTemp] = useState(4.2);
  const [activeTab, setActiveTab] = useState<'ops' | 'compliance' | 'traceability' | 'wellness' | 'prep_log'>('ops');
  const [riskScore, setRiskScore] = useState(1.8);
  
  // Advanced Traceability Filtering States
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL'); 

  const [traceabilityItems, setTraceabilityItems] = useState([
    { id: 1, category: "Poultry/Protein", source: "PT Berkah Ternak Jaya", batch: "L-992-K", date: "Oct 26, 2025", timestamp: new Date(2025, 9, 26).getTime(), status: "VERIFIED", icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 2, category: "Grains/Rice", source: "Bulog Region JKT", batch: "R-11-HUB", date: "Oct 25, 2025", timestamp: new Date(2025, 9, 25).getTime(), status: "VERIFIED", icon: <Database className="w-4 h-4" /> },
    { id: 3, category: "Vegetables", source: "Lembang Organic Co-op", batch: "V-VEG-44", date: "Today", timestamp: Date.now(), status: "VERIFIED", icon: <Leaf className="w-4 h-4" /> }
  ]);

  const filteredTraceabilityItems = useMemo(() => {
    return traceabilityItems.filter(item => {
      const matchesSearch = 
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.batch.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSource = sourceFilter === 'ALL' || item.source === sourceFilter;
      
      let matchesDate = true;
      if (dateFilter === 'TODAY') {
        matchesDate = item.date === 'Today';
      } else if (dateFilter === 'LAST_7') {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        matchesDate = item.timestamp >= sevenDaysAgo;
      }
      
      return matchesSearch && matchesSource && matchesDate;
    });
  }, [traceabilityItems, searchTerm, sourceFilter, dateFilter]);

  const uniqueSources = useMemo(() => {
    return ['ALL', ...Array.from(new Set(traceabilityItems.map(item => item.source)))];
  }, [traceabilityItems]);

  const isFilterActive = searchTerm !== '' || sourceFilter !== 'ALL' || dateFilter !== 'ALL';

  const clearFilters = () => {
    setSearchTerm('');
    setSourceFilter('ALL');
    setDateFilter('ALL');
  };

  const [wellnessLogs, setWellnessLogs] = useState([
    { name: "Siti Aminah", role: "Chef", status: "CLEARED", time: "06:15 AM", temp: "36.4°C" },
    { name: "Budi Santoso", role: "Prep", status: "CLEARED", time: "06:22 AM", temp: "36.6°C" },
    { name: "Dewi Lestari", role: "Packaging", status: "CLEARED", time: "07:05 AM", temp: "36.2°C" },
  ]);

  const [prepLogs, setPrepLogs] = useState([
    { time: '06:30', temp: 75.2, note: 'Initial batch heating' },
    { time: '07:45', temp: 78.5, note: 'Chicken internal temp check' },
    { time: '09:00', temp: 74.0, note: 'Holding temperature check' },
    { time: '10:15', temp: 76.2, note: 'Batch B dispatch check' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTemp(prev => {
        const change = (Math.random() - 0.5) * 0.2;
        const newTemp = parseFloat((prev + change).toFixed(1));
        
        let baseRisk = isPaused ? 0.2 : 1.5;
        if (newTemp > 5) baseRisk += (newTemp - 5) * 2;
        if (analysisResult && analysisResult.score < 80) baseRisk += 2;
        
        setRiskScore(parseFloat(Math.max(0.5, Math.min(10, baseRisk + (Math.random() * 0.4))).toFixed(1)));
        return newTemp;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [analysisResult, isPaused]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsScanning(true);
    setAnalysisResult(null);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const result = await analyzeKitchenPhoto(base64);
      setAnalysisResult(result);
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const handleWellnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading('WELLNESS');
    setTimeout(() => {
      setWellnessLogs(prev => [{
        name: "Ahmad Subagio",
        role: "Chef de Partie",
        status: "CLEARED",
        time: "Now",
        temp: "36.5°C"
      }, ...prev]);
      setIsActionLoading(null);
      setShowWellnessModal(false);
    }, 1500);
  };

  const handlePrepLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const temp = parseFloat(formData.get('temp') as string);
    const note = formData.get('note') as string;

    setIsActionLoading('PREP_LOG');
    setTimeout(() => {
      setPrepLogs(prev => [...prev, { time, temp, note }]);
      setIsActionLoading(null);
      setShowPrepLogModal(false);
    }, 1200);
  };

  const handleAddBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const category = formData.get('category') as string;
    const source = formData.get('source') as string;

    setIsActionLoading('ADDING_BATCH');
    setTimeout(() => {
      setTraceabilityItems(prev => [{
        id: Date.now(),
        category,
        source,
        batch: `B-${Math.floor(Math.random() * 1000)}`,
        date: "Today",
        timestamp: Date.now(),
        status: "VERIFIED",
        icon: <Plus className="w-4 h-4" />
      }, ...prev]);
      setIsActionLoading(null);
      setShowNewBatchModal(false);
    }, 1500);
  };

  const handleAuditRequest = () => {
    setIsActionLoading('Audit');
    setTimeout(() => {
      setIsActionLoading(null);
      setAuditRequested(true);
      // Reset after 10 seconds for demo purposes
      setTimeout(() => setAuditRequested(false), 10000);
    }, 2500);
  };

  const handleOpenDossier = () => {
    setIsActionLoading('Dossier Download');
    setTimeout(() => {
      setIsActionLoading(null);
      setShowDossierModal(true);
    }, 2000);
  };

  const handleSyncBlockchain = () => {
    setIsActionLoading('SYNC');
    setTimeout(() => {
      setIsActionLoading(null);
      alert("Traceability ledger synchronized with national BGN nodes.");
    }, 2500);
  };

  const openBatchDetail = (item: any) => {
    setSelectedBatch(item);
    setShowBatchDetailModal(true);
  };

  const getRiskColor = (score: number) => {
    if (isPaused) return 'text-slate-600 bg-slate-50 border-slate-100';
    if (score >= 7) return 'text-red-600 bg-red-50 border-red-100';
    if (score >= 4) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-emerald-600 bg-emerald-50 border-emerald-100';
  };

  return (
    <div className={`max-w-6xl mx-auto space-y-6 text-left transition-opacity duration-500 pb-12 ${isPaused ? 'opacity-80' : 'opacity-100'}`}>
      
      {/* Modals */}
      {showNewBatchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleAddBatch} className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Log Supply Batch</h3>
              <button type="button" onClick={() => setShowNewBatchModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <input required name="category" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Category (e.g. Rice)" />
              <input required name="source" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Supplier Name" />
              <button disabled={!!isActionLoading} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                {isActionLoading === 'ADDING_BATCH' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Log Entry
              </button>
            </div>
          </form>
        </div>
      )}

      {showWellnessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handleWellnessSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Staff Health Check-in</h3>
              <button type="button" onClick={() => setShowWellnessModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <input required className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Staff Full Name" />
              <div className="grid grid-cols-2 gap-3">
                 <input required type="number" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-indigo-100" placeholder="Temp (°C)" />
                 <select className="w-full p-4 bg-gray-50 rounded-2xl border outline-none text-xs font-bold uppercase cursor-pointer">
                   <option>Chef</option>
                   <option>Prep Area</option>
                   <option>Logistics</option>
                 </select>
              </div>
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border cursor-pointer hover:bg-slate-100 transition-colors">
                <input type="checkbox" required className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-xs font-bold text-gray-700">I verify I have zero symptoms (Nausea/Fever)</span>
              </label>
              <button disabled={!!isActionLoading} type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                {isActionLoading === 'WELLNESS' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Sign Digital Record
              </button>
            </div>
          </form>
        </div>
      )}

      {showPrepLogModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <form onSubmit={handlePrepLogSubmit} className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">Log Prep Temperature</h3>
              <button type="button" onClick={() => setShowPrepLogModal(false)}><X className="w-6 h-6" /></button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3 mb-2">
                <Thermometer className="w-5 h-5 text-orange-600" />
                <p className="text-[10px] text-orange-800 font-black uppercase tracking-widest leading-tight">Minimum safe internal temperature: 75°C.</p>
              </div>
              <input required type="number" name="temp" step="0.1" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-orange-100" placeholder="Temperature (°C)" />
              <textarea required name="note" className="w-full p-4 bg-gray-50 rounded-2xl border outline-none focus:ring-2 focus:ring-orange-100 h-24" placeholder="Brief observation note (e.g., Batch A Center)"></textarea>
              <button disabled={!!isActionLoading} type="submit" className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg">
                {isActionLoading === 'PREP_LOG' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Commit to Ledger
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Safety Dossier Modal */}
      {showDossierModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-100">
            <div className="flex justify-between items-start mb-10">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-indigo-600 rounded-3xl shadow-xl rotate-3">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-gray-900 leading-none">Safety Intelligence Dossier</h3>
                  <p className="text-xs text-indigo-600 font-black uppercase tracking-widest mt-2">Vendor Integrity Profile • 2025/2026 Season</p>
                </div>
              </div>
              <button onClick={() => setShowDossierModal(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-colors"><X className="w-6 h-6 text-slate-400" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                  <Award className="w-8 h-8 text-amber-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Trust Rating</span>
                  <span className="text-3xl font-black text-slate-900 mt-1">Grade A+</span>
               </div>
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                  <Verified className="w-8 h-8 text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Rate</span>
                  <span className="text-3xl font-black text-slate-900 mt-1">100%</span>
               </div>
               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center">
                  <Activity className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Scans</span>
                  <span className="text-3xl font-black text-slate-900 mt-1">24.2</span>
               </div>
            </div>

            <div className="space-y-8">
               <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100">
                  <div className="flex items-center gap-3 mb-4">
                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest leading-none">AI Insight Summary</h4>
                  </div>
                  <p className="text-sm font-bold text-indigo-800 leading-relaxed italic">
                    "This vendor demonstrates exceptional hygiene consistency. Cold-chain variance is below 0.5% over the last 90 days. Multimodal vision scans confirm 100% PPE compliance across all meal preparation shifts. Recommended for priority district expansion."
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <History className="w-4 h-4" /> Audit Milestones
                     </h4>
                     <div className="space-y-3">
                        <AuditLogItem date="Oct 20, 2025" event="Official BPOM On-Site" status="PASSED" />
                        <AuditLogItem date="Sep 12, 2025" event="IoT Telemetry Node Sync" status="PASSED" />
                        <AuditLogItem date="Aug 05, 2025" event="UMKM Hygiene Certification" status="RENEWED" />
                     </div>
                  </div>
                  <div className="space-y-4">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="w-4 h-4" /> Integrity Proofs
                     </h4>
                     <div className="space-y-2">
                        <div className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group cursor-default">
                           <div className="flex items-center gap-2">
                              <Fingerprint className="w-4 h-4 text-slate-300" />
                              <span className="text-[10px] font-mono text-slate-500">0x8f2a...e912</span>
                           </div>
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group cursor-default">
                           <div className="flex items-center gap-2">
                              <Fingerprint className="w-4 h-4 text-slate-300" />
                              <span className="text-[10px] font-mono text-slate-500">0x3c1b...f0a1</span>
                           </div>
                           <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-4">
               <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95">
                 <Printer className="w-4 h-4" /> Print Report
               </button>
               <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                 <Share className="w-4 h-4" /> Share Link
               </button>
            </div>
          </div>
        </div>
      )}

      {showBatchDetailModal && selectedBatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 leading-tight">Batch Details: {selectedBatch.batch}</h3>
                  <p className="text-xs text-emerald-600 font-black uppercase tracking-widest">{selectedBatch.category}</p>
                </div>
              </div>
              <button onClick={() => setShowBatchDetailModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><X className="w-6 h-6" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sourcing Metadata</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500">Supplier:</span>
                      <span className="text-xs font-black text-gray-900">{selectedBatch.source}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500">Status:</span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100 uppercase">{selectedBatch.status}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500">Date Received:</span>
                      <span className="text-xs font-black text-gray-900">{selectedBatch.date}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <div className="flex items-center gap-2 mb-4">
                    <BrainCircuit className="w-4 h-4 text-indigo-600" />
                    <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">AI Hygiene Score</h4>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-black text-indigo-600">92/100</div>
                    <p className="text-[10px] font-bold text-indigo-700 leading-tight">
                      Prep area photo scan shows 92% compliance with BPOM sanitation guidelines.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Cold-Chain History</h4>
                  <div className="h-[120px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockTempData}>
                        <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={3} dot={false} />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 10]} />
                        <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-[9px] text-center text-slate-400 font-bold mt-2 uppercase">24H Storage Variance: +/- 0.4°C</p>
                </div>

                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Verification Documents</h4>
                   <div className="space-y-2">
                     <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                           <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                           <span className="text-[10px] font-black text-gray-700">Origin_Certificate.pdf</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                     </div>
                     <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors group cursor-pointer">
                        <div className="flex items-center gap-2">
                           <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                           <span className="text-[10px] font-black text-gray-700">Hygiene_Audit_Log.json</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                     </div>
                   </div>
                </div>
              </div>
            </div>

            <button onClick={() => setShowBatchDetailModal(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg hover:bg-slate-800 transition-colors active:scale-95">
              Done
            </button>
          </div>
        </div>
      )}

      {/* Audit Success Banner */}
      {auditRequested && (
        <div className="p-4 bg-blue-600 text-white rounded-[2rem] shadow-xl flex items-center justify-between animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl"><FileSearch className="w-5 h-5" /></div>
            <p className="text-xs font-black uppercase tracking-widest">Audit Request Sent: An official inspection has been scheduled with BGN District Office.</p>
          </div>
          <button onClick={() => setAuditRequested(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Header Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className={`lg:col-span-3 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px] transition-colors duration-700 ${isPaused ? 'bg-red-950' : 'bg-slate-900'}`}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-3 rounded-2xl transition-colors ${isPaused ? 'bg-red-600' : 'bg-blue-600'}`}>
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                  Bunda Catering Jakarta
                  {isPaused && <span className="text-xs px-2 py-1 bg-red-600 rounded-full animate-pulse uppercase">Suspended</span>}
                </h2>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3 h-3" /> South Jakarta UMKM Hub • Region A-12
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
             <ShieldCheck className="w-8 h-8 text-emerald-600" />
          </div>
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Trust Status</h4>
          <div className="text-3xl font-black text-emerald-600 tracking-tighter mt-1">Grade A+</div>
          <div className="mt-2 text-[10px] font-bold text-gray-400">Verified by BPOM v2</div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100 rounded-2xl w-fit overflow-x-auto max-w-full no-scrollbar">
        {['ops', 'prep_log', 'compliance', 'traceability', 'wellness'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Main Content */}
        <div className="lg:col-span-8 space-y-6">
          
          {activeTab === 'ops' && (
            <>
              {/* IoT Telemetry */}
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2.5 rounded-2xl"><Thermometer className="w-5 h-5 text-blue-600" /></div>
                    <h3 className="text-lg font-black text-gray-900 leading-none">Cold-Chain Telemetry</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-gray-900">{currentTemp}°C</div>
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active • COOL-042</span>
                  </div>
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockTempData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={4} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* AI Safety Forecast Widget */}
              <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 text-white relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-indigo-500/20 rounded-xl"><Sparkles className="w-4 h-4 text-indigo-400" /></div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300">24H Safety Prediction</h4>
                      </div>
                      <h3 className="text-2xl font-black mb-2">Stability Forecast: High</h3>
                      <p className="text-xs text-slate-400 leading-relaxed font-medium">
                        Based on Jakarta heat trends (34°C predicted) and your recent fridge stability, AI predicts a 99% safety rating for tomorrow's batch.
                      </p>
                      <div className="mt-6 flex gap-4">
                        <div className="flex items-center gap-2"><Sun className="w-4 h-4 text-orange-400" /> <span className="text-[10px] font-bold">Intense Heat Risk: LOW</span></div>
                        <div className="flex items-center gap-2"><ThermometerSnowflake className="w-4 h-4 text-blue-400" /> <span className="text-[10px] font-bold">Compressor Health: 94%</span></div>
                      </div>
                   </div>
                   <div className="w-full md:w-48 h-24 bg-indigo-500/10 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                      <div className="text-4xl font-black text-indigo-400">99.2</div>
                      <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">Stability Index</div>
                   </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'prep_log' && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-2.5 rounded-2xl"><Utensils className="w-5 h-5 text-orange-600" /></div>
                    <h3 className="text-lg font-black text-gray-900 leading-none">Preparation Heat Map</h3>
                  </div>
                  <button onClick={() => setShowPrepLogModal(true)} className="px-5 py-2 bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-orange-700 transition-all shadow-md active:scale-95">
                    <Plus className="w-4 h-4" /> New Prep Log
                  </button>
                </div>
                
                <div className="h-[240px] w-full mb-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prepLogs} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                      <YAxis hide domain={[60, 90]} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                      <Area type="monotone" dataKey="temp" stroke="#f97316" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Fingerprint className="w-3.5 h-3.5" /> Verified Heat Logs</h4>
                   {prepLogs.slice().reverse().map((log, i) => (
                     <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100 hover:bg-white hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-white border flex items-center justify-center text-orange-600"><Thermometer className="w-5 h-5" /></div>
                           <div>
                              <p className="text-sm font-black text-gray-900">{log.temp}°C Internal</p>
                              <p className="text-[10px] text-gray-500 font-medium">{log.note}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <span className="text-[10px] font-black text-slate-400 uppercase">{log.time}</span>
                           <div className="flex items-center gap-1 mt-1 justify-end">
                              <ShieldCheck className="w-3 h-3 text-emerald-500" />
                              <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Hash-Verified</span>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'wellness' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg"><Stethoscope className="w-6 h-6 text-white" /></div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">Staff Wellness Ledger</h3>
                    <p className="text-xs text-gray-500 font-medium italic">Verified biometric logs for shift clearance.</p>
                  </div>
                </div>
                <button onClick={() => setShowWellnessModal(true)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-transform active:scale-95 shadow-md">
                  <Plus className="w-4 h-4" /> Log Health Check
                </button>
              </div>

              <div className="space-y-3">
                {wellnessLogs.map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem] border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white border flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Users2 className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 leading-none">{log.name}</h4>
                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-1.5 block">{log.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-10">
                      <div className="text-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block mb-1">Temp</span>
                        <span className="text-sm font-black text-gray-900">{log.temp}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase tracking-widest">
                           {log.status}
                        </span>
                        <p className="text-[9px] text-gray-400 font-bold mt-1.5 uppercase">{log.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-indigo-50 rounded-2xl"><Camera className="w-5 h-5 text-indigo-600" /></div>
                      <h3 className="text-xl font-black">AI Hygiene Audit</h3>
                   </div>
                   {analysisResult && (
                      <button onClick={() => setAnalysisResult(null)} className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1 hover:text-indigo-600 transition-colors">
                         <RefreshCw className="w-3.5 h-3.5" /> Re-Scan
                      </button>
                   )}
                </div>

                {!analysisResult ? (
                   <div className="p-16 border-2 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center text-center group hover:border-indigo-100 transition-all">
                      {isScanning ? (
                         <div className="flex flex-col items-center">
                            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
                            <p className="text-sm font-black text-indigo-900 uppercase tracking-widest animate-pulse">Analyzing Sanitation Standards...</p>
                         </div>
                      ) : (
                         <>
                            <div className="p-6 bg-slate-50 rounded-full mb-6 group-hover:scale-110 transition-transform">
                               <Smartphone className="w-12 h-12 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                            </div>
                            <p className="text-sm font-bold text-gray-400 max-w-xs leading-relaxed">Take a photo of the food preparation area to start deep hygiene analysis.</p>
                            <input type="file" className="hidden" id="compliance-upload" accept="image/*" onChange={handlePhotoUpload} />
                            <label htmlFor="compliance-upload" className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95">Open Camera</label>
                         </>
                      )}
                   </div>
                ) : (
                   <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                         <div className="md:col-span-4 flex flex-col items-center justify-center p-10 bg-slate-900 rounded-[3rem] text-white">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Audit Score</span>
                            <div className={`text-6xl font-black tracking-tighter ${analysisResult.score > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
                               {analysisResult.score}
                            </div>
                            <div className={`mt-4 px-3 py-1 rounded-full text-[10px] font-black uppercase ${analysisResult.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                               {analysisResult.passed ? 'VERIFIED' : 'ACTION REQUIRED'}
                            </div>
                         </div>
                         <div className="md:col-span-8 p-6 bg-slate-50 rounded-[3rem] border border-slate-100 h-full">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               <Eye className="w-3.5 h-3.5" /> Visual Observations
                            </h4>
                            <ul className="space-y-2">
                               {analysisResult.observations.map((obs: string, i: number) => (
                                  <li key={i} className="text-xs font-bold text-slate-700 flex items-start gap-2">
                                     <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                                     {obs}
                                  </li>
                               ))}
                            </ul>
                         </div>
                      </div>
                   </div>
                )}
            </div>
          )}
          
          {activeTab === 'traceability' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm relative overflow-hidden min-h-[500px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-emerald-600 p-3 rounded-2xl shadow-lg">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 leading-tight">Batch Traceability</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Sourcing & Origin Verification</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                      onClick={handleSyncBlockchain}
                      disabled={isActionLoading === 'SYNC'}
                      className="p-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-xl hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50"
                   >
                      {isActionLoading === 'SYNC' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                   </button>
                   <button 
                    onClick={() => setShowNewBatchModal(true)} 
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-md active:scale-95 shrink-0"
                   >
                    <Plus className="w-4 h-4" /> Log New Batch
                   </button>
                </div>
              </div>

              {/* Advanced Search and Filter Panel */}
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 mb-8 space-y-4">
                <div className="flex items-center justify-between">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><SlidersHorizontal className="w-3.5 h-3.5" /> Inventory Filters</h4>
                   {isFilterActive && (
                     <button onClick={clearFilters} className="text-[9px] font-black text-red-500 uppercase tracking-widest flex items-center gap-1 hover:text-red-700 transition-colors">
                       <XCircle className="w-3.5 h-3.5" /> Clear All
                     </button>
                   )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-6 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Search batches (e.g. 'Rice', 'L-992-K')..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                    />
                  </div>
                  <div className="md:col-span-3 relative group">
                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <select 
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-100 appearance-none cursor-pointer"
                    >
                      {uniqueSources.map(source => (
                        <option key={source} value={source}>{source === 'ALL' ? 'Filter Source' : source}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-3 relative group">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <select 
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-emerald-100 appearance-none cursor-pointer"
                    >
                      <option value="ALL">All Dates</option>
                      <option value="TODAY">Created Today</option>
                      <option value="LAST_7">Last 7 Days</option>
                    </select>
                  </div>
                </div>
              </div>

              {filteredTraceabilityItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {filteredTraceabilityItems.map((item) => (
                    <TraceabilityCard key={item.id} {...item} onClick={() => openBatchDetail(item)} />
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                  <div className="p-6 bg-white rounded-full shadow-sm mb-4">
                    <Search className="w-10 h-10 text-slate-100" />
                  </div>
                  <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">No matching batches found</h4>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Try resetting your filters or using broader keywords.</p>
                  <button onClick={clearFilters} className="mt-6 text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-600/30 hover:border-emerald-600 transition-all">Clear active filters</button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Risk Profile Gauge */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-xl text-center">
             <div className="flex items-center justify-center gap-2 mb-6">
                <Gauge className="w-4 h-4 text-gray-400" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Live Risk Coefficient</h4>
             </div>
             <div className={`text-6xl font-black tracking-tighter mb-2 ${riskScore > 7 ? 'text-red-600' : riskScore > 4 ? 'text-orange-500' : 'text-emerald-500'}`}>
                {riskScore.toFixed(1)}
             </div>
             <div className={`inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getRiskColor(riskScore)}`}>
               {isPaused ? 'OFFLINE' : riskScore > 7 ? 'CRITICAL' : 'OPTIMAL'}
             </div>
             <p className="text-[10px] text-gray-400 mt-6 font-bold leading-relaxed italic">
               Risk score is a weighted average of IoT telemetry, staff health, and AI compliance frequency.
             </p>
          </div>

          {/* School Feedback Feed */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden">
             <div className="flex items-center gap-2 mb-8">
               <MessageSquareText className="w-4 h-4 text-blue-600" />
               <h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Direct Feedback</h4>
             </div>
             <div className="space-y-6">
                <FeedbackItem school="SDN 01 Menteng" sentiment="positive" text="Portion size is great, chicken fully cooked!" time="Today" />
                <FeedbackItem school="SMPN 12 Bandung" sentiment="neutral" text="Rice was a bit dry, but overall safe and fresh." time="Yesterday" />
                <FeedbackItem school="SDN 05 Tebet" sentiment="positive" text="Students loved the fruit variety today." time="Oct 24" />
             </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 font-sans">Rapid Actions</h4>
            <div className="space-y-3">
              <ActionButton 
                onClick={() => setIsPaused(!isPaused)} 
                icon={isPaused ? <Zap className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />} 
                label={isPaused ? "Resume Operations" : "Emergency Pause"} 
                color={isPaused ? "text-emerald-600 bg-emerald-50" : "text-red-600 bg-red-50"} 
              />
              <ActionButton 
                onClick={handleAuditRequest} 
                loading={isActionLoading === 'Audit'}
                icon={<History className="w-4 h-4" />} 
                label="Request Audit" 
                color="text-blue-600 bg-blue-50" 
              />
              <ActionButton 
                onClick={handleOpenDossier} 
                loading={isActionLoading === 'Dossier Download'}
                icon={<Download className="w-4 h-4" />} 
                label="Safety Dossier" 
                color="text-indigo-600 bg-indigo-50" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditLogItem = ({ date, event, status }: { date: string, event: string, status: string }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-100 transition-colors">
     <div>
       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">{date}</span>
       <h5 className="text-xs font-bold text-slate-800">{event}</h5>
     </div>
     <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">{status}</span>
  </div>
);

const FeedbackItem = ({ school, sentiment, text, time }: any) => (
  <div className="relative pl-4 border-l-2 border-gray-100">
    <div className={`absolute -left-[5px] top-0 w-2 h-2 rounded-full ${sentiment === 'positive' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
    <h5 className="text-[11px] font-black text-gray-900">{school}</h5>
    <p className="text-[10px] text-gray-500 font-medium italic mt-1 leading-relaxed">"{text}"</p>
    <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest mt-2 block">{time}</span>
  </div>
);

const TraceabilityCard = ({ category, source, batch, date, status, icon, onClick }: any) => (
  <div 
    onClick={onClick}
    className="p-5 border border-gray-100 rounded-3xl bg-gray-50/50 hover:bg-white hover:shadow-xl transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">{icon}</div>
        <div><h5 className="text-xs font-black text-gray-900 leading-none">{category}</h5><span className="text-[8px] font-black text-gray-400 uppercase mt-1 block tracking-widest">{batch}</span></div>
      </div>
      <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-widest">{status}</span>
    </div>
    <div className="flex items-center justify-between mt-2">
       <div>
         <p className="text-[11px] font-black text-gray-800">{source}</p>
         <p className="text-[9px] text-gray-400 font-bold mt-0.5 uppercase tracking-tighter">{date}</p>
       </div>
       <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-emerald-600 transition-colors" />
    </div>
  </div>
);

const ActionButton = ({ icon, label, color, onClick, loading = false }: any) => (
  <button 
    onClick={onClick} 
    disabled={loading}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all active:scale-[0.98] disabled:opacity-50 ${color}`}
  >
    <div className="flex items-center gap-3">
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      <span className="text-xs font-black uppercase tracking-widest">{label}</span>
    </div>
    <ChevronRight className={`w-4 h-4 transition-transform ${loading ? 'opacity-0' : ''}`} />
  </button>
);

export default VendorPortal;
