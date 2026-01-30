
import React, { useState } from 'react';
import { User } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: 'user_' + Date.now(),
      email,
      name: email.split('@')[0],
      isPro: false
    };
    localStorage.setItem('pino_user', JSON.stringify(mockUser));
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <div className="w-full max-w-md bg-[#111] border border-gray-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 brand-bg"></div>
        <div className="text-center mb-10">
          <div className="w-20 h-20 brand-bg rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-cyan-500/20 relative group overflow-hidden pineapple-logo">
            <i className="fas fa-pineapple text-4xl text-white relative z-10 transition-transform group-hover:scale-110"></i>
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tight">{isLogin ? 'Intelligence Evolved' : 'Join the Evolution'}</h1>
          <p className="text-gray-500 text-sm font-medium">Experience the future of autonomous AI.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all text-gray-200"
              placeholder="name@evolution.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 ml-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-cyan-500 transition-all text-gray-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 brand-bg hover:opacity-90 text-white font-black rounded-2xl shadow-xl shadow-purple-600/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            {isLogin ? 'Authorize Access' : 'Begin Evolution'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs font-bold text-gray-500 hover:text-cyan-500 transition-colors uppercase tracking-widest"
          >
            {isLogin ? "Need a new identity? Register" : "Identity verified? Authorize"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
