import React, { useState, useEffect, useMemo } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  AreaChart, Area, LineChart, Line, Legend, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { 
  MapPin, AlertTriangle, CheckCircle, Users, Activity, ExternalLink, 
  MessageSquare, ShieldAlert, Loader2, TrendingUp, TrendingDown, Info, Map as MapIcon,
  AlertOctagon, Store, History, Zap, Search, Eye, Globe, ChevronRight,
  ShieldCheck, AlertCircle, X, BellRing, ArrowRight, FileText, Newspaper,
  LocateFixed, Shield, BarChart3, Clock, UserCheck, CalendarDays, Filter,
  ThumbsUp, ThumbsDown, Minus, Tag, Radio, Megaphone, Share2, BrainCircuit,
  Fingerprint, Database, Cpu, Layers, Workflow, Siren, Download, Info as InfoIcon,
  Database as DatabaseIcon, Target, Sparkles, Gauge, School, RefreshCw,
  CloudOff, CloudRain, ShieldQuestion, ThermometerSnowflake, BarChart as BarChartIcon
} from 'lucide-react';
import { monitorSocialSentiment, getRegionalRiskAssessment, getPredictiveRiskScore, getVendorRiskExplanation } from '../geminiService';

const mockTrendData = [
  { name: 'Sep 25', incidents: 12 },
  { name: 'Oct 25', incidents: 38 },
  { name: 'Nov 25', incidents: 25 },
  { name: 'Dec 25', incidents: 18 },
  { name: 'Jan 26', incidents: 42 },
  { name: 'Feb 26', incidents: 15 }, 
];

const mockSentimentTrend = [
  { time: '08:00', pos: 80, neg: 20 },
  { time: '10:00', pos: 75, neg: 25 },
  { time: '12:00', pos: 40, neg: 60 },
  { time: '14:00', pos: 30, neg: 70 },
  { time: '16:00', pos: 35, neg: 65 },
  { time: '18:00', pos: 50, neg: 50 },
];

const mockBlockchainLogs = [
  { h: '0x8f2a...e912', t: '14:21:05', a: 'INCIDENT_LOCK', s: 'Verified' },
  { h: '0x3c1b...f0a1', t: '14:18:22', a: 'COMPLIANCE_SYNC', s: 'Verified' },
  { h: '0x9d4e...d22b', t: '14:05:11', a: 'VENDOR_AUDIT_SIG', s: 'Verified' },
  { h: '0xa2c3...119c', t: '13:55:40', a: 'IOT_TELEMETRY', s: 'Verified' },
];

const mockSocialPosts = [
  { text: "My son just came home from SDN 01 with a stomach ache after MBG lunch. Anyone else? #MBG #Jakarta", sentiment: 'negative', topic: 'health' },
  { text: "The food at SMPN 12 today smelled a bit weird. The rice was slightly yellow. #FoodSafety #MBG", sentiment: 'negative', topic: 'quality' },
  { text: "Feeling great after the free meal today! So nutritious and the portion is huge. #HealthyIndonesia", sentiment: 'positive', topic: 'general' },
];

interface Notification {
  id: string;
  msg: string;
  type: 'INCIDENT' | 'SENTIMENT' | 'IOT' | 'SYSTEM';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
}

const SentimentGauge = ({ score }: { score: number }) => {
  const normalizedScore = Math.min(Math.max(score, 0), 10);
  const rotation = (normalizedScore / 10) * 180 - 90;
  const radius = 40;
  const circumference = Math.PI * radius; 
  const dashOffset = circumference - (normalizedScore / 10) * circumference;
  const getColor = () => normalizedScore >= 7 ? '#ef4444' : normalizedScore >= 4 ? '#f59e0b' : '#10b981';

  return (
    <div className="relative flex flex-col items-center justify-center pt-10 pb-4 w-full">
      <div className="relative w-56 h-28">
        <svg viewBox="0 0 100 55" className="w-full h-full drop-shadow-sm">
          <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
          <path d="M 10,50 A 40,40 0 0,1 90,50" fill="none" stroke={getColor()} strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-1000" />
        </svg>
        <div className="absolute bottom-[-2px] left-1/2 w-[2px] h-[46px] origin-bottom transition-all duration-1000" style={{ transform: `translateX(-50%) rotate(${rotation}deg)` }}>
          <div className="w-[2px] h-[38px] rounded-full" style={{ backgroundColor: getColor() }} />
        </div>
      </div>
      <div className="mt-4 text-center">
        <div className="text-4xl font-black tracking-tighter" style={{ color: getColor() }}>{normalizedScore.toFixed(1)}</div>
        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-[-4px]">Risk Coefficient</div>
      </div>
    </div>
  );
};

