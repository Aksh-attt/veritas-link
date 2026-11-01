import React from 'react';
import { InvestigationReport } from '../../types';
import { VeritasLogo } from '../common/VeritasLogo';
import { RiskBadge, SeverityTag } from '../common/RiskBadge';
import { BrandComparison } from './BrandComparison';
import { RedirectChainView } from './RedirectChainView';
import { RequestedInfoGrid } from './RequestedInfoGrid';
import { EvidenceGallery } from './EvidenceGallery';
import { 
  X, Share2, ShieldCheck, Clock, ShieldAlert 
} from 'lucide-react';

interface ThreatReportModalProps {
  report: InvestigationReport;
  onClose: () => void;
  onOpenWarningCard: () => void;
}

export const ThreatReportModal: React.FC<ThreatReportModalProps> = ({
  report,
  onClose,
  onOpenWarningCard,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-aubergine-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 gap-3">
          <VeritasLogo size="sm" showTagline={false} />

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenWarningCard}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Share Card</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Verdict & Risk Summary Header */}
        <div className="rounded-2xl bg-aubergine-surface/40 border border-white/10 p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="text-[11px] font-mono text-lavender/60 mb-1">
                DOSSIER #{report.id} &bull; {report.created_at}
              </div>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                Forensic Investigation Dossier
              </h2>
              <div className="text-xs font-mono text-lavender/80 mt-1 break-all">
                Target: <strong className="text-cyan-300 font-medium">{report.url}</strong>
              </div>
            </div>

            <RiskBadge
              verdict={report.final_verdict}
              score={report.risk_score}
              confidence={report.confidence}
              size="lg"
              showDetails={true}
            />
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs font-sans">
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-lavender/60 block text-[10px] uppercase">Target Brand</span>
              <strong className="text-white">{report.impersonated_brand || 'None Detected'}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-lavender/60 block text-[10px] uppercase">Analysis Engine</span>
              <strong className="text-cyan-300">{report.engine_used}</strong>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/5">
              <span className="text-lavender/60 block text-[10px] uppercase">Execution Duration</span>
              <strong className="text-white">{report.duration_seconds}s</strong>
            </div>
          </div>
        </div>

        {/* Risk Indicators */}
        <div className="rounded-2xl bg-aubergine-surface/40 border border-white/10 p-5 sm:p-6">
          <h3 className="font-display font-bold text-lg text-white mb-3">
            Calibrated Risk Factors ({report.risk_indicators.length})
          </h3>
          <div className="space-y-2.5 font-sans text-xs">
            {report.risk_indicators.map((ind, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-aubergine-950/60 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-white">{ind.title}</span>
                    <SeverityTag severity={ind.severity} />
                  </div>
                  <p className="text-lavender/80 text-xs">{ind.detail}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-400/15 text-cyan-300 font-mono font-bold text-[11px] whitespace-nowrap self-start sm:self-center border border-cyan-400/20">
                  +{ind.weight} PTS
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Comparison */}
        {report.brand_comparison && (
          <BrandComparison comparison={report.brand_comparison} />
        )}

        {/* Information Requested */}
        <RequestedInfoGrid fields={report.information_requested} />

        {/* Redirect Chain */}
        <RedirectChainView redirectChain={report.redirect_chain} />

        {/* Evidence Exhibits */}
        <EvidenceGallery evidence={report.evidence} />

        {/* Safety Actions */}
        <div className="rounded-2xl bg-gradient-to-r from-aubergine-surface/60 to-aubergine-surface/30 border border-cyan-400/30 p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white">
              Recommended Safety Actions
            </h3>
          </div>
          <div className="space-y-2 text-xs font-sans text-lavender/90 mb-4">
            {report.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0 mt-1.5" />
                <span className="text-offWhite">{rec}</span>
              </div>
            ))}
          </div>

          {report.uncertainties.length > 0 && (
            <div className="pt-3 border-t border-white/10 text-xs text-lavender/60">
              <span className="text-[10px] uppercase font-bold text-cyan-300 block mb-1">
                Forensic Limitations:
              </span>
              <ul className="list-disc list-inside space-y-0.5">
                {report.uncertainties.map((u, i) => (
                  <li key={i}>{u}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom Close */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};
