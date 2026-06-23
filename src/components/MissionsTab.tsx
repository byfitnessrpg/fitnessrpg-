import React, { useState } from 'react';
import { Exercise, GameState } from '../types';
import { WEEKLY_MISSIONS, SPECIAL_MISSIONS } from '../data';
import { Target, Trophy, Clock, Check, ChevronDown, ChevronUp, Play, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MissionsTabProps {
  gameState: GameState;
  exercises: Exercise[];
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  gameState,
  exercises,
  onStartExercise,
  scaledTarget,
}) => {
  const [subTab, setSubTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [expandedDaily, setExpandedDaily] = useState<string | null>(null);

  const getWeeklyProgress = (id: string) => {
    switch (id) {
      case 'w1':
        return gameState.weekDaysTraining || 0;
      case 'w2':
        return gameState.weekFlexoes || 0;
      case 'w3':
        return gameState.weekCardio || 0;
      case 'w4':
        return gameState.weekConsistency || 0;
      default:
        return 0;
    }
  };

  const getSpecialCompleted = (id: string) => {
    return gameState.completedSpecial.includes(id);
  };

  return (
    <div className="space-y-5 pb-20">
      {/* Tab Header Title */}
      <div className="px-5 pt-4">
        <h2 className="text-2xl font-black font-display text-white tracking-tight flex items-center gap-2">
          ⚔️ Mural de Missões
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Complete os contratos ativos e receba saques de XP lendários
        </p>
      </div>

      {/* Sub Tabs Pill Selector */}
      <div className="px-5">
        <div className="flex bg-[#12101a] border border-red-950/40 p-1 rounded-2xl">
          {(['daily', 'weekly', 'special'] as const).map((tab) => {
            const labels = { daily: 'Diárias', weekly: 'Semanais', special: 'Especiais' };
            const isActive = subTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-900/10'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lists */}
      <div className="px-5 space-y-3">
        {subTab === 'daily' && (
          <div className="grid gap-3">
            {exercises.map((ex) => {
              const done = gameState.completedToday.includes(ex.id);
              const target = scaledTarget(ex);
              const isExpanded = expandedDaily === ex.id;

              return (
                <div
                  key={ex.id}
                  className={`bg-[#12101a] border rounded-2xl overflow-hidden transition-all duration-300 ${
                    done
                      ? 'border-emerald-950/40 opacity-75'
                      : isExpanded
                      ? 'border-red-600/40'
                      : 'border-red-950/30 hover:border-red-600/20'
                  }`}
                >
                  {/* Header click */}
                  <div
                    onClick={() => setExpandedDaily(isExpanded ? null : ex.id)}
                    className="p-4 flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{ex.icon}</span>
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-200">{ex.name}</h4>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {target} {ex.unit} · {ex.sets} séries
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded ${
                          ex.diff === 'Fácil'
                            ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/20'
                            : ex.diff === 'Médio'
                            ? 'bg-amber-950/30 text-amber-400 border border-amber-900/20'
                            : 'bg-red-950/30 text-red-400 border border-red-900/20'
                        }`}
                      >
                        {ex.diff}
                      </span>
                      {done ? (
                        <span className="text-emerald-400 font-bold text-sm">✓</span>
                      ) : (
                        <span className="text-amber-500 font-bold text-xs font-mono">+{ex.xp} XP</span>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {/* Body expansion */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-slate-950/30 border-t border-red-950/10"
                      >
                        <div className="p-4 space-y-4">
                          {/* Muscles tags */}
                          <div>
                            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1.5">
                              Músculos Solicitados
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {ex.muscles.map((m) => (
                                <span
                                  key={m}
                                  className="text-[10px] font-medium font-sans px-2.5 py-0.5 rounded-full border border-slate-800 bg-slate-900 text-slate-300"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Steps */}
                          <div>
                            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1.5">
                              Guia de Execução
                            </span>
                            <ol className="space-y-2">
                              {ex.steps.map((step, i) => (
                                <li key={i} className="flex gap-2.5 text-xs text-slate-400 leading-relaxed">
                                  <span className="w-5 h-5 rounded-full bg-red-950/40 border border-red-600/20 flex items-center justify-center font-bold text-[10px] text-red-400 shrink-0 mt-0.5">
                                    {i + 1}
                                  </span>
                                  <span>{step}</span>
                                </li>
                              ))}
                            </ol>
                          </div>

                          {/* Active quest trigger */}
                          {!done && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onStartExercise(ex.id);
                              }}
                              className="w-full mt-2 py-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono tracking-widest uppercase rounded-xl shadow-lg shadow-red-900/15 flex items-center justify-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-white" />
                              Iniciar Treinamento
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {subTab === 'weekly' && (
          <div className="grid gap-3">
            {WEEKLY_MISSIONS.map((m) => {
              const done = gameState.completedWeekly.includes(m.id);
              const progressVal = getWeeklyProgress(m.id);
              const target = m.total;
              const percent = Math.min(100, Math.round((progressVal / target) * 100));

              return (
                <div
                  key={m.id}
                  className={`bg-[#12101a] border rounded-2xl p-4.5 flex flex-col gap-3 ${
                    done ? 'border-emerald-950/40 opacity-75' : 'border-red-950/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
                        {m.title}
                        {done && <span className="text-emerald-400">✓</span>}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">{m.desc}</p>
                    </div>

                    <span
                      className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded shrink-0 ${
                        m.diff === 'Épico'
                          ? 'bg-purple-950/30 text-purple-400 border border-purple-900/20'
                          : 'bg-red-950/30 text-red-400 border border-red-900/20'
                      }`}
                    >
                      {m.diff}
                    </span>
                  </div>

                  {/* Progress tracker slider bar */}
                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>{progressVal} / {target} concluídos</span>
                      <span className="text-amber-500 font-bold">+{m.xp} XP</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {subTab === 'special' && (
          <div className="grid gap-3">
            {SPECIAL_MISSIONS.map((m) => {
              const done = getSpecialCompleted(m.id);

              return (
                <div
                  key={m.id}
                  className={`bg-[#12101a] border rounded-2xl p-4.5 flex items-center justify-between ${
                    done ? 'border-emerald-950/40 opacity-75' : 'border-red-950/20'
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <h4 className="text-sm font-extrabold text-slate-200 flex items-center gap-1.5">
                      {m.title}
                      {done && <span className="text-emerald-400">✓</span>}
                    </h4>
                    <p className="text-xs text-slate-400 leading-snug">{m.desc}</p>
                    <span className="text-[10px] font-mono font-bold text-amber-500 block pt-1">+{m.xp} XP</span>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded ${
                        m.diff === 'Lendário'
                          ? 'bg-amber-950/40 text-amber-500 border border-amber-600/30 animate-pulse'
                          : m.diff === 'Especial'
                          ? 'bg-purple-950/30 text-purple-400 border border-purple-900/20'
                          : 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/20'
                      }`}
                    >
                      {m.diff}
                    </span>
                    {done ? (
                      <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20">
                        CONCLUÍDO
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        PENDENTE
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
