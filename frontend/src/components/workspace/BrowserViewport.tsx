import React, { useState } from 'react';
import { 
  Globe, Lock, AlertTriangle, RefreshCw, 
  Terminal, Eye, ShieldCheck 
} from 'lucide-react';
import { VeraStateType } from '../../types';

interface BrowserViewportProps {
  currentUrl: string;
  screenshotUrl?: string;
  isInvestigating: boolean;
  veraState: VeraStateType;
  lastEventMessage?: string;
  activeConsoleLogs?: string[];
}

export const BrowserViewport: React.FC<BrowserViewportProps> = ({
  currentUrl,
  screenshotUrl,
  isInvestigating,
  veraState,
  lastEventMessage,
  activeConsoleLogs = [],
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'console'>('preview');
  const isSecure = currentUrl.startsWith('https://');

  return (
    <div className="w-full rounded-2xl bg-aubergine-900/90 border border-white/10 overflow-hidden flex flex-col shadow-xl backdrop-blur-md">
      
      {/* Top Browser Chrome Bar */}
      <div className="bg-aubergine-surface/60 border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-3">
        
        {/* Window Dots */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-lg mx-auto flex items-center bg-aubergine-950/80 border border-white/10 rounded-xl px-3 py-1 text-xs font-mono">
          {isSecure ? (
            <div className="flex items-center gap-1 text-emerald-400 mr-2 flex-shrink-0">
              <Lock className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold">HTTPS</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-coral mr-2 flex-shrink-0">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[10px] uppercase font-bold">UNVERIFIED</span>
            </div>
          )}
          <span className="truncate text-offWhite/90 select-all font-mono text-[11px]">
            {currentUrl || 'about:blank'}
          </span>
        </div>

        {/* View Switcher (Viewport vs Console) */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-white/5 border border-white/10">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-medium flex items-center gap-1 transition-all ${
              activeTab === 'preview'
                ? 'bg-magenta text-white shadow-sm'
                : 'text-lavender/60 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Viewport</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-sans font-medium flex items-center gap-1 transition-all ${
              activeTab === 'console'
                ? 'bg-cyan-400 text-slate-950 font-extrabold shadow-sm'
                : 'text-lavender/60 hover:text-white'
            }`}
          >
            <Terminal className="w-3 h-3" />
            <span>Wire</span>
          </button>
        </div>

      </div>

      {/* Viewport Content Area */}
      <div className="relative min-h-[360px] max-h-[460px] bg-aubergine-950/50 flex items-center justify-center overflow-auto p-4">
        
        {activeTab === 'preview' ? (
          screenshotUrl ? (
            <div className="w-full h-full flex items-center justify-center relative">
              <img
                src={screenshotUrl}
                alt="Target Page Screenshot"
                className="max-w-full max-h-[420px] object-contain rounded-xl border border-white/10 shadow-lg"
              />
              {isInvestigating && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-aubergine-950/90 border border-magenta/40 text-magenta-light text-[11px] font-mono font-medium flex items-center gap-2 backdrop-blur-md animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-magenta" />
                  <span>AGENT AUDITING FORMS & SCRIPTS</span>
                </div>
              )}
            </div>
          ) : (
            /* Standby / Loading state */
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
              {isInvestigating ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-magenta/20 border border-magenta/40 flex items-center justify-center animate-spin-slow mb-3 text-magenta">
                    <RefreshCw className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h4 className="font-sans font-bold text-sm text-white mb-1">
                    Connecting to Remote Browser Sandbox...
                  </h4>
                  <p className="text-xs font-mono text-lavender/70">
                    {lastEventMessage || 'Establishing isolated container session'}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-lavender/60">
                    <Globe className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h4 className="font-sans font-semibold text-sm text-white mb-1">
                    Remote Browser Standby
                  </h4>
                  <p className="text-xs text-lavender/60 font-sans">
                    Submit a link or select a simulation above to begin autonomous inspection.
                  </p>
                </div>
              )}
            </div>
          )
        ) : (
          /* Wire Console */
          <div className="w-full h-full min-h-[320px] p-3 font-mono text-xs overflow-y-auto text-lavender/80 bg-black/40 rounded-xl">
            <div className="text-[10px] text-lavender/40 uppercase mb-2 border-b border-white/5 pb-1">
              -- TINYFISH ISOLATED WIRE TRACE --
            </div>
            {activeConsoleLogs.length > 0 ? (
              <div className="space-y-1">
                {activeConsoleLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-magenta">&gt;</span>
                    <span className="text-offWhite/90">{log}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-lavender/40 italic">No events captured yet.</div>
            )}
          </div>
        )}

      </div>

      {/* Sleek Sub-footer */}
      <div className="bg-aubergine-surface/40 border-t border-white/10 px-4 py-2 flex items-center justify-between text-[11px] font-mono text-lavender/70">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>TINYFISH REMOTE CHROMIUM (ISOLATED)</span>
        </div>
        <span>STATUS: <strong className="text-white">{veraState}</strong></span>
      </div>

    </div>
  );
};
