import React from 'react';
import { BrandComparisonData } from '../../types';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface BrandComparisonProps {
  comparison: BrandComparisonData;
}

export const BrandComparison: React.FC<BrandComparisonProps> = ({ comparison }) => {
  const { suspicious, official, differences, impersonation_detected } = comparison;

  return (
    <div className="rounded-2xl bg-aubergine-surface/40 border border-white/10 p-5 sm:p-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-white/10 gap-2">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-magenta-light block">
            Comparative Forensics
          </span>
          <h3 className="font-display font-bold text-lg text-white">
            Brand Impersonation Audit
          </h3>
        </div>

        {impersonation_detected && (
          <div className="px-3 py-1 rounded-xl bg-coral/15 border border-coral/30 text-coral font-sans font-bold text-xs uppercase flex items-center gap-1.5 self-start sm:self-center">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Impersonation Confirmed</span>
          </div>
        )}
      </div>

      {/* Split Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {/* Suspicious Website */}
        <div className="rounded-xl bg-aubergine-950/70 border border-coral/30 p-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-coral/20">
            <span className="text-xs font-sans font-bold text-coral flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Target Website
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-coral/20 text-coral font-bold">
              UNVERIFIED
            </span>
          </div>

          <div className="space-y-2.5 font-sans text-xs">
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">Domain</span>
              <span className="text-coral font-mono font-semibold break-all">{suspicious.domain}</span>
            </div>
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">SSL Certificate</span>
              <span className="text-white/90">{suspicious.ssl_issuer}</span>
            </div>
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">Branding Claim</span>
              <span className="text-cyan-300 font-semibold">{suspicious.branding_claim}</span>
            </div>
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">Payment Routing</span>
              <span className="text-coral">{suspicious.payment_methods}</span>
            </div>
          </div>
        </div>

        {/* Official Brand Website */}
        <div className="rounded-xl bg-aubergine-950/70 border border-emerald-400/30 p-4">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-emerald-400/20">
            <span className="text-xs font-sans font-bold text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Official Authentic Brand
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-400/20 text-emerald-300 font-bold">
              VERIFIED
            </span>
          </div>

          <div className="space-y-2.5 font-sans text-xs">
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">Canonical Domain</span>
              <span className="text-emerald-300 font-mono font-semibold break-all">{official.domain}</span>
            </div>
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">SSL Authority</span>
              <span className="text-white/90">{official.ssl_issuer}</span>
            </div>
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">Registered Entity</span>
              <span className="text-white font-medium">{official.branding_claim}</span>
            </div>
            <div>
              <span className="text-lavender/50 block text-[10px] uppercase">Approved Payment Gateways</span>
              <span className="text-lavender/90">{official.payment_methods}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Discrepancies */}
      <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 font-sans text-xs">
        <span className="text-[10px] font-mono uppercase text-lavender/60 block mb-1.5">
          Key Investigative Discrepancies:
        </span>
        <ul className="space-y-1.5 text-lavender/80">
          {differences.map((diff, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-coral flex-shrink-0 mt-1.5" />
              <span>{diff}</span>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};
