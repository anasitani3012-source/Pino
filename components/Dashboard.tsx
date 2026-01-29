
import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-3">Welcome, Explorer.</h1>
        <p className="text-gray-400 text-lg">Your autonomous AI command center is ready.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Task Agent Card */}
        <Link to="/agent" className="group bg-[#111] border border-gray-800 p-6 rounded-3xl hover:border-blue-500/50 transition-all">
          <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-robot text-blue-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Task Agent</h2>
          <p className="text-xs text-gray-500 leading-relaxed">Research & Automate with Search Grounding.</p>
        </Link>

        {/* Live Talk Card */}
        <Link to="/live" className="group bg-[#111] border border-gray-800 p-6 rounded-3xl hover:border-cyan-500/50 transition-all">
          <div className="w-12 h-12 bg-cyan-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-comment-dots text-cyan-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Live Talk</h2>
          <p className="text-xs text-gray-500 leading-relaxed">Real-time low-latency voice chat.</p>
        </Link>

        {/* Study Hub Card */}
        <Link to="/hub" className="group bg-[#111] border border-gray-800 p-6 rounded-3xl hover:border-purple-500/50 transition-all">
          <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-graduation-cap text-purple-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Study Hub</h2>
          <p className="text-xs text-gray-500 leading-relaxed">Flashcards & fast AI summaries.</p>
        </Link>

        {/* Studio Card */}
        <Link to="/studio" className="group bg-[#111] border border-gray-800 p-6 rounded-3xl hover:border-orange-500/50 transition-all">
          <div className="w-12 h-12 bg-orange-600/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <i className="fas fa-clapperboard text-orange-500 text-xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Studio</h2>
          <p className="text-xs text-gray-500 leading-relaxed">Generate Veo videos & Pro images.</p>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-blue-600/10 to-transparent border border-gray-800 rounded-3xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-4">Master Your Materials</h3>
            <p className="text-gray-400 mb-6">Pino doesn't just talk. It analyzes, recreates, and automates your entire study and work flow. Powered by Gemini 3.</p>
            <Link to="/hub" className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors inline-block">
              Get Started
            </Link>
          </div>
          <div className="w-full md:w-64 aspect-square bg-gray-900/50 rounded-2xl border border-gray-800 flex items-center justify-center">
            <i className="fas fa-brain text-6xl text-gray-700"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
