
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TaskAgent from './components/TaskAgent';
import StudyHub from './components/StudyHub';
import Studio from './components/Studio';
import Navbar from './components/Navbar';
import LiveConversation from './components/LiveConversation';
import Pricing from './components/Pricing';
import MobileApp from './components/MobileApp';
import Auth from './components/Auth';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('pino_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isPro, setIsPro] = useState<boolean>(() => {
    return user?.isPro || localStorage.getItem('pino_is_pro') === 'true';
  });

  useEffect(() => {
    const checkStoreKey = async () => {
      // @ts-ignore
      if (window.aistudio) {
        // @ts-ignore
        if (!(await window.aistudio.hasSelectedApiKey())) {
          // @ts-ignore
          await window.aistudio.openSelectKey();
        }
      }
    };
    checkStoreKey();
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setIsPro(u.isPro);
  };

  const handleUpgrade = (status: boolean) => {
    setIsPro(status);
    localStorage.setItem('pino_is_pro', status.toString());
    if (user) {
      const updated = { ...user, isPro: status };
      setUser(updated);
      localStorage.setItem('pino_user', JSON.stringify(updated));
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 flex flex-col overflow-x-hidden">
        {/* Floating Menu Toggle instead of a full Navigation Bar */}
        <Navbar isPro={isPro} user={user} />

        {/* Main Content Area - Reduced top padding as Navbar is gone */}
        <main className="flex-1 pt-6 px-4 md:px-8 pb-10">
          <div className="max-w-7xl mx-auto h-full">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/agent" element={<TaskAgent />} />
              <Route path="/live" element={<LiveConversation />} />
              <Route path="/hub" element={<StudyHub />} />
              <Route path="/studio" element={<Studio />} />
              <Route path="/mobile" element={<MobileApp />} />
              <Route path="/pro" element={<Pricing isPro={isPro} onUpgrade={() => handleUpgrade(true)} onDowngrade={() => handleUpgrade(false)} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
