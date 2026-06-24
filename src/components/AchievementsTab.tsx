import React from 'react';
import { GameState } from '../types';
import { ACHIEVEMENTS } from '../data';
import { Trophy, ShieldAlert, Sparkles, Check, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface AchievementsTabProps {
  gameState: GameState;
}

export const AchievementsTab: React.FC<AchievementsTabProps> = ({ gameState }) => {
  const unlocked = gameState.unlockedAchievements.length;
  const total = ACHIEVEMENTS.length;
  const percent = total > 0 ? Math.round((unlocked / total) * 100) : 0;

  return (
    <div className="space-y-5 pb-20 cyber-grid min-h-screen">
      {/* Tab Header Title */}
      <div className="px-5 pt-4">
        <h2 className="text-xl font-black font-display text-white tracking-widest flex items-center gap-2 uppercase">
          <Shield className="w-5 h-5 text-sky-400" />
          SALA DE CONQUISTAS
        </h2>
        <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">
          Forje sua glória eterna coletando insígnias sagradas de caçador
        </p>
      </div>

      {/* Stats Counter Progress Card */}
      <div className="mx-5 bg-black border-2 border-sky-400 rounded-3xl p-5 relative overflow-hidden shadow-[0_0_20px_rgba(14,165,233,0.2)]">
        {/* Background glow flares */}
        <div className="absolute right-[-20px] bottom-[-20px] w-24 h-24 bg-sky-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />

        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-widest font-black text-sky-400 block uppercase">
              RECOMPENSAS DE HONRA
            </span>
            <span className="text-lg font-black text-white leading-tight uppercase">Progresso Geral</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-mono font-black text-white">
              {unlocked}<span className="text-slate-600 text-sm">/{total}</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{percent}% COMPLETO</span>
          </div>
        </div>

        <div className="w-full h-2 bg-slate-950 rounded-full mt-4 overflow-hidden border border-slate-900">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.8 }}
            className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full shadow-[0_0_10px_rgba(14,165,233,0.4)]"
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            const isUnlocked = gameState.unlockedAchievements.includes(ach.id);

            return (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`border rounded-2xl p-4 text-center flex flex-col items-center justify-between transition-all duration-300 min-h-[160px] relative ${
                  isUnlocked
                    ? 'bg-[#050508]/60 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.15)]'
                    : 'bg-[#000000] border-slate-900 opacity-40'
                }`}
              >
                {/* Upper crown decorative lock icon */}
                {isUnlocked && (
                  <Sparkles className="w-3.5 h-3.5 text-sky-400 absolute top-2.5 right-2.5 animate-pulse" />
                )}

                {/* Avatar Icon */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-3xl shadow-md transition-transform duration-300 ${
                    isUnlocked
                      ? 'bg-sky-500/10 border border-sky-500/30 animate-bounce'
                      : 'bg-slate-950/40 border border-slate-900'
                  }`}
                >
                  {isUnlocked ? ach.icon : '🔒'}
                </div>

                {/* Info Text */}
                <div className="mt-3 space-y-1">
                  <h4 className={`text-xs font-black tracking-tight uppercase ${isUnlocked ? 'text-sky-400' : 'text-slate-400'}`}>
                    {ach.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 leading-snug font-mono px-1">
                    {ach.desc}
                  </p>
                </div>

                {/* Lower Badge check tag */}
                <div className="mt-3.5 w-full font-mono text-[8px]">
                  {isUnlocked ? (
                    <span className="inline-flex items-center gap-1 font-extrabold text-sky-400 bg-sky-950/20 border border-sky-500/20 px-2 py-0.5 rounded uppercase tracking-wider">
                      <Check className="w-2.5 h-2.5 text-sky-400" />
                      DESBLOQUEADA
                    </span>
                  ) : (
                    <span className="inline-flex items-center text-slate-600 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-900 uppercase tracking-wider">
                      BLOQUEADA
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
