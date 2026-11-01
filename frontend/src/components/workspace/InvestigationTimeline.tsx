import React from 'react';
import { InvestigationEvent } from '../../types';
import { 
  PlayCircle, Compass, ArrowRightLeft, ShieldAlert, 
  FileText, CheckCircle2, Clock 
} from 'lucide-react';

interface InvestigationTimelineProps {
  events: InvestigationEvent[];
  isInvestigating: boolean;
}

export const InvestigationTimeline: React.FC<InvestigationTimelineProps> = ({
  events,
  isInvestigating,
}) => {
  const getBadgeStyle = (eventType: string) => {
    switch (eventType) {
      case 'init':
        return 'bg-lavender/20 text-lavender';
      case 'navigate':
        return 'bg-cyan-400/20 text-cyan-300';
      case 'redirect':
        return 'bg-coral/20 text-coral';
      case 'form_found':
        return 'bg-magenta/20 text-magenta-light';
      case 'brand_found':
        return 'bg-purple-300/20 text-purple-200';
      case 'complete':
        return 'bg-emerald-400/20 text-emerald-300';
      default:
        return 'bg-white/10 text-slate-300';
    }
  };

  return (
    <div className="w-full rounded-2xl bg-aubergine-900/90 border border-white/10 p-4 shadow-xl backdrop-blur-md flex flex-col h-full max-h-[300px]">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <h3 className="font-sans font-semibold text-xs uppercase tracking-wider text-white">
            Investigation Wire Events
          </h3>
        </div>
        {isInvestigating && (
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-magenta/15 border border-magenta/30 text-[10px] font-mono text-magenta-light font-medium animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-magenta" />
            LIVE
          </span>
        )}
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
        {events.length > 0 ? (
          events.map((ev, index) => {
            const badgeStyle = getBadgeStyle(ev.event_type);

            return (
              <div
                key={index}
                className="relative pl-5 pb-1 border-l border-white/10 last:border-l-0"
              >
                {/* Pip */}
                <div className="absolute -left-[4.5px] top-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.6)]" />

                <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-medium text-lavender/60">
                      {ev.timestamp}
                    </span>
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${badgeStyle}`}>
                      {ev.event_type}
                    </span>
                  </div>

                  <p className="text-offWhite/90 text-xs font-sans leading-relaxed">
                    {ev.message}
                  </p>

                  {ev.current_url && (
                    <div className="mt-1 text-[10px] font-mono text-lavender/50 truncate">
                      ↳ {ev.current_url}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-center text-lavender/40 text-xs font-sans">
            Events will stream here in real time as the agent navigates.
          </div>
        )}
      </div>

    </div>
  );
};
