import React from 'react';
import { Zap, Package, Landmark, ArrowUpRight, ShieldAlert } from 'lucide-react';

interface ScenariosShowcaseProps {
  onSelectScenario: (scenarioId: string, url: string) => void;
}

export const ScenariosShowcase: React.FC<ScenariosShowcaseProps> = ({
  onSelectScenario,
}) => {
  const scenarios = [
    {
      id: 'electricity',
      title: 'PowerGrid Urgent Disconnection',
      category: 'Utility Scam',
      targetBrand: 'State Power & Electric Board',
      attackVector: 'SMS: "Power disconnected tonight at 9:30 PM due to unpaid balance $14.80"',
      deceptions: [
        '14-minute fake countdown timer',
        'Direct credit card & CVV form',
        'Untrusted .xyz domain claiming to be official',
      ],
      sampleUrl: 'http://powerbill-quickpay-alert.xyz/portal/verify?acct=9841',
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-400/15 border-cyan-400/30',
    },
    {
      id: 'courier',
      title: 'GlobalTrack Parcel Clearance',
      category: 'Logistics Customs Scam',
      targetBrand: 'Global Express Parcel Service',
      attackVector: 'Email: "Package on hold at customs due to missing street number & $1.85 fee"',
      deceptions: [
        'Multi-hop redirects cloaking host',
        'Harvests full street address & debit card',
        'Counterfeit customs tracking badge',
      ],
      sampleUrl: 'http://track-parcel-redelivery-fee.top/auth/shipment?id=8842',
      icon: Package,
      color: 'text-magenta-light bg-magenta/15 border-magenta/30',
    },
    {
      id: 'banking',
      title: 'Apex Trust KYC Compliance',
      category: 'Banking Credential Theft',
      targetBrand: 'Apex Trust National Bank',
      attackVector: 'WhatsApp: "Account suspended within 24h per regulatory KYC mandate"',
      deceptions: [
        'Demands netbanking password + PIN',
        'Simulated 2FA SMS OTP interception',
        'Lookalike logo and security claims',
      ],
      sampleUrl: 'http://apex-kyc-compliance-update.live/secure/login',
      icon: Landmark,
      color: 'text-coral bg-coral/15 border-coral/30',
    },
  ];

  return (
    <section className="py-20 bg-aubergine-950/40 border-t border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono font-medium text-lavender uppercase">
              Demonstration Mode
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-3">
              Test Against Real Deception
            </h2>
          </div>
          <p className="text-lavender/70 text-sm max-w-md font-sans">
            Safe, locally hosted phishing scenarios modeled after active campaigns in WhatsApp, SMS, and Email.
          </p>
        </div>

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                className="rounded-2xl p-6 bg-aubergine-light/70 border border-white/10 flex flex-col justify-between hover:border-white/20 transition-all backdrop-blur-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${sc.color}`}>
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-lavender/70 border border-white/5">
                      {sc.category}
                    </span>
                  </div>

                  <h3 className="font-sans font-bold text-lg text-white mb-1.5 leading-snug">
                    {sc.title}
                  </h3>
                  <div className="text-xs font-sans text-cyan-300 font-semibold mb-3">
                    Target: {sc.targetBrand}
                  </div>

                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 mb-4 text-xs font-sans text-lavender/80">
                    <span className="text-[10px] font-mono uppercase text-coral block mb-0.5">
                      Vector:
                    </span>
                    "{sc.attackVector}"
                  </div>

                  <ul className="space-y-1.5 text-xs font-sans text-lavender/70 mb-6">
                    {sc.deceptions.map((d, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-magenta flex-shrink-0" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => onSelectScenario(sc.id, sc.sampleUrl)}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
                >
                  <span>Launch Investigation</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
