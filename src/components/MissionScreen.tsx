import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../types';
import { ExerciseSVG } from './ExerciseSVG';
import { X, Play, Plus, SkipForward, HelpCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MissionScreenProps {
  exercise: Exercise;
  targetCount: number;
  onClose: () => void;
  onComplete: () => void;
}

export const MissionScreen: React.FC<MissionScreenProps> = ({
  exercise,
  targetCount,
  onClose,
  onComplete,
}) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [currentReps, setCurrentReps] = useState(0);

  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timerLeft, setTimerLeft] = useState(targetCount);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Rest states
  const [isResting, setIsResting] = useState(false);
  const [restLeft, setRestLeft] = useState(30);
  const restIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Ring calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  // Track progress fraction
  const getProgressPct = () => {
    if (exercise.type === 'timer') {
      const elapsed = targetCount - timerLeft;
      return Math.min(1, elapsed / targetCount);
    } else {
      return Math.min(1, currentReps / targetCount);
    }
  };

  const pct = getProgressPct();
  const offset = circumference * (1 - pct);

  // Timer tick
  useEffect(() => {
    if (timerActive && timerLeft > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setTimerActive(false);
            handleFinishSet();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive, timerLeft]);

  // Rest tick
  useEffect(() => {
    if (isResting && restLeft > 0) {
      restIntervalRef.current = setInterval(() => {
        setRestLeft((prev) => {
          if (prev <= 1) {
            clearInterval(restIntervalRef.current!);
            handleSkipRest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    };
  }, [isResting, restLeft]);

  const handleStartTimer = () => {
    setTimerActive(true);
  };

  const handleAddRep = () => {
    if (currentReps + 1 >= targetCount) {
      handleFinishSet();
    } else {
      setCurrentReps((prev) => prev + 1);
    }
  };

  const handleFinishSet = () => {
    if (currentSet < exercise.sets) {
      // Open rest screen
      setRestLeft(30);
      setIsResting(true);
    } else {
      // Done with all sets!
      onComplete();
    }
  };

  const handleSkipRest = () => {
    if (restIntervalRef.current) clearInterval(restIntervalRef.current);
    setIsResting(false);
    setCurrentSet((prev) => prev + 1);
    setCurrentReps(0);
    setTimerLeft(targetCount);
    setTimerActive(false);
  };

  // Circular ring calculations for rest progress
  const restRadius = 52;
  const restCircumference = 2 * Math.PI * restRadius;
  const restOffset = restCircumference * (1 - restLeft / 30);

  // Theme color adaptation: fallback to sky blue if not explicitly high-contrast
  const themeColor = '#38bdf8'; // Sky-400

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between overflow-y-auto no-scrollbar max-w-md mx-auto shadow-2xl">
      {/* 1. Header with details & close btn */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-900 bg-[#050508]">
        <div>
          <h3 className="text-sm font-black font-display text-white flex items-center gap-2 uppercase tracking-wider">
            <span className="text-xl">{exercise.icon}</span> {exercise.name}
          </h3>
          <p className="text-[10px] text-sky-400 font-mono font-bold tracking-wider">
            SÉRIE {currentSet} DE {exercise.sets}
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-900 flex items-center justify-center text-slate-400 hover:text-white hover:border-sky-500/30 transition-all active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Visual Animation Figure illustration */}
      <div className="flex-1 px-5 py-6 flex flex-col items-center justify-center space-y-6">
        <div className="w-full flex justify-center py-6 bg-[#030305] border border-slate-900 rounded-3xl relative overflow-hidden">
          {/* Atmospheric background glow */}
          <div className="absolute inset-0 bg-radial-gradient from-sky-500/5 to-transparent blur-xl pointer-events-none" />
          <ExerciseSVG pose={exercise.pose} color={themeColor} />
        </div>

        {/* Muscles tag row */}
        <div className="flex flex-wrap gap-1 justify-center">
          {exercise.muscles.map((m) => (
            <span
              key={m}
              className="text-[9px] font-bold font-mono uppercase px-3 py-1 rounded bg-sky-950/20 text-sky-400 border border-sky-500/10"
            >
              {m}
            </span>
          ))}
        </div>

        {/* Circular Progress widget */}
        <div className="flex flex-col items-center justify-center pt-2 relative">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle cx="72" cy="72" r={radius} className="stroke-slate-950 fill-none" strokeWidth="8" />
            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              className="fill-none"
              style={{ stroke: themeColor }}
              strokeWidth="8"
              strokeDasharray={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.25 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center leading-none mt-1">
            <span className="text-4xl font-black font-mono text-white">
              {exercise.type === 'timer' ? timerLeft : currentReps}
            </span>
            <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest mt-1.5">
              {exercise.type === 'timer' ? 'SEGUNDOS' : `DE ${targetCount}`}
            </span>
          </div>
        </div>

        {/* Series track bars */}
        <div className="w-full space-y-2 px-3">
          <span className="text-[9px] font-mono font-black tracking-wider text-slate-600 uppercase block text-center">
            Progresso das Séries
          </span>
          <div className="flex gap-2 justify-center">
            {Array.from({ length: exercise.sets }, (_, i) => {
              const setNum = i + 1;
              const isDone = setNum < currentSet;
              const isActive = setNum === currentSet;

              return (
                <div
                  key={i}
                  className={`flex-1 h-1.5 rounded transition-all duration-300 ${
                    isDone 
                      ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                      : isActive 
                      ? 'bg-sky-400 animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]' 
                      : 'bg-slate-900'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Action button area */}
      <div className="p-5 space-y-6 border-t border-slate-900 bg-[#030305]">
        <div className="flex justify-center">
          {exercise.type === 'reps' ? (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleAddRep}
              className="w-full py-4.5 bg-white hover:bg-slate-200 text-black font-black font-mono text-sm uppercase rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5 text-black stroke-[3px]" />
              +1 {exercise.unit.split(' ')[0]}
            </motion.button>
          ) : (
            <button
              onClick={handleStartTimer}
              disabled={timerActive}
              className="w-full py-4.5 bg-white hover:bg-slate-200 disabled:opacity-50 disabled:bg-slate-900 disabled:text-slate-500 text-black font-black font-mono text-sm uppercase rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-current text-black" />
              {timerActive ? 'TIMER ATIVO' : 'INICIAR CONTAGEM'}
            </button>
          )}
        </div>

        {/* Directions steps */}
        <div className="space-y-3">
          <h4 className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            Como Executar a Série
          </h4>
          <ul className="space-y-2">
            {exercise.steps.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-[11px] text-slate-400 leading-relaxed font-mono">
                <span className="w-4.5 h-4.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-[9px] text-sky-400 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Fullscreen rest panel overlay */}
      <AnimatePresence>
        {isResting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-51 flex flex-col items-center justify-center text-center p-6 max-w-md mx-auto"
          >
            <div className="space-y-1 mb-8">
              <span className="text-3xl">🧘</span>
              <h3 className="text-xl font-black font-display text-white uppercase tracking-widest">Hora do Descanso</h3>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Excelente série! Respire e recupere as energias</p>
            </div>

            {/* Circular rest countdown circle */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-10">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r={restRadius} className="stroke-slate-950 fill-none" strokeWidth="8" />
                <motion.circle
                  cx="72"
                  cy="72"
                  r={restRadius}
                  className="stroke-sky-400 fill-none"
                  strokeWidth="8"
                  strokeDasharray={restCircumference}
                  animate={{ strokeDashoffset: restOffset }}
                  transition={{ duration: 1, ease: 'linear' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center leading-none mt-1">
                <span className="text-4xl font-black font-mono text-sky-400">{restLeft}</span>
                <span className="text-[9px] font-mono font-black text-slate-600 uppercase tracking-widest mt-1.5">
                  SEGUNDOS
                </span>
              </div>
            </div>

            {/* Skip rest trigger */}
            <button
              onClick={handleSkipRest}
              className="px-8 py-3.5 bg-black hover:bg-slate-950 border border-sky-400 text-sky-400 font-bold font-mono text-xs uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
            >
              <SkipForward className="w-4 h-4 text-sky-400 fill-current" />
              Pular Descanso
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
