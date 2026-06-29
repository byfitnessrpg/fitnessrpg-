import React, { useState } from 'react';
import { GameState } from '../types';
import {
  TrendingUp, Dumbbell, Timer, Scale, Ruler, Calendar, ArrowLeft, Check, User, Activity, Flame, Shield, Award, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { calculatePersonalizedFitness } from '../lib/fitnessCalculator';

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
  const isLight = theme === 'light';
  const [step, setStep] = useState<number>(1);
  
  // Form states
  const [idade, setIdade] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  const [altura, setAltura] = useState<string>('');
  const [peso, setPeso] = useState<string>('');
  const [objetivo, setObjetivo] = useState<string>('');
  const [frequenciaTreino, setFrequenciaTreino] = useState<string>('');
  
  const [flexoes, setFlexoes] = useState<number>(10);
  const [agachamentos, setAgachamentos] = useState<number>(15);
  const [prancha, setPrancha] = useState<number>(30);

  const [cronogramaDias, setCronogramaDias] = useState<string[]>(['Seg', 'Qua', 'Sex']);
  const [cronogramaJanela, setCronogramaJanela] = useState<string>('Manhã');
  
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processProgress, setProcessProgress] = useState<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Results calculation state
  const [computedProfile, setComputedProfile] = useState<{
    nivel: string;
    text: string;
    flexoes: number;
    agachamentos: number;
    prancha: number;
  } | null>(null);

  React.useEffect(() => {
    let interval: any = null;
    if (isProcessing && step === 7) {
      interval = setInterval(() => {
        setProcessProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            setTimeout(() => {
              calculateResults();
              setStep(8);
            }, 600);
            return 100;
          }
          return prev + 4;
        });
      }, 60);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing, step]);

  const getProcessingMessage = (progress: number): string => {
    if (progress === 0) return 'PREPARANDO ANÁLISE...';
    if (progress < 25) return 'ANALISANDO DADOS FISIOLÓGICOS...';
    if (progress < 50) return 'PROCESSANDO CAPACIDADE NEUROMUSCULAR...';
    if (progress < 75) return 'DETERMINANDO SEU NÍVEL DE CALISTENIA...';
    if (progress < 95) return 'MODELANDO PLANO PERSONALIZADO...';
    return 'PLANO DE TREINO GERADO!';
  };

  const OBJETIVOS = [
    { id: 'Emagrecer', icon: '🔥', label: 'Emagrecer', desc: 'Queima de gordura e definição corporal' },
    { id: 'Ganhar massa muscular', icon: '💪', label: 'Ganhar força e massa', desc: 'Hipertrofia muscular através de calistenia' },
    { id: 'Melhorar condicionamento', icon: '⚡', label: 'Condicionamento Físico', desc: 'Mais fôlego, agilidade e resistência' },
    { id: 'Criar hábito de treinar', icon: '📅', label: 'Hábito e Consistência', desc: 'Desenvolver disciplina com foco em constância' },
    { id: 'Manter a saúde', icon: '💎', label: 'Saúde e Bem-estar', desc: 'Mobilidade, fortalecimento e longevidade' },
  ];

  const EXPERIENCIAS = [
    { id: 'Nunca treino', icon: '🛋️', label: 'Iniciante do zero', desc: 'Sedentário ou parado há bastante tempo' },
    { id: 'Treino raramente', icon: '🚶', label: 'Intermediário esporádico', desc: 'Pratico de vez em quando sem rotina fixa' },
    { id: 'Treino 2-3 vezes por semana', icon: '🏃', label: 'Ativo frequente', desc: 'Costumo treinar regularmente na semana' },
    { id: 'Treino 4 ou mais vezes por semana', icon: '⚡', label: 'Avançado consistente', desc: 'Treino de alta consistência e intensidade' },
  ];

  const handleNextStep = () => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      const parsedVal = parseInt(idade);
      if (!idade || isNaN(parsedVal)) {
        newErrors.idade = 'Informe uma idade válida.';
      } else if (parsedVal < 10 || parsedVal > 110) {
        newErrors.idade = 'Informe uma idade entre 10 e 110 anos.';
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
        newErrors.frequenciaTreino = 'Por favor, selecione seu nível de experiência.';
        setErrors(newErrors);
        return;
      }
    }

    setErrors({});

    if (step === 5) {
      setStep(6);
    } else if (step === 6) {
      if (cronogramaDias.length === 0) {
        newErrors.cronogramaDias = 'Selecione pelo menos 1 dia para o seu cronograma semanal.';
        setErrors(newErrors);
        return;
      }
      setProcessProgress(0);
      setIsProcessing(true);
      setStep(7);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setIsProcessing(false);
    setProcessProgress(0);
    setStep(prev => Math.max(1, prev - 1));
  };

  const calculateResults = () => {
    const profile = calculatePersonalizedFitness({
      sexo,
      idade: parseInt(idade) || 25,
      altura: parseFloat(altura) || 170,
      peso: parseFloat(peso) || 70,
      objetivo,
      frequenciaTreino,
      flexoesTest: flexoes,
      agachamentosTest: agachamentos,
      pranchaTest: prancha,
    });

    setComputedProfile({
      nivel: profile.nivel,
      text: profile.text,
      flexoes: profile.flexoes,
      agachamentos: profile.agachamentos,
      prancha: profile.prancha,
    });
  };

  const handleBeginProgram = () => {
    if (!computedProfile) return;

    const today = new Date().toDateString();
    const nextReassessmentDate = new Date();
    nextReassessmentDate.setDate(nextReassessmentDate.getDate() + 10);

    const updatedState: GameState = {
      ...gameState,
      avaliacao_concluida: true,
      idade: parseInt(idade) || 25,
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
      cronograma_dias: cronogramaDias,
      cronograma_janela: cronogramaJanela,
      weight: parseFloat(peso),
      weightHistory: [
        ...(gameState.weightHistory || []),
        { date: new Date().toLocaleDateString('pt-BR'), value: parseFloat(peso) }
      ],
      // Reset fitness specs to clean slate
      charClass: undefined,
      charName: undefined,
      statPoints: 0,
      level: 1,
      xp: 0,
      totalXP: 0,
    };

    onComplete(updatedState);
  };

  const SEX_OPTIONS = [
    { id: 'Masculino', label: 'Masculino' },
    { id: 'Feminino', label: 'Feminino' },
    { id: 'Outro', label: 'Outro' }
  ];

  const DAYS_OF_WEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const TIME_OPTIONS = ['Manhã', 'Tarde', 'Noite'];

  return (
    <div className={`min-h-screen flex flex-col max-w-md mx-auto relative ${isLight ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-slate-100'} p-6 justify-between select-none font-sans overflow-y-auto no-scrollbar pb-10`}>
      {/* Background accents */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none z-0" />
      
      {/* Top Navigation */}
      {step > 1 && step < 8 && (
        <div className="w-full flex items-center gap-4 pt-2 pb-6 z-10 shrink-0">
          <button 
            onClick={handlePrevStep}
            className="text-blue-500 hover:text-blue-600 active:scale-95 transition-all cursor-pointer p-1"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          
          <div className="flex-1 h-1 bg-slate-200 dark:bg-slate-900 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${((step - 1) / 6) * 100}%` }}
            />
          </div>

          <span className="text-[10px] font-mono font-bold text-slate-400">
            PASSO {step - 1}/6
          </span>
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
            {/* Top Pill */}
            <div className="pt-2 flex justify-center w-full">
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-full text-[10px] font-mono tracking-widest uppercase font-bold">
                EVOLUÇÃO REAL EM CASA
              </span>
            </div>

            {/* Icon Graphic */}
            <div className="w-24 h-24 rounded-3xl bg-blue-500 flex items-center justify-center text-white my-8 shadow-xl shadow-blue-500/20">
              <TrendingUp className="w-12 h-12 stroke-[2.5]" />
            </div>

            {/* Main branding */}
            <div className="text-center space-y-2.5 max-w-xs">
              <h1 className="text-3xl font-black tracking-tight uppercase">
                Fitness <span className="text-blue-500">Evolution</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                Sua jornada definitiva de treinos calistênicos em casa. Sem falsas promessas, focado 100% no seu progresso pessoal e hábitos saudáveis.
              </p>
            </div>

            {/* High fidelity features checklist */}
            <div className="w-full bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-900/60 rounded-2xl p-4 space-y-3.5 my-8">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Plano de Treino Científico</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Calculado proporcionalmente à sua aptidão atual para máxima consistência.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Acompanhamento de Métricas</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Acompanhe seu peso, sequência de treinos (streak), resistência e ganho de força real.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Reavaliação de Progresso</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">O sistema se adapta de forma inteligente a cada 10 dias com novos testes físicos.</p>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="w-full space-y-3 shrink-0">
              <button
                onClick={handleNextStep}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm tracking-wide uppercase rounded-xl transition-all cursor-pointer shadow-lg shadow-blue-500/10 active:scale-[0.98]"
              >
                COMEÇAR AVALIAÇÃO INICIAL
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full py-2 bg-transparent text-slate-400 dark:text-slate-500 hover:text-slate-300 font-bold text-xs uppercase transition-all tracking-wider text-center"
                >
                  Entrar com outra conta
                </button>
              )}
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
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  DADOS FISIOLÓGICOS
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Precisamos dessas métricas básicas para calibrar seu treino.</p>
              </div>

              <div className="space-y-4">
                {/* Idade */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                    Sua Idade (anos)
                  </label>
                  <input
                    type="number"
                    pattern="[0-9]*"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    placeholder="Ex: 26"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none transition-all focus:border-blue-500"
                  />
                  {errors.idade && (
                    <span className="text-red-500 text-[10px] font-semibold block">{errors.idade}</span>
                  )}
                </div>

                {/* Sexo */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                    Sexo Biológico
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {SEX_OPTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSexo(s.id)}
                        className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                          sexo === s.id
                            ? 'bg-blue-500/10 border-blue-500 text-blue-500 font-bold'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold tracking-wide">{s.label}</span>
                      </button>
                    ))}
                  </div>
                  {errors.sexo && (
                    <span className="text-red-500 text-[10px] font-semibold block">{errors.sexo}</span>
                  )}
                </div>

                {/* Altura & Peso Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      pattern="[0-9]*"
                      value={altura}
                      onChange={(e) => setAltura(e.target.value)}
                      placeholder="Ex: 175"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none transition-all focus:border-blue-500"
                    />
                    {errors.altura && (
                      <span className="text-red-500 text-[10px] font-semibold block">{errors.altura}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                      Peso Atual (kg)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={peso}
                      onChange={(e) => setPeso(e.target.value)}
                      placeholder="Ex: 72.4"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none transition-all focus:border-blue-500"
                    />
                    {errors.peso && (
                      <span className="text-red-500 text-[10px] font-semibold block">{errors.peso}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide uppercase rounded-xl transition-all cursor-pointer active:scale-95 text-sm"
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
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  QUAL SEU OBJETIVO?
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Isso ajustará o volume e as repetições sugeridas de calistenia.</p>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                {OBJETIVOS.map((obj) => (
                  <button
                    key={obj.id}
                    onClick={() => setObjetivo(obj.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer flex items-center gap-4 relative ${
                      objetivo === obj.id
                        ? 'bg-blue-500/10 border-blue-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {objetivo === obj.id && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                    <span className="text-2xl shrink-0">{obj.icon}</span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block">{obj.label}</span>
                      <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">{obj.desc}</span>
                    </div>
                  </button>
                ))}
                {errors.objetivo && (
                  <span className="text-red-500 text-[10px] font-semibold block">{errors.objetivo}</span>
                )}
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide uppercase rounded-xl transition-all cursor-pointer active:scale-95 text-sm"
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
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  EXPERIÊNCIA COM TREINOS
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Qual o seu nível de atividade física no momento?</p>
              </div>

              <div className="space-y-3">
                {EXPERIENCIAS.map((freq) => (
                  <button
                    key={freq.id}
                    onClick={() => setFrequenciaTreino(freq.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer flex items-center gap-4 relative ${
                      frequenciaTreino === freq.id
                        ? 'bg-blue-500/10 border-blue-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    {frequenciaTreino === freq.id && (
                      <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white stroke-[3]" />
                      </div>
                    )}
                    <span className="text-2xl shrink-0">{freq.icon}</span>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block">{freq.label}</span>
                      <span className="text-[10.5px] text-slate-400 leading-tight block mt-0.5">{freq.desc}</span>
                    </div>
                  </button>
                ))}
                {errors.frequenciaTreino && (
                  <span className="text-red-500 text-[10px] font-semibold block">{errors.frequenciaTreino}</span>
                )}
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide uppercase rounded-xl transition-all cursor-pointer active:scale-95 text-sm"
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
                <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-widest block">TESTE FÍSICO INICIAL</span>
                <h2 className="text-2xl font-black tracking-tight uppercase">CAPACIDADE ATUAL</h2>
                <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-900 rounded-xl p-4 text-left">
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Insira quantas repetições de cada exercício você consegue fazer <strong>sem parar</strong> até atingir sua fadiga técnica. Seja honesto para calibrar seu treino adequadamente.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Flexões */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-blue-500 animate-pulse" /> Flexões Clássicas
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
                        className="w-14 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-sm font-bold text-blue-500 focus:outline-none focus:border-blue-500 rounded-lg py-1"
                      />
                      <span className="text-[10px] font-bold text-slate-500">reps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setFlexoes(prev => Math.max(0, prev - 2))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="2"
                      value={flexoes}
                      onChange={(e) => setFlexoes(parseInt(e.target.value) || 0)}
                      className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFlexoes(prev => prev + 2)}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Agachamentos */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Dumbbell className="w-4 h-4 text-blue-500 animate-pulse" /> Agachamentos Livres
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
                        className="w-14 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-sm font-bold text-blue-500 focus:outline-none focus:border-blue-500 rounded-lg py-1"
                      />
                      <span className="text-[10px] font-bold text-slate-500">reps</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAgachamentos(prev => Math.max(0, prev - 2))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="120"
                      step="2"
                      value={agachamentos}
                      onChange={(e) => setAgachamentos(parseInt(e.target.value) || 0)}
                      className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setAgachamentos(prev => prev + 2)}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Prancha */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Timer className="w-4 h-4 text-blue-500" /> Prancha Isométrica
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
                        className="w-14 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center text-sm font-bold text-blue-500 focus:outline-none focus:border-blue-500 rounded-lg py-1"
                      />
                      <span className="text-[10px] font-bold text-slate-500">seg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPrancha(prev => Math.max(0, prev - 5))}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      step="5"
                      value={prancha}
                      onChange={(e) => setPrancha(parseInt(e.target.value) || 0)}
                      className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setPrancha(prev => prev + 5)}
                      className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 text-slate-600 dark:text-white font-bold flex items-center justify-center cursor-pointer transition-all active:scale-95 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide uppercase rounded-xl transition-all cursor-pointer active:scale-95 text-sm"
            >
              CONTINUAR
            </button>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="step6"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  DISPONIBILIDADE
                </h2>
                <p className="text-xs text-slate-400 dark:text-slate-500">Quais dias e períodos prefere treinar calistenia?</p>
              </div>

              <div className="space-y-5">
                {/* Dias de Treino */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                    Dias para treinar
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = cronogramaDias.includes(day);
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setCronogramaDias(prev => prev.filter(d => d !== day));
                            } else {
                              setCronogramaDias(prev => [...prev, day]);
                            }
                          }}
                          className={`py-3 rounded-lg border text-center transition-all cursor-pointer font-bold text-xs ${
                            isSelected
                              ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/10'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>
                  {errors.cronogramaDias && (
                    <span className="text-red-500 text-[10px] font-semibold block">{errors.cronogramaDias}</span>
                  )}
                </div>

                {/* Período Preferido */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide block">
                    Horário Preferido
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {TIME_OPTIONS.map((time) => {
                      const isSelected = cronogramaJanela === time;
                      return (
                        <button
                          key={time}
                          type="button"
                          onClick={() => setCronogramaJanela(time)}
                          className={`p-4 rounded-xl border text-center transition-all cursor-pointer font-bold text-xs ${
                            isSelected
                              ? 'bg-blue-500/10 border-blue-500 text-blue-500 font-bold'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="block">{time}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full py-4 mt-8 bg-blue-500 hover:bg-blue-600 text-white font-bold tracking-wide uppercase rounded-xl transition-all cursor-pointer active:scale-95 text-sm"
            >
              CRIAR MEU PLANO PERSONALIZADO
            </button>
          </motion.div>
        )}

        {step === 7 && (
          <motion.div
            key="step7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center py-12 z-10 w-full"
          >
            <div className="space-y-6 text-center max-w-xs">
              {/* Spinning Ring */}
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-200 dark:border-slate-900" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold text-blue-500 tracking-widest uppercase block animate-pulse">
                  {processProgress}% CONCLUÍDO
                </span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">{getProcessingMessage(processProgress)}</h3>
                <p className="text-xs text-slate-400">Nosso algoritmo está montando as metas ideais para o seu corpo.</p>
              </div>
            </div>
          </motion.div>
        )}

        {step === 8 && computedProfile && (
          <motion.div
            key="step8"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col justify-between py-4 z-10 w-full"
          >
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6 stroke-[2.5]" />
                </div>
                <h2 className="text-2xl font-black tracking-tight uppercase">
                  PLANO GERADO!
                </h2>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">Tudo pronto para iniciarmos sua evolução de forma segura e científica.</p>
              </div>

              {/* Assessment Card Details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-900/60 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-400 uppercase">Seu Nível Inicial</span>
                  <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-500 rounded-full text-xs font-black uppercase">
                    {computedProfile.nivel}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  "{computedProfile.text}"
                </p>

                {/* Exercises of the plan */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Metas de Repetições Sugeridas</span>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-900 text-center">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Flexões</span>
                      <span className="text-xl font-black text-blue-500">{computedProfile.flexoes}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">reps/série</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-900 text-center">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Agacham.</span>
                      <span className="text-xl font-black text-blue-500">{computedProfile.agachamentos}</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">reps/série</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-900 text-center">
                      <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Prancha</span>
                      <span className="text-xl font-black text-blue-500">{computedProfile.prancha}s</span>
                      <span className="text-[9px] text-slate-400 block mt-0.5">segundos</span>
                    </div>
                  </div>
                </div>

                {/* Additional metrics */}
                <div className="flex justify-between items-center text-[10.5px] font-mono text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-500" /> {cronogramaDias.length} treinos/semana</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-blue-500" /> Período: {cronogramaJanela}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-6 shrink-0">
              <button
                onClick={handleBeginProgram}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm tracking-wide uppercase rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
              >
                COMEÇAR MEU TREINO AGORA!
              </button>
              <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                Suas informações serão salvas localmente e um ciclo de 10 dias de acompanhamento começará hoje.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
