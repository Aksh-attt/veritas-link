import React from 'react';
import { RequestedField } from '../../types';
import { SeverityTag } from '../common/RiskBadge';
import { CreditCard, KeyRound, Smartphone, MapPin, UserCheck } from 'lucide-react';

interface RequestedInfoGridProps {
  fields: RequestedField[];
}

export const RequestedInfoGrid: React.FC<RequestedInfoGridProps> = ({ fields }) => {
  const getFieldIcon = (fieldType: string) => {
    switch (fieldType.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
      case 'cvv':
        return CreditCard;
      case 'password':
      case 'pin':
        return KeyRound;
      case 'otp':
      case 'phone':
        return Smartphone;
      case 'address':
        return MapPin;
      default:
        return UserCheck;
    }
  };

  return (
    <div className="rounded-2xl bg-aubergine-surface/40 border border-white/10 p-5 sm:p-6">
      
      <div className="pb-3 mb-4 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-coral block">
          Credential Infiltration
        </span>
        <h3 className="font-display font-bold text-lg text-white">
          Information Requested by Target ({fields.length} Input Fields)
        </h3>
      </div>

      {fields.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((f, i) => {
            const Icon = getFieldIcon(f.field_type);
            const isCritical = f.severity === 'CRITICAL' || f.severity === 'HIGH';

            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  isCritical
                    ? 'bg-coral/10 border-coral/30 text-white'
                    : 'bg-aubergine-950/60 border-white/5 text-lavender'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center text-cyan-400">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-sans font-semibold text-xs text-white">
                        {f.field_name}
                      </span>
                    </div>
                    <SeverityTag severity={f.severity} text={f.category} />
                  </div>

                  <p className="font-sans text-xs text-lavender/80 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                {f.selector && (
                  <div className="mt-2 pt-2 border-t border-white/5 text-[10px] font-mono text-lavender/40 truncate">
                    DOM: <code>{f.selector}</code>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="h-20 flex items-center justify-center text-center font-sans text-xs text-lavender/50">
          No aggressive credential extraction fields observed in current session.
        </div>
      )}

    </div>
  );
};
