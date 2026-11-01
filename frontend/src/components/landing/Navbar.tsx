import React from 'react';
import { VeritasLogo } from '../common/VeritasLogo';
import { Terminal, Sparkles, Compass, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'workspace' | 'history';
  onNavigate: (view: 'landing' | 'workspace' | 'history') => void;
  onOpenDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenDemo,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-aubergine-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => onNavigate('landing')}
          className="cursor-pointer transition-opacity hover:opacity-90"
        >
          <VeritasLogo size="sm" showTagline={false} />
        </div>

        {/* Center Minimal Nav Pills */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-aubergine-surface/40 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => onNavigate('landing')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all ${
              currentView === 'landing'
                ? 'bg-magenta text-white shadow-sm'
                : 'text-lavender/80 hover:text-white hover:bg-white/5'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('workspace')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'workspace'
                ? 'bg-cyan-400 text-slate-950 font-bold shadow-sm'
                : 'text-lavender/80 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Investigation Lab</span>
          </button>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-offWhite text-xs font-sans font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-magenta-light" />
            <span className="hidden sm:inline">Simulations</span>
          </button>

          <button
            onClick={() => onNavigate('workspace')}
            className="px-4 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-sans font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md hover:shadow-cyan-500/25"
          >
            <Compass className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Launch Lab</span>
          </button>
        </div>

      </div>
    </header>
  );
};
