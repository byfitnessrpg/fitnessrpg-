import React, { useState } from 'react';
import { GameState } from '../types';
import {
  Sparkles,
  ChevronRight,
  TrendingUp,
  Dumbbell,
  Timer,
  Scale,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ReassessmentModalProps {
  gameState: GameState;
  onClose: () => void;
  onComplete: (newState: GameState) => void;
  theme?: 'dark' | 'light';
}

export const ReassessmentModal: React.FC<ReassessmentModalProps> = ({
  gameState,
  onClose,
  onComplete,
  theme = 'dark',
}) => {
  const [step, setStep] = useState<number>(1); // 1: Form, 2: Comparative Results
  
  // Input fields
  const [peso, setPeso] = useState<string>(gameState.peso?.toString() || '');
  const [flexoes, setFlexoes] = useState<number>(gameState.flexoes_inicial || 0);
  const [agachamentos, setAgachamentos] = useState<number>(gameState.agachamentos_inicial || 0);
  const [prancha, setPrancha] = useState<number>(gameState.prancha_inicial || 0);
  
  const [error, setError] = useState<string>('');

  // Evolution result fields
  const [evolutionData, setEvolutionData] = useState<{
    flexoesDiff: number;
    flexoesPct: number;
    agachamentosDiff: number;
    agachamentosPct: number;
    pranchaDiff: number;
    pranchaPct: number;
    pesoDiff: number;
    pesoPct: number;
    oldMissions: { flexoes: number; agachamentos: number; prancha: number };
    newMissions: { flexoes: number; agachamentos: number; prancha: number };
  } | null>(null);

  const handleCalculateEvolution = () => {
    const numPeso = parseFloat(peso);
    if (peso && (isNaN(numPeso) || numPeso < 25 || numPeso > 300)) {
      setError('Por favor, informe um peso válido entre 25 kg e 300 kg.');
      return;
    }
    setError('');

    // Previous values
    const oldFlexoes = gameState.flexoes_inicial || 0;
    const oldAgachamentos = gameState.agachamentos_inicial || 0;
    const oldPrancha = gameState.prancha_inicial || 0;
    const oldPeso = gameState.peso || 0;

    // Diff counts
    const flexoesDiff = flexoes - oldFlexoes;
    const flexoesPct = oldFlexoes > 0 ? Math.round((flexoesDiff / oldFlexoes) * 100) : (flexoes > 0 ? 100 : 0);

    const agachamentosDiff = agachamentos - oldAgachamentos;
    const agachamentosPct = oldAgachamentos > 0 ? Math.round((agachamentosDiff / oldAgachamentos) * 100) : (agachamentos > 0 ? 100 : 0);

    const pranchaDiff = prancha - oldPrancha;
    const pranchaPct = oldPrancha > 0 ? Math.round((pranchaDiff / oldPrancha) * 100) : (prancha > 0 ? 100 : 0);

    const finalPeso = numPeso || oldPeso;
    const pesoDiff = finalPeso - oldPeso;
    const pesoPct = oldPeso > 0 ? Math.round((pesoDiff / oldPeso) * 100) : 0;

    // Old missions
    const oldMissions = gameState.missao_personalizada || {
      flexoes: 5,
      agachamentos: 10,
      prancha: 15
    };

    // Calculate new mission values gradually
    const profile = gameState.nivel_fitness || 'Iniciante';
    const factor = profile === 'Iniciante' ? 0.65 : (profile === 'Intermediário' ? 0.70 : 0.75);

    let nextFlexoes = Math.round(flexoes * factor);
    let nextAgachamentos = Math.round(agachamentos * factor);
    let nextPrancha = Math.round(prancha * factor);

    // Apply strict gradual thresholds
    nextFlexoes = Math.max(oldMissions.flexoes, Math.min(oldMissions.flexoes + 4, nextFlexoes));
    nextAgachamentos = Math.max(oldMissions.agachamentos, Math.min(oldMissions.agachamentos + 6, nextAgachamentos));
    nextPrancha = Math.max(oldMissions.prancha, Math.min(oldMissions.prancha + 15, nextPrancha));

    // Floor values
    nextFlexoes = Math.max(5, nextFlexoes);
    nextAgachamentos = Math.max(10, nextAgachamentos);
    nextPrancha = Math.max(15, nextPrancha);

    setEvolutionData({
      flexoesDiff,
      flexoesPct,
      agachamentosDiff,
      agachamentosPct,
      pranchaDiff,
      pranchaPct,
      pesoDiff,
      pesoPct,
      oldMissions,
      newMissions: {
        flexoes: nextFlexoes,
        agachamentos: nextAgachamentos,
        prancha: nextPrancha,
      }
    });

    setStep(2);
  };

  const handleApplyNewMissions = () => {
    if (!evolutionData) return;

    const today = new Date().toDateString();
    
    // Set next reassessment 10 days from today
    const nextReassessmentDate = new Date();
    nextReassessmentDate.setDate(nextReassessmentDate.getDate() + 10);

    const finalPeso = parseFloat(peso) || gameState.peso || 0;

    const updatedState: GameState = {
      ...gameState,
      peso: finalPeso,
      flexoes_inicial: flexoes,
      agachamentos_inicial: agachamentos,
      prancha_inicial: prancha,
      ultima_avaliacao: today,
      proxima_reavaliacao: nextReassessmentDate.toISOString(),
      missao_personalizada: evolutionData.newMissions,
      weight: finalPeso,
      weightHistory: [
        ...(gameState.weightHistory || []),
        { date: new Date().toLocaleDateString('pt-BR'), value: finalPeso }
      ]
    };

    onComplete(updatedState);
  };

  const renderBadge = (pct: number, isLowerBetter: boolean = false) => {
    if (pct === 0) return <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-950/50 border border-slate-900 px-2 py-1 rounded-md flex items-center gap-0.5"><Minus className="w-3 h-3" /> 0%</span>;
    const improved = isLowerBetter ? pct < 0 : pct > 0;
    if (improved) {
      return (
        <span className="text-[10px] font-mono font-black text-cyan-400 bg-cyan-950/20 border border-cyan-500/20 px-2 py-1 rounded-md flex items-center gap-0.5 shadow-[0_0_8px_rgba(6,182,212,0.1)]">
          <ArrowUpRight className="w-3.5 h-3.5 animate-pulse" /> {pct > 0 ? `+${pct}` : pct}%
        </span>
      );
    } else {
      return (
        <span className="text-[10px] font-mono font-bold text-red-400 bg-red-950/20 border border-red-900/30 px-2 py-1 rounded-md flex items-center gap-0.5">
          <ArrowDownRight className="w-3.5 h-3.5" /> {pct > 0 ? `+${pct}` : pct}%
        </span>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto font-sans select-none">
      <motion.div
        initial={{ scale: 0.95, y: 15, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 15, opacity: 0 }}
        className="w-full max-w-sm rounded-[2.5rem] p-6 border border-cyan-500/20 text-slate-100 bg-[#030205] cyber-grid relative overflow-hidden"
      >
        {/* Glow corner highlights inside modal */}
        <div className="bg-red-500/5 w-24 h-24 rounded-full blur-[40px] absolute -top-4 -left-4 pointer-events-none" />
        <div className="bg-cyan-400/8 w-32 h-32 rounded-full blur-[50px] absolute -top-6 -right-6 pointer-events-none" />

        {/* Close Button top-right */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/80 border border-slate-900 hover:text-red-400 text-slate-400 flex items-center justify-center transition-all cursor-pointer active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-900 pb-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <TrendingUp className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase block">CONEXÃO BIOMÉTRICA</span>
                  <h3 className="text-sm font-black text-white font-display uppercase tracking-tight">REAVALIAÇÃO ATIVA</h3>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                Chegou o momento de aferir sua evolução física. Registre suas marcas máximas atuais para recalibrar o Sistema.
              </p>

              {/* Form body */}
              <div className="space-y-4">
                {/* Peso */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black font-mono text-cyan-400 uppercase tracking-wider block">
                    Peso Atual (kg - opcional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    placeholder="Ex: 76.2"
                    className="w-full bg-[#07060a] border border-slate-900 focus:border-cyan-400 rounded-xl p-3.5 text-xs text-white outline-none font-mono placeholder:text-slate-800 focus:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                  />
                </div>

                {/* Flexões */}
                <div className="bg-[#07060a] border border-slate-900 rounded-xl p-3.5 flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Dumbbell className="w-4 h-4 text-red-500" /> Flexões Máximas
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={flexoes}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setFlexoes(isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className="w-16 bg-[#030206] border border-slate-800 text-right pr-2 text-sm font-mono font-black text-red-500 focus:outline-none focus:border-red-500 rounded-md py-0.5"
                      />
                      <span className="text-[10px] font-normal text-slate-500 font-mono">reps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFlexoes(prev => Math.max(0, prev - 5))}
                      className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="5"
                      value={flexoes}
                      onChange={(e) => setFlexoes(parseInt(e.target.value) || 0)}
                      className="flex-1 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFlexoes(prev => prev + 5)}
                      className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Agachamentos */}
                <div className="bg-[#07060a] border border-slate-900 rounded-xl p-3.5 flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Dumbbell className="w-4 h-4 text-amber-500" /> Agachamentos
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={agachamentos}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setAgachamentos(isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className="w-16 bg-[#030206] border border-slate-800 text-right pr-2 text-sm font-mono font-black text-amber-500 focus:outline-none focus:border-amber-500 rounded-md py-0.5"
                      />
                      <span className="text-[10px] font-normal text-slate-500 font-mono">reps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAgachamentos(prev => Math.max(0, prev - 5))}
                      className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="5"
                      value={agachamentos}
                      onChange={(e) => setAgachamentos(parseInt(e.target.value) || 0)}
                      className="flex-1 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAgachamentos(prev => prev + 5)}
                      className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Prancha */}
                <div className="bg-[#07060a] border border-slate-900 rounded-xl p-3.5 flex flex-col space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                      <Timer className="w-4 h-4 text-cyan-400" /> Prancha Estática
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min="0"
                        value={prancha}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setPrancha(isNaN(val) ? 0 : Math.max(0, val));
                        }}
                        className="w-16 bg-[#030206] border border-slate-800 text-right pr-2 text-sm font-mono font-black text-cyan-400 focus:outline-none focus:border-cyan-400 rounded-md py-0.5"
                      />
                      <span className="text-[10px] font-normal text-slate-500 font-mono">seg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPrancha(prev => Math.max(0, prev - 5))}
                      className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1200"
                      step="5"
                      value={prancha}
                      onChange={(e) => setPrancha(parseInt(e.target.value) || 0)}
                      className="flex-1 h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => setPrancha(prev => prev + 5)}
                      className="w-8 h-8 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-900 text-white text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {error && <p className="text-red-500 text-[10px] font-mono font-bold text-center leading-none">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-900 rounded-xl text-slate-400 text-[11px] font-mono font-black tracking-wider uppercase transition-all cursor-pointer active:scale-95"
                >
                  CANCELAR
                </button>
                <button
                  onClick={handleCalculateEvolution}
                  className="flex-1 py-3.5 bg-[#00f0ff] hover:bg-cyan-400 text-black text-[11px] font-mono font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer active:scale-95 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                >
                  ANALISAR
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-5"
            >
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-slate-900 pb-3 pr-8">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400 animate-pulse">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase block">DETECTOR DE EVOLUÇÃO</span>
                  <h3 className="text-sm font-black text-white font-display uppercase tracking-tight">RESULTADO CALCULADO</h3>
                </div>
              </div>

              {/* Stat Comparison list */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                {/* Flexões comparison */}
                <div className="bg-[#07060a] border border-slate-900 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">FLEXÕES</span>
                    <span className="text-sm font-mono font-black text-white mt-1 block">
                      {gameState.flexores_inicial || 0} <span className="text-slate-600 font-normal">→</span> {flexoes}
                    </span>
                  </div>
                  {renderBadge(evolutionData?.flexoesPct || 0)}
                </div>

                {/* Agachamentos comparison */}
                <div className="bg-[#07060a] border border-slate-900 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">AGACHAM.</span>
                    <span className="text-sm font-mono font-black text-white mt-1 block">
                      {gameState.agachamentos_inicial || 0} <span className="text-slate-600 font-normal">→</span> {agachamentos}
                    </span>
                  </div>
                  {renderBadge(evolutionData?.agachamentosPct || 0)}
                </div>

                {/* Prancha comparison */}
                <div className="bg-[#07060a] border border-slate-900 rounded-xl p-3.5 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">PRANCHA</span>
                    <span className="text-sm font-mono font-black text-white mt-1 block">
                      {gameState.prancha_inicial || 0}s <span className="text-slate-600 font-normal">→</span> {prancha}s
                    </span>
                  </div>
                  {renderBadge(evolutionData?.pranchaPct || 0)}
                </div>

                {/* Peso comparison if updated */}
                {(peso && parseFloat(peso) !== gameState.peso) && (
                  <div className="bg-[#07060a] border border-slate-900 rounded-xl p-3.5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">PESO REGISTRADO</span>
                      <span className="text-sm font-mono font-black text-white mt-1 block">
                        {gameState.peso || 0}kg <span className="text-slate-600 font-normal">→</span> {peso}kg
                      </span>
                    </div>
                    {renderBadge(evolutionData?.pesoPct || 0, true)}
                  </div>
                )}
              </div>

              {/* Adjustments summary box */}
              <div className="bg-cyan-950/5 border border-cyan-500/15 rounded-2xl p-4 space-y-3">
                <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest block uppercase">⚡ CALIBRAÇÃO DE REQUISITOS</span>
                <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                  Suas missões personalizadas foram atualizadas de forma gradual para acompanhar sua nova força máxima registrada:
                </p>

                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-[#040206] rounded-lg p-2 border border-slate-900/60">
                    <span className="text-[8px] text-slate-500 block leading-none font-mono">FLEXÕES</span>
                    <span className="text-xs font-mono font-bold text-slate-300 block mt-1">
                      {evolutionData?.oldMissions.flexoes} <span className="text-[8px] text-slate-500">→</span> <span className="text-cyan-400 font-black">{evolutionData?.newMissions.flexoes}</span>
                    </span>
                  </div>
                  <div className="bg-[#040206] rounded-lg p-2 border border-slate-900/60">
                    <span className="text-[8px] text-slate-500 block leading-none font-mono">AGACHAM.</span>
                    <span className="text-xs font-mono font-bold text-slate-300 block mt-1">
                      {evolutionData?.oldMissions.agachamentos} <span className="text-[8px] text-slate-500">→</span> <span className="text-cyan-400 font-black">{evolutionData?.newMissions.agachamentos}</span>
                    </span>
                  </div>
                  <div className="bg-[#040206] rounded-lg p-2 border border-slate-900/60">
                    <span className="text-[8px] text-slate-500 block leading-none font-mono">PRANCHA</span>
                    <span className="text-xs font-mono font-bold text-slate-300 block mt-1">
                      {evolutionData?.oldMissions.prancha}s <span className="text-[8px] text-slate-500">→</span> <span className="text-cyan-400 font-black">{evolutionData?.newMissions.prancha}s</span>
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplyNewMissions}
                className="w-full py-4 bg-[#00f0ff] hover:bg-cyan-400 text-black font-mono font-black tracking-[0.15em] uppercase rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all duration-200 cursor-pointer active:scale-[0.98]"
              >
                SALVAR EVOLUÇÃO ⚔️
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
