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
    <div className="px-5 py-4 bg-black border-y border-slate-900 relative overflow-hidden">
      {/* Background flare */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col gap-3">
        {/* Title, Level badge, XP tracker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white text-black rounded text-[10px] font-black shadow-[0_0_10px_rgba(255,255,255,0.25)] tracking-wider font-mono">
              <Star className="w-3.5 h-3.5 fill-black animate-pulse" />
              NÍVEL {level}
            </span>
            {streak >= 3 && (
              <span className="flex items-center gap-1 px-2.5 py-0.5 bg-sky-950/20 border border-sky-500/20 rounded text-[9px] font-black font-mono text-sky-400 tracking-wider">
                <Flame className="w-3 h-3 text-sky-400 fill-sky-400 animate-bounce" />
                {streak} DIAS SEGUIDOS
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-[11px] font-mono font-bold text-slate-300">
              {xp} <span className="text-slate-500">/ {xpNeeded}</span> <span className="text-sky-400">XP</span>
            </span>
          </div>
        </div>

        {/* Dynamic visual slider */}
        <div className="relative w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
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
