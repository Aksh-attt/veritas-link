import React from 'react';
import { XCircle, CheckCircle2, Zap } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const comparisons = [
    {
      feature: "Zero-Day Disposable Domains",
      traditional: "Fails: 85% of phishing links are less than 24h old and unindexed in reputation blocklists.",
      veritas: "Autonomous agent inspects real-time DOM behavior regardless of domain age or database status.",
    },
    {
      feature: "Anti-Bot & Geo Cloaking",
      traditional: "Fails: Phishers serve blank pages or benign 404s to known security crawler IPs.",
      veritas: "TinyFish executes real Chromium browser sessions through stealth residential proxies.",
    },
    {
      feature: "Deception Funnel Mapping",
      traditional: "Fails: Only examines initial HTTP response headers or raw static HTML markup.",
      veritas: "Reconstructs full interactive journey: detects fake urgency countdowns, OTP traps, and fake portals.",
    },
    {
      feature: "Explainable Risk Scoring",
      traditional: "Outputs an opaque risk number or binary rating with no verifiable context.",
      veritas: "Produces transparent dossier with screenshot evidence, requested fields breakdown, and brand audits.",
    },
    {
      feature: "Verdict Safety Assurance",
      traditional: "Falsely labels unknown sites as 'Safe', encouraging users to proceed into new traps.",
      veritas: "Strict security philosophy: Never declares a site 'Safe'—distinguishes low indicators from unverified.",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="px-3 py-1 rounded-full bg-cyan-400/15 text-cyan-300 text-xs font-mono font-medium uppercase tracking-wider border border-cyan-400/30">
            The Core Differentiator
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-3 mb-3">
            Why Traditional URL Scanners Fail
          </h2>
          <p className="text-lavender/70 text-sm font-sans">
            Attackers evolve beyond bad domain names. They use brand mimicry, countdown timers, and short-lived campaigns that bypass static scanners.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="rounded-2xl bg-aubergine-light/70 border border-white/10 p-4 sm:p-6 overflow-x-auto shadow-xl backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-xs font-sans uppercase">
                <th className="pb-3 text-lavender/60 w-1/4">Vector</th>
                <th className="pb-3 px-3 text-coral/80 w-3/8">Traditional URL Scanners</th>
                <th className="pb-3 px-3 text-cyan-300 font-bold w-3/8">VeritasLink Agentic Investigation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-sans">
              {comparisons.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-4 pr-3 font-semibold text-white align-top">
                    {row.feature}
                  </td>
                  <td className="py-4 px-3 text-lavender/70 align-top">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-coral/80 flex-shrink-0 mt-0.5" />
                      <span>{row.traditional}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-white align-top bg-white/5 rounded-xl">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span className="text-offWhite/90">{row.veritas}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};
