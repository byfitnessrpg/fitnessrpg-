import React, { useState, useEffect } from 'react';
import { Exercise, GameState } from '../types';
import {
  Swords, Trophy, Target, Sparkles, Check, Play, Zap, Plus, Settings,
  Droplet, Flame, Shield, Heart, Brain, Edit2, RotateCcw, Award, Star,
  AlertTriangle, FlameKindling, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { OATH_OPTIONS } from '../App';
import { ExerciseIcon } from './ExerciseIcon';

import neckStretchImg from '../assets/images/shredded_neck_stretch_1782592687377.jpg';
import shoulderChestImg from '../assets/images/shredded_shoulder_chest_1782592699484.jpg';
import armsStretchImg from '../assets/images/shredded_arms_stretch_1782592709605.jpg';
import backStretchImg from '../assets/images/shredded_back_stretch_1782592719951.jpg';
import hamstringStretchImg from '../assets/images/shredded_hamstrings_1782592730225.jpg';
import quadricepsStretchImg from '../assets/images/shredded_quadriceps_1782592741631.jpg';
import calfStretchImg from '../assets/images/shredded_calf_stretch_1782592750411.jpg';
import hipMobilityImg from '../assets/images/shredded_hip_mobility_1782592761420.jpg';
import spineMobilityImg from '../assets/images/shredded_spine_mobility_1782592774581.jpg';
import walkExerciseImg from '../assets/images/shredded_walk_1782592784972.jpg';

export const RECOVERY_ACTIVITIES = [
  {
    id: 'rec_neck_stretch',
    name: 'Alongamento de Pescoço',
    desc: 'Alivie a tensão acumulada na região cervical com movimentos suaves.',
    instructions: 'Incline a cabeça aproximando a orelha esquerda do ombro esquerdo. Segure suavemente por 15 segundos. Repita para o lado direito. Em seguida, gire a cabeça em movimentos lentos circulares.',
    icon: '🧘‍♀️',
    xp: 15,
    duration: 30,
    tag: 'OPCIONAL',
    durationLabel: '15 SEGUNDOS',
    focusLabel: 'AMBOS OS LADOS',
    breathLabel: 'RESPIRE SUAVEMENTE',
    image: neckStretchImg
  },
  {
    id: 'rec_shoulder_chest',
    name: 'Alongamento de Ombros e Peito',
    desc: 'Abra o tórax e libere a articulação dos ombros para melhorar a postura.',
    instructions: 'Entrelace os dedos atrás das costas, estenda os braços e eleve-os suavemente até sentir o peito alongar. Mantenha os ombros relaxados e respire fundo.',
    icon: '🙆‍♂️',
    xp: 15,
    duration: 30,
    tag: 'OPCIONAL',
    durationLabel: '15 SEGUNDOS',
    focusLabel: 'AMBOS OS LADOS',
    breathLabel: 'RESPIRE FUNDO',
    image: shoulderChestImg
  },
  {
    id: 'rec_arms_stretch',
    name: 'Alongamento de Braços',
    desc: 'Alongue os tríceps e antebraços, aliviando o cansaço dos membros superiores.',
    instructions: 'Cruze um braço à frente do corpo e apoie-o com a outra mão na altura do cotovelo, pressionando-o levemente contra o peito por 15 segundos. Troque de braço.',
    icon: '💪',
    xp: 15,
    duration: 30,
    tag: 'OPCIONAL',
    durationLabel: '15 SEGUNDOS',
    focusLabel: 'EM FRENTE DO CORPO',
    breathLabel: 'MANTENHA A POSTURA RETA',
    image: armsStretchImg
  },
  {
    id: 'rec_back_stretch',
    name: 'Alongamento de Costas',
    desc: 'Alivie a pressão sobre a lombar e a musculatura dorsal média.',
    instructions: 'Estenda os braços à frente, entrelace as mãos e empurde para frente enquanto projeta as costas para trás de forma suave, relaxando os ombros e a cabeça.',
    icon: '🧘',
    xp: 15,
    duration: 30,
    tag: 'OPCIONAL',
    durationLabel: '15 SEGUNDOS',
    focusLabel: 'EM FRENTE AO CORPO',
    breathLabel: 'RELAXE A CABEÇA',
    image: backStretchImg
  },
  {
    id: 'rec_hamstrings',
    name: 'Alongamento de Posteriores da Coxa',
    desc: 'Solta a cadeia posterior das pernas e previne dores e rigidez lombar.',
    instructions: 'Fique em pé ou sentado. Mantenha uma perna estendida à frente e flexione o quadril tentando aproximar as mãos da ponta do pé ou tornozelo. Não balance ou force.',
    icon: '🦵',
    xp: 20,
    duration: 40,
    tag: 'OPCIONAL',
    durationLabel: '20 SEGUNDOS',
    focusLabel: 'FLEXIONE O QUADRIL',
    breathLabel: 'MANTENHA AS COSTAS ALINHADAS E RESPIRAÇÃO CONSTANTE',
    image: hamstringStretchImg
  },
  {
    id: 'rec_quadriceps',
    name: 'Alongamento de Quadríceps',
    desc: 'Alongue a musculatura anterior da coxa, reduzindo sobrecarga nos joelhos.',
    instructions: 'Apoie-se se necessário. Flexione um joelho para trás, segure o tornozelo com a mão e puxe-o suavemente em direção ao glúteo. Mantenha os joelhos alinhados.',
    icon: '🧍',
    xp: 15,
    duration: 40,
    tag: 'OPCIONAL',
    durationLabel: '20 SEGUNDOS',
    focusLabel: 'FLEXIONE 1 JOELHO',
    breathLabel: 'APOIE-SE SE NECESSÁRIO. MANTENHA OS JOELHOS ALINHADOS E O QUADRIL ESTÁVEL',
    image: quadricepsStretchImg
  },
  {
    id: 'rec_calf_stretch',
    name: 'Alongamento de Panturrilhas',
    desc: 'Reduz a rigidez e previne dores nas pernas, melhorando a flexibilidade.',
    instructions: 'Fique de frente para uma parede. Apoie as mãos, dê um passo para trás com uma perna, apoie todo o calcanhar traseiro no chão e incline o quadril para frente.',
    icon: '👣',
    xp: 15,
    duration: 40,
    tag: 'OPCIONAL',
    durationLabel: '20 SEGUNDOS',
    focusLabel: 'APOIO COM AS MÃOS',
    breathLabel: 'MANTENHA O CALCANHAR TRASEIRO NO CHÃO E INCLINE O QUADRIL PARA FRENTE',
    image: calfStretchImg
  },
  {
    id: 'rec_hip_mobility',
    name: 'Mobilidade de Quadril',
    desc: 'Aumente a amplitude de movimento do quadril e relaxe as articulações.',
    instructions: 'Em pé com as mãos na cintura, faça movimentos circulares amplos com o quadril. Faça 10 giros suaves para o lado direito e 10 giros para o lado esquerdo.',
    icon: '🔄',
    xp: 20,
    duration: 20,
    tag: 'OPCIONAL',
    durationLabel: '20 SEGUNDOS',
    focusLabel: 'EM PÉ COM AS MÃOS NA CINTURA',
    breathLabel: 'MANTENHA O TRONCO ESTÁVEL E FAÇA MOVIMENTOS CIRCULARES CONTROLADOS',
    image: hipMobilityImg
  },
  {
    id: 'rec_spine_mobility',
    name: 'Mobilidade de Coluna',
    desc: 'Excelente para lubrificar as vértebras e aliviar dores na coluna inteira.',
    instructions: 'Em quatro apoios (mãos e joelhos no chão). Inspire curvando as costas para baixo e olhando para cima (vaca). Solte o ar curvando as costas para cima (gato).',
    icon: '🐈',
    xp: 20,
    duration: 20,
    tag: 'OPCIONAL',
    durationLabel: '20 SEGUNDOS',
    focusLabel: 'EM QUATRO APOIOS (MÃOS E JOELHOS)',
    breathLabel: 'INSPIRE CURVANDO AS COSTAS PARA BAIXO E OLHE PARA CIMA (VACA). SOLTE O AR CURVANDO AS COSTAS PARA CIMA (GATO).',
    image: spineMobilityImg
  },
  {
    id: 'rec_light_walk',
    name: 'Caminhada Leve (Opcional)',
    desc: 'Caminhada de 15-20 minutos para manter a circulação ativa e recuperar tecidos.',
    instructions: 'Caminhe ao ar livre ou em uma esteira em ritmo descontraído e constante. Respire profundamente pelo nariz e relaxe os braços e ombros.',
    icon: '🚶',
    xp: 30,
    duration: 1800,
    tag: 'OPCIONAL',
    durationLabel: '30 MINUTOS',
    focusLabel: 'RESPIRAÇÃO PROFUNDA E RITMO CONSTANTE',
    breathLabel: 'FOQUE NO PRESENTE E MANTENHA A POSTURA CORRETA',
    image: walkExerciseImg
  }
];

interface HomeTabProps {
  gameState: GameState;
  exercises: Exercise[];
  onStartExercise: (id: string) => void;
  scaledTarget: (ex: Exercise) => number;
  onUpdateGameState: (newState: GameState) => void;
  onCompleteRecoveryActivity?: (activityId: string, xpReward: number, name: string) => void;
  onStartRecoveryActivity?: (activityId: string) => void;
  theme?: 'dark' | 'light';
}

export const HomeTab: React.FC<HomeTabProps> = ({
  gameState,
  exercises,
  onStartExercise,
  scaledTarget,
  onUpdateGameState,
  onCompleteRecoveryActivity,
  onStartRecoveryActivity,
  theme = 'dark',
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
  const charClass = gameState.charClass || 'Calistenia';
  const charName = gameState.charName || 'Atleta';
  const statPoints = gameState.statPoints || 0;

  // Rest day detection based on Cronograma
  const DAYS_MAP = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
  const todayAbbrev = DAYS_MAP[new Date().getDay()];
  const isTrainingDay = !gameState.cronograma_dias || gameState.cronograma_dias.includes(todayAbbrev);

  // Local settings toggle state
  const [showSettings, setShowSettings] = useState(false);
  const [tempName, setTempName] = useState(charName);
  const [selectedClass, setSelectedClass] = useState(charClass);

  const completedCount = isTrainingDay 
    ? gameState.completedToday.length 
    : (gameState.completedRecoveryToday || []).length;
  const totalCount = isTrainingDay 
    ? exercises.length 
    : RECOVERY_ACTIVITIES.length;
  const percentCompleted = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const activeQuests = isTrainingDay 
    ? exercises.filter((e) => !gameState.completedToday.includes(e.id)) 
    : RECOVERY_ACTIVITIES.filter((r) => !(gameState.completedRecoveryToday || []).includes(r.id));
  const completedQuests = isTrainingDay 
    ? exercises.filter((e) => gameState.completedToday.includes(e.id)) 
    : RECOVERY_ACTIVITIES.filter((r) => (gameState.completedRecoveryToday || []).includes(r.id));

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
    if (power < 100) return { name: 'E-RANK', badge: 'E', color: 'text-red-500 border-red-500 bg-red-950/40 shadow-[0_0_10px_rgba(220,38,38,0.3)] font-black' };
    if (power < 150) return { name: 'D-RANK', badge: 'D', color: 'text-emerald-400 border-emerald-500 bg-emerald-950/40' };
    if (power < 220) return { name: 'C-RANK', badge: 'C', color: 'text-blue-400 border-blue-500 bg-blue-950/40' };
    if (power < 300) return { name: 'B-RANK', badge: 'B', color: 'text-purple-400 border-purple-500 bg-purple-950/40' };
    if (power < 400) return { name: 'A-RANK', badge: 'A', color: 'text-red-400 border-red-500 bg-red-950/40' };
    return { name: 'S-RANK', badge: 'S', color: 'text-amber-400 border-amber-500 bg-amber-950/40 animate-pulse font-black' };
  };

  const rank = getRank(totalPower);
  const activeOath = OATH_OPTIONS.find((opt) => opt.id === gameState.chosenOath);

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
    
    const waterGoal = gameState.waterGoal || 2000;
    if (prevIntake < waterGoal && updatedState.waterIntake >= waterGoal && gameState.notificacoes_ativas) {
      import('../lib/notificationEngine').then(({ getIntelligentMessage }) => {
        import('../lib/notifications').then(({ triggerTestNotification }) => {
          const { title, body } = getIntelligentMessage('missao_concluida');
          triggerTestNotification(title, body);
        });
      });
    }

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

  const isLight = theme === 'light';

  return (
    <div className={`space-y-6 pb-12 min-h-screen transition-colors duration-300 ${
      isLight 
        ? 'cyber-grid-light bg-slate-50 text-slate-800' 
        : 'cyber-grid bg-[#08070c] text-slate-100'
    }`}>
      {/* Hidden file input for gallery upload */}
      <input
        type="file"
        id="profile-pic-input"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* 1. TOP STATS BAR - SOLO LEVELING HUD PORTRAIT FRAME */}
      <div className={`mx-4 mt-4 border rounded-3xl p-6 shadow-2xl relative overflow-hidden transition-all duration-300 ${
        isLight 
          ? 'bg-white border-slate-200/80 shadow-md' 
          : 'bg-gradient-to-b from-[#050508] to-[#000000] border-slate-900 shadow-2xl'
      }`}>
        {/* Glow behind Avatar */}
        <div className={`absolute top-0 left-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-sky-500/5' : 'bg-sky-500/10'
        }`} />
        <div className={`absolute top-0 right-0 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
          isLight ? 'bg-blue-500/5' : 'bg-blue-500/10'
        }`} />

        <div className="flex flex-col items-center justify-center text-center pb-5">
          {/* Avatar / Portrait container in a sleek rounded rectangle with double-line neon blue border */}
          <div className="relative mb-3 group cursor-pointer" onClick={() => document.getElementById('profile-pic-input')?.click()}>
            <div className={`w-24 h-24 rounded-2xl border-2 p-0.5 relative overflow-hidden flex items-center justify-center transition-all ${
              isLight
                ? 'bg-white border-sky-500 shadow-[0_4px_15px_rgba(14,165,233,0.2)]'
                : 'bg-gradient-to-b from-slate-950 to-slate-900 border-2 border-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.35)]'
            }`}>
              {gameState.profilePic ? (
                <img src={gameState.profilePic} alt="Portrait" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" crossOrigin="anonymous" />
              ) : (
                <span className="select-none text-4xl filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.5)]">👤</span>
              )}
              {/* Hover Edit Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-xl">
                <Edit2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Level Badge placed at bottom corner */}
            <div className={`absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full flex items-center justify-center font-mono font-black text-xs shadow-lg transition-colors ${
              isLight 
                ? 'bg-slate-950 text-white border-slate-800' 
                : 'bg-white text-black border-slate-950'
            }`}>
              {level}
            </div>
          </div>

          {/* Name Display */}
          <h2 className={`text-xl font-extrabold tracking-widest flex items-center gap-2 leading-none transition-colors ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            {charName ? charName.toUpperCase() : 'JUNG SINWOO'}
            <button 
              onClick={() => {
                setTempName(charName);
                setSelectedClass(charClass);
                setShowSettings(!showSettings);
              }}
              className="text-slate-500 hover:text-sky-400 transition-colors"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </h2>
          <span className={`text-[10px] font-mono uppercase tracking-widest mt-1 block font-bold transition-colors ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`}>
            @{charName ? charName.toLowerCase().replace(/\s+/g, '') : 'jungsinwoo'}
          </span>
        </div>

        {/* Inline settings editor panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className={`mb-5 p-4 rounded-2xl border space-y-4 overflow-hidden shadow-xl transition-all ${
                isLight 
                  ? 'bg-white border-sky-400 text-slate-800' 
                  : 'bg-slate-950/95 border border-sky-500/30'
              }`}
            >
              <div>
                <label className={`block text-[10px] font-mono font-extrabold tracking-widest uppercase mb-1.5 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Nome de Perfil
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className={`w-full rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-sky-500 font-bold transition-all ${
                    isLight 
                      ? 'bg-slate-50 border border-slate-200 text-slate-950' 
                      : 'bg-slate-900 border border-slate-800 text-white'
                  }`}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className={`block text-[10px] font-mono font-extrabold tracking-widest uppercase mb-1.5 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Foco de Treino Principal
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Calistenia', 'Cardio', 'Força', 'Resistência', 'Foco & Core'].map((c) => {
                    const isSelected = selectedClass === c;
                    return (
                      <button
                        key={c}
                        onClick={() => setSelectedClass(c)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                          isSelected
                            ? (isLight ? 'bg-sky-50 border-sky-400 text-sky-600' : 'bg-sky-950/40 border-sky-500 text-sky-300')
                            : (isLight ? 'bg-white border-slate-200 text-slate-500 hover:text-slate-800' : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-white')
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className={`block text-[10px] font-mono font-extrabold tracking-widest uppercase mb-1.5 ${
                  isLight ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  Foto de Perfil (Galeria)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => document.getElementById('profile-pic-input')?.click()}
                    className={`flex-1 py-2 border rounded-xl text-xs transition-all font-bold uppercase tracking-wider ${
                      isLight 
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-sky-600' 
                        : 'bg-black hover:bg-slate-900 border border-slate-800 text-sky-400 hover:text-sky-300'
                    }`}
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
                      className={`px-4 py-2 border rounded-xl text-xs transition-all font-bold ${
                        isLight
                          ? 'bg-red-50 hover:bg-red-100 border-red-200 text-red-600'
                          : 'bg-red-950/20 hover:bg-red-950/40 border-red-900/30 text-red-400 hover:text-red-300'
                      }`}
                    >
                      Remover Foto
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveSettings}
                  className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
                    isLight 
                      ? 'bg-slate-900 hover:bg-slate-800 text-white' 
                      : 'bg-white hover:bg-slate-200 text-black'
                  }`}
                >
                  Salvar Alterações
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`px-4 py-2 text-xs rounded-xl transition-all ${
                    isLight 
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-500' 
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HP, Mana & Hydration bars exactly styled as Solo Leveling HUD */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* HP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="font-bold text-sky-500 flex items-center gap-1.5 uppercase tracking-wider">
                <Heart className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
                VIGOR FÍSICO
              </span>
              <span className={`font-black transition-colors ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{currentHP}%</span>
            </div>
            <div className={`w-full h-3 rounded-md p-[1px] overflow-hidden border transition-all ${
              isLight ? 'bg-slate-100 border-slate-200/80' : 'bg-slate-950 border-slate-900'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentHP}%` }}
                className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.4)]"
              />
            </div>
          </div>

          {/* MP Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
                RESERVA DE ENERGIA
              </span>
              <span className={`font-black transition-colors ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{currentMP}%</span>
            </div>
            <div className={`w-full h-3 rounded-md p-[1px] overflow-hidden border transition-all ${
              isLight ? 'bg-slate-100 border-slate-200/80' : 'bg-slate-950 border-slate-900'
            }`}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${currentMP}%` }}
                className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-sm shadow-[0_0_8px_rgba(14,165,233,0.4)]"
              />
            </div>
          </div>
        </div>

        {/* S-Rank circle dial system */}
        <div className={`grid grid-cols-3 gap-3 mt-6 pt-5 border-t transition-colors ${
          isLight ? 'border-slate-100' : 'border-slate-900/60'
        }`}>
          {/* Stat 1: RANK Dial */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center relative shadow-[0_2px_10px_rgba(14,165,233,0.15)] border-2 transition-all ${
              isLight 
                ? 'bg-white border-sky-500 text-slate-950 shadow-[0_3px_12px_rgba(14,165,233,0.15)]' 
                : 'bg-black border-2 border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.25)] text-white'
            }`}>
              <span className={`text-xl font-black font-mono tracking-tighter ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {rank.badge}
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase mt-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Rank</span>
          </div>

          {/* Stat 2: LEVEL Dial */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full border border-dashed flex items-center justify-center relative transition-all ${
              isLight 
                ? 'bg-slate-50 border-sky-400/60 shadow-[0_2px_8px_rgba(14,165,233,0.08)]' 
                : 'bg-[#050508] border-sky-400/60 shadow-[0_0_10px_rgba(14,165,233,0.15)]'
            }`}>
              <span className={`text-lg font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {level}
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase mt-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Nível</span>
          </div>

          {/* Stat 3: Workouts Completed Dial */}
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-full border border-dashed flex items-center justify-center relative transition-all ${
              isLight 
                ? 'bg-slate-50 border-sky-400/60 shadow-[0_2px_8px_rgba(14,165,233,0.08)]' 
                : 'bg-[#050508] border-sky-400/60 shadow-[0_0_10px_rgba(14,165,233,0.15)]'
            }`}>
              <span className={`text-base font-black font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {completedCount}
              </span>
            </div>
            <span className={`text-[10px] font-mono font-bold uppercase mt-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Treinos</span>
          </div>
        </div>

        {/* Character Information Sheets List Card */}
        <div className={`border rounded-2xl p-4.5 mt-5 space-y-3 font-mono text-xs transition-colors duration-300 ${
          isLight ? 'bg-slate-50/50 border-slate-200/60 text-slate-800' : 'bg-black/40 border border-slate-900/80 text-slate-300'
        }`}>
          <div className={`flex justify-between items-center pb-2 border-b ${isLight ? 'border-slate-200/60' : 'border-slate-900/40'}`}>
            <span className="text-slate-500">Foco:</span>
            <span className={`font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>{charClass}</span>
          </div>
          <div className={`flex justify-between items-center pb-2 border-b ${isLight ? 'border-slate-200/60' : 'border-slate-900/40'}`}>
            <span className="text-slate-500">Categoria:</span>
            <span className="text-sky-500 font-extrabold uppercase tracking-wider">
              {level >= 20 ? 'ATLETA ELITE' : level >= 10 ? 'ATLETA AVANÇADO' : level >= 5 ? 'ATLETA CONSISTENTE' : 'PRATICANTE'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">ID:</span>
            <span className="text-slate-400 tracking-widest text-[9px] font-black">■■■■■■■■■</span>
          </div>
        </div>
      </div>

      {/* 3. QUEST INFO NEON CONTAINER - EXACTLY COMPLYING WITH IMAGE 2 AND IMAGE 5 CODES */}
      <div className={`mx-4 border-2 rounded-3xl p-6 relative overflow-hidden transition-all duration-300 ${
        isLight 
          ? 'bg-white border-sky-500 shadow-[0_4px_25px_rgba(14,165,233,0.15)]' 
          : 'bg-black border-2 border-sky-400 shadow-[0_0_25px_rgba(14,165,233,0.3)]'
      }`}>
        {/* Neon blue radial pulse background */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Quest Info Header Tag */}
        <div className={`flex items-center justify-between mb-4 border-b pb-3 transition-colors ${
          isLight ? 'border-slate-200/80' : 'border-slate-900'
        }`}>
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-500 animate-pulse" />
            <span className={`text-sm font-black tracking-widest uppercase font-display ${
              isLight ? 'text-slate-800' : 'text-white'
            }`}>
              {isTrainingDay ? '💪 TREINO PROGRAMADO' : '🛌 RECUPERAÇÃO ATIVA'}
            </span>
          </div>
          {/* Live countdown timer */}
          <div className={`font-mono text-xs font-black px-2.5 py-1 tracking-wider border rounded transition-all ${
            isLight 
              ? 'text-sky-600 bg-sky-50 border-sky-200' 
              : 'text-sky-400 bg-sky-950/20 border-sky-500/20'
          }`}>
            {countdown}
          </div>
        </div>

        {/* Quest Arc title in display typography */}
        <h3 className={`text-base font-black tracking-widest uppercase font-mono ${
          isLight ? 'text-slate-950' : 'text-white'
        }`}>
          {isTrainingDay ? `Treino de ${charName}` : `Recuperação de ${charName}`}
        </h3>
        <p className={`text-[10px] font-mono mt-1 mb-5 uppercase tracking-wide ${
          isLight ? 'text-slate-400 font-bold' : 'text-slate-500'
        }`}>
          {isTrainingDay ? 'SISTEMA ATIVO DE TREINO DIÁRIO' : 'SISTEMA ATIVO DE REGENERAÇÃO'}
        </p>

        {/* Quest Items List - Interactive click to start */}
        {!isTrainingDay && (
          <div className={`p-4.5 rounded-xl mb-4.5 border transition-all flex flex-col gap-2 ${
            isLight 
              ? 'bg-teal-50/60 border-teal-300 text-teal-900' 
              : 'bg-gradient-to-r from-teal-950/20 via-[#07060a] to-[#07060a] border-teal-500/20 text-slate-300'
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-xl filter drop-shadow-[0_2px_8px_rgba(20,184,166,0.3)]">🏕️</span>
              <div>
                <span className="text-[10px] font-mono font-black text-teal-500 uppercase tracking-widest block leading-none">RECOMENDAÇÃO DO SISTEMA</span>
                <span className={`text-xs font-black font-display uppercase tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>MISSÃO DE RECUPERAÇÃO (OPCIONAL)</span>
              </div>
            </div>
            <p className="text-[10.5px] font-mono leading-relaxed text-slate-400">
              Hoje é seu dia de descanso. Seu corpo evolui durante a recuperação. Se desejar, realize algumas atividades leves para acelerar sua recuperação e chegar mais preparado ao próximo treino.
            </p>
          </div>
        )}

        {/* Quest Items List */}
        <div className="space-y-2.5 my-4 font-mono text-xs">
          {isTrainingDay ? (
            exercises.map((ex) => {
              const isCompleted = gameState.completedToday.includes(ex.id);
              const target = scaledTarget(ex);
              return (
                <div
                  key={ex.id}
                  onClick={() => !isCompleted && onStartExercise(ex.id)}
                  className={`flex items-center justify-between py-2 px-3 border transition-all cursor-pointer rounded-lg ${
                    isCompleted
                      ? (isLight ? 'bg-emerald-50 border-emerald-200/60 opacity-50' : 'bg-emerald-950/10 border-emerald-500/10 opacity-40')
                      : (isLight ? 'bg-slate-50/80 border-slate-200 hover:border-sky-400/40 hover:bg-sky-50/25' : 'bg-[#07070a] border-slate-900 hover:border-sky-500/40 hover:bg-slate-950')
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <ExerciseIcon pose={ex.pose} size="sm" theme={theme} />
                    <span className={`font-black tracking-wider ${
                      isCompleted 
                        ? (isLight ? 'text-slate-400 line-through' : 'text-slate-500 line-through') 
                        : (isLight ? 'text-slate-800' : 'text-white')
                    }`}>
                      {ex.name.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[11px] ${
                      isCompleted 
                        ? (isLight ? 'text-emerald-600 font-bold' : 'text-emerald-500') 
                        : (isLight ? 'text-sky-600 font-extrabold' : 'text-sky-400')
                    }`}>
                      [{isCompleted ? target : 0}/{target}]
                    </span>
                    {!isCompleted && (
                      <button className={`w-5 h-5 rounded flex items-center justify-center transition-all border ${
                        isLight 
                          ? 'bg-sky-50 hover:bg-sky-500 hover:text-white hover:border-sky-500 text-sky-600 border-sky-200 shadow-sm' 
                          : 'bg-sky-950 text-sky-400 border-sky-500/20 hover:bg-sky-500 hover:text-black hover:border-sky-500'
                      }`}>
                        <Play className="w-2.5 h-2.5 fill-current" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            RECOVERY_ACTIVITIES.map((rec) => {
              const isCompleted = (gameState.completedRecoveryToday || []).includes(rec.id);
              return (
                <div
                  key={rec.id}
                  onClick={() => !isCompleted && onStartRecoveryActivity?.(rec.id)}
                  className={`flex items-center justify-between py-2.5 px-3 border transition-all cursor-pointer rounded-lg ${
                    isCompleted
                      ? (isLight ? 'bg-teal-50/40 border-teal-200/60 opacity-50' : 'bg-teal-950/10 border-teal-500/10 opacity-40')
                      : (isLight ? 'bg-slate-50/80 border-slate-200 hover:border-teal-400/40 hover:bg-teal-50/25' : 'bg-[#07070a] border-slate-900 hover:border-teal-500/40 hover:bg-slate-950')
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-xl w-6 text-center filter drop-shadow-[0_1px_4px_rgba(0,0,0,0.2)]">
                      {rec.icon}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className={`font-black tracking-wider text-[11px] truncate ${
                        isCompleted 
                          ? (isLight ? 'text-slate-400 line-through' : 'text-slate-500 line-through') 
                          : (isLight ? 'text-slate-800' : 'text-white')
                      }`}>
                        {rec.name.toUpperCase()}
                      </span>
                      <span className={`text-[9px] leading-tight font-medium font-mono truncate max-w-[190px] md:max-w-[400px] ${
                        isCompleted 
                          ? 'text-slate-500/80' 
                          : (isLight ? 'text-slate-400 font-bold' : 'text-slate-500')
                      }`}>
                        {rec.desc}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-mono text-[10px] font-bold ${
                      isCompleted 
                        ? 'text-teal-500' 
                        : (isLight ? 'text-slate-500' : 'text-slate-400')
                    }`}>
                      {isCompleted ? '✓ CONCLUÍDO' : `+${rec.xp} XP`}
                    </span>
                    {!isCompleted && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartRecoveryActivity?.(rec.id);
                        }}
                        className={`px-2 py-1 text-[9px] font-bold uppercase rounded flex items-center gap-1 transition-all border ${
                          isLight 
                            ? 'bg-teal-50 hover:bg-teal-500 hover:text-white hover:border-teal-500 text-teal-600 border-teal-200 shadow-sm' 
                            : 'bg-teal-950/40 text-teal-400 border-teal-500/20 hover:bg-teal-500 hover:text-black hover:border-teal-500'
                        }`}
                      >
                        <Play className="w-2 h-2 fill-current" />
                        Executar
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Warning / System Note Box */}
        {isTrainingDay ? (
          <div className={`my-5 p-4 rounded-xl flex gap-2.5 items-start border transition-colors ${
            isLight 
              ? 'bg-red-50 border-red-200 text-red-700' 
              : 'bg-red-950/15 border border-red-500/25 text-red-400'
          }`}>
            <AlertTriangle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[10px] leading-relaxed font-semibold font-mono uppercase tracking-wider">
              DICA - A consistência diária é a chave para o progresso físico e mental. Mantenha o foco!
            </p>
          </div>
        ) : (
          <div className={`my-5 p-4 rounded-xl flex gap-2.5 items-start border transition-colors ${
            isLight 
              ? 'bg-teal-50/60 border-teal-200 text-teal-700' 
              : 'bg-teal-950/10 border-teal-500/15 text-teal-400'
          }`}>
            <Sparkles className="w-4.5 h-4.5 text-teal-500 shrink-0 mt-0.5 animate-pulse" />
            <p className="text-[10px] leading-relaxed font-semibold font-mono uppercase tracking-wider">
              A recuperação também faz parte da evolução. Complete apenas as atividades que desejar e volte amanhã para seu próximo treino.
            </p>
          </div>
        )}

        {/* Big action button / Quest complete feedback */}
        {isTrainingDay ? (
          activeQuests.length > 0 ? (
            <button
              onClick={() => onStartExercise((activeQuests[0] as Exercise).id)}
              className={`w-full py-4 font-black font-display text-xs tracking-widest uppercase rounded-xl transition-all shadow-[0_2px_15px_rgba(0,0,0,0.1)] active:scale-98 flex items-center justify-center gap-2 ${
                isLight 
                  ? 'bg-slate-950 hover:bg-slate-800 text-white shadow-[0_4px_12px_rgba(15,23,42,0.15)]' 
                  : 'bg-white hover:bg-slate-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.25)]'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              Iniciar Treino
            </button>
          ) : (
            <div className={`w-full py-3.5 text-center rounded-xl text-xs uppercase tracking-wider font-mono border transition-all ${
              isLight 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' 
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
            }`}>
              ✓ TREINO CONCLUÍDO COM SUCESSO
            </div>
          )
        ) : (
          activeQuests.length > 0 ? (
            <div className={`w-full py-3.5 text-center rounded-xl text-xs uppercase tracking-wider font-mono border transition-all ${
              isLight 
                ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold' 
                : 'bg-sky-950/15 border-sky-500/20 text-sky-400'
            }`}>
              🛌 DIA DE DESCANSO E REGENERAÇÃO ATIVO
            </div>
          ) : (
            <div className={`w-full py-3.5 text-center rounded-xl text-xs uppercase tracking-wider font-mono border transition-all ${
              isLight 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' 
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400'
            }`}>
              ✓ REGENERAÇÃO COMPLETA COM SUCESSO
            </div>
          )
        )}
      </div>

      {/* 1.5. ACTIVE OATH / PACT FROM THE GAME MASTER */}
      {activeOath && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mx-4 border rounded-2xl p-4 shadow-sm relative overflow-hidden transition-all duration-300 ${
            isLight 
              ? 'bg-gradient-to-r from-amber-50 to-orange-50/20 border-amber-200 shadow-sm' 
              : 'bg-gradient-to-r from-amber-950/20 via-amber-900/10 to-transparent border-amber-500/20'
          }`}
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className={`flex items-center gap-2 mb-2 border-b pb-2 transition-colors ${
            isLight ? 'border-amber-200/60 text-amber-700' : 'border-amber-500/10 text-amber-500'
          }`}>
            <span className="text-lg">{activeOath.icon}</span>
            <div className="flex-1 flex justify-between items-center">
              <span className="text-[10px] font-mono font-black tracking-widest uppercase">
                JURAMENTO: {activeOath.title.toUpperCase()}
              </span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-mono font-bold transition-all ${
                isLight ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/10 text-amber-400'
              }`}>
                {activeOath.effect.toUpperCase()}
              </span>
            </div>
          </div>
          
          <p className={`text-[10.5px] leading-relaxed italic font-medium transition-colors ${
            isLight ? 'text-slate-600' : 'text-slate-300'
          }`}>
            "{activeOath.quote}"
          </p>
        </motion.div>
      )}

      {/* 2. DYNAMIC POWER LEVEL RATING RAMP - CALISFIT ATHLETIC POWER RATING */}
      <div className={`mx-4 border rounded-2xl p-4 flex items-center justify-between relative overflow-hidden transition-all duration-300 ${
        isLight 
          ? 'bg-white border-slate-200/80 shadow-sm' 
          : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-slate-900 shadow-md'
      }`}>
        <div className="absolute right-0 top-0 w-24 h-24 bg-sky-500/10 rounded-full blur-xl pointer-events-none" />
        <div className="space-y-0.5">
          <span className={`text-[10px] font-mono font-extrabold tracking-widest uppercase transition-colors ${
            isLight ? 'text-sky-600 font-bold' : 'text-sky-400 font-bold'
          }`}>ÍNDICE DE RENDIMENTO FÍSICO</span>
          <p className={`text-xs transition-colors ${isLight ? 'text-slate-500 font-medium' : 'text-slate-400'}`}>
            Desenvolva seus status treinando diariamente
          </p>
        </div>
        <div className="text-right">
          <motion.div
            key={totalPower}
            initial={{ scale: 0.95 }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.3 }}
            className={`text-4xl font-extrabold font-display bg-clip-text text-transparent tracking-tight font-mono leading-none ${
              isLight 
                ? 'bg-gradient-to-r from-sky-600 via-blue-500 to-sky-700' 
                : 'bg-gradient-to-r from-sky-400 via-blue-300 to-sky-500 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]'
            }`}
          >
            {totalPower}
          </motion.div>
          <span className="text-[9px] font-mono font-extrabold text-sky-500 tracking-wider">PONTUAÇÃO FITNESS</span>
        </div>
      </div>

      {/* 5. CONTROLE DE HIDRATAÇÃO (ÁGUA) */}
      <div className={`mx-4 rounded-3xl p-5 space-y-4 border transition-all duration-300 ${
        isLight 
          ? 'bg-white border-slate-200/80 shadow-md' 
          : 'bg-[#07060a] border border-slate-900 shadow-lg'
      }`}>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-sky-500 uppercase block">META DIÁRIA</span>
            <h3 className={`text-base font-black font-display transition-colors ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>Controle de Hidratação</h3>
          </div>
          <span className="text-base font-mono font-black text-sky-500">
            {waterIntake} <span className="text-slate-400 text-xs">/ {waterGoal} ml</span>
          </span>
        </div>

        {/* Alerta de hidratação */}
        <div className={`p-4 rounded-2xl flex items-center justify-between border transition-all duration-300 ${
          waterIntake >= waterGoal
            ? (isLight ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-sky-950/20 border-sky-500/30 text-sky-300')
            : (isLight ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-slate-950/50 border-slate-900 text-slate-400')
        }`}>
          <div className="space-y-1 max-w-[200px]">
            <span className={`text-xs font-bold block ${isLight ? 'text-slate-800' : 'text-white'}`}>
              {waterIntake >= waterGoal ? '🎉 Hidratação Concluída!' : 'Mantenha sua hidratação!'}
            </span>
            <span className={`text-[10.5px] leading-snug block ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              {waterIntake >= waterGoal 
                ? 'Excelente! Seu corpo está pronto com hidratação de 100%.'
                : 'Beba água regularmente para manter seus atributos em nível máximo durante os treinos.'}
            </span>
          </div>
          <div className="w-12 h-12 shrink-0 flex items-center justify-center text-3xl filter drop-shadow-[0_2px_8px_rgba(14,165,233,0.4)]">
            💧
          </div>
        </div>

        {/* Botões de controle de água */}
        <div className="flex gap-2">
          <button
            onClick={() => addWater(250)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
              isLight 
                ? 'bg-sky-50/60 hover:bg-sky-100 border-sky-200 text-sky-600 hover:border-sky-400' 
                : 'bg-sky-950/20 hover:bg-sky-950/40 border border-sky-500/20 hover:border-sky-500/50 text-sky-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> 250 ml
          </button>
          <button
            onClick={() => addWater(500)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl border transition-all active:scale-95 flex items-center justify-center gap-1.5 ${
              isLight 
                ? 'bg-sky-50/60 hover:bg-sky-100 border-sky-200 text-sky-600 hover:border-sky-400' 
                : 'bg-sky-950/20 hover:bg-sky-950/40 border border-sky-500/20 hover:border-sky-500/50 text-sky-400'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> 500 ml
          </button>
          <button
            onClick={resetWater}
            title="Resetar contador"
            className={`px-3 py-2.5 rounded-xl border transition-all active:scale-95 flex items-center justify-center ${
              isLight 
                ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-500 hover:text-slate-800' 
                : 'bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
