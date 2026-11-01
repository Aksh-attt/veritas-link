import React, { useState } from 'react';
import { InvestigationReport } from '../../types';
import { VeritasLogo } from '../common/VeritasLogo';
import { VeraAvatar } from '../common/VeraAvatar';
import { RiskBadge } from '../common/RiskBadge';
import { Copy, Check, Download, ShieldAlert, QrCode, X } from 'lucide-react';

interface ShareableWarningCardProps {
  report: InvestigationReport;
  onClose: () => void;
}

export const ShareableWarningCard: React.FC<ShareableWarningCardProps> = ({
  report,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const shareText = `⚠️ VERITASLINK CYBER ADVISORY: POSSIBLE PHISHING DETECTED ⚠️

Target: ${report.hostname || report.url}
Verdict: ${report.final_verdict} (Risk Score: ${report.risk_score}/100)
Impersonates: ${report.impersonated_brand || 'Unknown'}

Observed Deception:
${report.risk_indicators.slice(0, 2).map(r => `• ${r.title}: ${r.detail}`).join('\n')}

DO NOT enter credentials, OTPs, or financial cards.
Verified via TinyFish Cloud Browser & Gemini.
Dossier ID: ${report.id}`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-aubergine-900 border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Card Canvas */}
        <div 
          id="warning-card-canvas"
          className="relative rounded-2xl bg-gradient-to-b from-aubergine-light to-aubergine-surface/90 border border-coral/40 p-6 shadow-xl overflow-hidden"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <VeritasLogo size="sm" showTagline={false} />
            <div className="px-2.5 py-0.5 rounded-full bg-coral/20 border border-coral/40 text-coral font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SECURITY BULLETIN</span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-3">
            <span className="text-[10px] font-mono uppercase text-coral font-bold block mb-1">
              FLAGGED DESTINATION
            </span>
            <h3 className="font-display font-extrabold text-xl text-white leading-snug">
              Impersonation of <span className="text-cyan-300 underline decoration-coral/50 font-bold">{report.impersonated_brand || 'Trusted Entity'}</span>
            </h3>
          </div>

          {/* Suspect URL */}
          <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 font-mono text-xs text-lavender/90 mb-4 break-all">
            {report.hostname || report.url}
          </div>

          {/* Risk Badge */}
          <div className="flex items-center justify-between gap-3 mb-4 p-3 rounded-xl bg-white/5 border border-white/5">
            <RiskBadge verdict={report.final_verdict} score={report.risk_score} size="md" />
            <div className="text-right text-xs font-mono text-lavender/60">
              <span className="block text-[10px]">CONFIDENCE</span>
              <strong className="text-white">{report.confidence}</strong>
            </div>
          </div>

          {/* Findings */}
          <div className="space-y-1.5 mb-4 text-xs font-sans text-lavender/80">
            {report.risk_indicators.slice(0, 2).map((ind, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0 mt-1.5" />
                <span>
                  <strong className="text-white">{ind.title}:</strong> {ind.detail}
                </span>
              </div>
            ))}
          </div>

          {/* Footer Seal */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-lavender/60">
            <div className="flex items-center gap-2">
              <VeraAvatar state="THREAT DETECTED" size="xs" interactive={false} />
              <div>
                <span className="block font-semibold text-white">VERA FORENSIC AUDIT</span>
                <span className="text-[9px]">ID: {report.id}</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] font-bold text-white">SCAN TO VERIFY</span>
            </div>
          </div>

        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyText}
            className="flex-1 py-2.5 px-4 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Warning Notice</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-offWhite font-sans font-semibold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Save PDF / Print</span>
          </button>
        </div>

      </div>
    </div>
  );
};
