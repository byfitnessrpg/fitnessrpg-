import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Exercise, GameState, WeeklyMission, SpecialMission, Achievement } from './types';
import { EXERCISES, WEEKLY_MISSIONS, SPECIAL_MISSIONS, ACHIEVEMENTS } from './data';
import { Header } from './components/Header';
import { XPBar } from './components/XPBar';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { MissionsTab } from './components/MissionsTab';
import { AchievementsTab } from './components/AchievementsTab';
import { RankingTab } from './components/RankingTab';
import { ProfileTab } from './components/ProfileTab';
import { EvolutionTab } from './components/EvolutionTab';
import { MissionScreen } from './components/MissionScreen';
import { RecoveryMissionScreen } from './components/RecoveryMissionScreen';
import { RECOVERY_ACTIVITIES } from './components/HomeTab';
import { AuthScreen } from './components/AuthScreen';
import { AssessmentScreen } from './components/AssessmentScreen';
import { ReassessmentModal } from './components/ReassessmentModal';
import { Trophy, Star, Sparkles, WifiOff, AlertTriangle, ShieldCheck, Flame, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OATH_OPTIONS = [
  {
    id: 'soul_mirror',
    icon: '🛡️',
    title: 'O Espelho da Alma',
    quote: 'Sua força no jogo é um reflexo exato do seu suor no mundo real. Trapacear nas missões é apenas sabotar o seu próprio herói. Treine de verdade, vença de verdade!',
    effect: 'Conexão Espiritual Ativa'
  },
  {
    id: 'warrior_way',
    icon: '⚔️',
    title: 'O Caminho do Guerreiro',
    quote: 'Não existem atalhos para se tornar uma lenda do fitness. Cada clique sem esforço legítimo enfraquece o seu caráter. Sua energia física real é o verdadeiro poder do seu avatar!',
    effect: 'Energia Vital Legítima'
  },
  {
    id: 'stats_pact',
    icon: '🔥',
    title: 'O Pacto dos Atributos',
    quote: 'Seus músculos são o controle; a tela é apenas o reflexo. Concluir missões falsamente não altera sua realidade. Eleve seus atributos na vida real e veja sua armadura brilhar!',
    effect: 'Pacto da Força Verdadeira'
  }
];

const generateFriendCode = (name?: string) => {
  if (name && name.trim().length >= 3) {
    const clean = name.trim().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 5);
    const num = Math.floor(100 + Math.random() * 900);
    return `${clean}-${num}`;
  }
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'FIT-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const ensureFriendSystemState = (state: GameState): GameState => {
  const updated = { ...state };
  if (!updated.friendCode) {
    updated.friendCode = generateFriendCode(updated.charName || 'CAÇADOR');
  }
  
  // Start with empty friends or filter out the mock ones to clean up the existing local state
  if (updated.friends) {
    updated.friends = updated.friends.filter(f => f.code !== 'JOAO-73' && f.code !== 'PEDRO-42' && f.code !== 'ANA-91');
  } else {
    updated.friends = [];
  }

  if (updated.weeklyXP === undefined) {
    updated.weeklyXP = Math.min(1820, updated.totalXP || 0);
  }

  if (!updated.friendChallenges || updated.friendChallenges.length === 0) {
    updated.friendChallenges = [
      {
        id: 'ch-1',
        title: 'Desafio de Flexões',
        target: 100,
        exerciseType: 'flexoes',
        creatorCode: updated.friendCode || 'YOU-CODE',
        participants: [
          { code: 'YOU-CODE', name: 'Você', progress: 0 }
        ]
      },
      {
        id: 'ch-2',
        title: 'Super Agachamentos',
        target: 150,
        exerciseType: 'agachamentos',
        creatorCode: updated.friendCode || 'YOU-CODE',
        participants: [
          { code: 'YOU-CODE', name: 'Você', progress: 0 }
        ]
      }
    ];
  } else {
    // Filter out the mock participants from existing challenges too
    updated.friendChallenges = updated.friendChallenges.map(ch => ({
      ...ch,
      participants: ch.participants.filter(p => p.code !== 'JOAO-73' && p.code !== 'PEDRO-42' && p.code !== 'ANA-91')
    }));
  }

  // Bind proper user friendCode and name inside active challenges
  if (updated.friendChallenges) {
    updated.friendChallenges = updated.friendChallenges.map(ch => ({
      ...ch,
      participants: ch.participants.map(p => {
        if (p.code === 'YOU-CODE' || p.name === 'Você') {
          return { ...p, code: updated.friendCode || 'YOU-CODE', name: updated.charName || 'Você' };
        }
        return p;
      })
    }));
  }

  if (updated.recruitsCount === undefined) {
    updated.recruitsCount = 0;
  }

  return updated;
};

