export interface Exercise {
  id: string;
  name: string;
  icon: string;
  base: number;
  max: number;
  sets: number;
  unit: string;
  type: 'reps' | 'timer';
  cat: 'força' | 'core' | 'cardio';
  muscles: string[];
  pose: 'pushup' | 'squat' | 'plank' | 'jumpingjack' | 'crunch' | 'lunge' | 'glute' | 'dip';
  mColor: string;
  xp: number;
  diff: 'Fácil' | 'Médio' | 'Difícil' | 'Épico' | 'Lendário';
  steps: string[];
}

export interface WeeklyMission {
  id: string;
  title: string;
  desc: string;
  xp: number;
  diff: string;
  total: number;
}

export interface SpecialMission {
  id: string;
  title: string;
  desc: string;
  xp: number;
  diff: string;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  check: (state: GameState) => boolean;
}

export interface GameState {
  level: number;
  xp: number;
  totalXP: number;
  streak: number;
  lastTrainingDate: string | null;
  totalMissions: number;
  completedToday: string[];
  weekDaysTraining: number;
  weekFlexoes: number;
  weekCardio: number;
  weekConsistency: number;
  totalFlexoes: number;
  totalAgacham: number;
  totalPrancha: number;
  maxDayMissions: number;
  maxConsecutive: number;
  consecutiveRun: number;
  completedWeekly: string[];
  completedSpecial: string[];
  unlockedAchievements: string[];
  earlyBird: boolean;
  trioPerfect: boolean;
  todayCategories: string[];
  str?: number;
  agi?: number;
  sta?: number;
  int?: number;
  waterIntake?: number;
  waterGoal?: number;
  charClass?: string;
  charName?: string;
  statPoints?: number;
  profilePic?: string;
  chosenOath?: string;
  weight?: number;
  weightHistory?: { date: string; value: number }[];
  friendCode?: string;
  friends?: Friend[];
  weeklyXP?: number;
  friendChallenges?: FriendChallenge[];
  lastWeeklyResetDate?: string;
  recruitsCount?: number;
  invitedBy?: string;
  avaliacao_concluida?: boolean;
  idade?: number;
  sexo?: string;
  altura?: number;
  peso?: number;
  objetivo?: string;
  frequencia_treino?: string;
  flexoes_inicial?: number;
  agachamentos_inicial?: number;
  prancha_inicial?: number;
  ultima_avaliacao?: string;
  proxima_reavaliacao?: string;
  nivel_fitness?: string;
  missao_personalizada?: {
    flexoes: number;
    agachamentos: number;
    prancha: number;
  };
  cronograma_dias?: string[];
  cronograma_janela?: string;
  completedRecoveryToday?: string[];
  notificacoes_ativas?: boolean;
  notificacoes_token?: string;
}

export interface Friend {
  code: string;
  name: string;
  avatar: string;
  level: number;
  weeklyXP: number;
  streak: number;
}

export interface FriendChallenge {
  id: string;
  title: string;
  target: number;
  exerciseType: 'flexoes' | 'agachamentos' | 'prancha';
  creatorCode: string;
  participants: {
    code: string;
    name: string;
    progress: number;
  }[];
}

export interface RankingPlayer {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  isMe?: boolean;
}
