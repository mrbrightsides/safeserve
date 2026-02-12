import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from './types';
import RegulatorDashboard from './components/RegulatorDashboard';
import VendorPortal from './components/VendorPortal';
import SchoolPortal from './components/SchoolPortal';
import SustainabilityPortal from './components/SustainabilityPortal';
import Sidebar from './components/Sidebar';
import SafetyAssistant from './components/SafetyAssistant';
import { 
  Shield, ChevronDown, User, Settings, LogOut, Activity, 
  Database, FileText, RefreshCcw, Sparkles,
  Loader2, Bell, ShieldCheck, Cpu, HardDrive, 
  X, Fingerprint, Lock, ShieldAlert, Zap, Search,
  ShieldQuestion, Scan, ArrowRight, Utensils, Heart, Globe,
  LayoutDashboard, Truck, School, Leaf,
  BrainCircuit, Thermometer, Info, BadgeCheck, ExternalLink,
  Users, AlertCircle, CheckCircle2, Siren, Clock
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO' | 'SUCCESS';
  read: boolean;
}

const App: React.FC = () => {
  const [view, setView] = useState<'LANDING' | 'DASHBOARD'>('LANDING');
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.REGULATOR);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  
  // Admin Action States
  const [isGeneratingBriefing, setIsGeneratingBriefing] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [sysHealth, setSysHealth] = useState<'IDLE' | 'CHECKING' | 'OPTIMAL'>('OPTIMAL');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isFlushing, setIsFlushing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());
  
  // Security Modal Dynamics
  const [rootKey, setRootKey] = useState("0x8F...A912");
  const [isRotating, setIsRotating] = useState(false);
  const [isScanningVault, setIsScanningVault] = useState(false);
  const [vaultStatus, setVaultStatus] = useState<'SECURE' | 'SCANNING' | 'VERIFIED'>('SECURE');

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: '1', title: 'Outbreak Detected', desc: 'Cluster A-12 in West Jakarta reports symptom spike.', time: '2m ago', type: 'CRITICAL', read: false },
    { id: '2', title: 'Node Sync Success', desc: 'Regional hub JKT-01 successfully synchronized.', time: '15m ago', type: 'SUCCESS', read: false },
    { id: '3', title: 'Safety Advisory', desc: 'New peanut allergen advisory for West Java region.', time: '1h ago', type: 'WARNING', read: true },
    { id: '4', title: 'Trust Score Update', desc: 'Bunda Catering trust score elevated to A+.', time: '3h ago', type: 'INFO', read: true },
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const launchPortal = (role: UserRole) => {
    setActiveRole(role);
    setView('DASHBOARD');
  };

  const generateAIBriefing = async () => {
    setIsGeneratingBriefing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Summarize the current status of a national food safety program. Mention: 1.2M beneficiaries, 94% supply health, and 14k meals saved. Be concise, authoritative, and professional for an Admin briefing."
      });
      setBriefing(response.text || "Status: All systems nominal. Security protocols verified.");
    } catch (error) {
      setBriefing("Morning Intelligence: Regional stability high. No critical supply chain disruptions in the last 6 hours.");
    } finally {
      setIsGeneratingBriefing(false);
    }
  };

  const handleSystemDiagnostic = () => {
    setSysHealth('CHECKING');
    setTimeout(() => setSysHealth('OPTIMAL'), 2000);
  };

  const handleNodeSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 2500);
  };

  const handleExportLedger = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dummyData = {
        platform: "SafeServe MBG",
        timestamp: new Date().toISOString(),
        role: activeRole,
      };
      const blob = new Blob([JSON.stringify(dummyData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SafeServe_Audit_${activeRole}.json`;
      a.click();
      setIsExporting(false);
    }, 1500);
  };

  const handleFlushCache = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setBriefing(null);
      setSysHealth('OPTIMAL');
      setIsFlushing(false);
      setIsProfileOpen(false);
    }, 2000);
  };

  const handleSecurityPrefs = () => {
    setIsProfileOpen(false);
    setIsSecurityModalOpen(true);
  };

  const rotateRootKey = () => {
    setIsRotating(true);
    setTimeout(() => {
      const newKey = "0x" + Math.random().toString(16).slice(2, 6).toUpperCase() + "..." + Math.random().toString(16).slice(2, 6).toUpperCase();
      setRootKey(newKey);
      setIsRotating(false);
    }, 1200);
  };

  const triggerVaultScan = () => {
    setIsScanningVault(true);
    setVaultStatus('SCANNING');
    setTimeout(() => {
      setIsScanningVault(false);
      setVaultStatus('VERIFIED');
      setTimeout(() => setVaultStatus('SECURE'), 3000);
    }, 3000);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const renderContent = () => {
    switch (activeRole) {
      case UserRole.REGULATOR: return <RegulatorDashboard />;
      case UserRole.VENDOR: return <VendorPortal />;
      case UserRole.SCHOOL: return <SchoolPortal />;
      case UserRole.SUSTAINABILITY: return <SustainabilityPortal />;
      default: return <RegulatorDashboard />;
    }
  };

  if (view === 'LANDING') {
    return (
      <div className="min-h-screen bg-white text-left selection:bg-indigo-100 animate-in fade-in duration-700">
        {/* Navigation */}
        <nav className="px-10 py-8 flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-100">
              <Shield className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black text-gray-900 tracking-tight">SafeServe MBG</h1>
          </div>
          <div className="flex items-center gap-8">
            <a 
              href="https://github.com/mrbrightsides/safeserve" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]"
            >
              Documentation
            </a>
            <a 
              href="https://standarpangan.pom.go.id/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest text-[10px]"
            >
              BPOM Standards
            </a>
            <button 
              onClick={() => launchPortal(UserRole.REGULATOR)}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
            >
              Access Command Center
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="px-10 py-20 max-w-7xl mx-auto relative overflow-hidden">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 relative z-10">
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-2xl">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Next-Gen Food Safety Intelligence</span>
                 </div>
                 <h1 className="text-7xl font-black text-gray-900 tracking-tighter leading-[1.1]">
                   Securing <br/> Indonesia's <br/> <span className="text-red-600">Future.</span>
                 </h1>
                 <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                   The unified AI command center for the <span className="text-gray-900 font-bold">Makan Bergizi Gratis</span> program. 
                   Real-time oversight for 83 million beneficiaries.
                 </p>
                 <div className="flex gap-4">
                    <button 
                      onClick={() => {
                        const el = document.getElementById('role-selector');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-3"
                    >
                      Choose Your Portal <ArrowRight className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-4 px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl">
                       <div className="flex -space-x-3">
                          {[1, 2, 3].map(i => (
                            <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" alt="User" />
                          ))}
                       </div>
                       <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                          1.2M Nodes Verified
                       </div>
                    </div>
                 </div>
              </div>
              
              <div className="relative">
                 <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] rounded-full" />
                 <div className="bg-slate-900 p-1 rounded-[3.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] relative">
                    <div className="bg-white rounded-[3.2rem] overflow-hidden">
                       <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=1200" className="w-full h-[500px] object-cover opacity-90 hover:scale-105 transition-transform duration-1000" alt="Kitchen Inspection" />
                       <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
                       <div className="absolute bottom-10 left-10 right-10 flex gap-4">
                          <div className="flex-1 bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                             <div className="text-3xl font-black text-white">99.2%</div>
                             <div className="text-[9px] font-black text-white/70 uppercase tracking-widest">Safety Compliance</div>
                          </div>
                          <div className="flex-1 bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/20">
                             <div className="text-3xl font-black text-white">14.2k</div>
                             <div className="text-[9px] font-black text-white/70 uppercase tracking-widest">Meals Saved</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Triple Shield Tech */}
        <section className="px-10 py-32 bg-slate-50 border-y border-slate-100">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
              <TechCard 
                icon={<BrainCircuit className="w-8 h-8 text-indigo-600" />} 
                title="AI Safety Triage" 
                desc="Predictive modeling of outbreak risks using hybrid BGN standards and real-time social cluster sentiment." 
              />
              <TechCard 
                icon={<Thermometer className="w-8 h-8 text-blue-600" />} 
                title="IoT Cold-Chain" 
                desc="Live telemetry from transport refrigeration units ensures temperature-controlled safety for every batch." 
              />
              <TechCard 
                icon={<Database className="w-8 h-8 text-emerald-600" />} 
                title="Blockchain Traceability" 
                desc="Immutable provenance for every ingredient, vendor audit, and hygiene scan stored on national nodes." 
              />
           </div>
        </section>

        {/* Role Selector */}
        <section id="role-selector" className="px-10 py-32 max-w-7xl mx-auto">
           <div className="text-center mb-20 space-y-4">
              <h2 className="text-5xl font-black text-gray-900 tracking-tight">Access Your Portal</h2>
              <p className="text-slate-500 font-medium max-w-xl mx-auto">Select your specialized command center to begin monitoring and managing the MBG safety loop.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <RoleEntryCard 
                icon={<LayoutDashboard className="w-6 h-6" />}
                title="Regulator"
                role={UserRole.REGULATOR}
                desc="National oversight, risk heatmaps, and outbreak prediction."
                color="bg-slate-900"
                onClick={() => launchPortal(UserRole.REGULATOR)}
              />
              <RoleEntryCard 
                icon={<Truck className="w-6 h-6" />}
                title="Vendor"
                role={UserRole.VENDOR}
                desc="UMKM catering management, AI hygiene audits, and batch logs."
                color="bg-blue-600"
                onClick={() => launchPortal(UserRole.VENDOR)}
              />
              <RoleEntryCard 
                icon={<School className="w-6 h-6" />}
                title="School Admin"
                role={UserRole.SCHOOL}
                desc="Shipment verification, symptom triage, and student feedback."
                color="bg-red-600"
                onClick={() => launchPortal(UserRole.SCHOOL)}
              />
              <RoleEntryCard 
                icon={<Leaf className="w-6 h-6" />}
                title="Sustainability"
                role={UserRole.SUSTAINABILITY}
                desc="Waste reduction algorithms and ecological impact matrix."
                color="bg-emerald-600"
                onClick={() => launchPortal(UserRole.SUSTAINABILITY)}
              />
           </div>
        </section>

        {/* Footer */}
        <footer className="p-20 bg-slate-900 text-white text-center">
           <div className="max-w-xl mx-auto space-y-8">
              <div className="flex items-center justify-center gap-3">
                <div className="bg-red-600 p-2 rounded-xl">
                  <Shield className="text-white w-5 h-5" />
                </div>
                <h3 className="text-xl font-black">SafeServe MBG</h3>
              </div>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">
                Empowering the nation through safety. SafeServe is a technology partner of the BGN (Badan Gizi Nasional) initiative.
              </p>
              <div className="pt-8 border-t border-white/5 flex items-center justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span>v1.3.0 ALPHA</span>
                 <span>JK-A1 NODE ACTIVE</span>
                 <span>© 2026 SAFESERVE ID</span>
              </div>
           </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-left animate-in fade-in duration-500">
      <Sidebar 
        activeRole={activeRole} 
        onRoleChange={setActiveRole} 
        onSettingsClick={() => setIsSecurityModalOpen(true)}
        onInfoClick={() => setIsAboutModalOpen(true)}
      />

      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setView('LANDING')} className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-100 hover:scale-105 transition-transform cursor-pointer">
              <Shield className="text-white w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-gray-900 leading-none tracking-tight">SafeServe MBG</h1>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">
                National Oversight • Hub ID: JK-A1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl relative" ref={notificationsRef}>
                <button 
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                  className={`relative p-2 rounded-xl transition-all ${isNotificationsOpen ? 'bg-slate-900 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-400'}`}
                >
                   <Bell className="w-5 h-5" />
                   {unreadCount > 0 && (
                     <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[8px] font-black text-white">{unreadCount}</span>
                     </div>
                   )}
                </button>
                
                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300 z-50">
                    <div className="p-8 bg-slate-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-lg font-black tracking-tight">System Alerts</h3>
                      </div>
                      <button onClick={markAllAsRead} className="text-[9px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Mark All Read</button>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div key={n.id} className={`p-6 border-b border-slate-50 flex items-start gap-4 transition-all hover:bg-slate-50 relative ${!n.read ? 'bg-indigo-50/30' : ''}`}>
                            <div className={`p-2 rounded-xl shrink-0 ${
                              n.type === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                              n.type === 'WARNING' ? 'bg-amber-100 text-amber-600' :
                              n.type === 'SUCCESS' ? 'bg-emerald-100 text-emerald-600' :
                              'bg-indigo-100 text-indigo-600'
                            }`}>
                              {n.type === 'CRITICAL' ? <Siren className="w-4 h-4" /> : 
                               n.type === 'WARNING' ? <AlertCircle className="w-4 h-4" /> :
                               n.type === 'SUCCESS' ? <CheckCircle2 className="w-4 h-4" /> :
                               <Info className="w-4 h-4" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className={`text-xs font-black ${!n.read ? 'text-gray-900' : 'text-slate-500'}`}>{n.title}</h4>
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{n.time}</span>
                              </div>
                              <p className="text-[10px] font-medium text-slate-500 leading-relaxed">{n.desc}</p>
                            </div>
                            {!n.read && <div className="absolute right-6 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-indigo-600 rounded-full" />}
                          </div>
                        ))
                      ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                          <Bell className="w-10 h-10 mb-4 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest">No Active Notifications</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 pt-0">
                      <button onClick={clearNotifications} className="w-full mt-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors border-t border-slate-100">Clear History</button>
                    </div>
                  </div>
                )}

                <div className="w-px h-4 bg-slate-200 mx-1" />
                <div className="flex items-center gap-1.5">
                   <Cpu className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Sync: {lastSync}</span>
                </div>
             </div>

             <div className="relative" ref={dropdownRef}>
               <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className={`flex items-center gap-4 p-1.5 pl-4 rounded-2xl transition-all cursor-pointer ${isProfileOpen ? 'bg-slate-900 text-white shadow-xl' : 'hover:bg-slate-50 border border-transparent hover:border-slate-200'}`}
               >
                 <div className="hidden md:flex flex-col items-end">
                    <span className={`text-sm font-black tracking-tight ${isProfileOpen ? 'text-white' : 'text-gray-900'}`}>
                      {activeRole === UserRole.REGULATOR ? "Dr. Budi Santoso" : 
                       activeRole === UserRole.VENDOR ? "Bunda Catering" : 
                       activeRole === UserRole.SUSTAINABILITY ? "Eco Officer" : "Sdn 01 Admin"}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isProfileOpen ? 'text-indigo-400' : 'text-indigo-600'}`}>
                      {activeRole === UserRole.REGULATOR ? "Senior Oversight" : "Portal Manager"}
                    </span>
                 </div>
                 <div className="relative">
                   <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRole}`} className="w-10 h-10 rounded-xl border-2 border-white bg-indigo-50 shadow-sm" alt="Avatar" />
                   <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-white">
                      <ShieldCheck className="w-2 h-2 text-white" />
                   </div>
                 </div>
                 <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isProfileOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
               </button>

               {/* Profile Dropdown Menu */}
               {isProfileOpen && (
                 <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-8 bg-slate-900 text-white relative">
                       <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Sparkles className="w-32 h-32" /></div>
                       <div className="flex items-center gap-4 mb-6">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activeRole}`} className="w-16 h-16 rounded-2xl border-4 border-white/10 bg-indigo-100 shadow-2xl" alt="Large Avatar" />
                          <div>
                             <h3 className="text-xl font-black">Dr. Budi Santoso</h3>
                             <p className="text-xs text-indigo-400 font-bold uppercase tracking-widest">ID: BGN-0042-ALPHA</p>
                          </div>
                       </div>
                       
                       <div className="p-5 bg-white/10 rounded-[2rem] border border-white/5 relative group overflow-hidden">
                          <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center gap-2">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">AI Intelligence Briefing</span>
                             </div>
                             {!briefing && !isGeneratingBriefing && (
                                <button 
                                  onClick={generateAIBriefing}
                                  className="text-[9px] font-black text-white hover:text-indigo-300 transition-colors uppercase underline underline-offset-4 cursor-pointer"
                                >
                                  Generate
                                </button>
                             )}
                          </div>
                          
                          {isGeneratingBriefing ? (
                             <div className="flex items-center gap-3 py-2">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                <p className="text-[10px] font-bold text-slate-400 italic">Synthesizing platform logs...</p>
                             </div>
                          ) : briefing ? (
                             <div className="animate-in fade-in slide-in-from-left-2">
                                <p className="text-[11px] font-medium leading-relaxed text-slate-300 italic">"{briefing}"</p>
                                <button onClick={() => setBriefing(null)} className="mt-3 text-[9px] font-black text-slate-500 uppercase hover:text-white transition-colors cursor-pointer">Clear</button>
                             </div>
                          ) : (
                             <p className="text-[10px] text-slate-500 font-bold leading-relaxed italic">Daily intelligence briefing not yet generated. Tap generate to start.</p>
                          )}
                       </div>
                    </div>

                    <div className="p-8 space-y-6">
                       <div className="grid grid-cols-2 gap-4">
                          <button onClick={handleSystemDiagnostic} className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border transition-all cursor-pointer ${sysHealth === 'CHECKING' ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl'}`}>
                             <div className={`p-2 rounded-xl ${sysHealth === 'CHECKING' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 shadow-sm'}`}>
                                {sysHealth === 'CHECKING' ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Diagnostics</span>
                          </button>
                          
                          <button onClick={handleNodeSync} className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border transition-all cursor-pointer ${isSyncing ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-xl'}`}>
                             <div className={`p-2 rounded-xl ${isSyncing ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 shadow-sm'}`}>
                                {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Database className="w-5 h-5" />}
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node Sync</span>
                          </button>
                       </div>

                       <div className="space-y-2">
                          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2">Administrative Tools</h4>
                          <MenuAction onClick={handleExportLedger} loading={isExporting} icon={isExporting ? <Loader2 /> : <FileText />} label="Export Master Ledger" sub="Download JSON Archive" />
                          <MenuAction onClick={handleFlushCache} loading={isFlushing} icon={isFlushing ? <Loader2 /> : <RefreshCcw />} label="Flush System Cache" sub="Reset Local Session" />
                          <MenuAction onClick={handleSecurityPrefs} icon={<Settings />} label="Security Preferences" sub="MFA & Root Access" />
                       </div>

                       <div className="pt-6 border-t border-slate-100">
                          <button 
                            onClick={() => setView('LANDING')}
                            className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-100/50 cursor-pointer"
                          >
                             <LogOut className="w-4 h-4" /> Terminate Session
                          </button>
                       </div>
                    </div>
                 </div>
               )}
             </div>
          </div>
        </header>

        {/* Security Vault Modal */}
        {isSecurityModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
               onClick={(e) => e.target === e.currentTarget && setIsSecurityModalOpen(false)}>
            <div className="bg-white w-full max-w-lg rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-8 bg-slate-900 text-white shrink-0 relative">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><ShieldAlert className="w-32 h-32" /></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl shadow-xl transition-all ${vaultStatus === 'SCANNING' ? 'bg-amber-500 animate-pulse' : 'bg-indigo-600'}`}>
                      <Lock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight leading-none">Security Vault</h3>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mt-2">Level 5 Clearance Verified</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsSecurityModalOpen(false)}
                    className="p-3 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-8 flex-1 overflow-y-auto space-y-8 no-scrollbar">
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-5"><Search className="w-16 h-16" /></div>
                   <div className={`text-5xl font-black tracking-tighter transition-colors ${vaultStatus === 'SCANNING' ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {vaultStatus === 'SCANNING' ? '...' : '100%'}
                   </div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Integrity Score</span>
                   <button 
                     onClick={triggerVaultScan}
                     disabled={isScanningVault}
                     className="mt-6 px-6 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-lg"
                   >
                     {isScanningVault ? <Loader2 className="w-4 h-4 animate-spin" /> : <Scan className="w-4 h-4" />}
                     {isScanningVault ? 'Scanning Cluster...' : 'Trigger Deep Scan'}
                   </button>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <Fingerprint className="w-4 h-4 text-slate-400" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Root Digital Signature</span>
                       </div>
                       <button 
                        onClick={rotateRootKey}
                        disabled={isRotating} 
                        className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors cursor-pointer flex items-center gap-1"
                       >
                         {isRotating && <Loader2 className="w-3 h-3 animate-spin" />} Rotate Key
                       </button>
                    </div>
                    <div className={`p-4 bg-white border border-slate-200 rounded-2xl font-mono text-sm text-center font-bold tracking-wider transition-all ${isRotating ? 'opacity-30 blur-sm' : 'text-slate-900 shadow-sm'}`}>
                       {rootKey}
                    </div>
                 </div>

                 <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Live Defense Layers</h4>
                    <SecurityLayer label="Multi-Factor Auth (MFA)" status={vaultStatus === 'SCANNING' ? 'Checking' : 'Active'} icon={<ShieldCheck className="text-emerald-500" />} active={vaultStatus !== 'SCANNING'} />
                    <SecurityLayer label="Session Encryption" status={vaultStatus === 'SCANNING' ? 'Hashing' : 'AES-256'} icon={<Zap className="text-amber-500" />} active={vaultStatus !== 'SCANNING'} />
                    <SecurityLayer label="Biometric Signature" status={vaultStatus === 'SCANNING' ? 'Syncing' : 'Verified'} icon={<User className="text-indigo-500" />} active={vaultStatus !== 'SCANNING'} />
                 </div>
              </div>

              <div className="p-8 pt-0 shrink-0">
                 <button 
                   onClick={() => setIsSecurityModalOpen(false)}
                   className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 cursor-pointer"
                 >
                   Seal & Exit Vault
                 </button>
              </div>
            </div>
          </div>
        )}

        {/* About Modal */}
        {isAboutModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" 
               onClick={(e) => e.target === e.currentTarget && setIsAboutModalOpen(false)}>
            <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col max-h-[85vh]">
              <div className="p-10 bg-indigo-600 text-white shrink-0 relative">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12"><Shield className="w-48 h-48" /></div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-white/20 rounded-3xl shadow-xl backdrop-blur-md">
                      <Info className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter leading-none">SafeServe MBG</h3>
                      <p className="text-[10px] text-indigo-200 font-black uppercase tracking-widest mt-2">v1.3.0 Stable</p>
                    </div>
                  </div>
                  <button onClick={() => setIsAboutModalOpen(false)} className="p-3 hover:bg-white/10 rounded-2xl transition-colors cursor-pointer">
                    <X className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-10 flex-1 overflow-y-auto space-y-8 no-scrollbar">
                <div className="space-y-4">
                  <h4 className="text-xl font-black text-gray-900 tracking-tight">Our Mission</h4>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed">
                    SafeServe MBG is an AI-powered safety layer designed to support Indonesia's <b>Makan Bergizi Gratis</b> program. By integrating real-time computer vision, IoT telemetry, and social sentiment analysis, we ensure 83 million beneficiaries receive safe, high-quality nutrition every day.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AboutStat icon={<Users className="w-4 h-4" />} label="Beneficiaries" value="83M+" />
                  <AboutStat icon={<Truck className="w-4 h-4" />} label="Verified Nodes" value="1.2M" />
                  <AboutStat icon={<ShieldCheck className="w-4 h-4" />} label="Compliance Rate" value="99.2%" />
                  <AboutStat icon={<Heart className="w-4 h-4" />} label="Health Score" value="A+" />
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                     <BadgeCheck className="w-4 h-4 text-emerald-500" /> Regulatory Partners
                   </h4>
                   <div className="flex items-center justify-between gap-4 grayscale opacity-60">
                      <div className="flex-1 h-8 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="flex-1 h-8 bg-slate-200 rounded-lg animate-pulse" />
                      <div className="flex-1 h-8 bg-slate-200 rounded-lg animate-pulse" />
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Fingerprint className="w-4 h-4 text-slate-300" />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Built for National Food Safety Governance</span>
                   </div>
                   <a 
                    href="https://github.com/mrbrightsides/safeserve" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                   >
                     View Repository <ExternalLink className="w-3 h-3" />
                   </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {renderContent()}
        </div>
      </main>

      <SafetyAssistant role={activeRole} />
    </div>
  );
};

