import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VeraAvatar } from '../common/VeraAvatar';
import { Search, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { VeraStateType } from '../../types';

interface HeroSectionProps {
  onStartInvestigation: (url: string) => void;
  onOpenDemo: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartInvestigation,
  onOpenDemo,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [veraState, setVeraState] = useState<VeraStateType>('IDLE');
  const [inputWarning, setInputWarning] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setUrlInput(val);
    
    if (!val) {
      setVeraState('IDLE');
      setInputWarning(null);
    } else if (val.includes('?') && (val.includes('token') || val.includes('auth') || val.includes('otp'))) {
      setVeraState('SUSPICIOUS');
      setInputWarning('Notice: URL contains sensitive authentication query parameters.');
    } else if (val.startsWith('http')) {
      setVeraState('SCANNING');
      setInputWarning(null);
    } else {
      setVeraState('IDLE');
      setInputWarning(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onStartInvestigation(urlInput.trim());
  };

  return (
    <section className="relative pt-16 sm:pt-24 pb-20 overflow-hidden">
      
      {/* Subtle Ambient Radial Glows (Inspired by Synco & Flux references) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-magenta/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-violet-electric/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Hero Content */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 flex flex-col items-start"
          >
            {/* Giant Bold Headline (Inspired by Flux Academy reference) */}
            <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white mb-6">
              Every Link Has a Story.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-magenta via-pink-400 to-cyan-400">
                Let's Investigate It.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-lavender/80 max-w-xl mb-8 leading-relaxed font-sans font-normal">
              Traditional scanners only check static domain databases. VeritasLink deploys an isolated TinyFish 
              remote browser agent that navigates the suspicious page, records redirects, maps deception funnels, 
              and has Google Gemini synthesize evidence-backed threat reports.
            </p>

            {/* Clean Input Box */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl mb-4">
              <div className="p-1.5 sm:p-2 rounded-2xl bg-aubergine-light/90 border border-white/15 shadow-xl flex flex-col sm:flex-row gap-2 backdrop-blur-md focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-400/20 transition-all">
                <div className="relative flex-1 flex items-center px-3">
                  <Search className="w-5 h-5 text-lavender/50 mr-2.5 flex-shrink-0" />
                  <input
                    type="text"
                    value={urlInput}
                    onChange={handleInputChange}
                    placeholder="Paste suspicious link (SMS, WhatsApp, Email, bit.ly)..."
                    className="w-full bg-transparent text-white placeholder-lavender/40 text-xs sm:text-sm font-sans focus:outline-none"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={!urlInput.trim()}
                  className={`px-6 py-3 rounded-xl font-sans font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 whitespace-nowrap transition-all ${
                    urlInput.trim() 
                      ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md hover:shadow-cyan-500/25 cursor-pointer' 
                      : 'bg-white/10 text-lavender/40 cursor-not-allowed'
                  }`}
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </button>
              </div>

              {inputWarning && (
                <div className="mt-2 px-3.5 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-sans flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-cyan-400" />
                  <span>{inputWarning}</span>
                </div>
              )}
            </form>

            {/* Quick Demo CTA */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-sans text-lavender/70">
              <span className="font-medium text-lavender/50">Simulated test environments:</span>
              <button
                type="button"
                onClick={onOpenDemo}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-offWhite border border-white/10 font-medium transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-magenta-light" />
                <span>Explore 3 Phishing Demos</span>
              </button>
            </div>
          </motion.div>

          {/* Right Hero Mascot Composition */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            <div className="relative w-full max-w-sm aspect-square rounded-3xl bg-gradient-to-b from-aubergine-light/80 to-aubergine-surface/50 border border-white/10 shadow-2xl flex flex-col items-center justify-center p-6 backdrop-blur-xl">
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-lavender/70">
                AI MASCOT &bull; VERA
              </div>

              <VeraAvatar 
                state={veraState} 
                size="hero" 
                showSpeech={true}
                interactive={true}
                onClick={() => {
                  const states: VeraStateType[] = [
                    'IDLE', 'SCANNING', 'INVESTIGATING', 
                    'SUSPICIOUS', 'THREAT DETECTED', 'ASSESSMENT COMPLETE'
                  ];
                  const next = states[(states.indexOf(veraState) + 1) % states.length];
                  setVeraState(next);
                }}
              />
              <span className="text-[11px] font-sans text-lavender/50 mt-3">
                Click VERA to cycle reactive expressions
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
