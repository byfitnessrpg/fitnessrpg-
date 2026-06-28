import { triggerTestNotification } from './notifications';

export type NotificationCategory =
  | 'bom_dia'
  | 'meta_agua'
  | 'horario_treino'
  | 'missao_quase_fim'
  | 'missao_concluida'
  | 'reavaliacao'
  | 'usuario_ausente';

export interface NotificationCategoryInfo {
  id: NotificationCategory;
  name: string;
  icon: string;
  description: string;
  title: string;
  messages: string[];
}

export const NOTIFICATION_DATABASE: Record<NotificationCategory, NotificationCategoryInfo> = {
  bom_dia: {
    id: 'bom_dia',
    name: 'Bom dia',
    icon: '🌅',
    description: 'Enviado entre 7h e 9h para iniciar a jornada diária',
    title: '🌅 FitnessRPG: Novo Dia!',
    messages: [
      '💧 Bom dia, aventureiro. Sua jornada de hoje começou. Não esqueça de registrar sua primeira hidratação.',
      '⚔️ Um novo dia significa uma nova oportunidade de evoluir. Comece registrando sua água.',
      '🌞 Seu corpo acabou de acordar. Que tal começar cuidando da sua hidratação?',
      '💧 Pequenas ações constroem grandes resultados. Registre sua primeira hidratação do dia.',
      '🔥 Toda evolução começa por um primeiro passo. Hoje, comece pela hidratação.',
      '🏹 O Sistema iniciou uma nova missão diária. Sua primeira tarefa é cuidar do seu corpo.',
      '✨ O amanhecer traz novos desafios. Encha seu cantil de água e prepare-se para a jornada.',
      '🛡️ Proteja seu status de guerreiro: comece o dia ativando seu bônus de hidratação!'
    ]
  },
  meta_agua: {
    id: 'meta_agua',
    name: 'Meta de Hidratação',
    icon: '💧',
    description: 'Lembrete enviado ao longo do dia para atingir a meta de água',
    title: '💧 FitnessRPG: Alerta de Água!',
    messages: [
      '💧 Ainda faltam alguns ml para atingir sua meta de hoje.',
      '🚰 Seu corpo agradece cada gole. Continue registrando sua hidratação.',
      '💙 Não deixe sua meta de água para depois.',
      '💧 A hidratação também faz parte da evolução.',
      '🌊 Continue assim. Você está cada vez mais perto da sua meta diária.',
      '🧪 Recarregue suas poções! A água é o combustível essencial para sua estamina hoje.',
      '🔋 Alerta de estamina baixa: beba água para manter seu guerreiro em alto desempenho.'
    ]
  },
  horario_treino: {
    id: 'horario_treino',
    name: 'Horário do Treino',
    icon: '⚔️',
    description: 'Alerta programado no horário preferido de treino',
    title: '⚔️ FitnessRPG: Hora do Treino!',
    messages: [
      '⚔️ Sua missão diária está pronta.',
      '💪 Está na hora de evoluir.',
      '🔥 Seu treino está esperando por você.',
      '🏹 O Mestre preparou uma nova missão.',
      '📜 Hoje existe uma missão para concluir.',
      '⚡ Não deixe sua evolução para amanhã.',
      '☄️ Os portões da masmorra se abriram. Seus exercícios diários aguardam!',
      '⚔️ Nenhum guerreiro alcança o topo descansando. Venha completar sua rotina diária.'
    ]
  },
  missao_quase_fim: {
    id: 'missao_quase_fim',
    name: 'Missão Quase Acabando',
    icon: '⏳',
    description: 'Aviso de poucas horas restantes para concluir as missões do dia',
    title: '⏳ FitnessRPG: Tempo Esgotando!',
    messages: [
      '⚠️ Ainda dá tempo de completar sua missão.',
      '🔥 Não perca sua sequência de dias!',
      '⏰ Sua missão diária está chegando ao fim.',
      '🏃 Apenas alguns minutos restantes para concluir o desafio de hoje.',
      '📜 O Sistema ainda aguarda seu retorno.',
      '🚨 Alerta de perigo: sua sequência de streak corre risco se você não concluir a missão.',
      '⏳ O sol está se pondo no reino. Não deixe seu treino diário expirar!'
    ]
  },
  missao_concluida: {
    id: 'missao_concluida',
    name: 'Missão Concluída',
    icon: '🏆',
    description: 'Enviada imediatamente após finalizar as tarefas diárias',
    title: '🏆 FitnessRPG: Missão Cumprida!',
    messages: [
      '🏆 Excelente trabalho.',
      '⚔️ Mais uma missão concluída.',
      '🔥 Você ficou mais forte hoje.',
      '⭐ Cada missão concluída aproxima você do seu objetivo.',
      '📈 Seu progresso continua aumentando.',
      '🎉 Quest Concluída! Você ganhou XP e o respeito do reino.',
      '💪 Incrível! Seus músculos se fortaleceram e seu poder aumentou.'
    ]
  },
  reavaliacao: {
    id: 'reavaliacao',
    name: 'Reavaliação Física',
    icon: '📅',
    description: 'Lembrete enviado a cada 10 dias para atualizar os status',
    title: '📅 FitnessRPG: Reavaliação Física!',
    messages: [
      '📈 Chegou o dia de medir sua evolução.',
      '⚔️ O Mestre deseja analisar seu progresso.',
      '🏹 Você evoluiu nos últimos 10 dias?',
      '🔥 Hora de atualizar suas missões.',
      '💪 Descubra quanto você melhorou desde a última avaliação.',
      '⚖️ Hora do update de status! Vamos registrar suas novas marcas de força e peso.',
      '📜 O Mestre quer ver sua ficha de personagem atualizada. Vamos avaliar?'
    ]
  },
  usuario_ausente: {
    id: 'usuario_ausente',
    name: 'Usuário Ausente',
    icon: '😴',
    description: 'Enviada se o jogador ficar mais de 48h sem abrir o app',
    title: '😴 FitnessRPG: Sentimos Sua Falta',
    messages: [
      '👀 Sentimos sua falta.',
      '⚔️ Sua jornada ainda continua.',
      '🔥 Não deixe sua evolução parar.',
      '📜 O Mestre ainda acredita em você.',
      '💪 Volte e continue construindo sua melhor versão.',
      '🏹 Seu personagem aguarda seu retorno.',
      '🌌 O reino está quieto sem você. Dê o primeiro passo hoje e retome seus hábitos.',
      '🔋 Uma pequena pausa é normal, mas a consistência constrói lendas. Esperamos você!'
    ]
  }
};