const TechCard = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="p-10 bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
     <div className="p-4 bg-slate-50 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">{icon}</div>
     <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight">{title}</h3>
     <p className="text-sm text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const RoleEntryCard = ({ icon, title, desc, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all text-left group flex flex-col justify-between min-h-[320px] active:scale-95"
  >
     <div>
       <div className={`p-4 rounded-2xl text-white w-fit mb-8 shadow-xl ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
       <h3 className="text-2xl font-black text-gray-900 mb-3 tracking-tight leading-none">{title}</h3>
       <p className="text-sm text-slate-500 font-medium leading-relaxed">{desc}</p>
     </div>
     <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:gap-4 transition-all">
        Launch Command Center <ArrowRight className="w-4 h-4" />
     </div>
  </button>
);

const SecurityLayer = ({ label, status, icon, active }: { label: string, status: string, icon: React.ReactNode, active: boolean }) => (
  <div className={`flex items-center justify-between p-4 bg-white border rounded-2xl shadow-sm transition-all ${active ? 'border-slate-100' : 'border-amber-100 bg-amber-50/30'}`}>
     <div className="flex items-center gap-3">
        <div className={`p-1.5 rounded-lg transition-all ${active ? 'bg-slate-50' : 'bg-white shadow-inner animate-pulse'}`}>{icon}</div>
        <span className="text-[11px] font-black text-gray-900">{label}</span>
     </div>
     <div className="flex items-center gap-2">
        {status === 'Checking' || status === 'Hashing' || status === 'Syncing' ? <Loader2 className="w-3 h-3 animate-spin text-amber-500" /> : null}
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-slate-400' : 'text-amber-500'}`}>{status}</span>
     </div>
  </div>
);

const AboutStat = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-center group hover:bg-white hover:shadow-md transition-all">
    <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center mx-auto mb-2 text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">{label}</span>
    <span className="text-lg font-black text-slate-900 tracking-tight">{value}</span>
  </div>
);

interface MenuActionProps {
  icon: React.ReactNode;
  label: string;
  sub: string;
  onClick: () => void;
  loading?: boolean;
}

const MenuAction = ({ icon, label, sub, onClick, loading }: MenuActionProps) => (
  <button onClick={onClick} disabled={loading} className="w-full p-4 flex items-center gap-4 bg-white hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group text-left disabled:opacity-70 cursor-pointer">
     <div className={`p-2.5 rounded-xl transition-all ${loading ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'}`}>
        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 18, className: loading ? "animate-spin" : "" }) : icon}
     </div>
     <div className="flex-1">
        <h5 className="text-[11px] font-black text-gray-900 leading-none">{label}</h5>
        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1.5">{sub}</p>
     </div>
  </button>
);

export default App;