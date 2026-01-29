
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsMobile(/Android|iPhone|iPad|iPod/i.test(ua));
  }, []);

  return (
    <div className="max-w-5xl mx-auto pb-10 page-transition">
      <div className="mb-10">
        <h1 className="text-5xl font-black tracking-tight mb-3">Pino Console</h1>
        <p className="text-gray-400 text-lg">Your autonomous AI command center is active.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {/* Task Agent Card */}
        <Link to="/agent" className="group bg-[#111] border border-gray-800 p-6 rounded-[2rem] hover:border-blue-500/50 transition-all active-scale">
          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-robot text-blue-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Task Agent</h2>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Research & Automate with Search Grounding.</p>
        </Link>

        {/* Live Talk Card */}
        <Link to="/live" className="group bg-[#111] border border-gray-800 p-6 rounded-[2rem] hover:border-cyan-500/50 transition-all active-scale">
          <div className="w-12 h-12 bg-cyan-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-comment-dots text-cyan-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Live Talk</h2>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Real-time low-latency voice chat.</p>
        </Link>

        {/* Study Hub Card */}
        <Link to="/hub" className="group bg-[#111] border border-gray-800 p-6 rounded-[2rem] hover:border-purple-500/50 transition-all active-scale">
          <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-graduation-cap text-purple-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Study Hub</h2>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Flashcards & fast AI summaries.</p>
        </Link>

        {/* Studio Card */}
        <Link to="/studio" className="group bg-[#111] border border-gray-800 p-6 rounded-[2rem] hover:border-orange-500/50 transition-all active-scale">
          <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-clapperboard text-orange-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Studio</h2>
          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Generate Veo videos & Pro images.</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-gray-800 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
          <div className="flex-1 relative z-10">
            <h3 className="text-2xl font-black mb-4">Master Your Materials</h3>
            <p className="text-gray-400 mb-6 text-sm">Pino analyzes, recreates, and automates your entire study and work flow. Optimized for Native store performance.</p>
            <Link to="/hub" className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-gray-200 transition-colors inline-block text-xs uppercase tracking-widest active-scale">
              Get Started
            </Link>
          </div>
          <div className="hidden md:flex w-40 h-40 bg-gray-900 rounded-[2rem] border border-gray-800 items-center justify-center shrink-0">
            <i className="fas fa-microchip text-5xl text-gray-700 animate-pulse"></i>
          </div>
        </div>

        {/* Store Access Section */}
        <Link to="/mobile" className="group bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 flex flex-col justify-center border-dashed border-gray-700 hover:border-amber-500/40 transition-all active-scale">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
              <i className="fas fa-mobile-screen-button text-xl"></i>
            </div>
            <div>
              <h3 className="text-lg font-black">Native App</h3>
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest">Store Edition</p>
            </div>
          </div>
          <p className="text-gray-500 text-xs mb-6 leading-relaxed">
            Unlock native capabilities including biometric lock and push notifications.
          </p>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <i className="fab fa-apple text-gray-600"></i>
              <i className="fab fa-android text-gray-600"></i>
            </div>
            <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform">Learn more →</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
