import React, { useState, useEffect } from 'react';
import { GameState } from '../types';
import { 
  TrendingUp, Activity, Plus, Trash2, Sparkles, Scale, 
  Flame, Award, Dumbbell, Shield, ChevronRight, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EvolutionTabProps {
  gameState: GameState;
  onUpdateGameState: (newState: GameState) => void;
}

export const EvolutionTab: React.FC<EvolutionTabProps> = ({ gameState, onUpdateGameState }) => {
  const [weightInput, setWeightInput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Extract core state metrics
  const str = gameState.str || 10;
  const agi = gameState.agi || 10;
  const sta = gameState.sta || 10;
  const int = gameState.int || 10;
  const statPoints = gameState.statPoints || 0;
  const currentWeight = gameState.weight || 70;

  // Generate a mock history for demonstration if history is empty
  const defaultHistory = [
    { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), value: currentWeight + 1.8 },
    { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), value: currentWeight + 0.9 },
    { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), value: currentWeight - 0.2 },
    { date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }), value: currentWeight }
  ];

  const history = gameState.weightHistory && gameState.weightHistory.length > 0 
    ? gameState.weightHistory 
    : defaultHistory;

  // Initialize weight states if undefined
  useEffect(() => {
    if (gameState.weight === undefined || !gameState.weightHistory || gameState.weightHistory.length === 0) {
      onUpdateGameState({
        ...gameState,
        weight: currentWeight,
        weightHistory: defaultHistory
      });
    }
  }, []);

  // Spend Stat Point handler
  const handleSpendStatPoint = (attribute: 'str' | 'agi' | 'sta' | 'int') => {
    if (statPoints <= 0) return;
    
    const updatedState = { ...gameState };
    updatedState.statPoints = (updatedState.statPoints || 0) - 1;
    
    if (attribute === 'str') updatedState.str = (updatedState.str || 10) + 1;
    else if (attribute === 'agi') updatedState.agi = (updatedState.agi || 10) + 1;
    else if (attribute === 'sta') updatedState.sta = (updatedState.sta || 10) + 1;
    else if (attribute === 'int') updatedState.int = (updatedState.int || 10) + 1;

    onUpdateGameState(updatedState);
  };

  // Add weight entry
  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const parsed = parseFloat(weightInput.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 20 || parsed > 300) {
      setErrorMsg('Por favor, digite um peso válido entre 20kg e 300kg.');
      return;
    }

    const todayStr = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    
    // Check if we already logged weight today to merge/replace or add
    let newHistory = gameState.weightHistory ? [...gameState.weightHistory] : [];
    
    // Remove if already exists today to prevent duplicate logs on the same day
    newHistory = newHistory.filter(h => h.date !== todayStr);
    
    // Add new log
    newHistory.push({
      date: todayStr,
      value: Number(parsed.toFixed(1))
    });

    // Keep max 7 logs for clean visualization
    if (newHistory.length > 7) {
      newHistory.shift();
    }

    onUpdateGameState({
      ...gameState,
      weight: Number(parsed.toFixed(1)),
      weightHistory: newHistory
    });

    setWeightInput('');
  };

  // Delete weight log entry
  const handleDeleteLog = (indexToDelete: number) => {
    if (!gameState.weightHistory) return;
    const filtered = gameState.weightHistory.filter((_, idx) => idx !== indexToDelete);
    const lastWeight = filtered.length > 0 ? filtered[filtered.length - 1].value : currentWeight;

    onUpdateGameState({
      ...gameState,
      weight: lastWeight,
      weightHistory: filtered
    });
  };

  // SVG Chart Dimensions & Computations
  const width = 320;
  const height = 120;
  const paddingX = 35;
  const paddingY = 20;

  const weights = history.map(h => h.value);
  const maxWeight = Math.max(...weights, currentWeight + 1);
  const minWeight = Math.min(...weights, currentWeight - 1);
  const weightRange = maxWeight - minWeight || 2;

  // Map indexes to X coordinates
  const getX = (index: number) => {
    if (history.length <= 1) return width / 2;
    return paddingX + (index * (width - 2 * paddingX)) / (history.length - 1);
  };

  // Map values to Y coordinates
  const getY = (val: number) => {
    const usableHeight = height - 2 * paddingY;
    const ratio = (val - minWeight) / weightRange;
    return height - paddingY - ratio * usableHeight;
  };

  // Generate path string for Line chart
  const points = history.map((h, idx) => ({ x: getX(idx), y: getY(h.value) }));
  
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - 10} L ${points[0].x} ${height - 10} Z`;
  }

  // Calculate some feedback based on first and last log
  const firstVal = history[0]?.value || currentWeight;
  const lastVal = history[history.length - 1]?.value || currentWeight;
  const netChange = Number((lastVal - firstVal).toFixed(1));

  return (
    <div className="space-y-6 pb-24 cyber-grid min-h-screen pt-4">
      
      {/* Tab Header Banner */}
      <div className="px-4">
        <div className="bg-[#050508]/80 border border-slate-900 rounded-3xl p-5 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-1">
            <span className="text-[9px] font-mono font-black text-sky-400 tracking-widest uppercase block">
              DIRETRIZ DE MONITORAMENTO
            </span>
            <h2 className="text-xl font-black text-white tracking-tight font-display uppercase">
              Painel de Evolução
            </h2>
            <p className="text-[11px] text-slate-400">
              Acompanhe seu avanço corporal e atributos de RPG.
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-950/30 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* SECTION 1: RPG CHARACTER ATTRIBUTES (Moved from HomeTab as requested) */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono tracking-wider font-extrabold text-purple-400 uppercase block">AVALIAÇÃO DE SISTEMA</span>
            <h3 className="text-base font-black text-white flex items-center gap-1.5 tracking-tight font-display">
              Atributos de Combate
            </h3>
          </div>
          {statPoints > 0 && (
            <span className="px-2.5 py-1 bg-purple-500/15 border border-purple-500/40 text-[10px] font-bold font-mono tracking-wider uppercase rounded-full animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              +{statPoints} Pontos Livres!
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* STR (Ataque) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">FOR (Força)</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => handleSpendStatPoint('str')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-red-950/30 flex items-center justify-center text-[10px] text-red-400">👊</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{str}</span>
              <span className="text-[9px] text-slate-500 font-mono uppercase block mt-1">Poder Muscular</span>
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-red-500" style={{ width: `${Math.min(100, str * 2)}%` }} />
              </div>
            </div>
          </div>

          {/* AGI (Agilidade) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">AGI (Agilidade)</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => handleSpendStatPoint('agi')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-amber-950/30 flex items-center justify-center text-[10px] text-amber-400">⚡</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{agi}</span>
              <span className="text-[9px] text-slate-500 font-mono uppercase block mt-1">Velocidade e Reação</span>
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, agi * 2)}%` }} />
              </div>
            </div>
          </div>

          {/* STA (Defesa / Vitalidade) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">VIT (Vitalidade)</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => handleSpendStatPoint('sta')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-emerald-950/30 flex items-center justify-center text-[10px] text-emerald-400">🛡️</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{sta}</span>
              <span className="text-[9px] text-slate-500 font-mono uppercase block mt-1">Resistência Corporal</span>
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, sta * 2)}%` }} />
              </div>
            </div>
          </div>

          {/* INT (Sabedoria / Inteligência) */}
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between hover:border-purple-500/20 transition-all">
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono font-extrabold text-slate-400 uppercase tracking-wider">SAB (Sabedoria)</span>
              {statPoints > 0 ? (
                <button
                  onClick={() => handleSpendStatPoint('int')}
                  className="w-6 h-6 rounded-md bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center font-bold text-sm transition-all active:scale-90 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="w-6 h-6 rounded bg-blue-950/30 flex items-center justify-center text-[10px] text-blue-400">🧠</div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-3xl font-mono font-black text-white">{int}</span>
              <span className="text-[9px] text-slate-500 font-mono uppercase block mt-1">Foco e Conhecimento</span>
              <div className="w-full h-1 bg-slate-950 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: `${Math.min(100, int * 2)}%` }} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-slate-500 font-mono leading-relaxed text-center pt-1 uppercase">
          💡 Complete quests para obter pontos de nível e evoluir seus atributos!
        </p>
      </div>

      {/* SECTION 2: WEIGHT PROGRESSION (Evolução de Peso) */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-5">
        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-black text-sky-400 tracking-wider block uppercase">HISTÓRICO CORPORAL</span>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">Evolução de Peso</h3>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black font-mono text-white">{currentWeight} <span className="text-xs text-sky-400">kg</span></span>
            <span className="text-[8px] font-mono font-bold text-slate-500 block uppercase">PESO ATUAL</span>
          </div>
        </div>

        {/* GLOWING SVG LINE GRAPH */}
        <div className="bg-[#030205] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden h-40">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-500/5 to-transparent pointer-events-none" />
          
          {/* Y-Axis Labeling */}
          <div className="absolute left-2 top-2 text-[8px] font-mono font-bold text-slate-600 flex flex-col justify-between h-28 pointer-events-none text-left">
            <span>{maxWeight.toFixed(1)}kg</span>
            <span>{((maxWeight + minWeight) / 2).toFixed(1)}kg</span>
            <span>{minWeight.toFixed(1)}kg</span>
          </div>

          <div className="flex-1 flex items-center justify-center relative mt-1 pl-4">
            {history.length > 0 ? (
              <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                <defs>
                  {/* Linear gradient line fill */}
                  <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                
                {/* Gridlines */}
                <line x1={paddingX} y1={paddingY} x2={width - paddingX} y2={paddingY} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={paddingX} y1={height / 2} x2={width - paddingX} y2={height / 2} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={paddingX} y1={height - paddingY} x2={width - paddingX} y2={height - paddingY} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

                {/* Filled Area */}
                {areaPath && <path d={areaPath} fill="url(#chart-glow)" className="transition-all duration-300" />}

                {/* Main Stroke Line */}
                {linePath && (
                  <path 
                    d={linePath} 
                    fill="none" 
                    stroke="#0ea5e9" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_8px_rgba(14,165,233,0.5)] transition-all duration-300" 
                  />
                )}

                {/* Circular Node Points */}
                {points.map((p, idx) => (
                  <g key={idx}>
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="5" 
                      fill="#020617" 
                      stroke="#0ea5e9" 
                      strokeWidth="2.5" 
                      className="cursor-pointer hover:r-7 transition-all duration-150"
                    />
                    <circle 
                      cx={p.x} 
                      cy={p.y} 
                      r="9" 
                      fill="#0ea5e9" 
                      fillOpacity="0.15" 
                      className="animate-ping"
                    />
                  </g>
                ))}
              </svg>
            ) : (
              <div className="text-center text-xs text-slate-500 py-6 uppercase font-mono tracking-wider">
                Sem registros de peso suficientes
              </div>
            )}
          </div>

          {/* X-Axis dates */}
          <div className="flex justify-between text-[8px] font-mono font-bold text-slate-500 pt-1.5 border-t border-slate-900 pl-8 pr-4">
            {history.map((h, idx) => (
              <span key={idx}>{h.date}</span>
            ))}
          </div>
        </div>

        {/* Change metric message */}
        <div className="flex justify-between items-center text-xs font-mono bg-slate-950/40 p-3 rounded-2xl border border-slate-900">
          <span className="text-slate-400">Balanço do Período:</span>
          {netChange < 0 ? (
            <span className="text-emerald-400 font-bold">-{Math.abs(netChange)} kg (Emagrecimento/Definição)</span>
          ) : netChange > 0 ? (
            <span className="text-sky-400 font-bold">+{netChange} kg (Massa Magra/Força)</span>
          ) : (
            <span className="text-slate-400">Mantido</span>
          )}
        </div>

        {/* Input weight form */}
        <form onSubmit={handleAddWeight} className="flex gap-2.5">
          <div className="flex-1 relative">
            <input 
              type="text"
              placeholder="Ex: 72.5"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              className="w-full bg-[#030205] border border-slate-800 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20"
            />
            <span className="absolute right-4 top-3.5 text-xs text-slate-500 font-mono font-bold">kg</span>
          </div>
          <button 
            type="submit"
            className="px-5 bg-sky-500 hover:bg-sky-400 text-black text-xs font-black font-mono tracking-wider uppercase rounded-xl flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-[0_4px_12px_rgba(14,165,233,0.2)]"
          >
            <Plus className="w-4 h-4 stroke-[3px]" />
            REGISTRAR
          </button>
        </form>
        {errorMsg && <p className="text-[10px] font-mono text-red-500 font-semibold">{errorMsg}</p>}

        {/* Historical Logs List */}
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {gameState.weightHistory && gameState.weightHistory.length > 0 ? (
            gameState.weightHistory.map((log, idx) => (
              <div 
                key={idx} 
                className="bg-[#050508] border border-slate-900 rounded-xl p-2.5 flex items-center justify-between text-xs hover:border-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className="font-mono text-slate-400 font-bold">{log.date}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-white">{log.value} kg</span>
                  <button 
                    onClick={() => handleDeleteLog(idx)}
                    className="text-slate-600 hover:text-red-400 p-1 rounded hover:bg-red-950/20 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-slate-500 text-center uppercase font-mono py-1">Registros manuais aparecerão aqui.</p>
          )}
        </div>
      </div>

      {/* SECTION 3: CONSISTENCY & REPETITIONS (Dias seguidos de treino) */}
      <div className="mx-4 bg-[#07060a] border border-slate-900 rounded-3xl p-5 shadow-lg space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <span className="text-[9px] font-mono font-black text-amber-500 tracking-wider block uppercase">CONSISTÊNCIA DO GUERREIRO</span>
            <h3 className="text-sm font-black text-white uppercase tracking-tight">Dias Seguidos e Exercícios</h3>
          </div>
        </div>

        {/* Streak details bento style */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-wider">Chama Ativa (Streak)</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-black text-amber-400">{gameState.streak}</span>
              <span className="text-xs text-amber-500 font-bold uppercase font-mono">dias</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1.5">Treinos ininterruptos atuais</span>
          </div>

          <div className="bg-[#0b0a0e] border border-slate-900/60 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-wider">Recorde Pessoal</span>
            <div className="mt-2 flex items-baseline gap-1.5">
              <span className="text-3xl font-mono font-black text-purple-400">
                {Math.max(gameState.maxConsecutive || 0, gameState.streak || 0)}
              </span>
              <span className="text-xs text-purple-500 font-bold uppercase font-mono">dias</span>
            </div>
            <span className="text-[9px] text-slate-400 font-mono mt-1.5">Maior sequência já alcançada</span>
          </div>
        </div>

        {/* Lifetime workout counters list */}
        <div className="space-y-2.5 pt-1">
          <span className="text-[9px] font-mono font-extrabold text-slate-400 uppercase tracking-widest block">Histórico de Repetições Totais</span>
          
          {/* Flexões */}
          <div className="bg-[#030205] border border-slate-900/50 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-red-500" />
                Flexões de Braço
              </span>
              <span className="text-white font-black">{gameState.totalFlexoes || 0} reps</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, ((gameState.totalFlexoes || 0) / 300) * 100)}%` }} />
            </div>
          </div>

          {/* Agachamentos */}
          <div className="bg-[#030205] border border-slate-900/50 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-amber-500" />
                Agachamentos
              </span>
              <span className="text-white font-black">{gameState.totalAgacham || 0} reps</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, ((gameState.totalAgacham || 0) / 400) * 100)}%` }} />
            </div>
          </div>

          {/* Pranchas */}
          <div className="bg-[#030205] border border-slate-900/50 rounded-2xl p-3.5 space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                Sustentação em Prancha
              </span>
              <span className="text-white font-black">{Math.floor((gameState.totalPrancha || 0) / 60)}m {(gameState.totalPrancha || 0) % 60}s</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${Math.min(100, ((gameState.totalPrancha || 0) / 900) * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
