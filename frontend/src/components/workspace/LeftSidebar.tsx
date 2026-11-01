import React from 'react';
import { VeritasLogo } from '../common/VeritasLogo';
import { VeraAvatar } from '../common/VeraAvatar';
import { InvestigationReport, VeraStateType } from '../../types';
import { 
  PlusCircle, History, Sparkles, LayoutDashboard, 
  FileText, Settings, ShieldCheck, ChevronRight 
} from 'lucide-react';

interface LeftSidebarProps {
  history: InvestigationReport[];
  selectedReportId?: string;
  onSelectReport: (report: InvestigationReport) => void;
  onNewInvestigation: () => void;
  onOpenDemoModal: () => void;
  veraState: VeraStateType;
  currentTab: 'lab' | 'reports' | 'settings';
  onTabChange: (tab: 'lab' | 'reports' | 'settings') => void;
  onNavigateLanding: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  history,
  selectedReportId,
  onSelectReport,
  onNewInvestigation,
  onOpenDemoModal,
  veraState,
  currentTab,
  onTabChange,
  onNavigateLanding,
}) => {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-4">
      
      {/* Top Logo & Home link */}
      <div 
        onClick={onNavigateLanding}
        className="editorial-card rounded-3xl bg-aubergine-light border-3 border-black p-4 shadow-comic cursor-pointer hover:bg-aubergine transition-colors"
      >
        <VeritasLogo size="sm" />
      </div>

      {/* New Investigation Button */}
      <button
        onClick={onNewInvestigation}
        className="w-full py-3.5 rounded-2xl bg-cyan-400 text-slate-950 font-sans font-extrabold text-xs uppercase flex items-center justify-center gap-2 hover:bg-cyan-300 shadow-md transition-all cursor-pointer"
      >
        <PlusCircle className="w-4 h-4 stroke-[2.5]" />
        <span>New Investigation</span>
      </button>

      {/* Navigation Menu */}
      <div className="rounded-2xl bg-aubergine-light border border-white/10 p-2 shadow-lg font-mono text-xs font-bold">
        <button
          onClick={() => onTabChange('lab')}
          className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all ${
            currentTab === 'lab'
              ? 'bg-magenta text-white shadow-sm'
              : 'text-lavender hover:bg-white/5'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Investigation Lab</span>
        </button>

        <button
          onClick={() => onTabChange('reports')}
          className={`w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 transition-all ${
            currentTab === 'reports'
              ? 'bg-lavender text-aubergine-900 shadow-sm'
              : 'text-lavender hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Threat Dossiers ({history.length})</span>
        </button>

        <button
          onClick={onOpenDemoModal}
          className="w-full py-2.5 px-3 rounded-xl flex items-center gap-2.5 text-cyan-300 hover:bg-white/5 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulation Scenarios</span>
        </button>
      </div>

      {/* Recent Investigation History */}
      <div className="editorial-card rounded-3xl bg-aubergine-light border-3 border-black p-4 shadow-comic flex-1 flex flex-col overflow-hidden min-h-[220px]">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-lavender/20">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-lavender uppercase">
            <History className="w-3.5 h-3.5" />
            <span>Recent Scans</span>
          </div>
          <span className="text-[10px] font-mono text-lavender/60">
            {history.length} saved
          </span>
        </div>

        {/* History Item list */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
          {history.length > 0 ? (
            history.map((item) => {
              const isSelected = selectedReportId === item.id;
              const isHigh = item.final_verdict === 'HIGH RISK';
              const isSusp = item.final_verdict === 'SUSPICIOUS';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectReport(item)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-magenta text-white border-black shadow-comic'
                      : 'bg-black/30 border-lavender/20 text-palePink hover:border-lavender/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="truncate font-bold text-[11px] max-w-[130px]">
                      {item.hostname || item.url}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                        isHigh
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : isSusp
                          ? 'bg-cyan-400 text-slate-950 font-bold'
                          : 'bg-lavender text-aubergine-900'
                      }`}
                    >
                      {item.final_verdict === 'HIGH RISK' ? 'HIGH' : item.final_verdict === 'SUSPICIOUS' ? 'SUSP' : 'SCAN'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-lavender/70">
                    <span>{item.impersonated_brand || 'General URL'}</span>
                    <span>{item.risk_score}/100</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-28 flex flex-col items-center justify-center text-center text-xs text-lavender/40 italic">
              No previous scans yet.
            </div>
          )}
        </div>
      </div>

      {/* Mini VERA Status Footnote */}
      <div className="rounded-2xl bg-aubergine-900 border border-white/10 p-3 flex items-center gap-3">
        <VeraAvatar state={veraState} size="xs" interactive={false} />
        <div className="flex flex-col text-xs font-mono">
          <span className="text-[10px] text-lavender/60 uppercase">Analyst Status</span>
          <span className="font-bold text-cyan-300">{veraState}</span>
        </div>
      </div>

    </aside>
  );
};

