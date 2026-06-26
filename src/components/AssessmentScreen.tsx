import React, { useState } from 'react';
import { GameState } from '../types';
import {
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Target,
  Flame,
  Award,
  Scroll,
  Dumbbell,
  Timer,
  Scale,
  Ruler,
  Calendar,
  Smile,
  ArrowLeft,
  Check,
  User,
  Activity,
  Heart,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AssessmentScreenProps {
  gameState: GameState;
  onComplete: (newState: GameState) => void;
  onLogout?: () => void;
  onClose?: () => void;
  theme?: 'dark' | 'light';
}

export const AssessmentScreen: React.FC<AssessmentScreenProps> = ({
  gameState,
  onComplete,
  onLogout,
  onClose,
  theme = 'dark',
}) => {
  const [step, setStep] = useState<number>(1);
  
  // Form states
  const [idade, setIdade] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  
  const [objetivo, setObjetivo] = useState<string>('');
  const [frequenciaTreino, setFrequenciaTreino] = useState<string>('');
  
  const [flexoes, setFlexoes] = useState<number>(0);
  const [agachamentos, setAgachamentos] = useState<number>(0);
  const [prancha, setPrancha] = useState<number>(0);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Results calculation state
  const [computedProfile, setComputedProfile] = useState<{
    nivel: string;
    text: string;
    flexoes: number;
    agachamentos: number;
    prancha: number;
  } | null>(null);

  const [showMestreMessage, setShowMestreMessage] = useState<boolean>(false);

  // Objective choices
  const OBJETIVOS = [
    { id: 'Emagrecer', icon: '🔥', label: 'Emagrecer', desc: 'Perda de gordura e definição corporal' },
    { id: 'Ganhar massa muscular', icon: '💪', label: 'Ganhar massa muscular', desc: 'Hipertrofia e ganho de força' },
    { id: 'Melhorar condicionamento', icon: '⚡', label: 'Melhorar condicionamento', desc: 'Mais fôlego e resistência no dia a dia' },
    { id: 'Criar hábito de treinar', icon: '🎯', label: 'Criar hábito de treinar', desc: 'Consistência e disciplina na rotina' },
    { id: 'Manter a saúde', icon: '❤️', label: 'Manter a saúde', desc: 'Bem-estar geral e longevidade' },
  ];

  // Frequency choices
  const FREQUENCIAS = [
    { id: 'Nunca treino', icon: '🛋️', label: 'Nunca treino', desc: 'Sedentário, sem atividade regular' },
    { id: 'Treino raramente', icon: '🚶', label: 'Treino raramente', desc: 'Pratico de vez em quando' },
    { id: 'Treino 2-3 vezes por semana', icon: '🏃', label: 'Treino 2-3 vezes por semana', desc: 'Atividade física moderada' },
    { id: 'Treino 4 ou mais vezes por semana', icon: '⚡', label: 'Treino 4 ou mais vezes por semana', desc: 'Estilo de vida bastante ativo' },
  ];

  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      // Validate Step 2: Basic Info (Age/Birth year, Gender, Height, Weight)
      const parsedVal = parseInt(idade);
      if (!idade || isNaN(parsedVal)) {
        newErrors.idade = 'Informe uma idade ou ano de nascimento válido.';
      } else if (parsedVal > 1900 && (parsedVal < 1905 || parsedVal > 2026)) {
        newErrors.idade = 'Informe um ano de nascimento válido.';
      } else if (parsedVal <= 1900 && (parsedVal < 5 || parsedVal > 120)) {
        newErrors.idade = 'Informe uma idade válida (5 a 120 anos).';
      }

      if (!sexo) {
        newErrors.sexo = 'Selecione o sexo.';
      }

      const numAltura = parseFloat(altura);
      if (!altura || isNaN(numAltura) || numAltura < 100 || numAltura > 250) {
        newErrors.altura = 'Altura deve estar entre 100 cm e 250 cm.';
      }

      const numPeso = parseFloat(peso);
      if (!peso || isNaN(numPeso) || numPeso < 20 || numPeso > 300) {
        newErrors.peso = 'Peso deve estar entre 20 kg e 300 kg.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (step === 3) {
      if (!objetivo) {
        newErrors.objetivo = 'Por favor, selecione seu principal objetivo.';
        setErrors(newErrors);
        return;
      }
    }

    if (step === 4) {
      if (!frequenciaTreino) {
        newErrors.frequenciaTreino = 'Por favor, selecione sua experiência.';
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});

    if (step === 5) {
      calculateResults();
      setStep(6);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setStep(prev => Math.max(1, prev - 1));
  };

  const calculateResults = () => {
    // Automated analysis logic
    let score = 0;
    if (frequenciaTreino === 'Nunca treino') score += 1;
    else if (frequenciaTreino === 'Treino raramente') score += 2;
    else if (frequenciaTreino === 'Treino 2-3 vezes por semana') score += 4;
    else if (frequenciaTreino === 'Treino 4 ou mais vezes por semana') score += 6;

    score += flexoes * 0.5;
    score += agachamentos * 0.3;
    score += prancha * 0.2;

    let nivel = 'Iniciante';
    let text = 'Seu foco será desenvolver força básica, resistência e criar consistência de treino.';
    
    if (score >= 12 && score < 25) {
      nivel = 'Intermediário';
      text = 'Seu foco será aprimorar a forma, aumentar a intensidade dos blocos e construir massa muscular.';
    } else if (score >= 25) {
      nivel = 'Avançado';
      text = 'Você possui excelente aptidão. Seu foco será superar limites e masterizar movimentos de alta intensidade.';
    }

    // Generate personalized missions
    let missionFlexoes = 5;
    let missionAgachamentos = 10;
    let missionPrancha = 15;

    if (nivel === 'Iniciante') {
      missionFlexoes = Math.max(5, Math.ceil(flexoes * 1.2));
      missionAgachamentos = Math.max(10, Math.ceil(agachamentos * 1.2));
      missionPrancha = Math.max(15, Math.ceil(prancha * 1.2));
    } else if (nivel === 'Intermediário') {
      missionFlexoes = Math.max(12, Math.round(flexoes * 0.75));
      missionAgachamentos = Math.max(20, Math.round(agachamentos * 0.75));
      missionPrancha = Math.max(25, Math.round(prancha * 0.75));
    } else {
      missionFlexoes = Math.max(22, Math.round(flexoes * 0.8));
      missionAgachamentos = Math.max(35, Math.round(agachamentos * 0.8));
      missionPrancha = Math.max(45, Math.round(prancha * 0.8));
    }

    setComputedProfile({
      nivel,
      text,
      flexoes: missionFlexoes,
      agachamentos: missionAgachamentos,
      prancha: missionPrancha,
    });
  };

  const handleStartJourney = () => {
    setShowMestreMessage(true);
  };

  const handleBeginGame = () => {
    if (!computedProfile) return;

    const inputAgeVal = parseInt(idade);
    const resolvedAge = inputAgeVal > 1900 ? (2026 - inputAgeVal) : inputAgeVal;
    
    const today = new Date().toDateString();
    
    // Set reassessment in exactly 10 days
    const nextReassessmentDate = new Date();
    nextReassessmentDate.setDate(nextReassessmentDate.getDate() + 10);

    const updatedState: GameState = {
      ...gameState,
      avaliacao_concluida: true,
      idade: resolvedAge,
      sexo,
      altura: parseFloat(altura),
      peso: parseFloat(peso),
      objetivo,
      frequencia_treino: frequenciaTreino,
      flexoes_inicial: flexoes,
      agachamentos_inicial: agachamentos,
      prancha_inicial: prancha,
      ultima_avaliacao: today,
      proxima_reavaliacao: nextReassessmentDate.toISOString(),
      nivel_fitness: computedProfile.nivel,
      missao_personalizada: {
        flexoes: computedProfile.flexoes,
        agachamentos: computedProfile.agachamentos,
        prancha: computedProfile.prancha,
      },
      weight: parseFloat(peso),
      weightHistory: [
        ...(gameState.weightHistory || []),
        { date: new Date().toLocaleDateString('pt-BR'), value: parseFloat(peso) }
      ]
    };

    onComplete(updatedState);
  };

  const SEX_OPTIONS = [
    { id: 'Masculino', icon: '♂', label: 'Masculino' },
    { id: 'Feminino', icon: '♀', label: 'Feminino' },
    { id: 'Prefiro não dizer', icon: '?', label: 'Prefiro não dizer' }
  ];

  return (
    <div id="assessment-container" className="min-h-screen flex flex-col max-w-md mx-auto relative bg-[#030205] text-slate-100 p-6 justify-between select-none font-sans cyber-grid overflow-y-auto no-scrollbar">
      
      {/* Glow Effects in Corners to Match the Screenshot Glows */}
      <div className="bg-[#ff1e56]/8 w-64 h-64 rounded-full blur-[90px] absolute -top-12 -left-12 pointer-events-none z-0" />
      <div className="bg-cyan-500/10 w-72 h-72 rounded-full blur-[100px] absolute -top-16 -right-16 pointer-events-none z-0" />
      <div className="bg-cyan-400/5 w-64 h-64 rounded-full blur-[80px] absolute bottom-0 right-0 pointer-events-none z-0" />

      {/* Close button for returning players on step 1 */}
      {step === 1 && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white font-mono text-[10px] uppercase border border-slate-900/60 bg-[#0c0a0f]/80 px-3 py-1.5 transition-all active:scale-95 z-20"
        >
          ✖ Fechar
        </button>
      )}

      {/* Top progress bar with back button inline */}
      {step > 1 && step < 6 && (
        <div className="w-full flex items-center gap-4 pt-2 pb-6 z-10 shrink-0">
          <button 
            id="btn-back-step"
            onClick={handlePrevStep}
            className="text-cyan-400 hover:text-cyan-300 active:scale-95 transition-all cursor-pointer p-1"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          
          <div className="flex-1 h-1 bg-[#121016] border border-slate-900 rounded-full overflow-hidden relative">
            <div 
              className="h-full bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-300 rounded-full"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white font-mono text-[10px] uppercase border border-slate-900/60 bg-[#0c0a0f]/80 px-2.5 py-1.5 transition-all active:scale-95 shrink-0"
            >
              Sair
            </button>
          )}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between items-center py-6 z-10 w-full"
          >
            {/* Top Label */}
            <div className="pt-8">
              <div className="px-4 py-1.5 bg-[#05060b] border border-cyan-500/40 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                <span className="text-[11px] font-mono font-black text-cyan-400 tracking-[0.25em] block uppercase">SISTEMA INICIADO</span>
              </div>
            </div>

            {/* Circular Scanning Profile */}
            <div className="my-auto flex flex-col items-center justify-center space-y-12 w-full">
              <div className="relative w-44 h-44 flex items-center justify-center">
                {/* Outer pulsing thin ring */}
                <div className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping duration-1000" />
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                <div className="absolute inset-2 rounded-full border border-cyan-400/30" />
                
                {/* Octagonal style inner circle */}
                <div className="absolute inset-4 border-2 border-cyan-400/80 rounded-[2.5rem] shadow-[0_0_30px_rgba(6,182,212,0.3)] flex items-center justify-center bg-[#07060a]">
                  <User className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)] stroke-[1.5]" />
                </div>
              </div>
              
              {/* Holographic greeting message */}
              <div className="space-y-6 w-full text-center">
                <h1 className="text-3xl font-black tracking-widest uppercase font-display text-white neon-text-blue">
                  BEM-VINDO, JOGADOR
                </h1>
                
                <div className="bg-[#05060b]/95 border border-slate-900 rounded-none p-6 relative max-w-sm mx-auto shadow-xl">
                  {/* Visual sci-fi brackets */}
                  <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-l-2 border-b-2 border-cyan-400" />
                  
                  <p className="text-xs text-slate-300 font-mono leading-relaxed text-center px-2">
                    "Agora você passará por uma breve avaliação de potencial. Responda todas as perguntas de forma honesta e precisa, pois isso será analisado pelo Sistema para calcular seus desafios iniciais."
                  </p>
                  <span className="text-[10px] font-black font-mono text-cyan-400 tracking-wider block mt-3 text-center">— SISTEMA</span>
                </div>
              </div>
            </div>

            {/* Next Button exactly matching the cyan style */}
            <div className="w-full space-y-5">
              <button
                id="btn-start-assessment"
                onClick={handleNextStep}
                className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black tracking-[0.2em] uppercase rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-sm"
              >
                PRÓXIMO
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-[10px] text-slate-500 font-mono underline cursor-pointer hover:text-slate-400 bg-transparent border-none p-0"
                >
                  Já sou um jogador (Fazer Login)
                </button>
                <p className="text-[8px] text-slate-600 font-mono mt-3">
                  Ao continuar, você aceita os <span className="underline">Termos</span> e <span className="underline">Privacidade</span>.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white tracking-widest uppercase neon-text-blue">
                  INFORMAÇÕES PESSOAIS
                </h2>
                <p className="text-xs text-slate-400 font-mono">Precisamos de alguns dados básicos</p>
              </div>

              <div className="space-y-5">
                {/* Idade / Ano de Nascimento */}
                <div className="space-y-2">
                  <label className="text-xs font-black font-mono text-cyan-400 uppercase tracking-wider block">
                    Ano de Nascimento
                  </label>
                  <input
                    id="input-idade"
                    type="number"
                    pattern="[0-9]*"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Ex: 1990"
                    className="w-full bg-[#050408] border border-[#ff3e6c]/40 focus:border-[#ff3e6c] rounded-none p-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-800 font-mono focus:shadow-[0_0_12px_rgba(255,62,108,0.2)]"
                  />
                  {errors.idade && (
                    <span className="text-[#ff3e6c] text-[10px] font-mono font-bold flex items-center gap-1 mt-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> {errors.idade}
                    </span>
                  )}
                </div>

                {/* Sexo */}
                <div className="space-y-2">
                  <label className="text-xs font-black font-mono text-cyan-400 uppercase tracking-wider block">
                    Sexo
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {SEX_OPTIONS.slice(0, 2).map((s) => (
                      <button
                        id={`btn-sexo-${s.id}`}
                        key={s.id}
                        type="button"
                        onClick={() => setSexo(s.id)}
                        className={`relative p-6 border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 min-h-[130px] rounded-none ${
                          sexo === s.id
                            ? 'bg-[#040a12]/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'bg-[#07060a]/90 border-slate-900 text-slate-400 hover:border-slate-800'
                        }`}
                      >
                        {sexo === s.id && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                            <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                          </div>
                        )}
                        <span className={`text-3xl ${sexo === s.id ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]' : 'text-slate-600'}`}>{s.icon}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider block leading-tight ${sexo === s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Prefer not to say styled to fill the layout nicely */}
                  <div className="pt-1">
                    <button
                      id={`btn-sexo-${SEX_OPTIONS[2].id}`}
                      type="button"
                      onClick={() => setSexo(SEX_OPTIONS[2].id)}
                      className={`relative w-full p-5 border transition-all cursor-pointer flex items-center justify-center gap-4 min-h-[70px] rounded-none ${
                        sexo === SEX_OPTIONS[2].id
                          ? 'bg-[#040a12]/40 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                          : 'bg-[#07060a]/90 border-slate-900 text-slate-400 hover:border-slate-800'
                      }`}
                    >
                      {sexo === SEX_OPTIONS[2].id && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_8px_rgba(6,182,212,0.6)]">
                          <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                        </div>
                      )}
                      <HelpCircle className={`w-6 h-6 ${sexo === SEX_OPTIONS[2].id ? 'text-cyan-400' : 'text-slate-600'}`} />
                      <span className={`text-xs font-bold uppercase tracking-wider leading-tight ${sexo === SEX_OPTIONS[2].id ? 'text-white' : 'text-slate-500'}`}>{SEX_OPTIONS[2].label}</span>
                    </button>
                  </div>

                  {errors.sexo && (
                    <span className="text-[#ff3e6c] text-[10px] font-mono font-bold flex items-center gap-1 mt-1">
                      <ShieldAlert className="w-3.5 h-3.5" /> {errors.sexo}
                    </span>
                  )}
                </div>

                {/* Altura & Peso Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black font-mono text-cyan-400 uppercase tracking-wider block">
                      Altura (cm)
                    </label>
                    <input
                      id="input-altura"
                      type="number"
                      pattern="[0-9]*"
                      value={altura}
                      onChange={(e) => setAltura(e.target.value)}
                      placeholder="Ex: 175"
                      className="w-full bg-[#050408] border border-slate-900 focus:border-cyan-400 rounded-none p-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-800 font-mono focus:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    />
                    {errors.altura && (
                      <span className="text-[#ff3e6c] text-[10px] font-mono font-bold flex items-center gap-1 mt-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> {errors.altura}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black font-mono text-cyan-400 uppercase tracking-wider block">
                      Peso (kg)
                    </label>
                    <input
                      id="input-peso"
                      type="number"
                      step="any"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      placeholder="Ex: 78.5"
                      className="w-full bg-[#050408] border border-slate-900 focus:border-cyan-400 rounded-none p-4 text-sm text-slate-100 outline-none transition-all placeholder:text-slate-800 font-mono focus:shadow-[0_0_12px_rgba(6,182,212,0.15)]"
                    />
                    {errors.peso && (
                      <span className="text-[#ff3e6c] text-[10px] font-mono font-bold flex items-center gap-1 mt-1">
                        <ShieldAlert className="w-3.5 h-3.5" /> {errors.peso}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              id="btn-step2-next"
              onClick={handleNextStep}
              className="w-full py-4 mt-8 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black tracking-[0.2em] uppercase rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-sm"
            >
              CONTINUAR
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white tracking-widest uppercase neon-text-blue">
                  PRINCIPAL OBJETIVO
                </h2>
                <p className="text-xs text-slate-400 font-mono">Para calibração das futuras missões do Sistema</p>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {OBJETIVOS.map((obj) => (
                  <button
                    id={`btn-objetivo-${obj.id}`}
                    key={obj.id}
                    onClick={() => setObjetivo(obj.id)}
                    className={`w-full p-4 rounded-none text-left border transition-all duration-200 cursor-pointer flex items-center gap-4 relative ${
                      objetivo === obj.id
                        ? 'bg-[#040a12]/30 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'bg-[#07060a]/90 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    {objetivo === obj.id && (
                      <div className="absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_6px_rgba(6,182,212,0.6)]">
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      </div>
                    )}
                    <span className="text-2xl shrink-0">{obj.icon}</span>
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider block ${objetivo === obj.id ? 'text-white' : 'text-slate-400'}`}>{obj.label}</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{obj.desc}</span>
                    </div>
                  </button>
                ))}
                {errors.objetivo && (
                  <span className="text-[#ff3e6c] text-[10px] font-mono font-bold flex items-center gap-1 mt-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {errors.objetivo}
                  </span>
                )}
              </div>
            </div>

            <button
              id="btn-step3-next"
              onClick={handleNextStep}
              className="w-full py-4 mt-6 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black tracking-[0.2em] uppercase rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-sm"
            >
              CONTINUAR
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black font-display text-white tracking-widest uppercase neon-text-blue">
                  FUNDO HISTÓRICO
                </h2>
                <p className="text-xs text-slate-400 font-mono">Qual sua experiência real de treino?</p>
              </div>

              <div className="space-y-3">
                {FREQUENCIAS.map((freq) => (
                  <button
                    id={`btn-frequencia-${freq.id}`}
                    key={freq.id}
                    onClick={() => setFrequenciaTreino(freq.id)}
                    className={`w-full p-4 rounded-none text-left border transition-all duration-200 cursor-pointer flex items-center gap-4 relative ${
                      frequenciaTreino === freq.id
                        ? 'bg-[#040a12]/30 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                        : 'bg-[#07060a]/90 border-slate-900 hover:border-slate-800'
                    }`}
                  >
                    {frequenciaTreino === freq.id && (
                      <div className="absolute top-2.5 right-2.5 w-4.5 h-4.5 rounded-full bg-cyan-400 flex items-center justify-center shadow-[0_0_6px_rgba(6,182,212,0.6)]">
                        <Check className="w-3 h-3 text-black stroke-[3]" />
                      </div>
                    )}
                    <span className="text-2xl shrink-0">{freq.icon}</span>
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider block ${frequenciaTreino === freq.id ? 'text-white' : 'text-slate-400'}`}>{freq.label}</span>
                      <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">{freq.desc}</span>
                    </div>
                  </button>
                ))}
                {errors.frequenciaTreino && (
                  <span className="text-[#ff3e6c] text-[10px] font-mono font-bold flex items-center gap-1 mt-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> {errors.frequenciaTreino}
                  </span>
                )}
              </div>
            </div>

            <button
              id="btn-step4-next"
              onClick={handleNextStep}
              className="w-full py-4 mt-6 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black tracking-[0.2em] uppercase rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-sm"
            >
              CONTINUAR
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">TESTE ADICIONAL</span>
                <h2 className="text-2xl font-black font-display text-white tracking-widest uppercase neon-text-blue">TESTE DE FORÇA</h2>
                <div className="bg-[#05060b] border border-slate-900 rounded-none p-4 text-left space-y-2">
                  <span className="text-[9px] font-mono font-black text-cyan-400 tracking-wider block uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> RECOMENDAÇÃO DO SISTEMA:
                  </span>
                  <p className="text-[10px] text-slate-400 leading-relaxed font-mono">
                    "Agora vamos descobrir seu ponto de partida físico. Digite ou use o controle de cada exercício até seu limite técnico atual. Se não conseguir executar, informe 0."
                  </p>
                </div>
              </div>

              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                {/* Flexões */}
                <div className="bg-[#07060a] border border-slate-900 rounded-none p-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                      <Dumbbell className="w-4 h-4 text-red-500" /> Flexões Consecutivas
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
                        className="w-16 bg-[#030206] border border-slate-800 text-right pr-2 text-md font-mono font-black text-red-500 focus:outline-none focus:border-red-500 rounded-md py-0.5"
                      />
                      <span className="text-xs font-normal text-slate-500 font-mono">reps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFlexoes(prev => Math.max(0, prev - 5))}
                      className="w-9 h-9 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
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
                      className="w-9 h-9 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Agachamentos */}
                <div className="bg-[#07060a] border border-slate-900 rounded-none p-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                      <Dumbbell className="w-4 h-4 text-amber-500" /> Agachamentos Máximos
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
                        className="w-16 bg-[#030206] border border-slate-800 text-right pr-2 text-md font-mono font-black text-amber-500 focus:outline-none focus:border-amber-500 rounded-md py-0.5"
                      />
                      <span className="text-xs font-normal text-slate-500 font-mono">reps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAgachamentos(prev => Math.max(0, prev - 5))}
                      className="w-9 h-9 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
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
                      className="w-9 h-9 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Prancha */}
                <div className="bg-[#07060a] border border-slate-900 rounded-none p-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-2 font-mono">
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
                        className="w-16 bg-[#030206] border border-slate-800 text-right pr-2 text-md font-mono font-black text-cyan-400 focus:outline-none focus:border-cyan-400 rounded-md py-0.5"
                      />
                      <span className="text-xs font-normal text-slate-500 font-mono">seg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPrancha(prev => Math.max(0, prev - 5))}
                      className="w-9 h-9 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
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
                      className="w-9 h-9 rounded-none bg-slate-900 hover:bg-slate-800 border border-slate-900 text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              id="btn-step5-finish"
              onClick={handleNextStep}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black tracking-[0.2em] uppercase rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-sm z-10 mt-4"
            >
              CONCLUIR ANÁLISE
            </button>
          </motion.div>
        )}

        {step === 6 && !showMestreMessage && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono font-black text-cyan-400 tracking-widest uppercase block">ANÁLISE CONCLUÍDA</span>
                <h2 className="text-2xl font-black font-display text-white tracking-widest uppercase neon-text-blue">PERFIL DETECTADO</h2>
              </div>

              {/* Perfil fitness card */}
              <div className="bg-[#07060a] border border-cyan-500/20 rounded-none p-6 text-center space-y-3 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <span className="text-[9px] font-mono font-extrabold text-cyan-400 tracking-widest block uppercase">CLASSIFICAÇÃO DO INDIVÍDUO</span>
                
                <div className="text-3xl font-black text-[#00f0ff] font-display uppercase tracking-widest flex items-center justify-center gap-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                  🏅 {computedProfile?.nivel}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed px-2 font-mono">
                  "{computedProfile?.text}"
                </p>
              </div>

              {/* Primeira missão personalizada */}
              <div className="bg-[#07060a] border border-slate-900 rounded-none p-5 space-y-4">
                <div className="border-b border-slate-900/60 pb-3 flex justify-between items-center">
                  <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-cyan-400" /> MISSÃO DO SISTEMA
                  </span>
                  <span className="text-[8px] px-2 py-0.5 rounded-md bg-cyan-950/20 text-cyan-400 border border-cyan-500/10 font-mono font-bold uppercase tracking-widest">DIÁRIA</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-[#040206] border border-slate-900 rounded-none p-3">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block leading-none">FLEXÕES</span>
                    <span className="text-lg font-mono font-black text-white block mt-1.5">{computedProfile?.flexoes}</span>
                    <span className="text-[8px] text-slate-500 block mt-0.5 font-mono">REPS</span>
                  </div>
                  <div className="bg-[#040206] border border-slate-900 rounded-none p-3">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block leading-none">AGACHAM.</span>
                    <span className="text-lg font-mono font-black text-white block mt-1.5">{computedProfile?.agachamentos}</span>
                    <span className="text-[8px] text-slate-500 block mt-0.5 font-mono">REPS</span>
                  </div>
                  <div className="bg-[#040206] border border-slate-900 rounded-none p-3">
                    <span className="text-[9px] font-mono font-bold text-slate-500 uppercase block leading-none">PRANCHA</span>
                    <span className="text-lg font-mono font-black text-white block mt-1.5">{computedProfile?.prancha}s</span>
                    <span className="text-[8px] text-slate-500 block mt-0.5 font-mono">SEG</span>
                  </div>
                </div>

                <div className="bg-cyan-950/5 border border-cyan-500/15 rounded-none p-3 flex gap-2.5 items-center">
                  <span className="text-xl">⚡</span>
                  <div>
                    <span className="text-[10px] font-mono font-black text-cyan-400 uppercase tracking-wider block">META DE CALIBRAÇÃO</span>
                    <span className="text-xs text-slate-300 font-mono leading-tight">Mantenha as marcas por 10 dias de streak ativo.</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              id="btn-start-journey"
              onClick={handleStartJourney}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black tracking-[0.2em] uppercase rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 cursor-pointer text-sm"
            >
              CONFIRMAR
            </button>
          </motion.div>
        )}

        {showMestreMessage && (
          <motion.div
            key="mestre"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-900 pb-3">
                <div className="w-10 h-10 rounded-none bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Scroll className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase block">SISTEMA COMPLETO</span>
                  <h3 className="text-sm font-black text-white font-display tracking-tight uppercase">📜 MENSAGEM RECEBIDA</h3>
                </div>
              </div>

              <div className="bg-[#05060b]/90 border border-cyan-500/20 rounded-none p-6 space-y-4 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="text-3xl animate-bounce">📜</div>
                
                <h4 className="text-sm font-mono font-black text-white uppercase tracking-wider">Parabéns, Guerreiro.</h4>
                
                <div className="space-y-3 text-[11px] text-slate-300 leading-relaxed text-justify font-mono">
                  <p>
                    O Sistema concluiu sua análise com sucesso. Suas missões foram calibradas e sua jornada no FitnessRPG começou.
                  </p>
                  <p>
                    Siga rigorosamente os exercícios diários calculados para somar XP e conquistar níveis de prestígio.
                  </p>
                  <p className="text-cyan-400 font-bold">
                    A cada 10 dias, o painel do perfil liberará a REAVALIAÇÃO FÍSICA para recalibrar sua força e acelerar seus ganhos.
                  </p>
                  <p>
                    A perseverança é o que diferencia os campeões dos fracos. Mostre sua determinação ao Sistema!
                  </p>
                </div>
              </div>
            </div>

            <button
              id="btn-begin-journey-final"
              onClick={handleBeginGame}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 text-black font-display font-black tracking-[0.2em] uppercase rounded-none shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-200 cursor-pointer text-sm"
            >
              COMEÇAR ⚔️
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
