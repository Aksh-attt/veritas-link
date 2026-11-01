import React from 'react';
import { Shield, Eye, Route, BrainCircuit, Cpu } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Safe Intake & Normalization',
      tag: 'STAGE 1',
      icon: Shield,
      color: 'bg-lavender/15 text-lavender border-lavender/30',
      description:
        'URL is validated, query tokens inspected for credential leaks, and blocked from accessing your local device or internal networks.',
    },
    {
      step: '02',
      title: 'TinyFish Isolated Navigation',
      tag: 'STAGE 2',
      icon: Cpu,
      color: 'bg-magenta/15 text-magenta-light border-magenta/30',
      description:
        'A headless Chromium instance in the TinyFish cloud opens the link. Anti-cloaking stealth proxies observe the genuine deceptive payload.',
    },
    {
      step: '03',
      title: 'Behavior & Form Extraction',
      tag: 'STAGE 3',
      icon: Eye,
      color: 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30',
      description:
        'Tracks redirects, scans for credential fields (credit cards, OTP, passwords), and identifies psychological urgency tricks.',
    },
    {
      step: '04',
      title: 'Official Brand Cross-Audit',
      tag: 'STAGE 4',
      icon: Route,
      color: 'bg-coral/15 text-coral border-coral/30',
      description:
        'Identifies the claimed enterprise (Power Grid, Postal Service, Bank) and independently audits canonical domain and SSL certificates.',
    },
    {
      step: '05',
      title: 'Gemini Agentic Reasoning',
      tag: 'STAGE 5',
      icon: BrainCircuit,
      color: 'bg-purple-400/15 text-purple-300 border-purple-400/30',
      description:
        'Google Gemini synthesizes observed behavior against known deceptive tactics, producing an explainable threat dossier.',
    },
  ];

  return (
    <section className="py-20 bg-aubergine-950/60 border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-magenta/15 border border-magenta/30 text-magenta-light text-xs font-mono font-medium uppercase tracking-wider">
              Autonomous Pipeline
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-3">
              How VeritasLink Investigates
            </h2>
          </div>
          <p className="text-lavender/70 text-sm max-w-md font-sans">
            We don't rely on stale blocklists. Our autonomous agent visits the page in a secure bubble and inspects actual deceptive behavior.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="rounded-2xl p-5 bg-aubergine-light/70 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1 backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-display font-extrabold text-lavender/40">
                      {s.step}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-lavender/70 border border-white/5">
                      {s.tag}
                    </span>
                  </div>

                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${s.color}`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>

                  <h3 className="font-sans font-bold text-base text-white mb-2 leading-snug">
                    {s.title}
                  </h3>
                </div>

                <p className="text-xs font-sans text-lavender/70 leading-relaxed mt-2">
                  {s.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