interface CategoryHistory {
  lastSentText: string;
  usedTexts: string[];
}

interface NotificationHistory {
  [category: string]: CategoryHistory;
}

const HISTORY_KEY = 'fitness_rpg_notification_history';

// Load history from localStorage
export const loadNotificationHistory = (): NotificationHistory => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Error loading notification history:', e);
    return {};
  }
};

// Save history to localStorage
export const saveNotificationHistory = (history: NotificationHistory) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving notification history:', e);
  }
};

/**
 * Intelligently retrieves a notification message for a specific category.
 * Rules applied:
 * 1. Excludes the single last sent message to prevent consecutive repetition.
 * 2. Alternates messages using a cycle list (usedTexts) to prevent repeating before all choices are exhausted.
 * 3. Picks randomly among eligible candidates.
 * 4. Automatically resets cycle if all options are used.
 */
export const getIntelligentMessage = (category: NotificationCategory): { title: string; body: string } => {
  const categoryInfo = NOTIFICATION_DATABASE[category];
  const title = categoryInfo.title;
  const messages = categoryInfo.messages;

  if (messages.length === 0) {
    return { title, body: 'Aventureiro, prepare-se para seu treino!' };
  }

  // Handle single message fallback
  if (messages.length === 1) {
    return { title, body: messages[0] };
  }

  const history = loadNotificationHistory();
  const catHistory = history[category] || { lastSentText: '', usedTexts: [] };

  // Determine candidates
  // Rule: Never repeat the same message consecutively
  let candidates = messages.filter(msg => msg !== catHistory.lastSentText);

  // Rule: Cycle through all messages without repeating if possible
  let freshCandidates = candidates.filter(msg => !catHistory.usedTexts.includes(msg));

  let chosenMessage = '';

  if (freshCandidates.length > 0) {
    // Pick from unused candidates
    const idx = Math.floor(Math.random() * freshCandidates.length);
    chosenMessage = freshCandidates[idx];
  } else {
    // If all candidates in cycle are used, reset the used array except for the last sent message
    catHistory.usedTexts = catHistory.lastSentText ? [catHistory.lastSentText] : [];
    
    // Now pick from all available candidates that are NOT the last sent one
    const resetCandidates = messages.filter(msg => msg !== catHistory.lastSentText);
    const idx = Math.floor(Math.random() * resetCandidates.length);
    chosenMessage = resetCandidates[idx];
  }

  // Update history
  catHistory.lastSentText = chosenMessage;
  if (!catHistory.usedTexts.includes(chosenMessage)) {
    catHistory.usedTexts.push(chosenMessage);
  }

  history[category] = catHistory;
  saveNotificationHistory(history);

  return { title, body: chosenMessage };
};

/**
 * Resets the history of all or a single notification category.
 */
