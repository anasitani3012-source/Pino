
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskAgent from './components/TaskAgent';
import StudyHub from './components/StudyHub';
import Studio from './components/Studio';
import Sidebar from './components/Sidebar';
import LiveConversation from './components/LiveConversation';

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-[#0a0a0a] text-gray-100 overflow-hidden">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block w-64 border-r border-gray-800 bg-[#0d0d0d]">
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative overflow-hidden">
          {/* Header Mobile */}
          <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-[#0d0d0d] z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">P</div>
              <h1 className="text-xl font-bold tracking-tight">PINO</h1>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-400 hover:text-white"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
            </button>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agent" element={<TaskAgent />} />
              <Route path="/live" element={<LiveConversation />} />
              <Route path="/hub" element={<StudyHub />} />
              <Route path="/studio" element={<Studio />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
