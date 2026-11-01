import React from 'react';
import { DemoScenario } from '../../types';
import { 
  X, Sparkles, Zap, Package, Landmark, ArrowRight, ShieldAlert 
} from 'lucide-react';

interface DemoLauncherModalProps {
  onClose: () => void;
  onSelectScenario: (scenarioId: string, url: string) => void;
}

export const DemoLauncherModal: React.FC<DemoLauncherModalProps> = ({
  onClose,
  onSelectScenario,
}) => {
  const scenarios = [
    {
      id: 'electricity',
      title: 'PowerGrid Urgent Disconnection',
      category: 'Utility Scam',
      targetBrand: 'State Power & Electric Board',
      domain: 'powerbill-quickpay-alert.xyz',
      url: 'http://powerbill-quickpay-alert.xyz/portal/verify?acct=9841',
      vector: 'SMS: "Dear consumer, electric connection will be disconnected tonight 9:30 PM. Pay unpaid $14.80 immediately."',
      tactics: [
        '14-minute fake countdown timer inducing panic',
        'Direct credit card number, expiry, and CVV harvesting',
        'Untrusted .xyz domain claiming to be official',
      ],
      icon: Zap,
      color: 'text-cyan-400 bg-cyan-400/15 border-cyan-400/30',
    },
    {
      id: 'courier',
      title: 'GlobalTrack Parcel Clearance',
      category: 'Logistics Customs Scam',
      targetBrand: 'Global Express Parcel Service',
      domain: 'track-parcel-redelivery-fee.top',
      url: 'http://track-parcel-redelivery-fee.top/auth/shipment?id=8842',
      vector: 'Email: "Package GT-8842 on hold at customs. $1.85 redelivery clearance fee required to release shipment."',
      tactics: [
        'Multi-hop redirect cloaking origin server',
        'Harvests full residential address, phone, and debit card',
        'Deceptive low $1.85 fee lowering victim suspicion',
      ],
      icon: Package,
      color: 'text-magenta-light bg-magenta/15 border-magenta/30',
    },
    {
      id: 'banking',
      title: 'Apex Trust KYC Compliance',
      category: 'Banking Credential Theft',
      targetBrand: 'Apex Trust National Bank',
      domain: 'apex-kyc-compliance-update.live',
      url: 'http://apex-kyc-compliance-update.live/secure/login',
      vector: 'WhatsApp: "Regulatory Alert: NetBanking suspended within 24h per central bank KYC directive."',
      tactics: [
        'Direct NetBanking customer ID and password capture',
        'Transaction security PIN harvesting',
        'Simulated two-factor SMS OTP interception',
      ],
      icon: Landmark,
      color: 'text-coral bg-coral/15 border-coral/30',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-aubergine-900 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        
        {/* Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white">
                Simulated Phishing Laboratories
              </h3>
              <p className="text-xs font-sans text-lavender/60">
                Safe, fictional environments modeled after real active phishing deception workflows.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3 Grid Scenarios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            return (
              <div
                key={sc.id}
                className="rounded-2xl bg-aubergine-surface/40 border border-white/10 p-5 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${sc.color}`}>
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 text-lavender/70 border border-white/5">
                      {sc.category}
                    </span>
                  </div>

                  <h4 className="font-sans font-bold text-base text-white mb-1 leading-snug">
                    {sc.title}
                  </h4>

                  <div className="text-[11px] font-sans text-cyan-300 font-semibold mb-3">
                    Target: {sc.targetBrand}
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 mb-3 text-xs font-sans text-lavender/80">
                    <span className="text-[9px] font-mono uppercase text-coral block mb-0.5">
                      Vector Notice:
                    </span>
                    {sc.vector}
                  </div>

                  <ul className="space-y-1 text-xs font-sans text-lavender/70 mb-5">
                    {sc.tactics.map((t, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-magenta flex-shrink-0 mt-1" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => {
                    onSelectScenario(sc.id, sc.url);
                    onClose();
                  }}
                  className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-sans font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md hover:shadow-cyan-500/25 cursor-pointer"
                >
                  <span>Launch Simulation</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Security Notice */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-sans text-lavender/60 flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span>
            These simulations are hosted locally in an isolated sandbox. No real credentials or payments are accepted or stored.
          </span>
        </div>

      </div>
    </div>
  );
};
