
import React, { useState, useEffect } from 'react';

const MobileApp: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 page-transition">
      <div className="text-center mb-12">
        <div className="w-28 h-28 brand-bg rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cyan-500/20 pineapple-logo relative group overflow-hidden">
          <i className="fas fa-pineapple text-5xl text-white relative z-10 transition-transform group-hover:rotate-12"></i>
          <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4 brand-text">Pino Evolved</h1>
        <p className="text-gray-400 font-medium">The Native Store-Ready autonomous experience.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 brand-bg opacity-[0.03] blur-3xl"></div>
          <h2 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter">
            <i className="fas fa-check-circle text-cyan-500"></i>
            Evolved Capabilities
          </h2>
          <ul className="space-y-6">
            {[
              { icon: 'fa-bolt', text: 'Neural App Launch', sub: 'Instantaneous activation via PWA tech' },
              { icon: 'fa-bell', text: 'Cognitive Alerts', sub: 'Deeply integrated push notifications' },
              { icon: 'fa-shield-halved', text: 'Biometric Firewall', sub: 'Native-level security for your data' },
              { icon: 'fa-wifi-slash', text: 'Distributed Offline Mode', sub: 'Library access anywhere, anytime' }
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0 shadow-inner">
                  <i className={`fas ${f.icon} brand-text text-xl`}></i>
                </div>
                <div>
                  <p className="font-black text-gray-200 uppercase tracking-tight text-sm">{f.text}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">{f.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isInstalled ? (
          <div className="p-8 bg-cyan-500/10 border border-cyan-500/30 rounded-[2rem] text-center shadow-inner">
            <p className="text-cyan-400 font-black uppercase tracking-widest text-xs">Evolved Instance Successfully Installed</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={handleInstall}
              className="w-full py-6 bg-white text-black font-black rounded-[2rem] active-scale transition-all flex items-center justify-center gap-4 shadow-2xl hover:bg-gray-100"
            >
              <i className="fas fa-pineapple text-xl"></i> 
              <span className="uppercase tracking-widest text-sm">Download Evolution</span>
            </button>
            <p className="text-center text-[10px] text-gray-600 uppercase tracking-[0.3em] font-black mt-4">
              Cross-Platform Native Deployment Ready
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileApp;
