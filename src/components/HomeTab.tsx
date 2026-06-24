import React, { useState, useEffect } from 'react';
import { Exercise, GameState } from '../types';
import {
  Swords, Trophy, Target, Sparkles, Check, Play, Zap, Plus, Settings,
  Droplet, Flame, Shield, Heart, Brain, Edit2, RotateCcw, Award, Star,
  AlertTriangle, FlameKindling, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeTabProps {
  gameState: GameState;
  exercises: Exercise[];
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
  onUpdateGameState: (newState: GameState) => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  gameState,
  exercises,
  onStartExercise,
  scaledTarget,
  onUpdateGameState,
}) => {
  // Gracefully handle undefined fields from gameState
  const level = gameState.level;
  const xp = gameState.xp;
  const streak = gameState.streak;
  const str = gameState.str || 10;
  const agi = gameState.agi || 10;
  const sta = gameState.sta || 10;
  const int = gameState.int || 10;
  const waterIntake = gameState.waterIntake !== undefined ? gameState.waterIntake : 0;
  const waterGoal = gameState.waterGoal || 2000;
  const charClass = gameState.charClass || 'Caçador';
  const charName = gameState.charName || 'Mcfly';
  const statPoints = gameState.statPoints || 0;

  // Local settings toggle state
  const [showSettings, setShowSettings] = useState(false);
  const [tempName, setTempName] = useState(charName);
  const [selectedClass, setSelectedClass] = useState(charClass);

  const completedCount = gameState.completedToday.length;
  const totalCount = exercises.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activeQuests = exercises.filter((e) => !gameState.completedToday.includes(e.id));
  const completedQuests = exercises.filter((e) => gameState.completedToday.includes(e.id));

  // HP and Mana dynamic calculation
  // Starts at 50% HP and goes up 15% with each quest completed
  const currentHP = Math.min(100, 50 + completedCount * 15);
  // Starts at 40% MP and goes up 20% with each quest completed
  const currentMP = Math.min(100, 40 + completedCount * 20);
  const currentHydration = Math.min(100, Math.round((waterIntake / waterGoal) * 100));

  // Power Level and Rank calculation
  // Power Level = STR * 2 + STA * 2 + AGI * 3 + INT * 2
  const totalPower = str * 2 + sta * 2 + agi * 3 + int * 2;
  
  const getRank = (power: number) => {
    if (power < 100) return { name: 'E-RANK', badge: 'E', color: 'text-slate-400 border-slate-500 bg-slate-950/40' };
    if (power < 150) return { name: 'D-RANK', badge: 'D', color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40' };
    if (power < 220) return { name: 'C-RANK', badge: 'C', color: 'text-blue-400 border-blue-500 bg-blue-950/40' };
    if (power < 300) return { name: 'B-RANK', badge: 'B', color: 'text-purple-400 border-purple-500 bg-purple-950/40' };
    if (power < 400) return { name: 'A-RANK', badge: 'A', color: 'text-red-400 border-red-500 bg-red-950/40' };
    return { name: 'S-RANK', badge: 'S', color: 'text-amber-400 border-amber-500 bg-amber-950/40 animate-pulse font-black' };
  };

  const rank = getRank(totalPower);

  // Live Timer till Midnight
  const [countdown, setCountdown] = useState('06:00:00');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown('00:00:00');
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setCountdown(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Spend Stat Point function
  const spendStatPoint = (attribute: 'str' | 'agi' | 'sta' | 'int') => {
    if (statPoints <= 0) return;
    
    const updatedState = { ...gameState };
    updatedState.statPoints = (updatedState.statPoints || 0) - 1;
    
    if (attribute === 'str') updatedState.str = (updatedState.str || 10) + 1;
    else if (attribute === 'agi') updatedState.agi = (updatedState.agi || 10) + 1;
    else if (attribute === 'sta') updatedState.sta = (updatedState.sta || 10) + 1;
    else if (attribute === 'int') updatedState.int = (updatedState.int || 10) + 1;

    onUpdateGameState(updatedState);
  };

  // Add water log function
  const addWater = (amount: number) => {
    const updatedState = { ...gameState };
    const prevIntake = updatedState.waterIntake !== undefined ? updatedState.waterIntake : 0;
    updatedState.waterIntake = prevIntake + amount;
    onUpdateGameState(updatedState);
  };

  const resetWater = () => {
    const updatedState = { ...gameState };
    updatedState.waterIntake = 0;
    onUpdateGameState(updatedState);
  };

  const saveSettings = () => {
    const updatedState = { ...gameState };
    updatedState.charName = tempName.trim() || 'Mcfly';
    updatedState.charClass = selectedClass;
    onUpdateGameState(updatedState);
    setShowSettings(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      alert("A imagem selecionada é muito grande! Escolha uma imagem menor que 2.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64String = event.target?.result as string;
      const updatedState = { ...gameState, profilePic: base64String };
      onUpdateGameState(updatedState);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6 pb-12 cyber-grid min-h-screen">
      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        id="profile-pic-input"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* 1. TOP STATS BAR - SOLO LEVELING HUD PORTRAIT FRAME */}
      <div className="mx-4 mt-4 bg-gradient-to-b from-[#09080c] to-[#040406] border border-slate-900 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Glow behind Avatar */}
        <div className="absolute top-0 left-0 w-36 h-36 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Info Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-900">
          <div className="flex items-center gap-3.5">
            {/* Avatar Circle with Level Badge */}
            <div className="relative">
              <div 
                onClick={() => document.getElementById('profile-pic-input')?.click()}
                className="w-16 h-16 rounded-full bg-slate-950 border-2 border-purple-500/80 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0 overflow-hidden relative group cursor-pointer"
              >
                {gameState.profilePic ? (
                  <img src={gameState.profilePic} alt="Portrait" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <span className="select-none filter drop-shadow-[0_2px_8px_rgba(168,85,247,0.5)] text-3xl">👤</span>
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Edit2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#7c3aed] border border-slate-950 flex items-center justify-center font-mono font-black text-white text-xs shadow-[0_2px_8px_rgba(124,58,237,0.6)] z-10 pointer-events-none">
                {level}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono font-bold text-purple-400 tracking-wider uppercase">
                  Lv.{level} {charClass}
                </span>
                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-500/30 text-purple-300">
                  {rank.name}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight leading-tight mt-1 flex items-center gap-1.5">
                {charName || 'Mcfly'}
                <button 
                  onClick={() => {
                    setTempName(charName);
                    setSelectedClass(charClass);
                    setShowSettings(!showSettings);
                  }}
                  className="text-slate-500 hover:text-white transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </h2>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            {/* XP progress tag */}
            <span className="text-[10px] font-mono text-slate-500">
              XP {xp} / {level * 100}
            </span>
            {/* Streak Flame Badge */}
            <div className="bg-amber-950/30 border border-amber-500/30 rounded-full px-3 py-1 flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <span className="text-xs font-mono font-black text-amber-400">{streak} DIAS</span>
            </div>
          </div>
        </div>

        {/* Inline settings editor panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 p-4 rounded-2xl bg-slate-950/75 border border-purple-900/40 space-y-4 overflow-hidden"
            >
              <div>
                <label className="block text-[10px] font-mono font-extrabold tracking-widest text-slate-400 uppercase mb-1.5">
                  Nome do Caçador
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500 font-bold"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono font-extrabold tracking-widest text-slate-400 uppercase mb-1.5">
                  Selecione sua Classe de RPG
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Caçador', 'Arqueiro', 'Guerreiro', 'Mago', 'Assassino'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedClass(c)}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        selectedClass === c
                          ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                          : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-extrabold tracking-widest text-slate-400 uppercase mb-1.5">
                  Foto de Perfil (Galeria)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('profile-pic-input')?.click()}
                    className="flex-1 py-2 bg-[#0b0a0e] hover:bg-slate-900 border border-slate-800 rounded-xl text-xs text-purple-400 hover:text-purple-300 transition-all font-bold uppercase tracking-wider"
                  >
                    Selecionar da Galeria
                  </button>
                  {gameState.profilePic && (
                    <button
                      type="button"
                      onClick={() => {
                        const updatedState = { ...gameState };
                        delete updatedState.profilePic;
                        onUpdateGameState(updatedState);
                      }}
                      className="px-4 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-xl text-xs text-red-400 hover:text-red-300 transition-all font-bold"
                    >
                      Remover Foto
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveSettings}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white uppercase tracking-wider rounded-xl transition-all"
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-xs text-slate-400 hover:text-white rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HP, Mana & Hydration bars exactly styled as Solo Leveling HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* HP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-red-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                HP (VIGOR)
              </span>
              <span className="font-black text-slate-300">{currentHP}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 border border-slate-900 rounded-md p-[1px] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentHP}%` }}
                className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-sm shadow-[0_0_8px_rgba(239,68,68,0.4)]"
              />
            </div>
          </div>

          {/* MP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-blue-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-blue-400 text-blue-400" />
                MP (ENERGIA)
              </span>
              <span className="font-black text-slate-300">{currentMP}%</span>
            </div>
            <div className="w-full h-3 bg-slate-950 border border-slate-900 rounded-md p-[1px] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentMP}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-sky-400 rounded-sm shadow-[0_0_8px_rgba(59,130,246,0.4)]"
              />
            </div>
          </div>
        </div>

        {/* Three Circular Stats Rings - EXACTLY LIKE LEFT PHONE IN IMAGE 2 */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-900">
          {/* Stat 1: RANK Dial */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#050508] border-2 border-slate-800 flex items-center justify-center relative shadow-[inset_0_0_8px_rgba(255,255,255,0.03)]">
              {/* Inner ring circle path */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="transparent"
                  stroke={totalPower >= 200 ? '#eab308' : '#3b82f6'}
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - Math.min(1, totalPower / 400))}`}
                />
              </svg>
              <span className="text-lg font-black text-white font-mono tracking-tighter filter drop-shadow-[0_2px_6px_rgba(255,255,255,0.15)]">
                {rank.badge}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mt-2">Rank</span>
          </div>

          {/* Stat 2: LEVEL Dial */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#050508] border-2 border-slate-800 flex items-center justify-center relative shadow-[inset_0_0_8px_rgba(255,255,255,0.03)]">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="transparent"
                  stroke="#a855f7"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - xp / (level * 100))}`}
                />
              </svg>
              <span className="text-base font-black text-white font-mono">
                {level}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mt-2">Nível</span>
          </div>

          {/* Stat 3: Workouts Completed Dial */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#050508] border-2 border-slate-800 flex items-center justify-center relative shadow-[inset_0_0_8px_rgba(255,255,255,0.03)]">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  strokeDashoffset={`${2 * Math.PI * 24 * (1 - percentCompleted / 100)}`}
                />
              </svg>
              <span className="text-xs font-black text-white font-mono">
                {completedCount}<span className="text-[10px] text-slate-500 font-medium">/{totalCount}</span>
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase mt-2">Quest Hoje</span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC POWER LEVEL RATING RAMP - SOLO LEVELING TOTAL COMBAT RATING */}
      <div className="mx-4 bg-gradient-to-r from-[#07060a] via-[#0d0a14] to-[#07060a] border border-slate-900 rounded-2xl p-4 flex items-center justify-between shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-0.5">
          <span className="text-[10px] font-mono font-extrabold tracking-widest text-purple-400 uppercase">PODER TOTAL DO CAÇADOR</span>
          <p className="text-xs text-slate-400 font-medium">Desenvolva seus status treinando diariamente</p>
        </div>
        <div className="text-right">
          <motion.div
            key={totalPower}
            initial={{ scale: 0.95 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-extrabold font-display bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(245,158,11,0.25)] tracking-tight font-mono leading-none"
          >
            {totalPower}
          </motion.div>
          <span className="text-[9px] font-mono font-extrabold text-amber-500 tracking-wider">PODER DE COMBATE</span>
        </div>
      </div>

      {/* 3. QUEST INFO NEON CONTAINER - EXACTLY COMPLYING WITH IMAGE 2 AND IMAGE 5 CODES */}
      <div className="mx-4 bg-[#060609]/95 neon-border-blue rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Neon blue radial pulse background */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Quest Info Header Tag */}
        <div className="flex items-center justify-between mb-4 border-b border-sky-950/40 pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase neon-text-blue">
              QUEST INFO
            </span>
          </div>
          {/* Live countdown timer ticks down to midnight exactly as references show */}
          <div className="flex items-center gap-1.5 bg-sky-950/30 border border-sky-500/20 rounded-full px-3 py-1 font-mono text-xs font-black text-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
            {countdown}
          </div>
        </div>

        {/* Quest Arc title in display typography */}
        <h3 className="text-lg font-black text-white tracking-tight text-center sm:text-left hover:text-sky-300 transition-colors">
          Main Character Training Arc
        </h3>
        <p className="text-[11px] text-slate-500 font-mono text-center sm:text-left mt-0.5 mb-5">
          Desafie os seus limites e conquiste os monstros da arena diária
        </p>

        {/* Quest Items List - Interactive click to start */}
        <div className="space-y-3.5 my-4">
          {exercises.map((ex) => {
            const isCompleted = gameState.completedToday.includes(ex.id);
            const target = scaledTarget(ex);
            return (
              <div
                key={ex.id}
                onClick={() => !isCompleted && onStartExercise(ex.id)}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-950/10 border-emerald-500/20 opacity-50'
                    : 'bg-slate-950/60 border-slate-900 hover:border-sky-500/40 hover:bg-[#0c0c14]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xl ${
                    isCompleted ? 'bg-emerald-950/30 text-emerald-400' : 'bg-slate-900 border border-slate-800'
                  }`}>
                    {isCompleted ? '✓' : ex.icon}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-200'}`}>
                      {ex.name}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">
                      Meta: {target} {ex.unit} (1/2 séries)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-sky-400 bg-sky-950/20 border border-sky-500/10 px-2 py-0.5 rounded">
                    [{isCompleted ? target : 0} / {target}]
                  </span>
                  {!isCompleted && (
                    <button className="w-6 h-6 rounded bg-sky-950 hover:bg-sky-500 hover:text-slate-950 border border-sky-500/30 flex items-center justify-center transition-all text-sky-400">
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Orange Warning Box from Sung Jinwoo quest interface */}
        <div className="my-5 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/20 flex gap-2.5 items-start">
          <AlertTriangle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[11.5px] leading-relaxed text-amber-400 font-semibold font-mono uppercase">
            WARNING - O não cumprimento desta quest diária resultará em penalidade grave (Reset do seu multiplicador de streak!).
          </p>
        </div>

        {/* Big high-contrast action button */}
        {activeQuests.length > 0 ? (
          <button
            onClick={() => onStartExercise(activeQuests[0].id)}
            className="w-full py-3.5 bg-white hover:bg-slate-100 text-slate-950 font-black font-display text-sm tracking-widest uppercase rounded-xl transition-all shadow-[0_4px_20px_rgba(255,255,255,0.1)] active:scale-98 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            Iniciar Próxima Quest
          </button>
        ) : (
          <div className="w-full py-3 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 font-bold text-center rounded-xl text-xs uppercase tracking-wider">
            ✓ Todas as quests diárias concluídas!
          </div>
        )}
      </div>

      {/* 4. RPG HUNTER STATS SHEET CARD - IMAGE 3 */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-purple-400 uppercase block">AVALIAÇÃO DE SISTEMA</span>
            <h3 className="text-lg font-black text-white flex items-center gap-1.5 tracking-tight font-display">
              Hunter Stats
            </h3>
          </div>
          {statPoints > 0 && (
            <span className="px-3 py-1 bg-purple-500/15 border border-purple-500/40 text-purple-400 text-xs font-bold font-mono tracking-wider uppercase rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              +{statPoints} Pontos Livres!
            </span>
          )}
        </div>

        {/* Stats Grid exactly resembling image 3 style */}
        <div className="grid grid-cols-2 gap-3">
          {/* STR (Ataque) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">STR</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => spendStatPoint('str')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-red-950/30 flex items-center justify-center text-[10px] text-red-400">👊</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{str}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mt-1">Ataque (FOR)</span>
              {/* Progress visual bar */}
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${Math.min(100, str * 2)}%` }} />
              </div>
            </div>
          </div>

          {/* AGI (Agilidade) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">AGI</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => spendStatPoint('agi')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-amber-950/30 flex items-center justify-center text-[10px] text-amber-400">⚡</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{agi}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mt-1">Agilidade (AGI)</span>
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, agi * 2)}%` }} />
              </div>
            </div>
          </div>

          {/* STA (Defesa / Vigor) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">STA</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => spendStatPoint('sta')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-emerald-950/30 flex items-center justify-center text-[10px] text-emerald-400">🛡️</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{sta}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mt-1">Defesa (DES)</span>
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, sta * 2)}%` }} />
              </div>
            </div>
          </div>

          {/* INT (Sabedoria / Inteligência) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">INT</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => spendStatPoint('int')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-blue-950/30 flex items-center justify-center text-[10px] text-blue-400">🧠</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{int}</span>
              <span className="text-[10px] text-slate-500 font-mono uppercase block mt-1">Sabedoria (SAB)</span>
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, int * 2)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10.5px] text-slate-500 font-mono leading-relaxed text-center pt-2">
          💡 Treinos aumentam os seus status de caçador dinamicamente!
        </p>
      </div>

      {/* 5. WATER INTAKE TRACKER - FROM THE PRECISE IMAGE 4 DESIGN LAYOUT */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-cyan-400 uppercase block">META DIÁRIA</span>
            <h3 className="text-base font-black text-white font-display">Controle de Hidratação</h3>
          </div>
          <span className="text-base font-mono font-black text-cyan-400">
            {waterIntake} <span className="text-slate-500 text-xs">/ {waterGoal} ml</span>
          </span>
        </div>

        {/* Water alert banner matching Image 4 text and tone */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
          waterIntake >= waterGoal
            ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
            : 'bg-slate-950/50 border-slate-900 text-slate-400'
        }`}>
          <div className="space-y-1 max-w-[200px]">
            <span className="text-xs font-bold text-white block">
              {waterIntake >= waterGoal ? '🎉 Hidratação Concluída!' : 'Você não bateu sua meta de beber água!'}
            </span>
            <span className="text-[10.5px] leading-snug block text-slate-400">
              {waterIntake >= waterGoal 
                ? 'Excelente! Seu guerreiro está pronto com hidratação de 100%.'
                : 'Mantenha-se hidratado e viva mais saudável para evoluir seus poderes.'}
            </span>
          </div>
          <div className="w-12 h-12 shrink-0 flex items-center justify-center text-3xl filter drop-shadow-[0_2px_8px_rgba(6,182,212,0.4)]">
            💧
          </div>
        </div>

        {/* Action log buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => addWater(250)}
            className="flex-1 py-2.5 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> 250 ml
          </button>
          <button
            onClick={() => addWater(500)}
            className="flex-1 py-2.5 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-500/50 text-cyan-400 text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> 500 ml
          </button>
          <button
            onClick={resetWater}
            title="Resetar contador"
            className="px-3 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-500 hover:text-slate-300 rounded-xl transition-all active:scale-95 flex items-center justify-center"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
