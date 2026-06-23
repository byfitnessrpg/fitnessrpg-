import React from 'react';
import { Star, Flame } from 'lucide-react';
import { motion } from 'motion/react';

interface XPBarProps {
  level: number;
  xp: number;
  xpNeeded: number;
  streak: number;
}

export const XPBar: React.FC<XPBarProps> = ({ level, xp, xpNeeded, streak }) => {
  const percent = Math.min(100, Math.round((xp / xpNeeded) * 100));

  return (
    <div className="px-5 py-4 bg-gradient-to-r from-[#171324] to-[#12101e] border-y border-red-950/40 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-3">
        {/* Title, Level badge, XP tracker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-amber-500 rounded-full text-xs font-black text-white shadow-lg shadow-red-900/10 border border-red-400/20">
              <Star className="w-3.5 h-3.5 fill-white animate-pulse" />
              NÍVEL {level}
            </span>
            {streak >= 3 && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-amber-950/40 border border-amber-600/30 rounded-full text-[10px] font-bold font-mono text-amber-500 tracking-wider">
                <Flame className="w-3 h-3 text-amber-500 fill-amber-500 animate-bounce" />
                {streak} DIAS SEGUIDOS
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-slate-300">
              {xp} <span className="text-slate-500">/ {xpNeeded}</span> <span className="text-amber-500">XP</span>
            </span>
          </div>
        </div>

        {/* Dynamic visual slider */}
        <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-900">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          />
        </div>
      </div>
    </div>
  );
};
