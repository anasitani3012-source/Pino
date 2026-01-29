
import React from 'react';

interface PricingProps {
  isPro?: boolean;
  onUpgrade?: () => void;
  onDowngrade?: () => void;
}

const Pricing: React.FC<PricingProps> = ({ isPro = false, onUpgrade, onDowngrade }) => {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      description: 'Perfect for getting started with autonomous tasks.',
      features: [
        'Basic Task Agent',
        'Standard Flashcards',
        'Limited Studio Access',
        'Gemini 3 Flash'
      ],
      button: isPro ? 'Downgrade' : 'Current Plan',
      current: !isPro,
      action: isPro ? onDowngrade : undefined
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: '/month',
      description: 'The complete autonomous study and work engine.',
      features: [
        'Advanced Task Agent (Pro)',
        '4K Image Generation*',
        'Veo 3.1 Video Studio*',
        'Live Real-time Voice Talk',
        'Unlimited Library Storage'
      ],
      button: isPro ? 'Active Plan' : 'Upgrade Now',
      popular: true,
      current: isPro,
      action: !isPro ? onUpgrade : undefined
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'For teams and high-volume autonomous processing.',
      features: [
        'Dedicated API Resources',
        'Team Shared Libraries',
        'Priority Veo Rendering',
        '24/7 Priority Support'
      ],
      button: 'Contact Sales',
      current: false,
      action: () => alert('Contacting sales...')
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
          Unlock the Full Power of Pino
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Choose the plan that fits your autonomous workflow. Subscribe monthly for full access to advanced video and image engines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`relative p-8 rounded-[3rem] border transition-all duration-500 hover:scale-105 ${
              plan.popular 
                ? 'bg-[#111] border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.1)]' 
                : 'bg-[#0d0d0d] border-gray-800'
            } ${plan.current ? 'border-2 border-blue-400' : ''}`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.period && <span className="text-gray-500 text-lg">{plan.period}</span>}
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-10">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${plan.popular ? 'bg-blue-600/20 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                    <i className="fas fa-check"></i>
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={plan.action}
              disabled={plan.id === 'free' && !isPro || plan.id === 'pro' && isPro}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${
                plan.current 
                  ? 'bg-gray-800 text-gray-400 cursor-default border border-gray-700' 
                  : plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20' 
                    : 'bg-white text-black hover:bg-gray-200'
              } active:scale-95`}
            >
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500 text-xs italic">
          * High-quality generation (Veo and Gemini 3 Pro) requires a paid API key from a Google Cloud Project with billing enabled. 
          <br />
          <a 
            href="https://ai.google.dev/gemini-api/docs/billing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-bold"
          >
            Learn more about billing documentation
          </a>
        </p>
      </div>

      <div className="mt-20 p-10 rounded-[3rem] bg-gradient-to-br from-gray-900 to-black border border-gray-800 text-center">
        <h3 className="text-2xl font-bold mb-4">Secure Billing Guaranteed</h3>
        <p className="text-gray-500 mb-8 max-w-xl mx-auto">
          We use industry-standard encryption for all transactions. You can cancel your monthly subscription at any time from your settings panel.
        </p>
        <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <i className="fab fa-cc-visa text-4xl"></i>
          <i className="fab fa-cc-mastercard text-4xl"></i>
          <i className="fab fa-cc-stripe text-4xl"></i>
          <i className="fab fa-cc-apple-pay text-4xl"></i>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
