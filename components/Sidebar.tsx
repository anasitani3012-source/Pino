
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isPro?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isPro = false }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: 'fa-house' },
    { path: '/agent', label: 'Task Agent', icon: 'fa-robot' },
    { path: '/live', label: 'Live Talk', icon: 'fa-comment-dots' },
    { path: '/hub', label: 'Study Hub', icon: 'fa-book-bookmark' },
    { path: '/studio', label: 'Studio', icon: 'fa-wand-magic-sparkles' },
    { path: '/pro', label: 'Pricing', icon: 'fa-crown', highlight: true },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-xl font-black text-white">P</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
            PINO
          </h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                    : item.highlight 
                      ? 'text-amber-400 hover:bg-amber-400/5' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <i className={`fas ${item.icon} w-5 text-lg ${isActive ? 'text-blue-400' : item.highlight ? 'text-amber-500' : ''}`}></i>
                <span className="font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-800/50">
          <Link to="/pro" className="group block p-4 rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-800 hover:border-amber-500/50 transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-amber-500 ${isPro ? 'bg-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-amber-500/20'}`}>
                <i className="fas fa-crown text-xs"></i>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isPro ? 'Pino Pro' : 'Pino Free'}</span>
            </div>
            <p className="text-[10px] text-amber-500 font-bold group-hover:underline">
              {isPro ? 'Manage subscription' : 'Upgrade for full features'}
            </p>
          </Link>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0d0d0d]/80 backdrop-blur-xl border-t border-gray-800 flex items-center justify-around px-4 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-500' : item.highlight ? 'text-amber-500' : 'text-gray-500'}`}
            >
              <i className={`fas ${item.icon} text-xl`}></i>
              <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

export default Sidebar;