const DEFAULT_STATE: GameState = {
  level: 1,
  xp: 0,
  totalXP: 0,
  streak: 0,
  lastTrainingDate: null,
  totalMissions: 0,
  completedToday: [],
  completedRecoveryToday: [],
  weekDaysTraining: 0,
  weekFlexoes: 0,
  weekCardio: 0,
  weekConsistency: 0,
  totalFlexoes: 0,
  totalAgacham: 0,
  totalPrancha: 0,
  maxDayMissions: 0,
  maxConsecutive: 0,
  consecutiveRun: 0,
  completedWeekly: [],
  completedSpecial: [],
  unlockedAchievements: [],
  earlyBird: false,
  trioPerfect: false,
  todayCategories: [],
  str: 10,
  agi: 10,
  sta: 10,
  int: 10,
  waterIntake: 0,
  waterGoal: 2000,
  charClass: 'Caçador',
  charName: '',
  statPoints: 0,
  chosenOath: '',
  friendCode: '',
  friends: [],
  weeklyXP: 0,
  friendChallenges: [],
  recruitsCount: 0,
  avaliacao_concluida: false,
  notificacoes_ativas: false,
  notificacoes_token: '',
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [viewingAuth, setViewingAuth] = useState<boolean>(false);
  const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [activeRecoveryActivityId, setActiveRecoveryActivityId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('fitnessRPG_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('fitnessRPG_theme', next);
      return next;
    });
  };

  // Overlay Notification States
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'gold' | 'default' } | null>(null);
  const [levelUpShow, setLevelUpShow] = useState<number | null>(null);
  const [achievementFlash, setAchievementFlash] = useState<Achievement | null>(null);
  const [customModal, setCustomModal] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });
  const [showGMModal, setShowGMModal] = useState<boolean>(false);
  const [showReassessment, setShowReassessment] = useState<boolean>(false);
  const [selectedOathId, setSelectedOathId] = useState<string>('soul_mirror');
  const [showAssessment, setShowAssessment] = useState<boolean>(false);
  const [showAssessmentAnnouncement, setShowAssessmentAnnouncement] = useState<boolean>(() => {
    return localStorage.getItem('fitnessRPG_dismissedAssessment') !== 'true';
  });

  // Formula matching exactly: Math.floor(100 * Math.pow(lv, 1.5))
  const xpForLevel = (lv: number) => {
    return Math.floor(100 * Math.pow(lv, 1.5));
  };

  // 1. Connectivity Status & Referral listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Save referral code from URL parameters
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      localStorage.setItem('fitnessRPG_referrer', refCode.trim().toUpperCase());
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 1b. Automatic Reassessment Check
  useEffect(() => {
    if (gameState.avaliacao_concluida && gameState.proxima_reavaliacao) {
      const nextDate = new Date(gameState.proxima_reavaliacao);
      const now = new Date();
      if (now >= nextDate) {
        setShowReassessment(true);
      }
    }
  }, [gameState.avaliacao_concluida, gameState.proxima_reavaliacao]);

  // 2. Auth State Changed listeners
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        loadProgress(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        loadProgress(session.user);
      } else {
        setUser(null);
        setGameState(DEFAULT_STATE);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Initialize notifications if active
  useEffect(() => {
    if (gameState.notificacoes_ativas) {
      import('./lib/notifications').then(({ initializeNotifications }) => {
        initializeNotifications().catch(err => {
          console.warn('Erro ao inicializar notificações ao carregar o aplicativo:', err);
        });
      });
    }
  }, [gameState.notificacoes_ativas]);

  // Run background notification engine check on active game state
  useEffect(() => {
    if (gameState.notificacoes_ativas) {
      import('./lib/notificationEngine').then(({ checkAndTriggerIntelligentNotifications }) => {
        const timer = setTimeout(() => {
          checkAndTriggerIntelligentNotifications(gameState).catch(err => {
            console.warn('Erro ao processar checagem automática de notificações:', err);
          });
        }, 3000);
        return () => clearTimeout(timer);
      });
    }
  }, [gameState.notificacoes_ativas, gameState.waterIntake, gameState.completedToday?.length]);



  // Load progress from Supabase / LocalStorage
  const loadProgress = async (currentUser: any) => {
    try {
      if (!currentUser) return;

      // 1. Fetch profiles table
      let { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile, create a default one
        const newProfile = {
          id: currentUser.id,
          nome: currentUser.user_metadata?.char_name || currentUser.email?.split('@')[0] || 'Guerreiro',
          xp: 0,
          nivel: 1,
          moedas: 0,
          streak: 0,
          total_missions: 0,
          max_day_missions: 0,
          last_training_date: null,
          total_xp: 0,
          profile_pic: null,
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) throw insertError;
        profile = newProfile;
      } else if (error) {
        throw error;
      }

      // Check local cache too
      const cached = localStorage.getItem('fitnessRPG_state');
      const loadedLocal = cached ? JSON.parse(cached) : {};

      // Parse metadata from profile_pic JSON
      let rawProfilePic = profile.profile_pic || '';
      let parsedProfilePic = '';
      let dbFriendCode = '';
      let dbInvitedBy = '';
      let parsedAssessment: Partial<GameState> = {};

      if (rawProfilePic && rawProfilePic.startsWith('{')) {
        try {
          const parsed = JSON.parse(rawProfilePic);
          parsedProfilePic = parsed.image || '';
          dbFriendCode = parsed.friendCode || '';
          dbInvitedBy = parsed.invitedBy || '';
          
          if (parsed.avaliacao_concluida !== undefined) parsedAssessment.avaliacao_concluida = parsed.avaliacao_concluida;
          if (parsed.idade !== undefined) parsedAssessment.idade = parsed.idade;
          if (parsed.sexo !== undefined) parsedAssessment.sexo = parsed.sexo;
          if (parsed.altura !== undefined) parsedAssessment.altura = parsed.altura;
          if (parsed.peso !== undefined) parsedAssessment.peso = parsed.peso;
          if (parsed.objetivo !== undefined) parsedAssessment.objetivo = parsed.objetivo;
          if (parsed.frequencia_treino !== undefined) parsedAssessment.frequencia_treino = parsed.frequencia_treino;
          if (parsed.flexoes_inicial !== undefined) parsedAssessment.flexoes_inicial = parsed.flexoes_inicial;
          if (parsed.agachamentos_inicial !== undefined) parsedAssessment.agachamentos_inicial = parsed.agachamentos_inicial;
          if (parsed.prancha_inicial !== undefined) parsedAssessment.prancha_inicial = parsed.prancha_inicial;
          if (parsed.ultima_avaliacao !== undefined) parsedAssessment.ultima_avaliacao = parsed.ultima_avaliacao;
          if (parsed.proxima_reavaliacao !== undefined) parsedAssessment.proxima_reavaliacao = parsed.proxima_reavaliacao;
          if (parsed.nivel_fitness !== undefined) parsedAssessment.nivel_fitness = parsed.nivel_fitness;
          if (parsed.missao_personalizada !== undefined) parsedAssessment.missao_personalizada = parsed.missao_personalizada;
          if (parsed.notificacoes_ativas !== undefined) parsedAssessment.notificacoes_ativas = parsed.notificacoes_ativas;
          if (parsed.notificacoes_token !== undefined) parsedAssessment.notificacoes_token = parsed.notificacoes_token;
          if (parsed.cronograma_dias !== undefined) parsedAssessment.cronograma_dias = parsed.cronograma_dias;
          if (parsed.cronograma_janela !== undefined) parsedAssessment.cronograma_janela = parsed.cronograma_janela;
        } catch (e) {
          console.warn("Failed to parse profilePic metadata JSON from database", e);
          parsedProfilePic = rawProfilePic;
        }
      } else {
        parsedProfilePic = rawProfilePic;
      }

      // Resolving codes and referrers
      let resolvedFriendCode = dbFriendCode || loadedLocal.friendCode || '';
      if (!resolvedFriendCode) {
        resolvedFriendCode = generateFriendCode(profile.nome || loadedLocal.charName || 'CAÇADOR');
      }

      let resolvedInvitedBy = dbInvitedBy || loadedLocal.invitedBy || '';
      const localReferrer = localStorage.getItem('fitnessRPG_referrer');

      if (!resolvedInvitedBy && localReferrer) {
        const cleanReferrer = localReferrer.trim().toUpperCase();
        // 1. Prevent self-referral
        if (cleanReferrer !== resolvedFriendCode) {
          // 2. Validate that the referrer actually exists in DB
          try {
            const { data: refCheck } = await supabase
              .from('profiles')
              .select('id')
              .like('profile_pic', `%friendCode":"${cleanReferrer}%`)
              .limit(1);

            if (refCheck && refCheck.length > 0) {
              resolvedInvitedBy = cleanReferrer;
              localStorage.removeItem('fitnessRPG_referrer');
            } else {
              console.warn(`Referral code ${cleanReferrer} does not exist in DB.`);
            }
          } catch (e) {
            console.error("Failed to validate referral code", e);
          }
        } else {
          console.warn("Self-referral is not allowed.");
          localStorage.removeItem('fitnessRPG_referrer');
        }
      }

      // Fetch real recruits count from the DB
      let recruits = 0;
      if (resolvedFriendCode) {
        try {
          const { data: recruitsData } = await supabase
            .from('profiles')
            .select('profile_pic')
            .like('profile_pic', `%invitedBy":"${resolvedFriendCode}%`);
          recruits = recruitsData ? recruitsData.length : 0;
        } catch (e) {
          console.error("Failed to fetch recruits count", e);
        }
      }

      // Merging profile & local storage data securely
      const mergedState: GameState = {
        ...DEFAULT_STATE,
        ...loadedLocal,
        ...parsedAssessment,
        charName: profile.nome || loadedLocal.charName || DEFAULT_STATE.charName || '',
        profilePic: parsedProfilePic || loadedLocal.profilePic || DEFAULT_STATE.profilePic || '',
        xp: profile.xp || 0,
        level: profile.nivel || 1,
        streak: profile.streak || 0,
        totalMissions: profile.total_missions || 0,
        maxDayMissions: profile.max_day_missions || 0,
        lastTrainingDate: profile.last_training_date || null,
        totalXP: profile.total_xp || profile.xp || 0,
        chosenOath: loadedLocal.chosenOath || DEFAULT_STATE.chosenOath || '',
        friendCode: resolvedFriendCode,
        invitedBy: resolvedInvitedBy,
        recruitsCount: recruits,
      };

      // Check day reset
      const checkedState = checkDayReset(mergedState);
      const finalizedState = ensureFriendSystemState(checkedState);
      setGameState(finalizedState);
      localStorage.setItem('fitnessRPG_state', JSON.stringify(finalizedState));

      // Trigger progress save immediately if resolved new values to update DB
      if (resolvedFriendCode !== dbFriendCode || resolvedInvitedBy !== dbInvitedBy) {
        await saveProgress(finalizedState);
      }

    } catch (e) {
      console.warn('Erro ao carregar dados do Supabase. Carregando dados locais...', e);
      const cached = localStorage.getItem('fitnessRPG_state');
      if (cached) {
        const parsed = JSON.parse(cached);
        const checked = checkDayReset(parsed);
        const finalized = ensureFriendSystemState(checked);
        setGameState(finalized);
      }
    }
  };

  const isScheduledTrainingDay = (date: Date, cronogramaDias?: string[]): boolean => {
    if (!cronogramaDias || cronogramaDias.length === 0) return true; // Default to all days if not configured
    const DAYS_MAP = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const dayAbbrev = DAYS_MAP[date.getDay()];
    return cronogramaDias.includes(dayAbbrev);
  };

  // Check and perform midnight date resets
  const checkDayReset = (stateVal: GameState): GameState => {
    const today = new Date().toDateString();
    if (stateVal.lastTrainingDate && stateVal.lastTrainingDate !== today) {
      let updatedState = { ...stateVal };

      // Parse dates to check for missed training days
      const lastDate = new Date(stateVal.lastTrainingDate);
      const currentDate = new Date(today);
      
      // Calculate days difference
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let missedTrainingDays = 0;
      // Check each day between lastTrainingDate and yesterday (exclusive)
      for (let i = 1; i < diffDays; i++) {
        const checkDate = new Date(lastDate);
        checkDate.setDate(checkDate.getDate() + i);
        if (isScheduledTrainingDay(checkDate, stateVal.cronograma_dias)) {
          missedTrainingDays++;
        }
      }

      if (stateVal.completedToday.length > 0) {
        if (missedTrainingDays === 0) {
          updatedState.streak = (updatedState.streak || 0) + 1;
        } else {
          updatedState.streak = 1; // start new streak since they completed today but missed days
        }
        updatedState.maxDayMissions = Math.max(updatedState.maxDayMissions, stateVal.completedToday.length);
      } else {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (isScheduledTrainingDay(yesterday, stateVal.cronograma_dias) || missedTrainingDays > 0) {
          updatedState.streak = 0;
        }
      }

      updatedState.completedToday = [];
      updatedState.completedRecoveryToday = [];
      updatedState.todayCategories = [];
      updatedState.earlyBird = false;
      updatedState.trioPerfect = false;

      return updatedState;
    }
    return stateVal;
  };

  // Sync / Save states to local & Supabase
  const saveProgress = async (updatedState: GameState) => {
    try {
      localStorage.setItem('fitnessRPG_state', JSON.stringify(updatedState));

      if (user) {
        // Bundled metadata inside the profile_pic column
        const metaPayload = JSON.stringify({
          image: updatedState.profilePic || '',
          friendCode: updatedState.friendCode || '',
          invitedBy: updatedState.invitedBy || '',
          avaliacao_concluida: updatedState.avaliacao_concluida,
          idade: updatedState.idade,
          sexo: updatedState.sexo,
          altura: updatedState.altura,
          peso: updatedState.peso,
          objetivo: updatedState.objetivo,
          frequencia_treino: updatedState.frequencia_treino,
          flexoes_inicial: updatedState.flexoes_inicial,
          agachamentos_inicial: updatedState.agachamentos_inicial,
          prancha_inicial: updatedState.prancha_inicial,
          ultima_avaliacao: updatedState.ultima_avaliacao,
          proxima_reavaliacao: updatedState.proxima_reavaliacao,
          nivel_fitness: updatedState.nivel_fitness,
          missao_personalizada: updatedState.missao_personalizada,
          notificacoes_ativas: updatedState.notificacoes_ativas,
          notificacoes_token: updatedState.notificacoes_token,
          cronograma_dias: updatedState.cronograma_dias,
          cronograma_janela: updatedState.cronograma_janela,
        });

        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            nome: updatedState.charName || user.email?.split('@')[0] || 'Guerreiro',
            xp: updatedState.xp,
            nivel: updatedState.level,
            streak: updatedState.streak,
            total_missions: updatedState.totalMissions,
            max_day_missions: updatedState.maxDayMissions,
            last_training_date: updatedState.lastTrainingDate,
            total_xp: updatedState.totalXP,
            profile_pic: metaPayload,
          });
      }
    } catch (e) {
      console.error('Falha ao salvar progresso síncrono:', e);
    }
  };

  // Scaled exercise target value based on completed total missions and consecutive days streak
  const getScaledTarget = (ex: Exercise) => {
    let baseTarget = ex.base;
    let maxCap = Infinity;

    if (gameState.missao_personalizada) {
      if (ex.id === 'd1') {
        baseTarget = gameState.missao_personalizada.flexoes || ex.base;
        maxCap = gameState.flexoes_inicial || baseTarget;
      } else if (ex.id === 'd2') {
        baseTarget = gameState.missao_personalizada.agachamentos || ex.base;
        maxCap = gameState.agachamentos_inicial || baseTarget;
      } else if (ex.id === 'd3') {
        baseTarget = gameState.missao_personalizada.prancha || ex.base;
        maxCap = gameState.prancha_inicial || baseTarget;
      } else {
        const factor = Math.min(1, gameState.totalMissions / 50);
        const range = ex.max - ex.base;
        baseTarget = Math.floor(ex.base + range * factor);
      }
    } else {
      const factor = Math.min(1, gameState.totalMissions / 50);
      const range = ex.max - ex.base;
      baseTarget = Math.floor(ex.base + range * factor);
    }
    
    // A cada 2 dias consecutivos de streak, adiciona 5% de bônus de intensidade
    const streakSteps = Math.floor((gameState.streak || 0) / 2);
    const intensityBonusFactor = 1 + streakSteps * 0.05;
    
    let finalTarget = Math.floor(baseTarget * intensityBonusFactor);

    // CRITICAL: The daily mission target MUST NOT exceed approximately 80% of their actual capacity (maxCap)
    // to leave room for evolution and avoid frustration, unless their initial capability was zero/extremely low
    if (maxCap !== Infinity && maxCap > 0) {
      const safeMaxLimit = Math.max(
        ex.base, // Ensure we at least do the exercise's baseline requirement
        Math.round(maxCap * 0.8) // Strictly cap at 80% of initial capacity
      );
      finalTarget = Math.min(finalTarget, safeMaxLimit);
    }

    return finalTarget;
  };

  const showToastMsg = (msg: string, type: 'success' | 'gold' | 'default' = 'default') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setGameState(DEFAULT_STATE);
  };

  const handleSaveOath = (oathId: string) => {
    const updated = { ...gameState, chosenOath: oathId };
    setGameState(updated);
    saveProgress(updated);
    setShowGMModal(false);
    showToastMsg('📜 Pacto assinado! Honre o seu juramento.', 'gold');
  };

  const handleReset = async () => {
    if (window.confirm('Tem certeza de que deseja resetar toda a sua jornada? Seus dados serão perdidos.')) {
      localStorage.removeItem('fitnessRPG_state');
      setGameState(DEFAULT_STATE);
      await saveProgress(DEFAULT_STATE);
      showToastMsg('Histórico de treino resetado com sucesso!');
    }
  };

  // Triggered when user completes an exercise in active view
  const handleExerciseComplete = () => {
    if (!activeExerciseId) return;

    const ex = EXERCISES.find((e) => e.id === activeExerciseId);
    if (!ex) return;

    const today = new Date().toDateString();
    const hour = new Date().getHours();
    const targetVal = getScaledTarget(ex);

    // 1. Create shallow copy of state
    let nextState = { ...gameState };

    // Mark completed today
    if (!nextState.completedToday.includes(ex.id)) {
      nextState.completedToday = [...nextState.completedToday, ex.id];
    }

    nextState.lastTrainingDate = today;
    nextState.totalMissions += 1;
    nextState.consecutiveRun += 1;
    nextState.maxConsecutive = Math.max(nextState.maxConsecutive, nextState.consecutiveRun);
    nextState.maxDayMissions = Math.max(nextState.maxDayMissions, nextState.completedToday.length);

    if (hour < 9) {
      nextState.earlyBird = true;
    }

    if (!nextState.todayCategories.includes(ex.cat)) {
      nextState.todayCategories = [...nextState.todayCategories, ex.cat];
    }

    if (nextState.todayCategories.length >= 3) {
      nextState.trioPerfect = true;
    }

    // Exercise metric accumulators
    if (ex.id === 'd1') {
      nextState.totalFlexoes += targetVal;
      nextState.weekFlexoes += targetVal;
      nextState.str = (nextState.str || 10) + 1;
    } else if (ex.id === 'd2') {
      nextState.totalAgacham += targetVal;
      nextState.sta = (nextState.sta || 10) + 1;
    } else if (ex.id === 'd3') {
      nextState.totalPrancha += targetVal;
      nextState.int = (nextState.int || 10) + 1;
    }

    // Update active friend challenges progress dynamically based on completed reps
    if (nextState.friendChallenges && nextState.friendChallenges.length > 0) {
      nextState.friendChallenges = nextState.friendChallenges.map(challenge => {
        let addedProgress = 0;
        if (challenge.exerciseType === 'flexoes' && ex.id === 'd1') {
          addedProgress = targetVal;
        } else if (challenge.exerciseType === 'agachamentos' && ex.id === 'd2') {
          addedProgress = targetVal;
        } else if (challenge.exerciseType === 'prancha' && ex.id === 'd3') {
          addedProgress = targetVal;
        }

        if (addedProgress > 0) {
          return {
            ...challenge,
            participants: challenge.participants.map(p => {
              if (p.code === nextState.friendCode || p.name === 'Você') {
                return { ...p, progress: Math.min(challenge.target, p.progress + addedProgress) };
              }
              return p;
            })
          };
        }
        return challenge;
      });
    }

    if (ex.cat === 'cardio') {
      nextState.weekCardio += 1;
      nextState.agi = (nextState.agi || 10) + 1;
    }

    // Days trained weekly streak count
    nextState.weekDaysTraining = Math.min(7, (nextState.weekDaysTraining || 0) + (nextState.completedToday.length === 1 ? 1 : 0));

    if (nextState.completedToday.length >= 3) {
      nextState.weekConsistency = Math.min(3, (nextState.weekConsistency || 0) + 1);
    }

    // Grant XP & Calculate level up
    let prevLevel = nextState.level;
    let nextXp = nextState.xp + ex.xp;
    nextState.totalXP += ex.xp;
    nextState.weeklyXP = (nextState.weeklyXP || 0) + ex.xp;

    let leveledUp = false;
    let gainedPoints = 0;
    while (nextXp >= xpForLevel(prevLevel)) {
      nextXp -= xpForLevel(prevLevel);
      prevLevel += 1;
      leveledUp = true;
      gainedPoints += 5;
    }

    nextState.level = prevLevel;
    nextState.xp = nextXp;
    if (leveledUp) {
      nextState.statPoints = (nextState.statPoints || 0) + gainedPoints;
    }
    nextState.xp = nextXp;

    // 2. Check contract weekly and specials
    nextState = checkWeeklyContracts(nextState);
    nextState = checkSpecialContracts(nextState);

    // 3. Check unlocked badges / achievements
    nextState = checkAchievements(nextState);

    // Close view & save state
    setActiveExerciseId(null);
    setGameState(nextState);
    saveProgress(nextState);

    // Se as notificações estiverem ativas, dispara a notificação inteligente de missão concluída!
    if (nextState.notificacoes_ativas) {
      import('./lib/notificationEngine').then(({ getIntelligentMessage }) => {
        import('./lib/notifications').then(({ triggerTestNotification }) => {
          const { title, body } = getIntelligentMessage('missao_concluida');
          triggerTestNotification(title, body);
        });
      });
    }

    // Visual prompts
    showToastMsg(`✅ ${ex.name} completo! +${ex.xp} XP`, 'success');

    if (leveledUp) {
      setTimeout(() => {
        setLevelUpShow(prevLevel);
      }, 700);
    }
  };

  const handleCompleteRecoveryActivity = (activityId: string, xpReward: number, name: string) => {
    const nextState = { ...gameState };
    if (!nextState.completedRecoveryToday) {
      nextState.completedRecoveryToday = [];
    }
    if (nextState.completedRecoveryToday.includes(activityId)) return;
    
    nextState.completedRecoveryToday = [...nextState.completedRecoveryToday, activityId];
    
    // Grant XP & Calculate level up
    let prevLevel = nextState.level;
    let nextXp = nextState.xp + xpReward;
    nextState.totalXP += xpReward;
    nextState.weeklyXP = (nextState.weeklyXP || 0) + xpReward;

    let leveledUp = false;
    let gainedPoints = 0;
    while (nextXp >= xpForLevel(prevLevel)) {
      nextXp -= xpForLevel(prevLevel);
      prevLevel += 1;
      leveledUp = true;
      gainedPoints += 5;
    }

    nextState.level = prevLevel;
    nextState.xp = nextXp;
    if (leveledUp) {
      nextState.statPoints = (nextState.statPoints || 0) + gainedPoints;
    }

    // Check achievements
    let updatedState = checkAchievements(nextState);

    setGameState(updatedState);
    saveProgress(updatedState);

    // Se as notificações estiverem ativas, dispara a notificação inteligente de missão concluída!
    if (updatedState.notificacoes_ativas) {
      import('./lib/notificationEngine').then(({ getIntelligentMessage }) => {
        import('./lib/notifications').then(({ triggerTestNotification }) => {
          const { title, body } = getIntelligentMessage('missao_concluida');
          triggerTestNotification(title, body);
        });
      });
    }

    showToastMsg(`🛌 ${name} completo! +${xpReward} XP`, 'success');

    if (leveledUp) {
      setTimeout(() => {
        setLevelUpShow(prevLevel);
      }, 700);
    }
  };

  const checkWeeklyContracts = (stateVal: GameState): GameState => {
    let updated = { ...stateVal };
    const getProgress = (id: string) => {
      if (id === 'w1') return updated.weekDaysTraining;
      if (id === 'w2') return updated.weekFlexoes;
      if (id === 'w3') return updated.weekCardio;
      if (id === 'w4') return updated.weekConsistency;
      return 0;
    };

    WEEKLY_MISSIONS.forEach((m) => {
      if (!updated.completedWeekly.includes(m.id)) {
        if (getProgress(m.id) >= m.total) {
          updated.completedWeekly = [...updated.completedWeekly, m.id];
          updated.xp += m.xp;
          updated.totalXP += m.xp;
          updated.weeklyXP = (updated.weeklyXP || 0) + m.xp;
          showToastMsg(`🏆 Missão semanal "${m.title}" completa! +${m.xp} XP`, 'gold');
        }
      }
    });

    return updated;
  };

  const checkSpecialContracts = (stateVal: GameState): GameState => {
    let updated = { ...stateVal };
    SPECIAL_MISSIONS.forEach((m) => {
      if (!updated.completedSpecial.includes(m.id)) {
        let achieved = false;
        if (m.id === 's1' && updated.totalMissions >= 1) achieved = true;
        else if (m.id === 's2' && updated.earlyBird) achieved = true;
        else if (m.id === 's3' && updated.trioPerfect) achieved = true;
        else if (m.id === 's4' && updated.streak >= 7) achieved = true;
        else if (m.id === 's5' && updated.totalMissions >= 100) achieved = true;

        if (achieved) {
          updated.completedSpecial = [...updated.completedSpecial, m.id];
          updated.xp += m.xp;
          updated.totalXP += m.xp;
          updated.weeklyXP = (updated.weeklyXP || 0) + m.xp;
          showToastMsg(`⭐ Missão especial "${m.title}" completa! +${m.xp} XP`, 'gold');
        }
      }
    });

    return updated;
  };

  const checkAchievements = (stateVal: GameState): GameState => {
    let updated = { ...stateVal };
    let newlyUnlocked: Achievement | null = null;

    ACHIEVEMENTS.forEach((ach) => {
      if (!updated.unlockedAchievements.includes(ach.id)) {
        if (ach.check(updated)) {
          updated.unlockedAchievements = [...updated.unlockedAchievements, ach.id];
          newlyUnlocked = ach;
        }
      }
    });

    if (newlyUnlocked) {
      setAchievementFlash(newlyUnlocked);
      setTimeout(() => setAchievementFlash(null), 3000);
    }

    return updated;
  };

  // Render current active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab
            gameState={gameState}
            exercises={EXERCISES}
            onStartExercise={(id) => setActiveExerciseId(id)}
            scaledTarget={getScaledTarget}
            onUpdateGameState={(newState) => {
              setGameState(newState);
              saveProgress(newState);
            }}
            onCompleteRecoveryActivity={handleCompleteRecoveryActivity}
            onStartRecoveryActivity={(id) => setActiveRecoveryActivityId(id)}
            theme={theme}
          />
        );
      case 'missions':
        return (
          <MissionsTab
            gameState={gameState}
            exercises={EXERCISES}
            onStartExercise={(id) => setActiveExerciseId(id)}
            scaledTarget={getScaledTarget}
            onCompleteRecoveryActivity={handleCompleteRecoveryActivity}
            onStartRecoveryActivity={(id) => setActiveRecoveryActivityId(id)}
            theme={theme}
          />
        );
      case 'achievements':
        return <AchievementsTab gameState={gameState} />;
      case 'ranking':
        return (
          <RankingTab
            gameState={gameState}
            onUpdateGameState={(newState) => {
              setGameState(newState);
              saveProgress(newState);
            }}
          />
        );
      case 'evolution':
        return (
          <EvolutionTab
            gameState={gameState}
            onUpdateGameState={(newState) => {
              setGameState(newState);
              saveProgress(newState);
            }}
          />
        );
      case 'profile':
        return (
          <ProfileTab
            gameState={gameState}
            xpNeeded={xpForLevel(gameState.level)}
            onReset={handleReset}
            onUpdateGameState={(newState) => {
              setGameState(newState);
              saveProgress(newState);
            }}
            onTriggerReassessment={() => setShowReassessment(true)}
            user={user}
            onLogout={handleLogout}
            onLoginTrigger={() => setViewingAuth(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        );
      default:
        return null;
    }
  };

  // If user is not authenticated and they explicitly want to see auth, OR they finished the assessment and want to register
  if (!user && viewingAuth) {
    // A brand new user who just finished the assessment but hasn't registered yet must NOT be allowed to bypass AuthScreen
    const isNewUserNoAuth = gameState.totalMissions === 0 && gameState.avaliacao_concluida;

    return (
      <>
        <AuthScreen
          onSuccess={(u) => {
            setUser(u);
            setViewingAuth(false);
            loadProgress(u);
          }}
          onShowModal={(msg) => setCustomModal({ show: true, msg })}
          onBack={isNewUserNoAuth ? undefined : () => setViewingAuth(false)}
        />

        {/* Custom dialog modal portal */}
        <AnimatePresence>
          {customModal.show && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 15 }}
                className="bg-[#12101a] border border-red-950/40 rounded-3xl p-6 text-center max-w-sm w-full space-y-4 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-center text-2xl mx-auto">
                  🎉
                </div>
                <h3 className="text-lg font-black text-white">Mensagem do Fitness RPG</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{customModal.msg}</p>
                <button
                  onClick={() => setCustomModal({ show: false, msg: '' })}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono tracking-wider uppercase rounded-xl transition-all duration-200"
                >
                  Entendido!
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Force evaluation for brand new users (no evaluation yet and zero missions) before they can see the app
  if (!gameState.avaliacao_concluida && gameState.totalMissions === 0) {
    return (
      <AssessmentScreen
        gameState={gameState}
        onComplete={(updatedState) => {
          const stateWithCompletedAssessment = {
            ...updatedState,
            avaliacao_concluida: true
          };
          setGameState(stateWithCompletedAssessment);
          saveProgress(stateWithCompletedAssessment);
          
          // Force new user to pass by the registration/signup flow
          if (!user) {
            setViewingAuth(true);
          }
        }}
        onLogout={async () => {
          await handleLogout();
          setViewingAuth(true);
        }}
        theme={theme}
      />
    );
  }

  // Render AssessmentScreen if actively triggered by the user
  if (showAssessment) {
    return (
      <AssessmentScreen
        gameState={gameState}
        onComplete={(updatedState) => {
          setGameState(updatedState);
          saveProgress(updatedState);
          setShowAssessment(false);
        }}
        onClose={() => setShowAssessment(false)}
        onLogout={user ? handleLogout : () => setViewingAuth(true)}
        theme={theme}
      />
    );
  }

  // Active workout quest
  const activeExercise = EXERCISES.find((e) => e.id === activeExerciseId);
  const activeRecoveryActivity = RECOVERY_ACTIVITIES.find((r) => r.id === activeRecoveryActivityId);

  return (
    <div className={`min-h-screen flex flex-col justify-between max-w-md mx-auto font-sans relative pb-20 select-none transition-colors duration-300 ${
      theme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-[#08070c] text-slate-100'
    }`}>
      {/* Offline Status Tracker */}
      {!isOnline && (
        <div className="bg-red-600 text-white text-center py-2 px-4 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 sticky top-0 z-50">
          <WifiOff className="w-4 h-4" />
          VOCÊ ESTÁ DESCONECTADO · SEUS DADOS SALVARÃO NO NUVEM AO RECONECTAR
        </div>
      )}

      {/* Primary HUD Headers */}
      <Header
        email={user?.email || null}
        onLogout={handleLogout}
        activeTab={activeTab}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <XPBar
        level={gameState.level}
        xp={gameState.xp}
        xpNeeded={xpForLevel(gameState.level)}
        streak={gameState.streak}
        theme={theme}
      />

      {/* ⚠️ NOTIFICAÇÕES GERAIS DE SISTEMA / CAIXAS DE ALERTA DO JOGO */}
      <AnimatePresence>
        {gameState.avaliacao_concluida && !user && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mx-4 mt-3 bg-gradient-to-r from-amber-950/80 to-red-950/80 border-2 border-dashed border-amber-500/50 p-4 rounded-2xl flex flex-col gap-3 shadow-lg relative overflow-hidden shrink-0"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-500 mt-0.5 animate-pulse">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-1 border-none bg-transparent">
                <span className="text-[9px] font-mono font-black text-amber-400 tracking-widest uppercase block animate-pulse leading-none mb-1">
                  ⚠️ SALVAR PROGRESSO NA NUVEM
                </span>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-tight leading-none mb-1">
                  Vínculo de Caçador Pendente!
                </h4>
                <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                  Sua avaliação foi concluída! Para não perder seus atributos e Rank, crie uma conta para eternizar seus dados no servidor!
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewingAuth(true)}
              className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-[10px] font-black font-mono tracking-widest uppercase rounded-lg shadow-md transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
            >
              💾 SALVAR ATRIBUTOS NO CADASTRO
            </button>
          </motion.div>
        )}

        {!gameState.avaliacao_concluida && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mx-4 mt-3 bg-gradient-to-r from-[#031122]/90 to-[#02050b]/90 border-2 border-cyan-500/30 p-4 rounded-2xl flex flex-col gap-3 shadow-lg relative overflow-hidden shrink-0"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 mt-0.5 animate-pulse">
                <Star className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="space-y-1 border-none bg-transparent">
                <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase block leading-none mb-1">
                  📢 NOVA ATUALIZAÇÃO DO JOGADOR
                </span>
                <h4 className="text-xs font-extrabold text-white uppercase tracking-tight leading-none mb-1">
                  Avaliação Física de Rank Disponível!
                </h4>
                <p className="text-[10px] text-slate-300 leading-relaxed font-mono">
                  A nova atualização do sistema de treino está ativa. Faça o teste físico agora para calibrar seu Rank de Caçador!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAssessment(true)}
              className="w-full py-2 bg-cyan-400 hover:bg-cyan-300 text-black text-[10px] font-black font-mono tracking-widest uppercase rounded-lg shadow-md transition-all duration-200 active:scale-95 cursor-pointer shrink-0"
            >
              ⚔️ INICIAR MINHA AVALIAÇÃO AGORA
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tab Switchboard */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modern navigation panel */}
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} theme={theme} />

      {/* Active workout screen modal */}
      <AnimatePresence>
        {activeExercise && (
          <MissionScreen
            exercise={activeExercise}
            targetCount={getScaledTarget(activeExercise)}
            onClose={() => setActiveExerciseId(null)}
            onComplete={handleExerciseComplete}
          />
        )}
      </AnimatePresence>

      {/* Active recovery screen modal */}
      <AnimatePresence>
        {activeRecoveryActivity && (
          <RecoveryMissionScreen
            activity={activeRecoveryActivity}
            onClose={() => setActiveRecoveryActivityId(null)}
            onComplete={(id, xp, name) => {
              handleCompleteRecoveryActivity(id, xp, name);
              setActiveRecoveryActivityId(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Level Up fullscreen overlay */}
      <AnimatePresence>
        {levelUpShow !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#08070cd0] backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="space-y-6"
            >
              <div className="text-6xl animate-bounce">⭐</div>
              <div>
                <h2 className="text-3xl font-black font-display tracking-tight bg-gradient-to-r from-red-500 via-amber-400 to-red-500 bg-clip-text text-transparent">
                  LEVEL UP!
                </h2>
                <div className="text-7xl font-black font-display text-amber-400 mt-2 leading-none">
                  {levelUpShow}
                </div>
                <p className="text-sm text-slate-400 mt-3 font-semibold">Você treinou muito e ficou mais forte!</p>
              </div>

              <button
                onClick={() => setLevelUpShow(null)}
                className="px-8 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-mono font-bold tracking-widest uppercase rounded-xl shadow-lg shadow-red-900/25 transition-all duration-200"
              >
                Continuar Jornada ⚔_
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievement Unlock Banner Overlay */}
      <AnimatePresence>
        {achievementFlash && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-4 right-4 bg-gradient-to-r from-amber-950/90 to-amber-900/80 border border-amber-500/40 rounded-2xl p-4 flex items-center gap-3.5 shadow-2xl z-55 max-w-md mx-auto backdrop-blur-md"
          >
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl shrink-0 animate-pulse">
              {achievementFlash.icon}
            </div>
            <div>
              <span className="text-[9px] font-mono font-extrabold text-amber-400 tracking-widest uppercase block">
                CONQUISTA DESBLOQUEADA!
              </span>
              <h4 className="text-sm font-black text-white mt-0.5">{achievementFlash.title}</h4>
              <p className="text-[11px] text-slate-300 leading-none">{achievementFlash.desc}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simple absolute toast feedback component */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-22 left-4 right-4 z-40 max-w-md mx-auto"
          >
            <div
              className={`p-3.5 rounded-xl text-xs font-bold text-center shadow-2xl backdrop-blur-md border ${
                toast.type === 'success'
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                  : toast.type === 'gold'
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                  : 'bg-[#12101ae0] text-slate-200 border-red-950/30'
              }`}
            >
              {toast.msg}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reassessment Overlay Modal */}
      <AnimatePresence>
        {showReassessment && (
          <ReassessmentModal
            gameState={gameState}
            onComplete={(updatedState) => {
              setGameState(updatedState);
              saveProgress(updatedState);
              setShowReassessment(false);
            }}
            onClose={() => setShowReassessment(false)}
            theme={theme}
          />
        )}
      </AnimatePresence>



      {/* Solo Leveling Physical Assessment Update Announcement Modal */}
      <AnimatePresence>
        {!gameState.avaliacao_concluida && showAssessmentAnnouncement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#020204]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="bg-[#0b0c10] border-2 border-cyan-500/30 rounded-[2.5rem] p-6 max-w-sm w-full space-y-5 shadow-[0_20px_50px_rgba(6,182,212,0.15)] text-left relative overflow-hidden"
            >
              {/* Sci-fi glow details */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] pointer-events-none" />
              
              <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Scroll className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[9px] font-mono font-black text-cyan-400 tracking-widest uppercase block animate-pulse">
                    ATUALIZAÇÃO DE SISTEMA DISPONÍVEL
                  </span>
                  <h3 className="text-sm font-black text-white tracking-tight uppercase">
                    Avaliação Física de Caçador
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Guerreiro, o Sistema de Treinamento de Caçador recebeu uma <strong>Grande Atualização de Aptidão</strong>! 
                </p>
                <div className="bg-[#040912]/80 border border-cyan-500/10 p-3.5 rounded-2xl space-y-2">
                  <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-widest block border-b border-cyan-500/15 pb-1">PATCH NOTES (V1.2)</span>
                  <ul className="text-[10px] text-slate-300 space-y-1.5 font-mono list-disc list-inside">
                    <li>Atribuição de <strong>Rank Oficial (E a S-Rank)</strong></li>
                    <li>Cálculo de metas diárias de exercícios</li>
                    <li>Ganho otimizado de XP de Caçador</li>
                    <li>Duração automática e controle de reavaliação</li>
                  </ul>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed italic">
                  "Sua força real determina seu Rank de Caçador. Responda com precisão para receber suas missões diárias calibradas."
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setShowAssessmentAnnouncement(false);
                    setShowAssessment(true);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-black font-mono tracking-widest uppercase rounded-xl shadow-lg shadow-cyan-900/30 transition-all duration-200 cursor-pointer text-center block"
                >
                  ⚔️ INICIAR MINHA AVALIAÇÃO
                </button>
                <button
                  onClick={() => {
                    setShowAssessmentAnnouncement(false);
                    localStorage.setItem('fitnessRPG_dismissedAssessment', 'true');
                  }}
                  className="w-full py-3 border border-slate-800 hover:bg-slate-900/50 text-slate-400 text-[10px] font-bold font-mono tracking-widest uppercase rounded-xl transition-all duration-200 cursor-pointer"
                >
                  ⏳ FAZER MAIS TARDE / EXPLORAR
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
