
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
        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-blue-500/20">
          <span className="text-4xl font-black text-white">P</span>
        </div>
        <h1 className="text-4xl font-black tracking-tight mb-4">Pino Mobile</h1>
        <p className="text-gray-400">The Store-Ready autonomous experience.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
            <i className="fas fa-check-circle text-green-500"></i>
            Native Features Enabled
          </h2>
          <ul className="space-y-4">
            {[
              { icon: 'fa-bolt', text: 'Instant App Launch', sub: 'Zero loading state after first run' },
              { icon: 'fa-bell', text: 'Push Notifications', sub: 'Get notified when tasks complete' },
              { icon: 'fa-shield-halved', text: 'Secure Biometric Lock', sub: 'Protect your study materials' },
              { icon: 'fa-wifi-slash', text: 'Offline Mastery', sub: 'Access your library without data' }
            ].map((f, i) => (
              <li key={i} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center shrink-0">
                  <i className={`fas ${f.icon} text-blue-500`}></i>
                </div>
                <div>
                  <p className="font-bold text-gray-200">{f.text}</p>
                  <p className="text-xs text-gray-500">{f.sub}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {isInstalled ? (
          <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-3xl text-center">
            <p className="text-green-500 font-bold">Successfully Installed in Native Mode</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={handleInstall}
              className="w-full py-5 bg-white text-black font-black rounded-3xl active-scale transition-all flex items-center justify-center gap-3"
            >
              <i className="fas fa-download"></i> Install Pino Now
            </button>
            <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest font-black">
              Available for Android & iOS via Web-to-Native technology
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mt-8">
           <div className="p-4 bg-[#111] border border-gray-800 rounded-2xl text-center grayscale opacity-50">
             <i className="fab fa-google-play text-2xl mb-2"></i>
             <p className="text-[10px] font-bold">Play Store Build</p>
           </div>
           <div className="p-4 bg-[#111] border border-gray-800 rounded-2xl text-center grayscale opacity-50">
             <i className="fab fa-apple text-2xl mb-2"></i>
             <p className="text-[10px] font-bold">App Store Build</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;
