import React, { useState } from 'react';
import { InvestigationInput } from './InvestigationInput';
import { BrowserViewport } from './BrowserViewport';
import { InvestigationTimeline } from './InvestigationTimeline';
import { VeraAssistantPanel } from './VeraAssistantPanel';
import { ThreatReportModal } from '../report/ThreatReportModal';
import { ShareableWarningCard } from '../report/ShareableWarningCard';
import { DemoLauncherModal } from '../demo/DemoLauncherModal';
import { 
  InvestigationReport, 
  InvestigationEvent, 
  VeraStateType, 
  ObservedBehaviour, 
  RequestedField 
} from '../../types';
import { History, X, Clock, PlusCircle } from 'lucide-react';

interface WorkspaceLayoutProps {
  url: string;
  onUrlChange: (url: string) => void;
  onStartInvestigation: () => void;
  isInvestigating: boolean;
  veraState: VeraStateType;
  events: InvestigationEvent[];
  activeReport: InvestigationReport | null;
  history: InvestigationReport[];
  onSelectReport: (report: InvestigationReport) => void;
  onNewInvestigation: () => void;
  onSelectScenario: (scenarioId: string, url: string) => void;
  onNavigateLanding: () => void;
  screenshotUrl?: string;
  consoleLogs: string[];
}

export const WorkspaceLayout: React.FC<WorkspaceLayoutProps> = ({
  url,
  onUrlChange,
  onStartInvestigation,
  isInvestigating,
  veraState,
  events,
  activeReport,
  history,
  onSelectReport,
  onNewInvestigation,
  onSelectScenario,
  onNavigateLanding,
  screenshotUrl,
  consoleLogs,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [showWarningCard, setShowWarningCard] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // Extract observations and requested fields
  const currentObservations: ObservedBehaviour[] = activeReport 
    ? activeReport.observed_behaviour 
    : events
        .filter(e => e.payload?.behaviour)
        .map(e => e.payload!.behaviour as ObservedBehaviour);

  const currentRequestedFields: RequestedField[] = activeReport
    ? activeReport.information_requested
    : events
        .filter(e => e.payload?.requested_field)
        .map(e => e.payload!.requested_field as RequestedField);

  const lastEventMessage = events.length > 0 ? events[events.length - 1].message : undefined;

  return (
    <div className="min-h-screen bg-aubergine-950 text-offWhite flex flex-col">
      
      {/* Top Workspace Bar */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onNewInvestigation}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-sans font-extrabold transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Investigation</span>
          </button>

          <button
            onClick={() => setShowHistoryDrawer(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-lavender text-xs font-sans font-medium transition-all"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Past Dossiers ({history.length})</span>
          </button>
        </div>

        <div className="text-[11px] font-mono text-lavender/50 hidden sm:block">
          ISOLATED TINYFISH BROWSER &bull; GOOGLE GEMINI REASONING
        </div>
      </div>

      {/* Main Workspace Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12 w-full flex flex-col gap-6">
        
        {/* Prominent URL Search & Quick Simulation Bar */}
        <InvestigationInput
          url={url}
          onUrlChange={onUrlChange}
          onStart={onStartInvestigation}
          isInvestigating={isInvestigating}
          onSelectScenario={(id, scUrl) => onSelectScenario(id, scUrl)}
        />

        {/* 2-Column Balanced Grid (Never overlaps!) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT/CENTER: Remote Browser Viewport & Event Timeline (8 of 12 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5 min-w-0">
            {/* Remote Browser Viewport */}
            <BrowserViewport
              currentUrl={url}
              screenshotUrl={screenshotUrl || activeReport?.evidence?.[0]?.screenshot_url}
              isInvestigating={isInvestigating}
              veraState={veraState}
              lastEventMessage={lastEventMessage}
              activeConsoleLogs={consoleLogs}
            />

            {/* Event Timeline */}
            <InvestigationTimeline
              events={events}
              isInvestigating={isInvestigating}
            />
          </div>

          {/* RIGHT: VERA Assistant & Live Findings (4 of 12 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-5 min-w-0">
            <VeraAssistantPanel
              veraState={veraState}
              report={activeReport}
              isInvestigating={isInvestigating}
              observations={currentObservations}
              requestedFields={currentRequestedFields}
              onOpenReport={() => setShowReportModal(true)}
              onOpenWarningCard={() => setShowWarningCard(true)}
            />
          </div>

        </div>

      </div>

      {/* Slide-over Past Dossiers Drawer */}
      {showHistoryDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-aubergine-900 border-l border-white/10 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <h3 className="font-sans font-bold text-sm text-white uppercase tracking-wider">
                  Past Investigation Dossiers
                </h3>
              </div>
              <button
                onClick={() => setShowHistoryDrawer(false)}
                className="p-1 rounded-lg text-lavender/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {history.length > 0 ? (
                history.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectReport(item);
                      setShowHistoryDrawer(false);
                      setShowReportModal(true);
                    }}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-magenta/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-sans font-semibold text-xs text-white truncate max-w-[200px]">
                        {item.hostname || item.url}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        item.final_verdict === 'HIGH RISK' ? 'bg-coral/20 text-coral' : 'bg-cyan-400/20 text-cyan-300'
                      }`}>
                        {item.final_verdict}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-lavender/60">
                      <span>{item.impersonated_brand || 'General URL'}</span>
                      <span>Score: {item.risk_score}/100</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-48 flex items-center justify-center text-center text-xs text-lavender/40 font-sans">
                  No previous investigations found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Threat Report Modal */}
      {showReportModal && activeReport && (
        <ThreatReportModal
          report={activeReport}
          onClose={() => setShowReportModal(false)}
          onOpenWarningCard={() => {
            setShowReportModal(false);
            setShowWarningCard(true);
          }}
        />
      )}

      {/* Shareable Warning Card Modal */}
      {showWarningCard && activeReport && (
        <ShareableWarningCard
          report={activeReport}
          onClose={() => setShowWarningCard(false)}
        />
      )}

      {/* Demo Launcher Modal */}
      {showDemoModal && (
        <DemoLauncherModal
          onClose={() => setShowDemoModal(false)}
          onSelectScenario={(id, scUrl) => onSelectScenario(id, scUrl)}
        />
      )}

    </div>
  );
};
