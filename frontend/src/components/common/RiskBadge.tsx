import React from 'react';
import { VerdictType, SeverityType, ConfidenceType } from '../../types';
import { AlertTriangle, ShieldAlert, CheckCircle2, HelpCircle } from 'lucide-react';

interface RiskBadgeProps {
  verdict: VerdictType;
  score?: number;
  confidence?: ConfidenceType;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  verdict,
  score,
  confidence,
  size = 'md',
  showDetails = false,
}) => {
  const configs: Record<
    VerdictType,
    {
      bg: string;
      text: string;
      border: string;
      badge: string;
      icon: React.ComponentType<{ className?: string }>;
      label: string;
      subtitle: string;
    }
  > = {
    "HIGH RISK": {
      bg: "bg-coral/15",
      text: "text-coral",
      border: "border-coral/40",
      badge: "bg-coral text-aubergine-950",
      icon: ShieldAlert,
      label: "HIGH RISK",
      subtitle: "Active phishing deception or credential theft confirmed",
    },
    "SUSPICIOUS": {
      bg: "bg-amber-400/15",
      text: "text-amber-300",
      border: "border-amber-400/40",
      badge: "bg-amber-400 text-slate-950 font-extrabold",
      icon: AlertTriangle,
      label: "SUSPICIOUS",
      subtitle: "Deceptive cues, domain anomalies, or evasive behavior",
    },
    "NO STRONG INDICATORS": {
      bg: "bg-lavender/15",
      text: "text-lavender",
      border: "border-lavender/30",
      badge: "bg-lavender text-aubergine-950",
      icon: CheckCircle2,
      label: "NO STRONG INDICATORS",
      subtitle: "No explicit malicious payload observed in session",
    },
    "INCONCLUSIVE": {
      bg: "bg-white/10",
      text: "text-slate-300",
      border: "border-white/20",
      badge: "bg-slate-300 text-aubergine-950",
      icon: HelpCircle,
      label: "INCONCLUSIVE",
      subtitle: "Website blocked exploration, cloaked, or was unreachable",
    },
  };

  const current = configs[verdict] || configs["INCONCLUSIVE"];
  const Icon = current.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3.5 py-1.5 text-xs sm:text-sm gap-2",
    lg: "px-4 py-2 text-sm sm:text-base gap-2.5 font-bold",
  }[size];

  return (
    <div className="inline-flex flex-col">
      <div
        className={`inline-flex items-center rounded-xl font-display font-bold uppercase border backdrop-blur-md ${current.bg} ${current.text} ${current.border} ${sizeClasses}`}
      >
        <Icon className={size === 'lg' ? 'w-5 h-5 stroke-[2.2]' : 'w-4 h-4 stroke-[2.2]'} />
        <span>{current.label}</span>
        {typeof score === 'number' && (
          <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${current.badge}`}>
            {score}/100
          </span>
        )}
      </div>

      {showDetails && (
        <div className="mt-1.5 flex items-center gap-2">
          {confidence && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-lavender/80 border border-white/10">
              CONFIDENCE: <strong className="text-white">{confidence}</strong>
            </span>
          )}
          <span className="text-xs text-lavender/70">
            {current.subtitle}
          </span>
        </div>
      )}
    </div>
  );
};

export const SeverityTag: React.FC<{ severity: SeverityType; text?: string }> = ({
  severity,
  text,
}) => {
  const styles: Record<SeverityType, string> = {
    CRITICAL: "bg-coral/20 text-coral border-coral/30",
    HIGH: "bg-magenta/20 text-magenta-light border-magenta/30",
    MEDIUM: "bg-amber-400/20 text-amber-300 border-amber-400/30",
    LOW: "bg-lavender/15 text-lavender border-lavender/25",
    INFO: "bg-white/10 text-slate-300 border-white/15",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-mono font-semibold uppercase rounded border ${styles[severity] || styles.INFO}`}
    >
      {text || severity}
    </span>
  );
};
