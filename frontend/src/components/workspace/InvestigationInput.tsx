import React, { useState } from 'react';
import { 
  Search, ArrowRight, SlidersHorizontal, 
  AlertCircle, Sparkles, X, Shield 
} from 'lucide-react';

interface InvestigationInputProps {
  url: string;
  onUrlChange: (url: string) => void;
  onStart: () => void;
  isInvestigating: boolean;
  onSelectScenario: (scenarioId: string, url: string) => void;
}

export const InvestigationInput: React.FC<InvestigationInputProps> = ({
  url,
  onUrlChange,
  onStart,
  isInvestigating,
  onSelectScenario,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [browserProfile, setBrowserProfile] = useState<'lite' | 'stealth'>('lite');
  const [maxSteps, setMaxSteps] = useState(25);

  const hasTrackingTokens = 
    url.includes('?') && 
    (url.includes('token=') || url.includes('auth=') || url.includes('session=') || url.includes('otp='));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && url.trim() && !isInvestigating) {
      e.preventDefault();
      onStart();
    }
  };

  return (
    <div className="w-full flex flex-col gap-2.5">
      
      {/* Sleek Minimal URL Input Box */}
      <div className="relative w-full rounded-2xl bg-aubergine-light/90 border border-white/10 p-1.5 sm:p-2 flex items-center gap-2 shadow-lg backdrop-blur-md transition-all focus-within:border-magenta/50 focus-within:ring-2 focus-within:ring-magenta/20">
        <Search className="w-5 h-5 text-lavender/60 ml-2.5 flex-shrink-0" />
        
        <input
          type="text"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste suspicious link (SMS, WhatsApp, email, bit.ly)..."
          disabled={isInvestigating}
          className="flex-1 bg-transparent text-white placeholder-lavender/40 text-xs sm:text-sm font-sans focus:outline-none min-w-0"
        />

        {url && !isInvestigating && (
          <button
            type="button"
            onClick={() => onUrlChange('')}
            className="p-1 rounded-md text-lavender/40 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Config Toggle */}
        <button
          type="button"
          onClick={() => setShowConfig(!showConfig)}
          className={`p-2 rounded-xl text-xs font-sans font-medium transition-colors ${
            showConfig 
              ? 'bg-magenta/20 text-magenta-light border border-magenta/30' 
              : 'text-lavender/60 hover:text-white hover:bg-white/5'
          }`}
          title="Investigation Settings"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* Main CTA */}
        <button
          type="button"
          onClick={onStart}
          disabled={!url.trim() || isInvestigating}
          className={`px-4 sm:px-6 py-2.5 rounded-xl font-sans font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
            url.trim() && !isInvestigating
              ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md hover:shadow-cyan-500/25 cursor-pointer'
              : 'bg-white/10 text-lavender/40 cursor-not-allowed'
          }`}
        >
          <span>{isInvestigating ? 'Investigating...' : 'Investigate'}</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>

      {/* Quick Simulation Pills */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-lavender/70 px-1">
        <span className="text-[11px] font-sans font-medium text-lavender/50 mr-1">
          Simulated Threats:
        </span>
        <button
          type="button"
          onClick={() => onSelectScenario('electricity', 'http://powerbill-quickpay-alert.xyz/portal/verify?acct=9841')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-400/20 hover:text-cyan-300 border border-white/5 text-[11px] text-lavender transition-all"
        >
          ⚡ Electricity Cutoff
        </button>
        <button
          type="button"
          onClick={() => onSelectScenario('courier', 'http://track-parcel-redelivery-fee.top/auth/shipment?id=8842')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-400/20 hover:text-cyan-300 border border-white/5 text-[11px] text-lavender transition-all"
        >
          📦 Courier $1.85 Fee
        </button>
        <button
          type="button"
          onClick={() => onSelectScenario('banking', 'http://apex-kyc-compliance-update.live/secure/login')}
          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-cyan-400/20 hover:text-cyan-300 border border-white/5 text-[11px] text-lavender transition-all"
        >
          🏦 Bank KYC Suspension
        </button>
      </div>

      {/* Sensitive Parameter Warning */}
      {hasTrackingTokens && (
        <div className="px-3 py-2 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-300 text-xs font-sans flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-cyan-400" />
          <span>Notice: URL contains sensitive tracking/auth parameters. The isolated agent will not transmit real tokens.</span>
        </div>
      )}

      {/* Config Drawer */}
      {showConfig && (
        <div className="p-3.5 rounded-xl bg-aubergine-surface/80 border border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
          <div>
            <label className="text-lavender/70 block mb-1">Browser Profile</label>
            <select
              value={browserProfile}
              onChange={(e) => setBrowserProfile(e.target.value as any)}
              className="w-full bg-aubergine-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              <option value="lite">TinyFish Lite (Standard sandbox)</option>
              <option value="stealth">TinyFish Stealth (Anti-cloaking)</option>
            </select>
          </div>
          <div>
            <label className="text-lavender/70 block mb-1">Max Steps</label>
            <select
              value={maxSteps}
              onChange={(e) => setMaxSteps(Number(e.target.value))}
              className="w-full bg-aubergine-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-white focus:outline-none"
            >
              <option value={10}>10 Steps (Quick)</option>
              <option value={25}>25 Steps (Deep Investigation)</option>
            </select>
          </div>
        </div>
      )}

    </div>
  );
};
