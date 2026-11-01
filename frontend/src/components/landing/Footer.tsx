import React from 'react';
import { VeritasLogo } from '../common/VeritasLogo';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC<{ onNavigateToWorkspace: () => void }> = ({
  onNavigateToWorkspace,
}) => {
  return (
    <footer className="bg-aubergine-950 border-t border-white/10 text-lavender/70 pt-12 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-white/10 gap-6">
          
          <div className="flex flex-col items-start">
            <VeritasLogo size="sm" showTagline={false} />
            <p className="text-xs font-sans text-lavender/60 max-w-sm mt-2 leading-relaxed">
              VeritasLink investigates suspicious URLs using TinyFish remote browser automation and Google Gemini reasoning.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToWorkspace}
              className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
            >
              Launch Lab
            </button>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-lavender/50 gap-3">
          <p>&copy; 2026 VERITASLINK &bull; TINYFISH HACKATHON</p>
          <p>REMOTE ISOLATED SESSIONS &bull; ZERO CREDENTIAL TRANSMISSION</p>
        </div>
      </div>
    </footer>
  );
};
