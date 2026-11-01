import React from 'react';
import { RedirectHop } from '../../types';
import { AlertOctagon } from 'lucide-react';

interface RedirectChainViewProps {
  redirectChain: RedirectHop[];
}

export const RedirectChainView: React.FC<RedirectChainViewProps> = ({ redirectChain }) => {
  return (
    <div className="rounded-2xl bg-aubergine-surface/40 border border-white/10 p-5 sm:p-6">
      
      <div className="pb-3 mb-4 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300 block">
          Hop Analysis
        </span>
        <h3 className="font-display font-bold text-lg text-white">
          Redirection Journey ({redirectChain.length} Hops)
        </h3>
      </div>

      <div className="space-y-2.5 font-sans text-xs">
        {redirectChain.map((hop, index) => {
          const isFinal = index === redirectChain.length - 1;

          return (
            <div
              key={hop.hop}
              className={`p-3 rounded-xl border ${
                hop.suspicious
                  ? 'bg-coral/10 border-coral/30'
                  : 'bg-aubergine-950/60 border-white/5'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-white/10 text-cyan-300 font-mono font-bold flex items-center justify-center text-[10px]">
                    {hop.hop}
                  </span>
                  <span className="font-semibold text-white">
                    {isFinal ? 'Final Destination' : `Hop #${hop.hop}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-bold">
                    HTTP {hop.status_code}
                  </span>
                  <span className="text-lavender/50">{hop.timing_ms}ms</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-black/40 font-mono text-[11px] break-all text-lavender/90">
                {hop.url}
              </div>

              {hop.reason && (
                <div className="mt-1.5 text-[11px] text-coral flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{hop.reason}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
