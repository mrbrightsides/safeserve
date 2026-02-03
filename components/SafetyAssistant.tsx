
import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Send, X, Bot, User, Loader2, Sparkles, 
  ShieldCheck, AlertCircle, ChevronDown, RefreshCw 
} from 'lucide-react';
import { startSafetyChat } from '../geminiService';
import { GenerateContentResponse } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface SafetyAssistantProps {
  role: string;
}

const SafetyAssistant: React.FC<SafetyAssistantProps> = ({ role }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `Halo! I am SafeServe AI. I'm here to help you as a ${role} with MBG safety standards. How can I assist you today?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = startSafetyChat(role);
  }, [role]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      if (!chatRef.current) chatRef.current = startSafetyChat(role);
      
      const response = await chatRef.current.sendMessage({ message: userMessage });
      const text = response.text || "I'm having trouble connecting to the safety database. Please try again.";
      
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Quota exceeded or connection lost. Please wait a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    "What is the safe temp for chicken?",
    "How to report an incident?",
    "BPOM Hygiene checklist",
    "BGN Standards 2025"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans">
      {/* FAB */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center group ${isOpen ? 'bg-slate-900 rotate-90' : 'bg-red-600 hover:bg-red-700 hover:scale-110 pulse-glow'}`}
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <ShieldCheck className="w-6 h-6 text-white" />}
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-white px-3 py-1.5 rounded-xl shadow-lg text-[10px] font-black text-gray-900 uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-gray-100">
            Ask Safety AI
          </span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[550px] bg-white rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-500">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black tracking-tight">SafeServe AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">BGN Safety Specialist</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-slate-600" />}
                  </div>
                  <div className={`p-4 rounded-3xl text-xs font-medium leading-relaxed shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-indigo-600 text-white border-indigo-500 rounded-tr-none' 
                      : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
                  </div>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 bg-white border-t border-gray-100">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickActions.map(action => (
                <button 
                  key={action}
                  onClick={() => setInput(action)}
                  className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1.5 border border-slate-100 rounded-xl hover:border-indigo-600 hover:text-indigo-600 transition-all"
                >
                  {action}
                </button>
              ))}
            </div>
            <div className="relative group">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask something..."
                className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 top-2 p-3 bg-indigo-600 text-white rounded-[1.2rem] hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95 shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[8px] text-gray-400 font-bold uppercase tracking-widest mt-4">
              AI can make mistakes. Verify critical protocols with BGN.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .pulse-glow {
          box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4);
          animation: pulse-red 2s infinite;
        }
        @keyframes pulse-red {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 38, 38, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default SafetyAssistant;
