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
import { MissionScreen } from './components/MissionScreen';
import { AuthScreen } from './components/AuthScreen';
import { Trophy, Star, Sparkles, WifiOff, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_STATE: GameState = {
  level: 1,
  xp: 0,
  totalXP: 0,
  streak: 0,
  lastTrainingDate: null,
  totalMissions: 0,
  completedToday: [],
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
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [gameState, setGameState] = useState<GameState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<string>('home');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Overlay Notification States
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'gold' | 'default' } | null>(null);
  const [levelUpShow, setLevelUpShow] = useState<number | null>(null);
  const [achievementFlash, setAchievementFlash] = useState<Achievement | null>(null);
  const [customModal, setCustomModal] = useState<{ show: boolean; msg: string }>({ show: false, msg: '' });

  // Formula matching exactly: Math.floor(100 * Math.pow(lv, 1.5))
  const xpForLevel = (lv: number) => {
    return Math.floor(100 * Math.pow(lv, 1.5));
  };

  // 1. Connectivity Status listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
          nome: currentUser.email?.split('@')[0] || 'Guerreiro',
          xp: 0,
          nivel: 1,
          moedas: 0,
          streak: 0,
          total_missions: 0,
          max_day_missions: 0,
          last_training_date: null,
          total_xp: 0,
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

      // Merging profile & local storage data securely
      const mergedState: GameState = {
        ...DEFAULT_STATE,
        ...loadedLocal,
        xp: profile.xp || 0,
        level: profile.nivel || 1,
        streak: profile.streak || 0,
        totalMissions: profile.total_missions || 0,
        maxDayMissions: profile.max_day_missions || 0,
        lastTrainingDate: profile.last_training_date || null,
        totalXP: profile.total_xp || profile.xp || 0,
      };

      // Check day reset
      const checkedState = checkDayReset(mergedState);
      setGameState(checkedState);
      localStorage.setItem('fitnessRPG_state', JSON.stringify(checkedState));

    } catch (e) {
      console.warn('Erro ao carregar dados do Supabase. Carregando dados locais...', e);
      const cached = localStorage.getItem('fitnessRPG_state');
      if (cached) {
        const parsed = JSON.parse(cached);
        setGameState(checkDayReset(parsed));
      }
    }
  };

  // Check and perform midnight date resets
  const checkDayReset = (stateVal: GameState): GameState => {
    const today = new Date().toDateString();
    if (stateVal.lastTrainingDate !== today) {
      let updatedState = { ...stateVal };

      if (stateVal.completedToday.length > 0) {
        // Was training yesterday?
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (stateVal.lastTrainingDate === yesterday.toDateString()) {
          updatedState.streak = (updatedState.streak || 0) + 1;
        } else {
          updatedState.streak = 1; // Start brand new streak
        }

        updatedState.maxDayMissions = Math.max(updatedState.maxDayMissions, stateVal.completedToday.length);
      }

      updatedState.completedToday = [];
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
        await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            xp: updatedState.xp,
            nivel: updatedState.level,
            streak: updatedState.streak,
            total_missions: updatedState.totalMissions,
            max_day_missions: updatedState.maxDayMissions,
            last_training_date: updatedState.lastTrainingDate,
            total_xp: updatedState.totalXP,
          });
      }
    } catch (e) {
      console.error('Falha ao salvar progresso síncrono:', e);
    }
  };

  // Scaled exercise target value based on completed total missions
  const getScaledTarget = (ex: Exercise) => {
    const factor = Math.min(1, gameState.totalMissions / 50);
    const range = ex.max - ex.base;
    return Math.floor(ex.base + range * factor);
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
    } else if (ex.id === 'd2') {
      nextState.totalAgacham += targetVal;
    } else if (ex.id === 'd3') {
      nextState.totalPrancha += targetVal;
    }

    if (ex.cat === 'cardio') {
      nextState.weekCardio += 1;
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

    let leveledUp = false;
    while (nextXp >= xpForLevel(prevLevel)) {
      nextXp -= xpForLevel(prevLevel);
      prevLevel += 1;
      leveledUp = true;
    }

    nextState.level = prevLevel;
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

    // Visual prompts
    showToastMsg(`✅ ${ex.name} completo! +${ex.xp} XP`, 'success');

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
          />
        );
      case 'missions':
        return (
          <MissionsTab
            gameState={gameState}
            exercises={EXERCISES}
            onStartExercise={(id) => setActiveExerciseId(id)}
            scaledTarget={getScaledTarget}
          />
        );
      case 'achievements':
        return <AchievementsTab gameState={gameState} />;
      case 'ranking':
        return <RankingTab gameState={gameState} />;
      case 'profile':
        return (
          <ProfileTab
            gameState={gameState}
            xpNeeded={xpForLevel(gameState.level)}
            onReset={handleReset}
          />
        );
      default:
        return null;
    }
  };

  // If user is not authenticated, render Auth screen
  if (!user) {
    return (
      <>
        <AuthScreen
          onSuccess={(u) => {
            setUser(u);
            loadProgress(u);
          }}
          onShowModal={(msg) => setCustomModal({ show: true, msg })}
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

  // Active workout quest
  const activeExercise = EXERCISES.find((e) => e.id === activeExerciseId);

  return (
    <div className="min-h-screen bg-[#08070c] text-slate-100 flex flex-col justify-between max-w-md mx-auto font-sans relative pb-20 select-none">
      {/* Offline Status Tracker */}
      {!isOnline && (
        <div className="bg-red-600 text-white text-center py-2 px-4 text-xs font-mono font-bold tracking-wider flex items-center justify-center gap-1.5 sticky top-0 z-50">
          <WifiOff className="w-4 h-4" />
          VOCÊ ESTÁ DESCONECTADO · SEUS DADOS SALVARÃO NO NUVEM AO RECONECTAR
        </div>
      )}

      {/* Primary HUD Headers */}
      <Header email={user.email} onLogout={handleLogout} />

      <XPBar
        level={gameState.level}
        xp={gameState.xp}
        xpNeeded={xpForLevel(gameState.level)}
        streak={gameState.streak}
      />

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
      <BottomNav activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

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
    </div>
  );
}
