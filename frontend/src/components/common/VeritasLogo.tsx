import React from 'react';

interface VeritasLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const VeritasLogo: React.FC<VeritasLogoProps> = ({
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  }[size];

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek Lens Icon */}
      <div className={`relative ${iconSizes} flex-shrink-0 flex items-center justify-center`}>
        <div className="w-full h-full rounded-xl bg-gradient-to-br from-magenta via-violet-electric to-aubergine-surface border border-white/20 shadow-md flex items-center justify-center overflow-hidden">
          <svg viewBox="0 0 40 40" className="w-3/4 h-3/4" fill="none">
            <circle cx="18" cy="18" r="10" stroke="#00F0FF" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="5" fill="#FCFAFF" />
            <circle cx="17" cy="17" r="2" fill="#1A0C2B" />
            <line x1="25" y1="25" x2="33" y2="33" stroke="#00F0FF" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Modern Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-display font-extrabold tracking-tight text-white ${textSizes}`}>
            VERITAS<span className="text-cyan-400">LINK</span>
          </span>
          <span className="px-1.5 py-0.5 bg-magenta/20 text-magenta text-[9px] font-mono font-bold rounded border border-magenta/30">
            AI
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-mono text-lavender/70 tracking-wider uppercase mt-1">
            Don't Just Scan. Investigate.
          </span>
        )}
      </div>
    </div>
  );
};
