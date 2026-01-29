
import React, { useState, useRef, useEffect } from 'react';
import { agentTask } from '../services/geminiService';
import { Message } from '../types';

const TaskAgent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Ready to work. I'm Pino, your autonomous agent. I can browse the web, plan complex tasks, and summarize real-time news. What's the mission?", timestamp: Date.now() }
  ]);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (customInput?: string) => {
    const text = customInput || input;
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await agentTask(text, messages);
      const modelMsg: Message = { role: 'model', text: result.text, timestamp: Date.now() };
      setMessages(prev => [...prev, modelMsg]);
      setSources(result.sources);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'model', text: "Mission compromised. Encountered an API error. Please try again.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const renderActionCard = (msgText: string) => {
    if (msgText.toLowerCase().includes('flight') || msgText.toLowerCase().includes('booking')) {
      return (
        <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <i className="fas fa-plane text-white"></i>
            </div>
            <div>
              <p className="text-sm font-bold">Flight Research Active</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Mock API Linkage Success</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold">View Options</button>
        </div>
      );
    }
    if (msgText.toLowerCase().includes('news') || msgText.toLowerCase().includes('research')) {
      return (
        <div className="mt-4 p-4 bg-green-600/10 border border-green-500/30 rounded-2xl">
          <div className="flex items-center gap-3 mb-3">
             <i className="fas fa-rss text-green-500"></i>
             <span className="text-sm font-bold">Real-time Intel Feed</span>
          </div>
          <div className="flex gap-2">
             <div className="flex-1 h-1 bg-green-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-[progress_2s_infinite]"></div>
             </div>
             <div className="flex-1 h-1 bg-green-500/30 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-[progress_2s_infinite_0.5s]"></div>
             </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             <h1 className="text-3xl font-black tracking-tight">Agent Command</h1>
          </div>
          <p className="text-gray-500 font-medium">Research, plan, and automate.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
           {['Cheap Flights to Paris', 'Latest AI News', 'Summarize Crypto Trends'].map((q) => (
             <button 
              key={q} 
              onClick={() => handleSend(q)}
              className="whitespace-nowrap px-4 py-2 text-xs font-bold bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-500/50 transition-all text-gray-400 hover:text-white"
             >
               {q}
             </button>
           ))}
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 mb-6 px-2 custom-scrollbar pr-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[80%] rounded-3xl px-6 py-5 ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/10 border border-blue-400/20' 
                : 'bg-[#0f0f0f] border border-gray-800 text-gray-200 shadow-lg'
            }`}>
              {msg.role === 'model' && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center text-[10px] font-black text-white">P</div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-500">Autonomous Unit</span>
                </div>
              )}
              <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.text}</p>
              
              {msg.role === 'model' && renderActionCard(msg.text)}

              {msg.role === 'model' && i === messages.length - 1 && sources.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-800/50">
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-3">Verified Sources</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sources.map((s, idx) => (
                      <a 
                        key={idx} 
                        href={s.web?.uri} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="group flex items-center gap-2 text-xs bg-gray-800/30 hover:bg-gray-800 px-3 py-2.5 rounded-xl border border-gray-700/50 transition-all"
                      >
                        <i className="fas fa-link text-gray-600 group-hover:text-blue-500"></i>
                        <span className="truncate flex-1">{s.web?.title || 'Resource'}</span>
                        <i className="fas fa-external-link-alt text-[10px] opacity-0 group-hover:opacity-100"></i>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-[#0f0f0f] border border-gray-800 rounded-[2rem] px-8 py-5 flex flex-col gap-4 min-w-[200px]">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-150"></div>
                </div>
                <div className="space-y-2">
                   <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500/50 animate-[progress_1.5s_infinite]"></div>
                   </div>
                   <p className="text-[10px] font-black text-gray-600 uppercase tracking-tighter">Initializing search parameters...</p>
                </div>
             </div>
          </div>
        )}
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-10 group-focus-within:opacity-25 transition-opacity duration-500"></div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Initiate mission (e.g., 'Book a flight to NYC' or 'Research quantum AI news')"
          className="relative w-full bg-[#0d0d0d] border border-gray-800 rounded-[1.8rem] py-5 pl-8 pr-20 focus:outline-none focus:border-blue-500 transition-all text-gray-200 text-lg shadow-2xl"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="absolute right-3 top-3 w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
        >
          <i className="fas fa-paper-plane text-white"></i>
        </button>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default TaskAgent;
