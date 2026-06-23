import React from 'react';
import { GameState } from '../types';
import { Award, Zap, Flame, Shield, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileTabProps {
  gameState: GameState;
  xpNeeded: number;
  onReset: () => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({ gameState, xpNeeded, onReset }) => {
  const pct = Math.min(100, Math.round((gameState.xp / xpNeeded) * 100));

  // Circular ring calculations
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct / 100);

  const getRankName = (lv: number) => {
    if (lv < 5) return 'Bronze';
    if (lv < 10) return 'Prata';
    if (lv < 20) return 'Ouro';
    if (lv < 35) return 'Diamante';
    return 'Lendário';
  };

  const rank = getRankName(gameState.level);

  const rankColors = {
    Bronze: 'bg-amber-950/20 text-amber-600 border-amber-800/30',
    Prata: 'bg-slate-950/20 text-slate-300 border-slate-700/30',
    Ouro: 'bg-amber-950/40 text-amber-400 border-amber-600/30 animate-pulse',
    Diamante: 'bg-indigo-950/20 text-indigo-400 border-indigo-700/30',
    Lendário: 'bg-rose-950/30 text-rose-500 border-rose-600/30 animate-pulse font-black',
  };

  const stats = [
    { label: 'Contratos Completos', val: gameState.totalMissions, sub: 'quests' },
    { label: 'Chama Ativa (Streak)', val: `${gameState.streak}🔥`, sub: 'dias seguidos' },
    { label: 'XP Acumulado', val: gameState.totalXP.toLocaleString(), sub: 'xp total' },
    { label: 'Conquistas Coletadas', val: gameState.unlockedAchievements.length, sub: 'emblemas' },
    { label: 'Guerreiro das Flexões', val: gameState.totalFlexoes, sub: 'flexões totais' },
    { label: 'Pernas de Aço', val: gameState.totalAgacham, sub: 'agachamentos' },
    { label: 'Prancha do Destino', val: `${Math.floor(gameState.totalPrancha / 60)}m`, sub: 'tempo total' },
    { label: 'Recorde Diário', val: gameState.maxDayMissions, sub: 'quests completas' },
  ];

  return (
    <div className="space-y-6 pb-24">
      {/* Visual profile header card */}
      <div className="flex flex-col items-center text-center px-5 pt-6 space-y-3">
        {/* Progress Circular ring */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-28 h-28 transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-slate-900 fill-none"
              strokeWidth="8"
            />
            {/* Animated primary circle */}
            <motion.circle
              cx="56"
              cy="56"
              r={radius}
              className="stroke-red-600 fill-none"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          {/* Outer circle layout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
            <span className="text-3xl font-black font-mono text-white leading-none">{gameState.level}</span>
            <span className="text-[9px] font-mono font-extrabold text-slate-500 uppercase mt-1 tracking-wider">
              NÍVEL
            </span>
          </div>
        </div>

        {/* Hero title & Class Rank name tag */}
        <div className="space-y-1">
          <h3 className="text-xl font-extrabold font-display text-white">Guerreiro da Disciplina</h3>
          <span
            className={`inline-block px-4 py-1 border rounded-full text-xs font-bold tracking-widest font-mono uppercase ${
              rankColors[rank as keyof typeof rankColors]
            }`}
          >
            Tier {rank}
          </span>
          <p className="text-[11px] text-slate-500 font-mono pt-1">
            {gameState.xp} / {xpNeeded} XP para o próximo nível ({pct}%)
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-5 space-y-4">
        <h4 className="text-xs font-mono font-extrabold tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
          <Award className="w-4 h-4 text-red-500" />
          ATRIBUTOS DO GUERREIRO
        </h4>

        <div className="grid grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="bg-[#12101a] border border-red-950/20 rounded-2xl p-4">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wide block">
                {s.label}
              </span>
              <span className="text-2xl font-black font-display text-slate-200 block mt-1.5 leading-none">
                {s.val}
              </span>
              <span className="text-[9px] font-mono text-slate-400 block mt-1 uppercase tracking-wider">
                {s.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone Controls */}
      <div className="px-5 pt-2">
        <button
          onClick={onReset}
          className="w-full py-3.5 bg-red-950/20 hover:bg-red-950/40 border border-red-900/20 text-red-400 font-bold font-mono tracking-wider text-xs uppercase rounded-xl flex items-center justify-center gap-2 transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Zerar Histórico de Treino
        </button>
      </div>
    </div>
  );
};
