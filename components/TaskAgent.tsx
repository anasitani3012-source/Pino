
import React, { useState, useRef, useEffect } from 'react';
import { agentTask, deepSearch, generateSlides, writeCode } from '../services/geminiService';
import { Message } from '../types';

const TaskAgent: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Mission Control Active. I can perform Deep Search, architect code, or build presentation structures. Select a tool or type your mission.", 
      timestamp: Date.now() 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleToolAction = async (tool: 'deep' | 'slides' | 'code') => {
    if (!input.trim() || loading) return;
    const text = input;
    setInput('');
    setLoading(true);
    
    // Add user message
    const userMsg: Message = { role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);

    try {
      if (tool === 'deep') {
        const result = await deepSearch(text);
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: result.text, 
          timestamp: Date.now(),
          type: 'text',
          data: { sources: result.sources } // Attach sources to this specific message
        }]);
      } else if (tool === 'slides') {
        const slides = await generateSlides(text);
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: `Presentation deck for: ${text}`, 
          timestamp: Date.now(), 
          type: 'slides', 
          data: slides 
        }]);
      } else if (tool === 'code') {
        const code = await writeCode(text);
        setMessages(prev => [...prev, { 
          role: 'model', 
          text: code || '', 
          timestamp: Date.now(), 
          type: 'code' 
        }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "Mission compromised. Advanced tool failed to execute.", 
        timestamp: Date.now() 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const text = input;
    setMessages(prev => [...prev, { role: 'user', text, timestamp: Date.now() }]);
    setInput('');
    setLoading(true);

    try {
      const result = await agentTask(text, messages);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: result.text, 
        timestamp: Date.now(),
        data: { sources: result.sources }
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "API Error. Check your connection.", timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-5xl mx-auto">
      {/* Header & Toolbelt */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
             <h1 className="text-2xl font-black tracking-tight">Agent Command</h1>
          </div>
          <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
            Encrypted Session
          </span>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
           <button 
             onClick={() => handleToolAction('deep')}
             disabled={loading}
             className="whitespace-nowrap px-5 py-2.5 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all active-scale disabled:opacity-50"
           >
             <i className="fas fa-search-plus mr-2"></i> Deep Search
           </button>
           <button 
             onClick={() => handleToolAction('slides')}
             disabled={loading}
             className="whitespace-nowrap px-5 py-2.5 bg-orange-600/10 text-orange-400 border border-orange-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 hover:text-white transition-all active-scale disabled:opacity-50"
           >
             <i className="fas fa-desktop mr-2"></i> AI Slides
           </button>
           <button 
             onClick={() => handleToolAction('code')}
             disabled={loading}
             className="whitespace-nowrap px-5 py-2.5 bg-green-600/10 text-green-400 border border-green-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all active-scale disabled:opacity-50"
           >
             <i className="fas fa-code mr-2"></i> Code Architect
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 mb-6 px-1 custom-scrollbar pr-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[95%] md:max-w-[85%] rounded-[2rem] shadow-xl ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white px-6 py-4 rounded-tr-none' 
                : 'bg-[#111] border border-gray-800 text-gray-200 p-1 rounded-tl-none overflow-hidden'
            }`}>
              {/* Message Content */}
              <div className={`${msg.role === 'model' ? 'p-6' : ''}`}>
                {msg.type === 'code' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                       <span>Source Code</span>
                       <button onClick={() => navigator.clipboard.writeText(msg.text)} className="hover:text-blue-400 transition-colors">Copy</button>
                    </div>
                    <div className="bg-black/60 p-5 rounded-2xl border border-gray-800 font-mono text-sm overflow-x-auto text-blue-300">
                      <pre><code>{msg.text}</code></pre>
                    </div>
                  </div>
                ) : msg.type === 'slides' ? (
                  <div className="space-y-6">
                    <p className="text-xs font-black text-orange-500 uppercase tracking-widest mb-4">
                      <i className="fas fa-images mr-2"></i> Generated Slide Deck
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {msg.data?.map((slide: any, idx: number) => (
                        <div key={idx} className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl font-black italic">
                             {idx + 1}
                           </div>
                           <h3 className="text-lg font-black text-white mb-4 uppercase tracking-tight pr-10">{slide.title}</h3>
                           <ul className="space-y-3">
                              {slide.bulletPoints.map((bullet: string, bIdx: number) => (
                                <li key={bIdx} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0"></div>
                                  {bullet}
                                </li>
                              ))}
                           </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.text}</p>
                  </div>
                )}
              </div>
              
              {/* Grounding Sources (Specific to the message) */}
              {msg.role === 'model' && msg.data?.sources && msg.data.sources.length > 0 && (
                <div className="bg-black/40 border-t border-gray-800 p-4">
                  <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3">Grounding Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {msg.data.sources.map((s: any, idx: number) => (
                      <a 
                        key={idx} 
                        href={s.web?.uri} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-2 text-[10px] font-bold bg-gray-800/50 hover:bg-blue-600/20 hover:border-blue-500/30 px-3 py-1.5 rounded-full border border-gray-700/50 transition-all text-gray-400 hover:text-blue-400"
                      >
                        <i className="fas fa-link text-[8px]"></i>
                        <span className="truncate max-w-[120px]">{s.web?.title}</span>
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
            <div className="bg-[#111] border border-gray-800 rounded-[2rem] px-8 py-5 flex items-center gap-4">
               <div className="flex gap-1">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
               </div>
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">Synthesizing Analysis</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Console */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.2rem] blur opacity-20 group-focus-within:opacity-40 transition-opacity"></div>
        <div className="relative flex bg-[#0d0d0d] border border-gray-800 rounded-[2rem] p-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Issue a command..."
            className="flex-1 bg-transparent py-4 px-6 focus:outline-none text-gray-200 placeholder:text-gray-700 font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="w-12 h-12 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 rounded-2xl flex items-center justify-center transition-all active-scale"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskAgent;
