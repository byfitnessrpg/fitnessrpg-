import React, { useState } from 'react';
import { Exercise, GameState } from '../types';
import { WEEKLY_MISSIONS, SPECIAL_MISSIONS } from '../data';
import { Target, Trophy, Clock, Check, ChevronDown, ChevronUp, Play, Zap, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExerciseIcon } from './ExerciseIcon';
import { RECOVERY_ACTIVITIES } from './HomeTab';

interface MissionsTabProps {
  gameState: GameState;
  exercises: Exercise[];
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
  onCompleteRecoveryActivity?: (activityId: string, xpReward: number, name: string) => void;
  theme?: 'dark' | 'light';
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  gameState,
  exercises,
  onStartExercise,
  scaledTarget,
  onCompleteRecoveryActivity,
  theme = 'dark',
}) => {
  const [subTab, setSubTab] = useState<'daily' | 'weekly' | 'special'>('daily');
  const [expandedDaily, setExpandedDaily] = useState<string | null>(null);
  const isLight = theme === 'light';

  const DAYS_MAP = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const todayAbbrev = DAYS_MAP[new Date().getDay()];
  const isTrainingDay = !gameState.cronograma_dias || gameState.cronograma_dias.includes(todayAbbrev);

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
    <div className={`space-y-5 pb-20 min-h-screen transition-colors duration-300 ${
      isLight ? 'cyber-grid-light bg-slate-50 text-slate-800' : 'cyber-grid bg-black text-slate-100'
    }`}>
      {/* Tab Header Title */}
      <div className="px-5 pt-4">
        <h2 className={`text-xl font-black font-display tracking-widest flex items-center gap-2 uppercase transition-colors ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <Shield className="w-5 h-5 text-sky-500 animate-pulse" />
          MURAL DE MISSÕES
        </h2>
        <p className={`text-[10px] font-mono mt-1 uppercase tracking-wider transition-colors ${
          isLight ? 'text-slate-400 font-bold' : 'text-slate-500'
        }`}>
          Complete os contratos ativos e receba recompensas de XP do sistema
        </p>
      </div>

      {/* Sub Tabs Pill Selector */}
      <div className="px-5">
        <div className={`flex p-1 rounded-2xl border transition-all ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-black border-slate-900 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]'
        }`}>
          {(['daily', 'weekly', 'special'] as const).map((tab) => {
            const labels = { daily: isTrainingDay ? 'Programadas' : 'Recuperação', weekly: 'Semanais', special: 'Especiais' };
            const isActive = subTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 ${
                  isActive
                    ? (isLight ? 'bg-slate-950 text-white shadow-md font-black' : 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.2)] font-black')
                    : (isLight ? 'text-slate-400 hover:text-slate-700' : 'text-slate-500 hover:text-slate-300')
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
            {isTrainingDay ? (
              exercises.map((ex) => {
                const done = gameState.completedToday.includes(ex.id);
                const target = scaledTarget(ex);
                const isExpanded = expandedDaily === ex.id;

                return (
                  <div
                    key={ex.id}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      done
                        ? (isLight ? 'bg-emerald-50/40 border-emerald-200/50 opacity-60' : 'border-emerald-500/10 opacity-60 bg-black')
                        : isExpanded
                        ? (isLight ? 'bg-white border-sky-500 shadow-[0_4px_15px_rgba(14,165,233,0.1)]' : 'bg-black border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.15)]')
                        : (isLight ? 'bg-white border-slate-200/80 hover:border-sky-400' : 'bg-black border-slate-900 hover:border-sky-500/20')
                    }`}
                  >
                    {/* Header click */}
                    <div
                      onClick={() => setExpandedDaily(isExpanded ? null : ex.id)}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <ExerciseIcon pose={ex.pose} size="md" theme={theme} />
                        <div>
                          <h4 className={`text-sm font-black tracking-wide transition-colors ${
                            done 
                              ? (isLight ? 'text-slate-400 line-through font-bold' : 'text-slate-500 line-through') 
                              : (isLight ? 'text-slate-900 font-extrabold' : 'text-slate-200')
                          }`}>
                            {ex.name.toUpperCase()}
                          </h4>
                          <p className={`text-[10px] font-mono transition-colors ${
                            isLight ? 'text-slate-500 font-bold' : 'text-slate-500'
                          }`}>
                            {target} {ex.unit} · {ex.sets} séries
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded transition-all ${
                            ex.diff === 'Fácil'
                              ? (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10')
                              : ex.diff === 'Médio'
                              ? (isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-950/20 text-amber-400 border border-amber-500/10')
                              : (isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/20 text-red-400 border border-red-500/10')
                          }`}
                        >
                          {ex.diff}
                        </span>
                        {done ? (
                          <span className="text-emerald-500 font-bold text-sm">✓</span>
                        ) : (
                          <span className={`font-bold text-xs font-mono transition-colors ${
                            isLight ? 'text-sky-600 font-extrabold' : 'text-sky-400'
                          }`}>+{ex.xp} XP</span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
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
                          className={`overflow-hidden border-t transition-all ${
                            isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#050508]/40 border-slate-900'
                          }`}
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
                                    className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded border transition-all ${
                                      isLight 
                                        ? 'bg-white border-slate-200 text-slate-600' 
                                        : 'bg-black border-slate-800 text-slate-400'
                                    }`}
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
                                  <li key={i} className="flex gap-2.5 text-xs leading-relaxed">
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 border transition-all ${
                                      isLight 
                                        ? 'bg-slate-200 border-slate-300 text-sky-600' 
                                        : 'bg-slate-900 border-slate-800 text-sky-400'
                                    }`}>
                                      {i + 1}
                                    </span>
                                    <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>{step}</span>
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
                                className={`w-full mt-2 py-3 text-xs font-black font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                                  isLight 
                                    ? 'bg-slate-950 hover:bg-slate-800 text-white shadow-[0_3px_10px_rgba(15,23,42,0.15)]' 
                                    : 'bg-white hover:bg-slate-200 text-black shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                                }`}
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                                Iniciar Treinamento
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              RECOVERY_ACTIVITIES.map((rec) => {
                const done = (gameState.completedRecoveryToday || []).includes(rec.id);
                const isExpanded = expandedDaily === rec.id;

                return (
                  <div
                    key={rec.id}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                      done
                        ? (isLight ? 'bg-emerald-50/40 border-emerald-200/50 opacity-60' : 'border-emerald-500/10 opacity-60 bg-black')
                        : isExpanded
                        ? (isLight ? 'bg-white border-emerald-500 shadow-[0_4px_15px_rgba(16,185,129,0.1)]' : 'bg-black border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)]')
                        : (isLight ? 'bg-white border-slate-200/80 hover:border-emerald-400' : 'bg-black border-slate-900 hover:border-emerald-500/20')
                    }`}
                  >
                    {/* Header click */}
                    <div
                      onClick={() => setExpandedDaily(isExpanded ? null : rec.id)}
                      className="p-4 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900/30 flex items-center justify-center text-xl filter drop-shadow">
                          {rec.icon}
                        </div>
                        <div>
                          <h4 className={`text-sm font-black tracking-wide transition-colors ${
                            done 
                              ? (isLight ? 'text-slate-400 line-through font-bold' : 'text-slate-500 line-through') 
                              : (isLight ? 'text-slate-900 font-extrabold' : 'text-slate-200')
                          }`}>
                            {rec.name.toUpperCase()}
                          </h4>
                          <p className={`text-[10px] font-mono transition-colors ${
                            isLight ? 'text-slate-500 font-bold' : 'text-slate-500'
                          }`}>
                            {rec.tag} · RECOMENDADO
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {done ? (
                          <span className="text-emerald-500 font-bold text-xs uppercase font-mono">✓ CONCLUÍDO</span>
                        ) : (
                          <span className={`font-bold text-xs font-mono transition-colors ${
                            isLight ? 'text-emerald-600 font-extrabold' : 'text-emerald-400'
                          }`}>+{rec.xp} XP</span>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
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
                          className={`overflow-hidden border-t transition-all ${
                            isLight ? 'bg-slate-50/50 border-slate-100' : 'bg-[#050508]/40 border-slate-900'
                          }`}
                        >
                          <div className="p-4 space-y-3">
                            <div>
                              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1.5">
                                Instruções do Sistema
                              </span>
                              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                                {rec.desc} O descanso programado restaura as fibras musculares e otimiza a sua regeneração para o próximo ciclo de treino ativo.
                              </p>
                            </div>

                            {!done && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onCompleteRecoveryActivity?.(rec.id, rec.xp, rec.name);
                                }}
                                className={`w-full mt-2 py-3 text-xs font-black font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                                  isLight 
                                    ? 'bg-slate-950 hover:bg-slate-800 text-white shadow-[0_3px_10px_rgba(15,23,42,0.15)]' 
                                    : 'bg-white hover:bg-slate-200 text-black shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                                }`}
                              >
                                <Check className="w-4 h-4" />
                                Concluir Atividade
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
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
                  className={`border rounded-2xl p-4.5 flex flex-col gap-3 transition-all ${
                    done 
                      ? (isLight ? 'bg-emerald-50/40 border-emerald-200 opacity-60' : 'bg-black border-emerald-500/10 opacity-60') 
                      : (isLight ? 'bg-white border-slate-200/80 hover:border-sky-400' : 'bg-black border border-slate-900 hover:border-sky-50/10')
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-black tracking-wide flex items-center gap-1.5 uppercase transition-colors ${
                        isLight ? 'text-slate-800' : 'text-slate-200'
                      }`}>
                        {m.title}
                        {done && <span className="text-emerald-500 font-bold">✓</span>}
                      </h4>
                      <p className={`text-xs mt-1 transition-colors ${
                        isLight ? 'text-slate-400' : 'text-slate-500'
                      }`}>{m.desc}</p>
                    </div>

                    <span
                      className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded shrink-0 transition-all ${
                        m.diff === 'Épico'
                          ? (isLight ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-purple-950/20 text-purple-400 border border-purple-500/10')
                          : (isLight ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-red-950/20 text-red-400 border border-red-500/10')
                      }`}
                    >
                      {m.diff}
                    </span>
                  </div>

                  {/* Progress tracker slider bar */}
                  <div className="space-y-1.5 pt-1.5">
                    <div className={`flex justify-between items-center text-[10px] font-mono transition-colors ${
                      isLight ? 'text-slate-400 font-bold' : 'text-slate-500'
                    }`}>
                      <span>{progressVal} / {target} concluídos</span>
                      <span className={isLight ? 'text-sky-600 font-extrabold' : 'text-sky-400 font-bold'}>+{m.xp} XP</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden transition-all ${
                      isLight ? 'bg-slate-100' : 'bg-slate-950'
                    }`}>
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-300"
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
                  className={`border rounded-2xl p-4.5 flex items-center justify-between transition-all ${
                    done 
                      ? (isLight ? 'bg-emerald-50/40 border-emerald-200 opacity-60' : 'bg-black border-emerald-500/10 opacity-60') 
                      : (isLight ? 'bg-white border-slate-200 hover:border-sky-400' : 'bg-black border border-slate-900 hover:border-sky-50/10')
                  }`}
                >
                  <div className="space-y-1 pr-4">
                    <h4 className={`text-sm font-black tracking-wide flex items-center gap-1.5 uppercase transition-colors ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}>
                      {m.title}
                      {done && <span className="text-emerald-500 font-bold">✓</span>}
                    </h4>
                    <p className={`text-xs leading-snug transition-colors ${
                      isLight ? 'text-slate-400' : 'text-slate-500'
                    }`}>{m.desc}</p>
                    <span className={`text-[10px] font-mono font-bold block pt-1 transition-colors ${
                      isLight ? 'text-sky-600 font-black' : 'text-sky-400'
                    }`}>+{m.xp} XP</span>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-bold font-mono tracking-widest uppercase px-2 py-0.5 rounded transition-all ${
                        m.diff === 'Lendário'
                          ? (isLight ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' : 'bg-amber-950/20 text-amber-500 border border-amber-500/10 animate-pulse')
                          : m.diff === 'Especial'
                          ? (isLight ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-purple-950/20 text-purple-400 border border-purple-500/10')
                          : (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/20 text-emerald-400 border border-emerald-500/10')
                      }`}
                    >
                      {m.diff}
                    </span>
                    {done ? (
                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border transition-all ${
                        isLight 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-emerald-950/15 text-emerald-400 border-emerald-500/10'
                      }`}>
                        CONCLUÍDO
                      </span>
                    ) : (
                      <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border transition-all ${
                        isLight 
                          ? 'bg-slate-100 text-slate-500 border-slate-200' 
                          : 'text-slate-500 bg-slate-950 border-slate-900'
                      }`}>
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
