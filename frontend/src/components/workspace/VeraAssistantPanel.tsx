import React from 'react';
import { VeraAvatar } from '../common/VeraAvatar';
import { RiskBadge, SeverityTag } from '../common/RiskBadge';
import { 
  VeraStateType, 
  InvestigationReport, 
  RequestedField, 
  ObservedBehaviour 
} from '../../types';
import { 
  FileText, Share2, AlertTriangle, ShieldCheck, 
  ChevronRight, ExternalLink 
} from 'lucide-react';

interface VeraAssistantPanelProps {
  veraState: VeraStateType;
  report: InvestigationReport | null;
  isInvestigating: boolean;
  observations: ObservedBehaviour[];
  requestedFields: RequestedField[];
  onOpenReport: () => void;
  onOpenWarningCard: () => void;
}

export const VeraAssistantPanel: React.FC<VeraAssistantPanelProps> = ({
  veraState,
  report,
  isInvestigating,
  observations,
  requestedFields,
  onOpenReport,
  onOpenWarningCard,
}) => {
  return (
    <div className="w-full rounded-2xl bg-aubergine-900/90 border border-white/10 p-5 shadow-xl backdrop-blur-md flex flex-col gap-4">
      
      {/* VERA Capsule Card */}
      <div className="rounded-xl bg-aubergine-surface/40 border border-white/10 p-4 flex flex-col items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-magenta/10 rounded-full blur-2xl pointer-events-none" />
        
        <VeraAvatar
          state={veraState}
          size="md"
          showSpeech={true}
          interactive={false}
        />

        <div className="mt-2 text-center">
          <span className="text-xs font-sans font-semibold text-white block">
            VERA Forensic Assistant
          </span>
          <span className="text-[10px] font-mono text-lavender/60">
            TinyFish Cloud Browser & Gemini Reasoning
          </span>
        </div>
      </div>

      {/* Current Risk Verdict Card */}
      <div className="rounded-xl bg-white/5 border border-white/10 p-3.5">
        <span className="text-[10px] font-mono font-semibold uppercase text-lavender/60 block mb-1.5">
          Risk Verdict
        </span>

        {report ? (
          <div>
            <RiskBadge
              verdict={report.final_verdict}
              score={report.risk_score}
              confidence={report.confidence}
              size="md"
              showDetails={true}
            />
            {report.impersonated_brand && (
              <div className="mt-2.5 pt-2 border-t border-white/10 text-xs font-sans text-lavender/80">
                Impersonates: <strong className="text-cyan-300 font-semibold">{report.impersonated_brand}</strong>
              </div>
            )}
          </div>
        ) : isInvestigating ? (
          <div className="flex items-center gap-2 text-xs font-sans text-cyan-300 py-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Evaluating deception metrics...</span>
          </div>
        ) : (
          <div className="text-xs font-sans text-lavender/50 py-1">
            Awaiting target URL to begin evaluation.
          </div>
        )}
      </div>

      {/* Extracted Findings Stream */}
      <div className="flex-1 flex flex-col min-h-[140px] max-h-[220px]">
        <span className="text-[10px] font-mono font-semibold uppercase text-lavender/60 mb-2">
          Observed Traps ({requestedFields.length + observations.length})
        </span>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-sans text-xs">
          {/* Requested Fields */}
          {requestedFields.map((field, idx) => (
            <div
              key={`field-${idx}`}
              className="p-2.5 rounded-xl bg-coral/10 border border-coral/30 text-palePink"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-coral flex items-center gap-1 text-[11px]">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  {field.field_name}
                </span>
                <SeverityTag severity={field.severity} text={field.category} />
              </div>
              <p className="text-[11px] text-lavender/80 leading-relaxed font-sans">
                {field.description}
              </p>
            </div>
          ))}

          {/* Observations */}
          {observations.map((obs, idx) => (
            <div
              key={`obs-${idx}`}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-palePink"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-semibold text-cyan-300 text-[11px]">{obs.type}</span>
                <SeverityTag severity={obs.severity} />
              </div>
              <p className="text-[11px] text-lavender/80 leading-relaxed font-sans">
                {obs.description}
              </p>
            </div>
          ))}

          {requestedFields.length === 0 && observations.length === 0 && (
            <div className="h-24 flex items-center justify-center text-center text-xs text-lavender/40 italic">
              No suspicious inputs detected yet.
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
        <button
          onClick={onOpenReport}
          disabled={!report}
          className={`w-full py-2.5 px-4 rounded-xl font-sans font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
            report
              ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md hover:shadow-cyan-500/25 cursor-pointer'
              : 'bg-white/5 text-lavender/30 cursor-not-allowed'
          }`}
        >
          <FileText className="w-4 h-4 stroke-[2.2]" />
          <span>View Full Dossier</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onOpenWarningCard}
          disabled={!report}
          className={`w-full py-2 px-4 rounded-xl font-sans font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-all ${
            report
              ? 'bg-white/5 hover:bg-white/10 border border-white/10 text-offWhite cursor-pointer'
              : 'bg-transparent text-lavender/20 cursor-not-allowed border border-white/5'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-magenta-light" />
          <span>Export Warning Card</span>
        </button>
      </div>

    </div>
  );
};
