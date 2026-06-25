import React from 'react';
import { Star, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface XPBarProps {
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
  theme?: 'dark' | 'light';
}

export const XPBar: React.FC<XPBarProps> = ({ level, xp, xpNeeded, streak, theme = 'dark' }) => {
  const percent = Math.min(100, Math.round((xp / xpNeeded) * 100));
  const isLight = theme === 'light';

  return (
    <div className={`px-5 py-4 relative overflow-hidden transition-colors duration-300 ${
      isLight 
        ? 'bg-white border-y border-slate-200/60 shadow-sm' 
        : 'bg-black border-y border-slate-900'
    }`}>
      {/* Background flare */}
      <div className={`absolute right-0 top-0 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
        isLight ? 'bg-sky-500/5' : 'bg-sky-500/5'
      }`} />

      <div className="flex flex-col gap-3">
        {/* Title, Level badge, XP tracker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-black tracking-wider font-mono transition-all duration-300 ${
              isLight 
                ? 'bg-slate-950 text-white shadow-[0_2px_8px_rgba(15,23,42,0.2)]' 
                : 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.25)]'
            }`}>
              <Star className={`w-3.5 h-3.5 fill-current animate-pulse ${isLight ? 'text-white' : 'text-black'}`} />
              NÍVEL {level}
            </span>
            {streak >= 3 && (
              <span className={`flex items-center gap-1 px-2.5 py-0.5 border rounded text-[9px] font-black font-mono tracking-wider transition-all duration-300 ${
                isLight 
                  ? 'bg-sky-50 border-sky-200 text-sky-600' 
                  : 'bg-sky-950/20 border-sky-500/20 text-sky-400'
              }`}>
                <Flame className="w-3 h-3 text-sky-400 fill-sky-400 animate-bounce" />
                {streak} DIAS SEGUIDOS
              </span>
            )}
          </div>
          <div className="text-right">
            <span className={`text-[11px] font-mono font-bold transition-all duration-300 ${
              isLight ? 'text-slate-600' : 'text-slate-300'
            }`}>
              {xp} <span className="text-slate-400">/ {xpNeeded}</span> <span className="text-sky-500 font-bold">XP</span>
            </span>
          </div>
        </div>

        {/* Dynamic visual slider */}
        <div className={`relative w-full h-2 rounded-full overflow-hidden border transition-all duration-300 ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-slate-950 border-slate-900'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-sky-400 via-blue-500 to-sky-300 rounded-full shadow-[0_0_8px_rgba(14,165,233,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
