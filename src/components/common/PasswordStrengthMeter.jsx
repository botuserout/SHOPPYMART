import React from 'react';
import zxcvbn from 'zxcvbn';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

const PasswordStrengthMeter = ({ password }) => {
  if (!password) return null;

  const result = zxcvbn(password);
  const score = result.score; // 0 to 4

  const getLabel = () => {
    switch (score) {
      case 0:
        return { text: 'Too Weak', color: 'bg-rose-500', textColor: 'text-rose-500', width: 'w-1/5' };
      case 1:
        return { text: 'Weak', color: 'bg-orange-500', textColor: 'text-orange-500', width: 'w-2/5' };
      case 2:
        return { text: 'Medium', color: 'bg-amber-500', textColor: 'text-amber-500', width: 'w-3/5' };
      case 3:
        return { text: 'Strong', color: 'bg-emerald-500', textColor: 'text-emerald-500', width: 'w-4/5' };
      case 4:
        return { text: 'Very Strong', color: 'bg-indigo-500', textColor: 'text-indigo-500', width: 'w-full' };
      default:
        return { text: '', color: 'bg-slate-300', textColor: 'text-slate-500', width: 'w-0' };
    }
  };

  const strength = getLabel();

  return (
    <div className="mt-2 space-y-1.5 transition-all">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
          {score >= 3 ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
          )}
          Password Strength:
        </span>
        <span className={strength.textColor}>{strength.text}</span>
      </div>

      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${strength.color} transition-all duration-300 ease-out`}
          style={{ width: `${((score + 1) / 5) * 100}%` }}
        />
      </div>

      {result.feedback.suggestions && result.feedback.suggestions.length > 0 && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">
          💡 {result.feedback.suggestions[0]}
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;
