import React from 'react';
import { Exercise, GameState } from '../types';
import { Swords, Trophy, Target, Sparkles, Check, Play, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeTabProps {
  gameState: GameState;
  exercises: Exercise[];
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  gameState,
  exercises,
  onStartExercise,
  scaledTarget,
}) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  const completedCount = gameState.completedToday.length;
  const totalCount = exercises.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activeQuests = exercises.filter((e) => !gameState.completedToday.includes(e.id));
  const completedQuests = exercises.filter((e) => gameState.completedToday.includes(e.id));

  return (
    <div className="space-y-6">
      {/* Dynamic Time & Hero Greeting */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
            {greeting}, GUERREIRO!
          </span>
          <h2 className="text-2xl font-extrabold font-display text-white tracking-tight flex items-center gap-1.5 mt-0.5">
            Seja bem-vindo
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500 animate-pulse" />
          </h2>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-lg shadow-inner">
          ⚔️
        </div>
      </div>

      {/* Progress Card */}
      <div className="mx-5 bg-[#12101a] border border-red-950/40 rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute right-[-40px] top-[-40px] w-32 h-32 bg-red-600/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-red-500 uppercase block">JORNADA DIÁRIA</span>
            <span className="text-lg font-black text-white">Quests de Hoje</span>
          </div>
          <span className="text-2xl font-mono font-black text-amber-400">
            {completedCount}<span className="text-slate-600 text-sm">/{totalCount}</span>
          </span>
        </div>

        {/* Custom Circular percentage or modern slider bar */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
            <span>Progresso Geral</span>
            <span>{percentCompleted}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-900">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
              style={{ width: `${percentCompleted}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hero Stats Mini Banner */}
      {gameState.streak >= 3 && (
        <div className="mx-5 bg-gradient-to-r from-amber-950/30 to-red-950/10 border border-amber-600/30 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-md animate-pulse">
          <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/40 rounded-lg flex items-center justify-center text-xl shrink-0">
            🔥
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 block leading-tight">CHAMA DO GUERREIRO</span>
            <span className="text-[11px] text-slate-300">
              Você está ativo há <strong className="text-amber-500">{gameState.streak} dias</strong>! Não perca o bônus de XP!
            </span>
          </div>
        </div>
      )}

      {/* Quests Container */}
      <div className="space-y-4 px-5 pb-8">
        <h3 className="text-xs font-mono font-extrabold tracking-widest text-slate-500 uppercase flex items-center gap-1.5 mb-1">
          <Target className="w-4 h-4 text-red-500" />
          DESAFIOS DA ARENA ({activeQuests.length})
        </h3>

        {activeQuests.length === 0 ? (
          <div className="bg-[#12101a]/50 border border-emerald-950/40 rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-200">Arena Concluída!</h4>
              <p className="text-xs text-slate-500 max-w-[240px] mx-auto mt-1">
                Você derrotou todos os monstros e completou todos os desafios de hoje! Descanse bem.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            {activeQuests.map((ex) => {
              const targetVal = scaledTarget(ex);
              return (
                <motion.div
                  key={ex.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onStartExercise(ex.id)}
                  className="bg-[#12101a] border border-red-950/30 hover:border-red-600/30 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-red-950/15 border border-red-950/30 flex items-center justify-center text-2xl relative">
                      {ex.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-200">{ex.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono uppercase mt-0.5">
                        {targetVal} {ex.unit} · {ex.sets} séries
                      </p>
                      <span
                        className="inline-block text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded mt-1.5"
                        style={{ backgroundColor: `${ex.mColor}15`, color: ex.mColor }}
                      >
                        {ex.cat}
                      </span>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1.5 shrink-0">
                    <span className="flex items-center gap-1 text-[10px] font-mono font-black text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/20">
                      +{ex.xp} <span className="text-[8px] text-slate-500">XP</span>
                    </span>
                    <button className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-900/10">
                      <Play className="w-3.5 h-3.5 fill-white" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Completed Section */}
        {completedQuests.length > 0 && (
          <div className="space-y-3 pt-4">
            <h3 className="text-xs font-mono font-extrabold tracking-widest text-slate-500 uppercase flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-500" />
              QUETS CONCLUÍDAS ({completedQuests.length})
            </h3>
            <div className="grid gap-2">
              {completedQuests.map((ex) => (
                <div
                  key={ex.id}
                  className="bg-[#12101a]/40 border border-emerald-950/20 rounded-2xl p-3.5 flex items-center justify-between opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{ex.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-300">{ex.name}</h4>
                      <p className="text-[10px] text-slate-500">Concluído ✓</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