const RegulatorDashboard: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExplainingVendor, setIsExplainingVendor] = useState(false);
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConfidenceModal, setShowConfidenceModal] = useState(false);
  const [predictiveData, setPredictiveData] = useState<any>(null);
  const [vendorRiskInfo, setVendorRiskInfo] = useState<any>(null);
  const [regionalRisks, setRegionalRisks] = useState<any[]>([]);
  const [isRisksLoading, setIsRisksLoading] = useState(false);
  const [riskSources, setRiskSources] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trend, setTrend] = useState<'up' | 'down'>('up');

  const [riskInputs, setRiskInputs] = useState({
    schoolReports: 3,
    avgSeverity: 6.5,
    sentimentSpike: 25,
    hygieneDeficit: 8,
    iotAnomalies: 2
  });

  const [vendorFactors, setVendorFactors] = useState({
    incidentCount: 1,
    hygieneScore: 78,
    tempAnomalies: 4
  });

  const calculateOutbreakRisk = (inputs: typeof riskInputs) => {
    const score = Math.min(100, (
      (Math.min(inputs.schoolReports, 20) * 5 * 0.3) + 
      (inputs.avgSeverity * 10 * 0.2) + 
      (inputs.sentimentSpike * 0.2) + 
      (inputs.hygieneDeficit * 1.5) + 
      (inputs.iotAnomalies * 10 * 0.15)
    ));
    return Math.round(score);
  };

  const addNotification = (notif: Notification) => setNotifications(prev => [notif, ...prev.slice(0, 3)]);

  const triggerSimulation = () => {
    setIsSimulationMode(!isSimulationMode);
    if (!isSimulationMode) {
      const simInputs = {
        schoolReports: 12,
        avgSeverity: 8.2,
        sentimentSpike: 65,
        hygieneDeficit: 22,
        iotAnomalies: 7
      };
      setRiskInputs(simInputs);
      setTrend('up');
      addNotification({
        id: `SIM-${Date.now()}`,
        msg: "DEMO: Simulated Outbreak detected in West Jakarta cluster.",
        type: 'INCIDENT',
        severity: 'CRITICAL'
      });
      setPredictiveData({
        score: calculateOutbreakRisk(simInputs),
        riskLevel: "CRITICAL",
        explanation: ["High frequency of school reports (12+).", "IoT telemetry showing widespread fridge failures.", "Social sentiment reach: 25k users reporting illness."],
        recommendedThreshold: 80
      });
      // Also simulate high vendor risk
      handleVendorAnalysis({ incidentCount: 5, hygieneScore: 42, tempAnomalies: 12 });
    } else {
      const defaultInputs = {
        schoolReports: 3,
        avgSeverity: 6.5,
        sentimentSpike: 25,
        hygieneDeficit: 8,
        iotAnomalies: 2
      };
      setRiskInputs(defaultInputs);
      setTrend('down');
      fetchPredictiveScore();
      handleVendorAnalysis({ incidentCount: 1, hygieneScore: 78, tempAnomalies: 4 });
    }
  };

  const fetchPredictiveScore = async () => {
    setIsAnalyzing(true);
    const result = await getPredictiveRiskScore({ 
      ...riskInputs, 
      calculatedBase: calculateOutbreakRisk(riskInputs) 
    });
    setPredictiveData(result);
    setIsAnalyzing(false);
  };

  const handleVendorAnalysis = async (factors?: typeof vendorFactors) => {
    setIsExplainingVendor(true);
    const targetFactors = factors || vendorFactors;
    const result = await getVendorRiskExplanation(targetFactors);
    setVendorRiskInfo(result);
    setIsExplainingVendor(false);
  };

  const fetchRisks = async () => {
    setIsRisksLoading(true);
    try {
      const result = await getRegionalRiskAssessment();
      setRegionalRisks(result.data);
      setRiskSources(result.sources || []);
    } finally {
      setIsRisksLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictiveScore();
    fetchRisks();
    handleVendorAnalysis();
  }, []);

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto text-left animate-in fade-in duration-700">
      
      {/* Confidence Data Modal */}
      {showConfidenceModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 rounded-xl"><Gauge className="text-white w-5 h-5" /></div>
                <h3 className="text-xl font-black">AI Confidence Metrics</h3>
              </div>
              <button onClick={() => setShowConfidenceModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Model Confidence</span>
                  <span className="text-2xl font-black text-indigo-600">94.2%</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Data Freshness</span>
                  <span className="text-2xl font-black text-emerald-600">Live</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Logic Consistency</span>
                  <span>High (98%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full w-[98%]" />
                </div>
                
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>Grounding Relevance</span>
                  <span>91%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full w-[91%]" />
                </div>
              </div>

              <div className="p-5 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                <p className="text-[10px] text-indigo-800 font-bold leading-relaxed">
                  Explanation generated using RAG (Retrieval-Augmented Generation) mapping vendor hygiene audits to current BGN safety standards. Inference token usage optimized for sub-500ms latency.
                </p>
              </div>

              <button 
                onClick={() => setShowConfidenceModal(false)}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
              >
                Close Metrics
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulation & Status Banner */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center justify-between p-4 bg-slate-900 rounded-[2rem] border border-slate-700 shadow-xl overflow-hidden relative">
          <div className="flex items-center gap-4 relative z-10">
            <div className={`p-3 rounded-2xl ${isSimulationMode ? 'bg-red-600 animate-pulse shadow-lg shadow-red-500/50' : 'bg-indigo-600'}`}>
              {isSimulationMode ? <Siren className="w-6 h-6 text-white" /> : <Sparkles className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h3 className="text-white font-black text-lg tracking-tight">System Simulation Mode</h3>
              <p className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest">{isSimulationMode ? 'Outbreak Scenario Active' : 'Live Monitoring Active'}</p>
            </div>
          </div>
          <button onClick={triggerSimulation} className="px-8 py-3 bg-white text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 shadow-lg">
            {isSimulationMode ? 'Stop Simulation' : 'Simulate Outbreak'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Beneficiaries" value="1.2M" sub="Live Sync" icon={<Users className="text-blue-600" />} />
        <StatCard title="Predictive Alert" value={predictiveData?.score.toString() || "42"} sub="Risk Score" icon={<BrainCircuit className="text-red-600" />} color="bg-red-50" />
        <StatCard title="Supply Health" value="94.2%" sub="Verified Log" icon={<ShieldCheck className="text-green-600" />} />
        <StatCard title="Integrity Uptime" value="99.9%" sub="Block-Sync" icon={<Database className="text-purple-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          
          {/* District Outbreak Risk Score Panel */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2.5 rounded-2xl shadow-xl"><Activity className="w-5 h-5 text-white" /></div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">District Outbreak Risk Score</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Real-time Hybrid Intelligence (Rule-Based + AI)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-black text-[10px] tracking-widest transition-all ${trend === 'up' ? 'text-red-600 bg-red-50 border-red-100' : 'text-emerald-600 bg-emerald-50 border-emerald-100'}`}>
                  {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {trend === 'up' ? 'INCREASING' : 'STABILIZING'}
                </div>
                <button 
                  onClick={() => setShowExplanation(!showExplanation)}
                  className="px-4 py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-xl text-[10px] font-black uppercase hover:text-indigo-600 hover:border-indigo-100 transition-all flex items-center gap-2"
                >
                  <InfoIcon className="w-4 h-4" /> {showExplanation ? 'Hide Metrics' : 'Breakdown'}
                </button>
              </div>
            </div>

            {isAnalyzing ? (
              <div className="py-20 flex flex-col items-center justify-center animate-pulse">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Calculating Outbreak Probability...</p>
              </div>
            ) : predictiveData && (
              <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                  <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative overflow-hidden shadow-inner">
                    <div className="absolute top-0 right-0 p-4 opacity-5"><Zap className="w-12 h-12" /></div>
                    <div className={`text-7xl font-black tracking-tighter mb-1 transition-colors ${predictiveData.score > 70 ? 'text-red-600' : predictiveData.score > 40 ? 'text-orange-500' : 'text-emerald-500'}`}>
                      {predictiveData.score}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Unified Risk Score</span>
                  </div>

                  <div className="md:col-span-2 space-y-6 pt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-black text-gray-500 uppercase tracking-tight">Risk Tier: 
                        <span className={`ml-2 px-2.5 py-0.5 rounded-lg border ${predictiveData.score > 70 ? 'text-red-600 bg-red-50 border-red-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200'}`}>
                          {predictiveData.riskLevel}
                        </span>
                      </span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">THRESHOLD: {predictiveData.recommendedThreshold || 80}</span>
                    </div>
                    
                    <div className="relative h-6 bg-slate-100 rounded-full overflow-hidden border-4 border-white shadow-sm">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${predictiveData.score > 70 ? 'bg-gradient-to-r from-red-400 to-red-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`} 
                        style={{ width: `${predictiveData.score}%` }} 
                      />
                      <div className="absolute top-0 bottom-0 w-px bg-slate-300 border-l border-white/50" style={{ left: '80%' }} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                         <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all"><School className="w-4 h-4" /></div>
                         <div><p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Reports</p><p className="text-xs font-black text-gray-900">{riskInputs.schoolReports} Active Incidents</p></div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                         <div className="p-2 bg-white rounded-xl shadow-sm group-hover:bg-orange-500 group-hover:text-white transition-all"><AlertCircle className="w-4 h-4" /></div>
                         <div><p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Avg Severity</p><p className="text-xs font-black text-gray-900">{riskInputs.avgSeverity}/10 Intensity</p></div>
                      </div>
                    </div>
                  </div>
                </div>

                {showExplanation && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-[2rem] shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <BrainCircuit className="w-4 h-4 text-indigo-600" />
                        <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">AI Reasoning Breakdown</h4>
                      </div>
                      <ul className="space-y-3">
                        {predictiveData.explanation.map((r: string, i: number) => (
                          <li key={i} className="text-xs font-bold text-indigo-700 flex items-start gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-300 mt-1.5 shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Layers className="w-4 h-4" /> Metric Weights (Rule-Based)</h4>
                       <div className="space-y-4">
                          <RuleMetric label="Reports Volume" value={`${riskInputs.schoolReports} units`} weight="30%" />
                          <RuleMetric label="Symptom Severity" value={`${riskInputs.avgSeverity}/10`} weight="20%" />
                          <RuleMetric label="Sentiment Spike" value={`${riskInputs.sentimentSpike}%`} weight="20%" />
                          <RuleMetric label="Hygiene Deficit" value={`${riskInputs.hygieneDeficit}%`} weight="15%" />
                          <RuleMetric label="IoT Anomalies" value={`${riskInputs.iotAnomalies} counts`} weight="15%" />
                       </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI Explainability Panel: Why is this vendor high-risk? */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm relative overflow-hidden group min-h-[400px]">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-amber-100 p-2.5 rounded-2xl shadow-sm"><ShieldQuestion className="w-5 h-5 text-amber-600" /></div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 tracking-tight">Why is this vendor high-risk?</h3>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Deep AI Insight & Evidence Chain</p>
                </div>
              </div>
              <button 
                onClick={() => handleVendorAnalysis()} 
                className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl text-[10px] font-black uppercase hover:bg-amber-100 transition-all flex items-center gap-2"
              >
                {isExplainingVendor ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                Re-Analyze Vendor
              </button>
            </div>

            {isExplainingVendor ? (
              <div className="flex flex-col items-center justify-center py-20 animate-pulse">
                <BrainCircuit className="w-12 h-12 text-amber-500 animate-bounce mb-4" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthesizing Safety Evidence...</p>
              </div>
            ) : vendorRiskInfo && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-500">
                <div className="md:col-span-5 space-y-6">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-[2rem] shadow-inner">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Target className="w-3.5 h-3.5" /> Incident Profile
                    </h4>
                    <div className="space-y-5">
                       <RiskFactor icon={<AlertTriangle className="text-red-500" />} label="Recent Reports" value={isSimulationMode ? "5 Units" : "1 Unit"} trend="high" />
                       <RiskFactor icon={<CheckCircle className="text-amber-500" />} label="Hygiene Baseline" value={isSimulationMode ? "42/100" : "78/100"} trend="low" />
                       <RiskFactor icon={<ThermometerSnowflake className="text-blue-500" />} label="Temp Anomalies" value={isSimulationMode ? "12 Detects" : "4 Detects"} trend="high" />
                    </div>
                  </div>
                  
                  <div className="p-6 bg-red-600 rounded-[2rem] text-white shadow-xl shadow-red-100">
                     <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Automated Triage</span>
                     <h4 className="text-2xl font-black tracking-tight mt-1">{vendorRiskInfo.urgency} Action Required</h4>
                     <p className="text-[10px] font-bold mt-2 opacity-90 leading-relaxed">
                       Systems recommend an immediate physical audit and temporary supply suspension for District Cluster A-12.
                     </p>
                  </div>
                </div>

                <div className="md:col-span-7 flex flex-col justify-between">
                  <div className="space-y-6">
                     <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem]">
                        <div className="flex items-center gap-2 mb-3">
                           <Sparkles className="w-4 h-4 text-amber-600" />
                           <h4 className="text-xs font-black text-amber-900 uppercase tracking-widest">AI Synthesis Summary</h4>
                        </div>
                        <p className="text-sm font-bold text-amber-800 leading-relaxed italic">
                          "{vendorRiskInfo.summary}"
                        </p>
                     </div>

                     <div className="space-y-3">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5" /> Evidence Breakdown
                        </h4>
                        <div className="space-y-2">
                           {vendorRiskInfo.details.map((detail: string, i: number) => (
                             <div key={i} className="flex items-start gap-3 p-4 bg-white border border-slate-100 rounded-2xl hover:border-amber-200 transition-colors shadow-sm">
                                <div className="w-5 h-5 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 font-black text-[10px]">
                                   {i + 1}
                                </div>
                                <p className="text-[11px] font-bold text-slate-700 leading-normal">{detail}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-slate-400" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Model: Gemini 3.1 Flash-Reasoning</span>
                     </div>
                     <button 
                       onClick={() => setShowConfidenceModal(true)}
                       className="text-[9px] font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-200 hover:text-indigo-800 transition-colors active:scale-95"
                     >
                       View Confidence Data
                     </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-8"><div className="flex items-center gap-3"><div className="bg-blue-50 p-2.5 rounded-2xl"><TrendingUp className="text-blue-600 w-5 h-5" /></div><h3 className="text-xl font-black text-gray-900 tracking-tight">National Incident Trends</h3></div></div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockTrendData}>
                  <defs><linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} />
                  <RechartsTooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="incidents" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorIncidents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6"><div className="bg-indigo-50 p-2.5 rounded-2xl shadow-sm"><Megaphone className="text-indigo-600 w-5 h-5" /></div><h3 className="text-xl font-black text-gray-900 tracking-tight">Social Pulse</h3></div>
                <div className="space-y-4">
                  {mockSocialPosts.map((post, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-lg transition-all group">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${post.sentiment === 'negative' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{post.topic}</span>
                      </div>
                      <p className="text-xs text-gray-600 font-medium italic">"{post.text}"</p>
                    </div>
                  ))}
                </div>
             </div>
             
             {/* Enhanced Sentiment Trend Graphic */}
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm flex flex-col justify-between overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><BarChartIcon className="w-3.5 h-3.5" /> Sentiment Volatility</h4>
                  <span className="text-[8px] font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-lg border border-red-100 uppercase tracking-widest animate-pulse">Live Tracking</span>
                </div>
                
                <div className="h-[120px] w-full mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockSentimentTrend}>
                      <XAxis dataKey="time" hide />
                      <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{ fontSize: '9px', borderRadius: '12px', border: 'none' }} />
                      <Bar dataKey="neg" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="pos" stackId="a" fill="#10b981" radius={[0, 0, 4, 4]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-auto">
                   <div className="text-center">
                      <span className="text-2xl font-black text-emerald-600">42%</span>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Positive Engagement</p>
                   </div>
                   <div className="text-center border-l border-slate-100">
                      <span className="text-2xl font-black text-red-600">58%</span>
                      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Critical Reports</p>
                   </div>
                </div>

                <div className="mt-6">
                   <SentimentGauge score={predictiveData?.score / 10 || 4.2} />
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Target className="w-48 h-48 text-emerald-400" /></div>
            <div className="flex items-center gap-3 mb-8 relative z-10"><div className="bg-emerald-500/20 p-2.5 rounded-2xl border border-emerald-500/20 shadow-lg"><BarChart3 className="w-5 h-5 text-emerald-400" /></div><div><h3 className="text-lg font-black tracking-tight">Projected Impact</h3><p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">BGN System ROI</p></div></div>
            <div className="space-y-6 relative z-10">
              <MetricItem label="Detection Latency" value="-60%" color="text-emerald-400" icon={<Clock className="w-4 h-4" />} />
              <MetricItem label="Response Speed" value="+45%" color="text-indigo-400" icon={<Zap className="w-4 h-4" />} />
              <MetricItem label="Vendor Trust" value="+35%" color="text-amber-400" icon={<ShieldCheck className="w-4 h-4" />} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm"><div className="flex items-center gap-2 mb-6"><Fingerprint className="w-4 h-4 text-indigo-600" /><h4 className="text-xs font-black uppercase tracking-widest text-gray-900">Integrity Proofs</h4></div><div className="space-y-3">{mockBlockchainLogs.slice(0, 3).map((log, i) => (<div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between"><div><span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest block">{log.a}</span><span className="text-[8px] font-mono text-slate-400">{log.h}</span></div><CheckCircle className="w-4 h-4 text-emerald-500" /></div>))}</div></div>
          
          {/* Regional Pulse Component */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-xl"><Globe className="w-5 h-5 text-white" /></div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900 tracking-tight leading-none">Regional Pulse</h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live Geographical Heatmap</p>
                  </div>
               </div>
               <div className="flex items-center gap-2">
                  <button 
                    onClick={fetchRisks}
                    disabled={isRisksLoading}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRisksLoading ? 'animate-spin' : ''}`} />
                  </button>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
                    <div className="relative w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
                  </div>
               </div>
            </div>

            <div className="space-y-4 flex-1">
              {isRisksLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Gathering Regional Intel...</p>
                </div>
              ) : regionalRisks.length > 0 ? (
                regionalRisks.slice(0, 5).map((region, i) => {
                  const isSimHit = isSimulationMode && region.region === 'Jakarta Raya';
                  const riskLevel = isSimHit ? 'CRITICAL' : region.risk;
                  const score = isSimHit ? 88 : region.score;
                  
                  return (
                    <div key={i} className={`group p-5 rounded-[2rem] border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${isSimHit ? 'bg-red-50 border-red-200 animate-in pulse-red' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-black text-sm text-gray-900 leading-none group-hover:text-indigo-600 transition-colors">{region.region}</h4>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 block">{region.activeVendors} Active Vendors</span>
                        </div>
                        <div className={`px-2.5 py-1 rounded-lg text-[8px] font-black tracking-widest border shadow-sm ${riskLevel === 'CRITICAL' || riskLevel === 'High' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-emerald-600 border-emerald-100'}`}>
                           {riskLevel}
                        </div>
                      </div>
                      
                      <div className="flex items-end justify-between">
                         <div className="flex-1 mr-4">
                            <p className="text-[10px] text-slate-500 font-bold leading-relaxed mb-2">
                               <span className="text-indigo-600 font-black">Issue:</span> {isSimHit ? 'Cluster Reported (3 Schools)' : region.concern}
                            </p>
                            <div className="flex items-center gap-1.5">
                               <div className={`px-2 py-0.5 rounded-md text-[8px] font-black tracking-tighter uppercase ${region.status === 'Stable' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                 {isSimHit ? 'Crisis Command' : region.status}
                               </div>
                            </div>
                         </div>
                         <div className="text-center">
                            <span className={`text-2xl font-black tracking-tighter leading-none ${isSimHit ? 'text-red-600' : 'text-gray-900'}`}>{score}</span>
                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Score</p>
                         </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-center text-slate-400 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-full"><AlertCircle className="w-8 h-8" /></div>
                  <p className="text-[10px] font-black uppercase tracking-widest">No Regional Data Available</p>
                  <button onClick={fetchRisks} className="text-indigo-600 font-black text-[10px] uppercase tracking-widest border-b border-indigo-200">Retry Fetch</button>
                </div>
              )}
            </div>

            {/* Integrated Grounding Ledger */}
            {riskSources.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-8 -mb-8 p-8 animate-in fade-in duration-700">
                <div className="flex items-center gap-2 mb-4">
                  <DatabaseIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Grounding Intelligence Ledger</h4>
                </div>
                <div className="space-y-2">
                  {riskSources.slice(0, 3).map((source, i) => (
                    source.web && (
                      <a 
                        key={i} 
                        href={source.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all group"
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                           <Newspaper className="w-3 h-3 text-slate-300 shrink-0" />
                           <span className="text-[9px] font-bold text-slate-600 truncate group-hover:text-indigo-600">{source.web.title || source.web.uri}</span>
                        </div>
                        <ExternalLink className="w-3 h-3 text-slate-200 group-hover:text-indigo-400 shrink-0" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse-red {
          0% { background-color: rgb(254, 242, 242); }
          50% { background-color: rgb(254, 226, 226); }
          100% { background-color: rgb(254, 242, 242); }
        }
        .pulse-red {
          animation: pulse-red 2s infinite;
        }
      `}</style>
    </div>
  );
};

const StatCard = ({ title, value, sub, icon, color = 'bg-white' }: any) => (
  <div className={`${color} p-6 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-default text-left`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 group-hover:text-gray-600 transition-colors">{title}</p>
        <h4 className="text-3xl font-black text-gray-900 tracking-tighter">{value}</h4>
        <p className="text-[10px] text-gray-500 mt-1.5 font-bold flex items-center gap-1"><TrendingUp className="w-3 h-3 text-green-500" /> {sub}</p>
      </div>
      <div className="p-3.5 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">{icon}</div>
    </div>
  </div>
);

const RuleMetric = ({ label, value, weight }: any) => (
  <div className="flex items-center justify-between text-xs">
    <div className="flex flex-col">
       <span className="font-bold text-gray-900">{label}</span>
       <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Value: {value}</span>
    </div>
    <span className="font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">W: {weight}</span>
  </div>
);

const RiskFactor = ({ icon, label, value, trend }: any) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
       <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
       </div>
       <span className="text-xs font-bold text-slate-600">{label}</span>
    </div>
    <div className="text-right">
       <span className="text-xs font-black text-slate-900">{value}</span>
       <div className={`text-[8px] font-black uppercase tracking-widest ${trend === 'high' ? 'text-red-500' : 'text-emerald-500'}`}>
          {trend === 'high' ? 'Alert' : 'Nominal'}
       </div>
    </div>
  </div>
);

const MetricItem = ({ label, value, color, icon }: any) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3">
      <div className={`p-1.5 rounded-lg bg-slate-800 text-slate-400 group-hover:${color.replace('text', 'bg')} group-hover:text-white transition-all`}>{icon}</div>
      <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{label}</span>
    </div>
    <div className={`text-xl font-black ${color}`}>{value}</div>
  </div>
);

export default RegulatorDashboard;