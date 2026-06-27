import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Check, RotateCcw, AlertCircle, Sparkles, Clock, RotateCw, Wind } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface RecoveryActivity {
  id: string;
  name: string;
  desc: string;
  instructions: string;
  icon: string;
  xp: number;
  duration: number; // in seconds
  tag: string;
  durationLabel?: string;
  focusLabel?: string;
  breathLabel?: string;
  image?: string;
}

interface RecoveryMissionScreenProps {
  activity: RecoveryActivity;
  onClose: () => void;
  onComplete: () => void;
  theme?: 'dark' | 'light';
}

export const RecoveryMissionScreen: React.FC<RecoveryMissionScreenProps> = ({
  activity,
  onClose,
  onComplete,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(activity.duration);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, timeLeft]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeLeft(activity.duration);
  };

  // Helper to format remaining time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Circular ring calculation for timer
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progressPct = timeLeft / activity.duration;
  const strokeOffset = circumference * (1 - progressPct);

  // Render responsive CSS animations in vector SVG based on activity
  const renderRecoveryAnimation = () => {
    const strokeColor = isLight ? '#0d9488' : '#2dd4bf'; // teal accent for recovery
    const bodyColor = isLight ? '#475569' : '#94a3b8';
    const floorColor = isLight ? '#cbd5e1' : '#334155';

    switch (activity.id) {
      case 'rec_neck_stretch':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes headSway {
                0% { transform: rotate(-12deg); }
                50% { transform: rotate(12deg); }
                100% { transform: rotate(-12deg); }
              }
              .stretching-head {
                animation: headSway 4s ease-in-out infinite;
                transform-origin: 50px 38px;
              }
            `}</style>
            {/* Ground / Bench */}
            <line x1="20" y1="85" x2="80" y2="85" stroke={floorColor} strokeWidth="3" strokeLinecap="round" />
            {/* Torso */}
            <path d="M40,75 L50,45 L60,75 Z" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Neck & Head with Sway animation */}
            <g className="stretching-head">
              <line x1="50" y1="45" x2="50" y2="38" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="30" r="8" fill="none" stroke={strokeColor} strokeWidth="4.5" />
            </g>
            {/* Crossed arms */}
            <path d="M35,53 Q50,62 65,53" fill="none" stroke={bodyColor} strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'rec_shoulder_chest':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes chestOpen {
                0% { transform: scaleX(0.9); }
                50% { transform: scaleX(1.15); }
                100% { transform: scaleX(0.9); }
              }
              .chest-group {
                animation: chestOpen 3s ease-in-out infinite;
                transform-origin: 50px 50px;
              }
            `}</style>
            <line x1="20" y1="85" x2="80" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Torso & Head */}
            <g className="chest-group">
              <path d="M45,75 L50,45 L55,75" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="50" cy="32" r="8" fill="none" stroke={strokeColor} strokeWidth="4.5" />
              {/* Stretching Arms pulling back */}
              <path d="M22,46 C32,40 45,44 50,45 C55,44 68,40 78,46" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'rec_arms_stretch':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes armSqueeze {
                0% { transform: translateX(0); }
                50% { transform: translateX(4px); }
                100% { transform: translateX(0); }
              }
              .arm-squeeze {
                animation: armSqueeze 2.5s ease-in-out infinite;
                transform-origin: 50px 50px;
              }
            `}</style>
            <line x1="20" y1="85" x2="80" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Figure */}
            <path d="M48,75 L50,45 L52,75" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="32" r="8" fill="none" stroke={bodyColor} strokeWidth="4.5" />
            {/* Crossing arm and pressing hand */}
            <g className="arm-squeeze">
              <path d="M28,45 L62,45" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" />
              <path d="M54,38 L54,52" fill="none" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'rec_back_stretch':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes backCurve {
                0% { d: "M50,75 L50,45"; }
                50% { d: "M50,75 Q41,58 48,45"; }
                100% { d: "M50,75 L50,45"; }
              }
              .back-spine {
                animation: backCurve 4s ease-in-out infinite;
              }
            `}</style>
            <line x1="20" y1="85" x2="80" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Moving spine */}
            <path className="back-spine" d="M50,75 L50,45" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" />
            <circle cx="48" cy="32" r="8" fill="none" stroke={bodyColor} strokeWidth="4.5" />
            {/* Reaching arms */}
            <path d="M48,45 Q30,42 22,46" fill="none" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );

      case 'rec_hamstrings':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes hamstringReach {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(18deg); }
                100% { transform: rotate(0deg); }
              }
              .torso-reach {
                animation: hamstringReach 4s ease-in-out infinite;
                transform-origin: 35px 75px;
              }
            `}</style>
            <line x1="15" y1="80" x2="85" y2="80" stroke={floorColor} strokeWidth="3" />
            {/* Legs on floor */}
            <path d="M35,75 L75,75" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            {/* Leaning torso with head */}
            <g className="torso-reach">
              <path d="M35,75 L35,42" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="35" cy="30" r="7.5" fill="none" stroke={bodyColor} strokeWidth="4.5" />
              {/* Reaching arms towards feet */}
              <path d="M35,45 L62,55" fill="none" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'rec_quadriceps':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes quadPull {
                0% { transform: rotate(0deg); }
                50% { transform: rotate(-8deg); }
                100% { transform: rotate(0deg); }
              }
              .holding-leg {
                animation: quadPull 3s ease-in-out infinite;
                transform-origin: 48px 48px;
              }
            `}</style>
            <line x1="20" y1="85" x2="80" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Standing Leg */}
            <path d="M52,50 L52,85" fill="none" stroke={bodyColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Torso & Head */}
            <path d="M52,50 L52,22" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            <circle cx="52" cy="14" r="7" fill="none" stroke={strokeColor} strokeWidth="4.5" />
            {/* Bent Leg being held with hand */}
            <g className="holding-leg">
              <path d="M52,50 L45,68 L48,53" fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M52,32 L40,48 L46,54" fill="none" stroke={bodyColor} strokeWidth="3" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'rec_calf_stretch':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes calfLean {
                0% { transform: translateX(0); }
                50% { transform: translateX(3px); }
                100% { transform: translateX(0); }
              }
              .calf-figure {
                animation: calfLean 3.5s ease-in-out infinite;
              }
            `}</style>
            {/* Wall and Ground */}
            <line x1="15" y1="85" x2="85" y2="85" stroke={floorColor} strokeWidth="3" />
            <line x1="75" y1="20" x2="75" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Stretching figure */}
            <g className="calf-figure">
              {/* Back leg (calf stretched) */}
              <path d="M36,83 L48,54" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" />
              {/* Front leg (bent) */}
              <path d="M56,83 L62,65 L48,54" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Torso & Head */}
              <path d="M48,54 L52,30" fill="none" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
              <circle cx="54" cy="22" r="7" fill="none" stroke={bodyColor} strokeWidth="4" />
              {/* Arms pushing against wall */}
              <path d="M52,36 L75,32" fill="none" stroke={strokeColor} strokeWidth="3.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'rec_hip_mobility':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes hipCircle {
                0% { transform: rotate(0deg) translate(0px, 0px); }
                25% { transform: rotate(90deg) translate(2px, 1px); }
                50% { transform: rotate(180deg) translate(0px, 2px); }
                75% { transform: rotate(270deg) translate(-2px, 1px); }
                100% { transform: rotate(360deg) translate(0px, 0px); }
              }
              .hip-joint {
                animation: hipCircle 3s linear infinite;
                transform-origin: 50px 55px;
              }
            `}</style>
            <line x1="20" y1="85" x2="80" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Upper body */}
            <circle cx="50" cy="22" r="7" fill="none" stroke={bodyColor} strokeWidth="4.5" />
            <path d="M50,29 L50,55" fill="none" stroke={bodyColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Moving Hip Ring and legs */}
            <g className="hip-joint">
              <ellipse cx="50" cy="55" rx="7" ry="3" fill="none" stroke={strokeColor} strokeWidth="3.5" />
              <path d="M44,55 L40,82" fill="none" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
              <path d="M56,55 L60,82" fill="none" stroke={bodyColor} strokeWidth="4.5" strokeLinecap="round" />
            </g>
          </svg>
        );

      case 'rec_spine_mobility':
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes catCow {
                0% { d: "M25,60 Q50,45 70,60"; } /* Cow (Curved Down) */
                50% { d: "M25,60 Q50,22 70,60"; } /* Cat (Curved Up) */
                100% { d: "M25,60 Q50,45 70,60"; }
              }
              .spine-line {
                animation: catCow 5s ease-in-out infinite;
              }
            `}</style>
            <line x1="15" y1="85" x2="85" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Arms & Legs (4 supports) */}
            <line x1="28" y1="60" x2="28" y2="84" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            <line x1="68" y1="60" x2="68" y2="84" stroke={bodyColor} strokeWidth="5" strokeLinecap="round" />
            {/* Flexing spine */}
            <path className="spine-line" d="M25,60 Q50,45 70,60" fill="none" stroke={strokeColor} strokeWidth="5" strokeLinecap="round" />
            {/* Head */}
            <circle cx="76" cy="55" r="6" fill="none" stroke={bodyColor} strokeWidth="4" />
          </svg>
        );

      case 'rec_light_walk':
      default:
        return (
          <svg className="w-48 h-48" viewBox="0 0 100 100">
            <style>{`
              @keyframes walkLegL {
                0% { transform: rotate(-20deg); }
                50% { transform: rotate(20deg); }
                100% { transform: rotate(-20deg); }
              }
              @keyframes walkLegR {
                0% { transform: rotate(20deg); }
                50% { transform: rotate(-20deg); }
                100% { transform: rotate(20deg); }
              }
              .leg-l {
                animation: walkLegL 1.6s ease-in-out infinite;
                transform-origin: 50px 52px;
              }
              .leg-r {
                animation: walkLegR 1.6s ease-in-out infinite;
                transform-origin: 50px 52px;
              }
            `}</style>
            <line x1="15" y1="85" x2="85" y2="85" stroke={floorColor} strokeWidth="3" />
            {/* Torso & Head */}
            <path d="M50,52 L50,28" fill="none" stroke={bodyColor} strokeWidth="5.5" strokeLinecap="round" />
            <circle cx="50" cy="18" r="7" fill="none" stroke={strokeColor} strokeWidth="4.5" />
            {/* Left Leg */}
            <path className="leg-l" d="M50,52 L42,83" fill="none" stroke={bodyColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Right Leg */}
            <path className="leg-r" d="M50,52 L58,83" fill="none" stroke={strokeColor} strokeWidth="5.5" strokeLinecap="round" />
            {/* Arms swinging */}
            <path d="M50,34 L38,50" fill="none" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50,34 L62,48" fill="none" stroke={bodyColor} strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        );
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col justify-between overflow-y-auto no-scrollbar max-w-md mx-auto shadow-2xl transition-colors duration-300 ${
      isLight ? 'bg-slate-50 text-slate-900' : 'bg-black text-slate-100'
    }`}>
      {/* 1. Header with details & close btn */}
      <div className={`px-5 py-4 flex items-center justify-between border-b ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-900 bg-[#050508]'
      }`}>
        <div>
          <h3 className="text-sm font-black font-display flex items-center gap-2 uppercase tracking-wider">
            <span className="text-xl filter drop-shadow">{activity.icon}</span>
            {activity.name}
          </h3>
          <p className="text-[10px] text-teal-500 font-mono font-bold tracking-wider uppercase">
            {activity.tag} · {activity.xp} XP RECOMPENSA
          </p>
        </div>
        <button
          onClick={onClose}
          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all active:scale-90 ${
            isLight
              ? 'bg-slate-100 border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300'
              : 'bg-slate-950 border-slate-900 text-slate-400 hover:text-white hover:border-teal-500/30'
          }`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Demonstration & Instructions */}
      <div className="flex-1 px-5 py-6 flex flex-col items-center justify-center space-y-6">
        <div className={`w-full flex items-center justify-between p-4 border rounded-3xl relative overflow-hidden ${
          isLight ? 'bg-teal-50/20 border-teal-100' : 'bg-[#030305] border-slate-900'
        }`}>
          {/* Atmospheric background glow */}
          <div className="absolute inset-0 bg-radial-gradient from-teal-500/5 to-transparent blur-xl pointer-events-none" />

          {/* Left info column */}
          <div className="flex flex-col space-y-5 justify-center z-10 select-none shrink-0 pr-2 border-r border-slate-900/40">
            {/* 1. Duration badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-teal-500/30 flex items-center justify-center shrink-0 bg-teal-950/20">
                <Clock className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col text-left">
                {activity.durationLabel ? (
                  activity.durationLabel.split(' ').map((word, idx) => (
                    <span key={idx} className="text-[9px] font-black font-mono tracking-widest leading-tight text-slate-300 uppercase">
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] font-black font-mono tracking-widest leading-tight text-slate-300 uppercase">
                    {activity.duration} SEG
                  </span>
                )}
              </div>
            </div>

            {/* 2. Focus badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-teal-500/30 flex items-center justify-center shrink-0 bg-teal-950/20">
                <RotateCw className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col text-left max-w-[85px]">
                {activity.focusLabel ? (
                  activity.focusLabel.split(' ').map((word, idx) => (
                    <span key={idx} className="text-[9px] font-black font-mono tracking-widest leading-tight text-slate-300 uppercase">
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] font-black font-mono tracking-widest leading-tight text-slate-300 uppercase">
                    ALONGAR
                  </span>
                )}
              </div>
            </div>

            {/* 3. Breath badge */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-teal-500/30 flex items-center justify-center shrink-0 bg-teal-950/20">
                <Wind className="w-4 h-4 text-teal-400" />
              </div>
              <div className="flex flex-col text-left max-w-[85px]">
                {activity.breathLabel ? (
                  activity.breathLabel.split(' ').map((word, idx) => (
                    <span key={idx} className="text-[9px] font-black font-mono tracking-widest leading-tight text-slate-300 uppercase">
                      {word}
                    </span>
                  ))
                ) : (
                  <span className="text-[9px] font-black font-mono tracking-widest leading-tight text-slate-300 uppercase">
                    RESPIRAR
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right image/animation column */}
          <div className="flex-1 flex justify-center items-center relative pl-3 z-10">
            {activity.image ? (
              <img
                src={activity.image}
                alt={activity.name}
                className="w-full max-h-48 object-contain select-none rounded-xl"
                referrerPolicy="no-referrer"
              />
            ) : (
              renderRecoveryAnimation()
            )}
          </div>
        </div>

        {/* Action card */}
        <div className={`w-full p-5 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-slate-950/40 border-slate-900'
        }`}>
          <div className="flex items-start gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-teal-400 shrink-0 mt-0.5 animate-pulse" />
            <div>
              <span className={`text-[9px] font-mono font-black text-teal-500 uppercase tracking-widest block leading-none mb-1`}>
                RECOMENDAÇÃO DO SISTEMA
              </span>
              <h4 className="text-[11px] font-black font-mono uppercase tracking-tight">
                Como executar corretamente:
              </h4>
            </div>
          </div>
          <p className={`text-[11px] font-mono leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {activity.instructions}
          </p>
        </div>

        {/* 3. Circular Interactive Timer */}
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={() => {
              if (timeLeft > 0) handleTogglePlay();
            }}
            disabled={timeLeft === 0}
            className={`relative w-36 h-36 flex items-center justify-center rounded-full bg-transparent border-0 outline-none select-none transition-all duration-300 ${
              timeLeft > 0 ? 'cursor-pointer hover:scale-[1.03] active:scale-95' : 'cursor-default'
            }`}
            title={isPlaying ? "Pausar" : "Iniciar"}
          >
            {/* SVG Timer Ring */}
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="transparent"
                stroke={isLight ? '#e2e8f0' : '#1e293b'}
                strokeWidth="6"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                fill="transparent"
                stroke={isLight ? '#0d9488' : '#2dd4bf'}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            {/* Inside Ring: Text representation of remaining time */}
            <div className="absolute flex flex-col items-center justify-center">
              {timeLeft === activity.duration && !isPlaying ? (
                <Play className="w-7 h-7 text-teal-400 fill-current animate-pulse mb-1" />
              ) : (
                <span className="text-3xl font-black font-mono tracking-tight">
                  {formatTime(timeLeft)}
                </span>
              )}
              <span className={`text-[9px] font-mono font-extrabold tracking-widest ${
                isPlaying ? 'text-teal-400 animate-pulse' : 'text-slate-500'
              }`}>
                {timeLeft === 0 ? 'CONCLUÍDO' : isPlaying ? 'EM PROGRESSO' : 'TOCAR P/ INICIAR'}
              </span>
            </div>
          </button>

          {/* Controls: If not started yet, show a clear prominent main button. If started/paused, show standard controls. */}
          {timeLeft === activity.duration && !isPlaying ? (
            <div className="flex flex-col items-center">
              <button
                id="btn-start-recovery-timer"
                onClick={() => setIsPlaying(true)}
                className={`px-8 py-3 bg-teal-500 hover:bg-teal-400 text-black font-mono text-xs font-black tracking-widest uppercase rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_20px_rgba(45,212,191,0.25)]`}
              >
                <Play className="w-4 h-4 fill-current text-black" />
                COMEÇAR CRONÔMETRO
              </button>
            </div>
          ) : (
            /* Micro controls */
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className={`p-2.5 rounded-xl border transition-all active:scale-95 ${
                  isLight
                    ? 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title="Reiniciar Cronômetro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={handleTogglePlay}
                disabled={timeLeft === 0}
                className={`px-6 py-2.5 rounded-xl border font-mono text-xs font-black tracking-widest uppercase flex items-center gap-2 transition-all active:scale-95 disabled:opacity-30 ${
                  isPlaying
                    ? (isLight ? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200' : 'bg-amber-950/40 border-amber-500/30 text-amber-400 hover:text-white')
                    : (isLight ? 'bg-teal-100 border-teal-300 text-teal-800 hover:bg-teal-200' : 'bg-teal-950/40 border-teal-500/30 text-teal-400 hover:text-white')
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Iniciar
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Complete Action Footer */}
      <div className={`p-5 border-t flex flex-col gap-2 ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-900 bg-[#050508]'
      }`}>
        <p className="text-[10px] text-center font-mono font-bold text-slate-500 uppercase tracking-wider mb-2">
          "A recuperação também faz parte da evolução."
        </p>
        <button
          onClick={onComplete}
          className={`w-full py-4 rounded-xl font-display text-xs font-black tracking-widest uppercase shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 ${
            isLight
              ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-[0_4px_14px_rgba(13,148,136,0.25)]'
              : 'bg-teal-500 hover:bg-teal-400 text-black shadow-[0_0_20px_rgba(45,212,191,0.3)]'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
          Concluir Atividade (+{activity.xp} XP)
        </button>
      </div>
    </div>
  );
};
