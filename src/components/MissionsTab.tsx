import React, { useState } from 'react';
import { Exercise, GameState } from '../types';
import { WEEKLY_MISSIONS, SPECIAL_MISSIONS, PREMIUM_EXERCISES, ELITE_MISSIONS } from '../data';
import { Target, Trophy, Clock, Check, ChevronDown, ChevronUp, Play, Zap, Shield, Crown, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExerciseIcon } from './ExerciseIcon';
import { RECOVERY_ACTIVITIES } from './HomeTab';

interface MissionsTabProps {
  gameState: GameState;
  exercises: Exercise[];
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
  onCompleteRecoveryActivity?: (activityId: string, xpReward: number, name: string) => void;
  onStartRecoveryActivity?: (activityId: string) => void;
  theme?: 'dark' | 'light';
  onNavigateToPremium?: () => void;
}

export const MissionsTab: React.FC<MissionsTabProps> = ({
  gameState,
  exercises,
  onStartExercise,
  scaledTarget,
  onCompleteRecoveryActivity,
  onStartRecoveryActivity,
  theme = 'dark',
  onNavigateToPremium,
}) => {
  const [subTab, setSubTab] = useState<'daily' | 'weekly' | 'special' | 'elite'>('daily');
  const [expandedDaily, setExpandedDaily] = useState<string | null>(null);
  const isLight = theme === 'light';
  const isPremium = !!gameState.isPremium;


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

  const getEliteProgress = (id: string) => {
    switch (id) {
      case 'e1':
        return gameState.weekFlexoes || 0;
      case 'e2':
        return gameState.streak || 0;
      case 'e3':
        return gameState.totalAgacham || 0;
      case 'e4':
        return gameState.completedWeekly?.length || 0;
      default:
        return 0;
    }
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
          MURAL DE TREINAMENTOS
        </h2>
        <p className={`text-[10px] font-mono mt-1 uppercase tracking-wider transition-colors ${
          isLight ? 'text-slate-400 font-bold' : 'text-slate-500'
        }`}>
          Complete suas metas para manter a consistência e acelerar seu progresso físico
        </p>
      </div>

      {/* Sub Tabs Pill Selector */}
      <div className="px-5">
        <div className={`flex p-1 rounded-2xl border transition-all overflow-x-auto scrollbar-none ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-black border-slate-900 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]'
        }`}>
          {(['daily', 'weekly', 'special', 'elite'] as const).map((tab) => {
            const labels = { 
              daily: isTrainingDay ? 'Programadas' : 'Recuperação', 
              weekly: 'Semanais', 
              special: 'Especiais',
              elite: isPremium ? 'Elite 👑' : 'Elite 🔒'
            };
            const isActive = subTab === tab;

            return (
              <button
                key={tab}
                onClick={() => setSubTab(tab)}
                className={`flex-1 min-w-[70px] py-2.5 px-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-all duration-200 shrink-0 ${
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
              ([...exercises, ...PREMIUM_EXERCISES]).map((ex) => {
                const isLocked = ex.isPremium && !isPremium;
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
                          <h4 className={`text-sm font-black tracking-wide transition-colors flex items-center gap-1.5 ${
                            done 
                              ? (isLight ? 'text-slate-400 line-through font-bold' : 'text-slate-500 line-through') 
                              : (isLight ? 'text-slate-900 font-extrabold' : 'text-slate-200')
                          }`}>
                            <span>{ex.name.toUpperCase()}</span>
                            {ex.isPremium && (
                              <span className="inline-flex items-center gap-0.5 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-500 text-[8px] px-1.5 py-0.5 rounded font-bold border border-yellow-500/30">
                                PREMIUM 👑
                              </span>
                            )}
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
                            {isLocked ? (
                              <div className="mt-3 p-4 border border-yellow-500/25 bg-yellow-500/5 rounded-2xl text-center space-y-2.5">
                                <Crown className="w-5 h-5 text-yellow-500 mx-auto animate-pulse" />
                                <div>
                                  <h5 className="text-[11px] font-black text-yellow-500 uppercase tracking-wider">Exercício Premium Exclusivo</h5>
                                  <p className={`text-[10px] font-mono leading-relaxed max-w-xs mx-auto mt-0.5 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                                    Desbloqueie o Fitness Evolution Premium para incluir o {ex.name} e outros 8 treinos de elite na sua jornada corporal!
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onNavigateToPremium) onNavigateToPremium();
                                  }}
                                  className="py-2 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black font-mono text-[9px] uppercase tracking-widest hover:brightness-110 transition-all cursor-pointer inline-block shadow-md"
                                >
                                  Desbloquear Premium 👑
                                </button>
                              </div>
                            ) : (
                              !done && (
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
                              )
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
                        ? (isLight ? 'bg-teal-50/40 border-teal-200/50 opacity-60' : 'border-teal-500/10 opacity-60 bg-black')
                        : isExpanded
                        ? (isLight ? 'bg-white border-teal-500 shadow-[0_4px_15px_rgba(20,184,166,0.1)]' : 'bg-black border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.15)]')
                        : (isLight ? 'bg-white border-slate-200/80 hover:border-teal-400' : 'bg-black border-slate-900 hover:border-teal-500/20')
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
                          <span className="text-teal-500 font-bold text-xs uppercase font-mono">✓ CONCLUÍDO</span>
                        ) : (
                          <span className={`font-bold text-xs font-mono transition-colors ${
                            isLight ? 'text-teal-600 font-extrabold' : 'text-teal-400'
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
                                  onStartRecoveryActivity?.(rec.id);
                                }}
                                className={`w-full mt-2 py-3 text-xs font-black font-mono tracking-widest uppercase rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                                  isLight 
                                    ? 'bg-teal-600 hover:bg-teal-500 text-white shadow-[0_3px_10px_rgba(20,184,166,0.15)]' 
                                    : 'bg-teal-500 hover:bg-teal-400 text-black shadow-[0_0_12px_rgba(20,184,166,0.2)]'
                                }`}
                              >
                                <Play className="w-4 h-4 fill-current" />
                                Executar Atividade
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
                          ? (isLight ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-sky-950/30 text-sky-400 border border-sky-500/20')
                          : (isLight ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-blue-950/30 text-blue-400 border border-blue-500/20')
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
                          ? (isLight ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-amber-950/30 text-amber-500 border border-amber-500/20')
                          : m.diff === 'Especial'
                          ? (isLight ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-sky-950/30 text-sky-400 border border-sky-500/20')
                          : (isLight ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20')
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

        {subTab === 'elite' && (
          <div className="grid gap-3 relative min-h-[320px]">
            {/* If not Premium, render locked overlay but show the list underneath with a blur! */}
            {!isPremium && (
              <div className="absolute inset-0 z-15 bg-black/75 backdrop-blur-[6px] rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-14 h-14 bg-yellow-500/20 rounded-full flex items-center justify-center border border-yellow-500/30 text-yellow-500 text-2xl animate-pulse">
                  👑
                </div>
                <div className="space-y-1.5 px-4">
                  <h4 className="text-sm font-black text-yellow-500 uppercase font-display tracking-widest">Performance Elite Bloqueada</h4>
                  <p className="text-xs text-slate-300 max-w-xs leading-relaxed font-mono">
                    Faça o upgrade para o plano Premium para aceitar desafios de alta performance, conquistar medalhas exclusivas e acelerar sua evolução corporal!
                  </p>
                </div>
                <button
                  onClick={onNavigateToPremium}
                  className="py-3 px-6 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 text-black font-black font-mono text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-[0_4px_15px_rgba(234,179,8,0.45)] cursor-pointer"
                >
                  Liberar Acesso Premium 👑
                </button>
              </div>
            )}

            {ELITE_MISSIONS.map((m) => {
              const completedList = gameState.completedElite || [];
              const done = completedList.includes(m.id);
              const progressVal = getEliteProgress(m.id);
              const target = m.target;
              const percent = Math.min(100, Math.round((progressVal / target) * 100));

              return (
                <div
                  key={m.id}
                  className={`border rounded-2xl p-4.5 flex flex-col gap-3 transition-all ${
                    done 
                      ? (isLight ? 'bg-emerald-50/40 border-emerald-200 opacity-60' : 'bg-black border-emerald-500/10 opacity-60') 
                      : (isLight ? 'bg-white border-slate-200/80 hover:border-sky-400' : 'bg-black border border-slate-900 hover:border-yellow-500/10')
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 pr-2">
                      <span className="text-[8px] font-mono font-black text-yellow-500 uppercase tracking-widest block">
                        CONTRATO DE CLASSE ELITE
                      </span>
                      <h4 className={`text-sm font-black tracking-wide flex items-center gap-1.5 uppercase transition-colors ${
                        isLight ? 'text-slate-800 font-extrabold' : 'text-slate-200'
                      }`}>
                        {m.title}
                        {done && <span className="text-emerald-500 font-bold">✓</span>}
                      </h4>
                      <p className={`text-xs transition-colors leading-relaxed ${
                        isLight ? 'text-slate-500 font-medium' : 'text-slate-400'
                      }`}>{m.desc}</p>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span className="text-2xl" title={m.medalTitle}>{m.medalIcon}</span>
                      <span className="text-[8px] font-mono text-yellow-500 uppercase font-black tracking-wider block">
                        {m.medalTitle.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1.5 pt-1 border-t border-slate-900/40 mt-1">
                    <div className={`flex justify-between items-center text-[10px] font-mono transition-colors ${
                      isLight ? 'text-slate-400 font-bold' : 'text-slate-500'
                    }`}>
                      <span>Progresso: {progressVal} / {target}</span>
                      <span className="text-yellow-500 font-black">+{m.xp} XP</span>
                    </div>
                    <div className={`w-full h-1.5 rounded-full overflow-hidden transition-all ${
                      isLight ? 'bg-slate-100' : 'bg-slate-950'
                    }`}>
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
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
