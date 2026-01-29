
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskAgent from './components/TaskAgent';
import StudyHub from './components/StudyHub';
import Studio from './components/Studio';
import Sidebar from './components/Sidebar';
import LiveConversation from './components/LiveConversation';
import Pricing from './components/Pricing';
import MobileApp from './components/MobileApp';

const App: React.FC = () => {
  const [isPro, setIsPro] = useState<boolean>(() => {
    return localStorage.getItem('pino_is_pro') === 'true';
  });

  useEffect(() => {
    console.debug("[Pino-Native] App Engine Initialized");
    const initTime = performance.now();
    
    // Check if running in standalone (PWA/Store) mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandalone) {
      console.debug("[Pino-Native] Running in Standalone Native mode");
    }

    // Mandatory API Key Selection for high-quality models (Veo, Gemini 3 Pro)
    const checkStoreKey = async () => {
      // @ts-ignore
      if (window.aistudio) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          console.debug("[Pino] Prompting for mandatory API key selection");
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      }
    };
    checkStoreKey();

    console.debug(`[Pino-Native] Core ready: ${(performance.now() - initTime).toFixed(2)}ms`);
  }, []);

  const handleUpgrade = (status: boolean) => {
    setIsPro(status);
    localStorage.setItem('pino_is_pro', status.toString());
  };

  return (
    <Router>
      <div className="flex h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden select-none">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block w-64 border-r border-gray-800 bg-[#0d0d0d]">
          <Sidebar isPro={isPro} />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          {/* Header Mobile - Store Compliant */}
          <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-gray-800/50 bg-[#0a0a0a]/80 backdrop-blur-xl z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-lg shadow-blue-500/20">P</div>
              <h1 className="text-lg font-black tracking-tight">PINO</h1>
            </div>
            <div className="flex gap-4">
               <i className="fas fa-signal-stream text-xs text-gray-600"></i>
               <i className="fas fa-battery-three-quarters text-xs text-gray-600"></i>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agent" element={<TaskAgent />} />
              <Route path="/live" element={<LiveConversation />} />
              <Route path="/hub" element={<StudyHub />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/mobile" element={<MobileApp />} />
              <Route path="/pro" element={<Pricing isPro={isPro} onUpgrade={() => handleUpgrade(true)} onDowngrade={() => handleUpgrade(false)} />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
