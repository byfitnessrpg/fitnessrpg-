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
}

export interface RankingPlayer {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  isMe?: boolean;
}