export const resetNotificationHistory = (category?: NotificationCategory) => {
  if (category) {
    const history = loadNotificationHistory();
    delete history[category];
    saveNotificationHistory(history);
  } else {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HISTORY_KEY);
    }
  }
};

/**
 * Runs scheduled checks and fires corresponding intelligent notifications when criteria are met.
 * Prevents flooding by ensuring a category is only triggered once per calendar day.
 */
export const checkAndTriggerIntelligentNotifications = async (gameState: any) => {
  if (typeof window === 'undefined') return;
  if (!gameState.notificacoes_ativas) return;

  const todayStr = new Date().toLocaleDateString('pt-BR');
  const now = new Date();
  const currentHour = now.getHours();

  // Helper to check if triggered today
  const isTriggeredToday = (category: NotificationCategory): boolean => {
    const lastDate = localStorage.getItem(`fitness_rpg_last_triggered_date_${category}`);
    return lastDate === todayStr;
  };

  const markAsTriggeredToday = (category: NotificationCategory) => {
    localStorage.setItem(`fitness_rpg_last_triggered_date_${category}`, todayStr);
  };

  // Helper to actually fire notification
  const fireNotification = async (category: NotificationCategory) => {
    const { title, body } = getIntelligentMessage(category);
    console.log(`[Notification Engine] Disparando notificação inteligente da categoria: ${category}`);
    await triggerTestNotification(title, body);
    markAsTriggeredToday(category);
  };

  // 1. 🌅 Bom dia (7h às 9h)
  if (currentHour >= 7 && currentHour < 9) {
    if (!isTriggeredToday('bom_dia')) {
      await fireNotification('bom_dia');
      return; // Only trigger one automated notification per session to prevent flooding
    }
  }

  // 2. 📅 Reavaliação
  if (gameState.proxima_reavaliacao) {
    const nextRevalDate = new Date(gameState.proxima_reavaliacao);
    if (now >= nextRevalDate) {
      if (!isTriggeredToday('reavaliacao')) {
        await fireNotification('reavaliacao');
        return;
      }
    }
  }

  // 3. ⚔️ Horário de Treino
  // Check if current hour falls into user's preferred training window
  if (gameState.cronograma_janela) {
    let isInWindow = false;
    const windowName = gameState.cronograma_janela.toLowerCase();
    
    if (windowName.includes('manhã') && currentHour >= 9 && currentHour < 12) {
      isInWindow = true;
    } else if (windowName.includes('tarde') && currentHour >= 14 && currentHour < 18) {
      isInWindow = true;
    } else if (windowName.includes('noite') && currentHour >= 19 && currentHour < 22) {
      isInWindow = true;
    }

    if (isInWindow && !isTriggeredToday('horario_treino')) {
      const hasCompletedToday = gameState.completedToday && gameState.completedToday.length > 0;
      if (!hasCompletedToday) {
        await fireNotification('horario_treino');
        return;
      }
    }
  }

  // 4. ⏳ Missão quase acabando (20h às 23h59)
  if (currentHour >= 20) {
    const hasCompletedToday = gameState.completedToday && gameState.completedToday.length > 0;
    if (!hasCompletedToday && !isTriggeredToday('missao_quase_fim')) {
      await fireNotification('missao_quase_fim');
      return;
    }
  }

  // 5. 💧 Meta de hidratação (14h às 19h - se água ainda não bateu a meta)
  if (currentHour >= 14 && currentHour < 19) {
    if (gameState.waterIntake !== undefined && gameState.waterGoal !== undefined) {
      if (gameState.waterIntake < gameState.waterGoal) {
        if (!isTriggeredToday('meta_agua')) {
          await fireNotification('meta_agua');
          return;
        }
      }
    }
  }

  // 6. 😴 Usuário ausente (>48 horas)
  const lastActiveStr = localStorage.getItem('fitness_rpg_last_active_timestamp');
  const nowMs = Date.now();
  if (lastActiveStr) {
    const lastActiveMs = parseInt(lastActiveStr, 10);
    const diffHours = (nowMs - lastActiveMs) / (1000 * 60 * 60);
    if (diffHours >= 48) {
      const lastAusenteTrigger = localStorage.getItem('fitness_rpg_last_triggered_date_usuario_ausente');
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      const isEligible = !lastAusenteTrigger || new Date(lastAusenteTrigger) < threeDaysAgo;

      if (isEligible) {
        await fireNotification('usuario_ausente');
        localStorage.setItem('fitness_rpg_last_active_timestamp', nowMs.toString());
        return;
      }
    }
  }
  localStorage.setItem('fitness_rpg_last_active_timestamp', nowMs.toString());
};
