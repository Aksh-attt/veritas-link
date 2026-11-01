import React from 'react';

export const StarburstBadge: React.FC<{
  text: string;
  subtext?: string;
  color?: 'cyan' | 'pink' | 'lavender';
  className?: string;
}> = ({ text, subtext, color = 'cyan', className = '' }) => {
  const bgColors = {
    cyan: 'bg-cyan-400/15 border-cyan-400/40 text-cyan-300',
    pink: 'bg-magenta/15 border-magenta/40 text-magenta-light',
    lavender: 'bg-lavender/15 border-lavender/30 text-lavender',
  }[color];

  return (
    <div className={`inline-flex flex-col items-center justify-center px-3 py-1.5 rounded-full border backdrop-blur-md ${bgColors} ${className}`}>
      <span className="font-display font-bold text-xs uppercase tracking-wider text-center">
        {text}
      </span>
      {subtext && (
        <span className="text-[9px] font-mono opacity-80 mt-0.5">
          {subtext}
        </span>
      )}
    </div>
  );
};

export const EditorialStamp: React.FC<{
  text: string;
  status?: 'warning' | 'alert' | 'isolated' | 'evidence';
  className?: string;
}> = ({ text, status = 'evidence', className = '' }) => {
  const borderStyles = {
    warning: 'border-cyan-400/40 text-cyan-300 bg-cyan-400/10',
    alert: 'border-coral/40 text-coral bg-coral/10',
    isolated: 'border-lavender/30 text-lavender bg-lavender/5',
    evidence: 'border-magenta/40 text-magenta-light bg-magenta/10',
  }[status];

  return (
    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg border font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider select-none ${borderStyles} ${className}`}>
      {text}
    </div>
  );
};
