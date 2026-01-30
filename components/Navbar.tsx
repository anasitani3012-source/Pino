
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  isPro: boolean;
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ isPro, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'fa-house' },
    { path: '/agent', label: 'Task Agent', icon: 'fa-robot' },
    { path: '/live', label: 'Live Talk', icon: 'fa-comment-dots' },
    { path: '/hub', label: 'Study Hub', icon: 'fa-book-bookmark' },
    { path: '/studio', label: 'Creative Studio', icon: 'fa-wand-magic-sparkles' },
    { path: '/pro', label: 'Pricing & Plans', icon: 'fa-crown', highlight: true },
  ];

  const handleLogout = () => {
    localStorage.removeItem('pino_user');
    window.location.reload();
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Floating Menu Toggle Button */}
      <div className="fixed top-6 right-6 z-[110] flex items-center gap-4">
        {location.pathname !== '/' && (
           <Link to="/" className="w-12 h-12 rounded-2xl bg-[#111] border border-gray-800 flex items-center justify-center active-scale transition-all hover:border-gray-600 shadow-xl backdrop-blur-md">
             <i className="fas fa-pineapple brand-text text-xl"></i>
           </Link>
        )}
        
        <button 
          onClick={toggleMenu}
          className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center gap-1.5 active-scale transition-all shadow-xl backdrop-blur-md ${
            isOpen ? 'bg-white border-white text-black' : 'bg-[#111] border-gray-800 text-white'
          }`}
          aria-label="Toggle Menu"
        >
          <div className={`w-5 h-0.5 transition-all duration-300 ${isOpen ? 'bg-black rotate-45 translate-y-2' : 'bg-white'}`}></div>
          <div className={`w-5 h-0.5 transition-all duration-300 ${isOpen ? 'opacity-0' : 'bg-white'}`}></div>
          <div className={`w-5 h-0.5 transition-all duration-300 ${isOpen ? 'bg-black -rotate-45 -translate-y-2' : 'bg-white'}`}></div>
        </button>
      </div>

      {/* Full-Screen Hamburger Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-[#0a0a0a]/98 backdrop-blur-3xl z-[105] transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col p-8 pt-24 max-w-2xl mx-auto">
          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar py-6">
            <div className="mb-10 flex flex-col items-center text-center">
               <div className="w-20 h-20 brand-bg rounded-3xl flex items-center justify-center shadow-2xl shadow-cyan-500/20 mb-4 pineapple-logo">
                 <i className="fas fa-pineapple text-4xl text-white"></i>
               </div>
               <h2 className="text-3xl font-black brand-text tracking-tighter uppercase">Pino Evolved</h2>
            </div>

            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{ transitionDelay: `${idx * 50}ms` }}
                  className={`flex items-center gap-6 px-8 py-6 rounded-[2.5rem] transition-all duration-300 ${
                    isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                  } ${
                    isActive 
                      ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20' 
                      : item.highlight 
                        ? 'text-amber-400 hover:bg-amber-400/5' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <i className={`fas ${item.icon} text-2xl w-8`}></i>
                  <span className="text-xl font-black uppercase tracking-tight">{item.label}</span>
                  {isActive && <div className="ml-auto w-2 h-2 rounded-full brand-bg animate-pulse"></div>}
                </Link>
              );
            })}
          </div>

          <div className={`mt-auto space-y-6 pt-6 border-t border-gray-800 transition-all duration-700 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl brand-bg flex items-center justify-center font-black text-xl shadow-lg shadow-purple-500/20">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="font-black text-white">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-900 hover:bg-red-500/10 hover:text-red-500 border border-gray-800 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Sign Out
              </button>
            </div>
            
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-cyan-600/10 to-transparent border border-gray-800 flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-1">Instance Status</p>
                <p className={`text-lg font-black ${isPro ? 'text-amber-500' : 'text-white'}`}>
                  {isPro ? 'PINO PRO' : 'EVOLVED FREE'}
                </p>
              </div>
              {!isPro && (
                <Link to="/pro" className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] rounded-full uppercase tracking-widest transition-all">
                  Upgrade
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
