import { Exercise, WeeklyMission, SpecialMission, Achievement, RankingPlayer, EliteMission } from './types';

export const EXERCISES: Exercise[] = [
  {
    id: 'd1', name: 'Flexão Clássica', icon: '💪',
    base: 12, max: 40, sets: 2, unit: 'flexões', type: 'reps', cat: 'força',
    muscles: ['Peito', 'Tríceps', 'Ombros'], pose: 'pushup',
    mColor: '#3b82f6', xp: 65, diff: 'Fácil',
    steps: [
      'Deite de bruços com as mãos na largura dos ombros',
      'Mantenha o corpo reto como uma prancha',
      'Desça o peito até quase tocar o chão',
      'Empurre com força para subir',
      'Mantenha a respiração controlada a cada repetição'
    ]
  },
  {
    id: 'd2', name: 'Agachamento Livre', icon: '🦵',
    base: 15, max: 50, sets: 2, unit: 'agachamentos', type: 'reps', cat: 'força',
    muscles: ['Quadríceps', 'Glúteos', 'Panturrilhas'], pose: 'squat',
    mColor: '#3b82f6', xp: 60, diff: 'Fácil',
    steps: [
      'Fique em pé com os pés na largura dos ombros',
      'Aponte os pés levemente para fora',
      'Desça flexionando os joelhos como se fosse sentar',
      'Mantenha as costas retas e o peito aberto',
      'Suba empurrando o chão através dos calcanhares'
    ]
  },
  {
    id: 'd3', name: 'Prancha Abdominal', icon: '⏱️',
    base: 20, max: 90, sets: 2, unit: 'segundos', type: 'timer', cat: 'core',
    muscles: ['Core', 'Abdômen', 'Lombar'], pose: 'plank',
    mColor: '#10b981', xp: 70, diff: 'Médio',
    steps: [
      'Apoie o peso nos antebraços e nas pontas dos pés',
      'Mantenha o corpo alinhado da cabeça aos calcanhares',
      'Contraia o abdômen e os glúteos com força',
      'Não permita que o quadril suba ou caia',
      'Respire de maneira calma e constante'
    ]
  },
  {
    id: 'd4', name: 'Polichinelo', icon: '⚡',
    base: 20, max: 60, sets: 2, unit: 'polichinelos', type: 'reps', cat: 'cardio',
    muscles: ['Corpo todo', 'Cardio'], pose: 'jumpingjack',
    mColor: '#ef4444', xp: 60, diff: 'Fácil',
    steps: [
      'Fique de pé com os braços ao lado do corpo e pés juntos',
      'Pule abrindo as pernas e elevando os braços acima da cabeça',
      'Retorne imediatamente à posição inicial com outro salto',
      'Mantenha um ritmo fluido e constante'
    ]
  },
  {
    id: 'd5', name: 'Abdominal Crunch', icon: '🧘',
    base: 15, max: 50, sets: 2, unit: 'abdominais', type: 'reps', cat: 'core',
    muscles: ['Abdômen Superior', 'Core'], pose: 'crunch',
    mColor: '#10b981', xp: 60, diff: 'Fácil',
    steps: [
      'Deite de costas com os joelhos flexionados e pés no chão',
      'Posicione as mãos levemente atrás das orelhas',
      'Contraia o abdômen para elevar os ombros do chão',
      'Mantenha o pescoço relaxado sem puxar a cabeça',
      'Desça de forma controlada'
    ]
  },
  {
    id: 'd6', name: 'Afundo Estático', icon: '🏃',
    base: 10, max: 30, sets: 2, unit: 'afundos', type: 'reps', cat: 'força',
    muscles: ['Quadríceps', 'Glúteos', 'Isquiotibiais'], pose: 'lunge',
    mColor: '#3b82f6', xp: 65, diff: 'Médio',
    steps: [
      'Fique em pé e dê um passo largo para frente',
      'Desça o quadril de forma que o joelho traseiro quase toque o chão',
      'Mantenha o joelho da frente alinhado com o tornozelo',
      'Retorne à posição inicial aplicando força na perna da frente',
      'Complete a série e repita com a outra perna'
    ]
  },
  {
    id: 'd7', name: 'Elevação Pélvica', icon: '🔋',
    base: 15, max: 40, sets: 2, unit: 'elevações', type: 'reps', cat: 'força',
    muscles: ['Glúteos', 'Posteriores de Coxa', 'Core'], pose: 'glute',
    mColor: '#3b82f6', xp: 60, diff: 'Fácil',
    steps: [
      'Deite de costas com os joelhos dobrados e pés firmes no chão',
      'Eleve o quadril contraindo os glúteos ao máximo',
      'Mantenha os ombros apoiados no chão',
      'Segure por 1 segundo no topo e retorne devagar',
      'Evite encostar o quadril no chão até o final da série'
    ]
  },
  {
    id: 'd8', name: 'Mergulho no Banco', icon: '🪑',
    base: 10, max: 30, sets: 2, unit: 'mergulhos', type: 'reps', cat: 'força',
    muscles: ['Tríceps', 'Peitoral', 'Ombro Anterior'], pose: 'dip',
    mColor: '#3b82f6', xp: 65, diff: 'Médio',
    steps: [
      'Apoie as mãos na borda de um banco ou cadeira estável',
      'Mantenha as pernas estendidas ou levemente dobradas à frente',
      'Flexione os cotovelos até formar um ângulo de 90 graus',
      'Empurre o corpo de volta para cima estendendo os braços',
      'Mantenha as costas próximas à cadeira durante todo o movimento'
    ]
  }
];

export const WEEKLY_MISSIONS: WeeklyMission[] = [
  { id: 'w1', title: 'Frequência Semanal', desc: 'Registre treinos em pelo menos 5 dias esta semana', xp: 500, diff: 'Intermediário', total: 5 },
  { id: 'w2', title: 'Meta de Flexões', desc: 'Acumule 60 flexões concluídas nos seus treinos', xp: 350, diff: 'Moderado', total: 60 },
  { id: 'w3', title: 'Volume de Cardio', desc: 'Complete 4 sessões focadas em condicionamento cárdio', xp: 400, diff: 'Moderado', total: 4 },
  { id: 'w4', title: 'Foco de Treinos', desc: 'Complete pelo menos 3 exercícios em 3 dias diferentes', xp: 550, diff: 'Avançado', total: 3 }
];

export const SPECIAL_MISSIONS: SpecialMission[] = [
  { id: 's1', title: 'Primeiro Passo', desc: 'Conclua seu primeiro exercício no aplicativo', xp: 50, diff: 'Iniciante' },
  { id: 's2', title: 'Treino Matinal', desc: 'Complete qualquer exercício antes das 09:00', xp: 150, diff: 'Estilo de Vida' },
  { id: 's3', title: 'Sessão Completa', desc: 'Treine Força, Core e Cardio no mesmo dia', xp: 200, diff: 'Estilo de Vida' },
  { id: 's4', title: 'Consistência Plena', desc: 'Mantenha uma sequência de 7 dias de treino ativos', xp: 700, diff: 'Desafio' },
  { id: 's5', title: 'Consistência de Ferro', desc: 'Conclua um total acumulado de 100 exercícios', xp: 1000, diff: 'Desafio' }
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', icon: '🎯', title: 'Ponto de Partida', desc: 'Concluiu seu primeiro exercício', check: s => s.totalMissions >= 1 },
  { id: 'a2', icon: '📈', title: 'Hábito Inicial', desc: 'Concluiu 10 exercícios totais', check: s => s.totalMissions >= 10 },
  { id: 'a3', icon: '🔋', title: 'Consistência Sólida', desc: 'Concluiu 25 exercícios totais', check: s => s.totalMissions >= 25 },
  { id: 'a4', icon: '💪', title: 'Foco Absoluto', desc: 'Concluiu 50 exercícios totais', check: s => s.totalMissions >= 50 },
  { id: 'a5', icon: '🏆', title: 'Atleta Dedicado', desc: 'Concluiu 100 exercícios totais', check: s => s.totalMissions >= 100 },
  { id: 'a6', icon: '🔥', title: 'Foco Inicial', desc: 'Sequência ativa de 3 dias de treino', check: s => s.streak >= 3 },
  { id: 'a7', icon: '⚡', title: 'Consistência Semanal', desc: 'Sequência ativa de 7 dias de treino', check: s => s.streak >= 7 },
  { id: 'a8', icon: '👑', title: 'Estilo de Vida', desc: 'Sequência ativa de 30 dias de treino', check: s => s.streak >= 30 },
  { id: 'a9', icon: '⭐', title: 'Nível de Consistência 5', desc: 'Alcance o nível 5 de progresso', check: s => s.level >= 5 },
  { id: 'a10', icon: '🌟', title: 'Nível de Consistência 10', desc: 'Alcance o nível 10 de progresso', check: s => s.level >= 10 },
  { id: 'a11', icon: '💎', title: 'Nível de Consistência 25', desc: 'Alcance o nível 25 de progresso', check: s => s.level >= 25 },
  { id: 'a12', icon: '🏅', title: 'Atleta de Elite', desc: 'Alcance o nível 50 de progresso', check: s => s.level >= 50 },
  { id: 'a13', icon: '🦾', title: 'Volume de Flexões', desc: '200 flexões totais concluídas', check: s => s.totalFlexoes >= 200 },
  { id: 'a14', icon: '🦵', title: 'Força de Membros Inferiores', desc: '300 agachamentos totais concluídos', check: s => s.totalAgacham >= 300 },
  { id: 'a15', icon: '🛡️', title: 'Estabilidade de Core', desc: '600s de prancha abdominal acumulados', check: s => s.totalPrancha >= 600 },
  { id: 'a16', icon: '📅', title: 'Volume de Treinos Diários', desc: 'Concluiu 5 exercícios em um único dia', check: s => s.maxDayMissions >= 5 },
  { id: 'a17', icon: '🚀', title: 'Foco Inabalável', desc: '10 exercícios seguidos sem falhas', check: s => s.maxConsecutive >= 10 },
  { id: 'a18', icon: '🌌', title: 'Lenda da Calistenia', desc: 'Nível 50 e 200 exercícios concluídos', check: s => s.level >= 50 && s.totalMissions >= 200 }
];

export const MOCK_PLAYERS_REGIONAL: RankingPlayer[] = [
  { name: 'Bruno Silva', avatar: '🏃', level: 8, xp: 3200 },
  { name: 'Carla Mendes', avatar: '⚡', level: 7, xp: 2800 },
  { name: 'Diego Costa', avatar: '💪', level: 6, xp: 2400 },
  { name: 'Fernanda Reis', avatar: '🔋', level: 5, xp: 1900 },
  { name: 'Gabriel Souza', avatar: '📈', level: 4, xp: 1500 },
  { name: 'Helena Martins', avatar: '⏱️', level: 3, xp: 1100 },
  { name: 'Igor Ferreira', avatar: '🦵', level: 2, xp: 700 },
  { name: 'Julia Santos', avatar: '🧘', level: 1, xp: 300 }
];

export const MOCK_PLAYERS_NACIONAL: RankingPlayer[] = [
  { name: 'André Oliveira', avatar: '💪', level: 15, xp: 8500 },
  { name: 'Beatriz Cruz', avatar: '⚡', level: 12, xp: 6200 },
  { name: 'Carlos Neto', avatar: '🔋', level: 10, xp: 5100 },
  { name: 'Daniela Pires', avatar: '📈', level: 9, xp: 4300 },
  { name: 'Eduardo Alves', avatar: '🏃', level: 8, xp: 3800 },
  { name: 'Flavia Rocha', avatar: '🎯', level: 7, xp: 3100 },
  { name: 'Gustavo Lima', avatar: '⏱️', level: 6, xp: 2500 },
  { name: 'Ingrid Vale', avatar: '🧘', level: 5, xp: 1800 }
];

export const MOCK_PLAYERS_MUNDIAL: RankingPlayer[] = [
  { name: 'Alex Storm', avatar: '⚡', level: 50, xp: 85000 },
  { name: 'Maria Fuerte', avatar: '💪', level: 42, xp: 62000 },
  { name: 'Kai Thunder', avatar: '🔋', level: 35, xp: 48000 },
  { name: 'Yuki Sato', avatar: '📈', level: 28, xp: 35000 },
  { name: 'Camila Power', avatar: '🏃', level: 22, xp: 25000 },
  { name: 'Ruan Silva', avatar: '🎯', level: 18, xp: 18000 },
  { name: 'Priya Patel', avatar: '🧘', level: 15, xp: 12000 },
  { name: 'Luca Speed', avatar: '⏱️', level: 10, xp: 7000 }
];

export const PREMIUM_EXERCISES: Exercise[] = [
  {
    id: 'p1', name: 'Flexão Diamante', icon: '💎',
    base: 8, max: 25, sets: 2, unit: 'flexões', type: 'reps', cat: 'força',
    muscles: ['Tríceps', 'Peitoral Interno', 'Ombros'], pose: 'pushup',
    mColor: '#3b82f6', xp: 90, diff: 'Médio', isPremium: true,
    steps: [
      'Coloque as mãos no chão bem abaixo do peito',
      'Forme um triângulo com os polegares e indicadores',
      'Desça o peito em direção às mãos mantendo os cotovelos próximos ao corpo',
      'Empurre o chão de volta estendendo os braços',
      'Mantenha o corpo perfeitamente alinhado'
    ]
  },
  {
    id: 'p2', name: 'Flexão Arqueiro', icon: '🏹',
    base: 6, max: 18, sets: 2, unit: 'flexões', type: 'reps', cat: 'força',
    muscles: ['Peitoral', 'Tríceps', 'Core'], pose: 'pushup',
    mColor: '#3b82f6', xp: 100, diff: 'Difícil', isPremium: true,
    steps: [
      'Afaste as mãos bem além da largura dos ombros',
      'Aponte os dedos levemente para fora',
      'Desça o corpo em direção a uma das mãos, estendendo o braço oposto',
      'Suba e alterne descendo para o outro braço',
      'Foque o trabalho de força unilateral'
    ]
  },
  {
    id: 'p3', name: 'Burpee Completo', icon: '⏱️',
    base: 6, max: 20, sets: 2, unit: 'burpees', type: 'reps', cat: 'cardio',
    muscles: ['Corpo Todo', 'Cardio', 'Pernas'], pose: 'jumpingjack',
    mColor: '#ef4444', xp: 110, diff: 'Difícil', isPremium: true,
    steps: [
      'Comece de pé, agache e coloque as mãos no chão',
      'Salte com os pés para trás entrando em posição de flexão',
      'Faça uma flexão completa tocando o peito no chão',
      'Salte trazendo os pés de volta para as mãos',
      'Salte explosivamente para cima batendo as palmas'
    ]
  },
  {
    id: 'p4', name: 'Mountain Climber', icon: '🏃',
    base: 20, max: 60, sets: 2, unit: 'segundos', type: 'timer', cat: 'cardio',
    muscles: ['Core', 'Ombros', 'Cardio'], pose: 'plank',
    mColor: '#ef4444', xp: 80, diff: 'Médio', isPremium: true,
    steps: [
      'Comece na posição de flexão alta (mãos no chão)',
      'Traga um joelho em direção ao peito rapidamente',
      'Troque de perna em um movimento contínuo de corrida',
      'Mantenha o abdômen contraído e as costas retas'
    ]
  },
  {
    id: 'p5', name: 'Super-homem Estático', icon: '🔋',
    base: 15, max: 45, sets: 2, unit: 'segundos', type: 'timer', cat: 'core',
    muscles: ['Lombar', 'Glúteos', 'Lombar'], pose: 'glute',
    mColor: '#10b981', xp: 85, diff: 'Médio', isPremium: true,
    steps: [
      'Deite de bruços com braços esticados à frente',
      'Contraia a lombar e os glúteos simultaneamente',
      'Levante os braços, peito e pernas do chão',
      'Mantenha o pescoço em posição neutra',
      'Segure a posição respirando lentamente'
    ]
  },
  {
    id: 'p6', name: 'Agachamento com Salto', icon: '🦵',
    base: 10, max: 30, sets: 2, unit: 'saltos', type: 'reps', cat: 'força',
    muscles: ['Quadríceps', 'Glúteos', 'Cardio'], pose: 'squat',
    mColor: '#3b82f6', xp: 90, diff: 'Médio', isPremium: true,
    steps: [
      'Faça um agachamento tradicional completo',
      'Ao subir, empurre o chão de forma explosiva',
      'Salte o mais alto possível estendendo o corpo',
      'Amorteça a queda voltando de forma controlada ao agachamento'
    ]
  },
  {
    id: 'p7', name: 'Agachamento Búlgaro', icon: '🦵',
    base: 8, max: 20, sets: 2, unit: 'repetições', type: 'reps', cat: 'força',
    muscles: ['Quadríceps', 'Glúteos', 'Posteriores'], pose: 'lunge',
    mColor: '#3b82f6', xp: 95, diff: 'Difícil', isPremium: true,
    steps: [
      'Fique de costas para uma superfície estável',
      'Coloque o peito de uma perna traseira apoiado na superfície',
      'Focalize a força no calcanhar da perna dianteira',
      'Desça o quadril de forma estável e retorne ao topo'
    ]
  },
  {
    id: 'p8', name: 'Prancha Lateral', icon: '⏱️',
    base: 15, max: 45, sets: 2, unit: 'segundos', type: 'timer', cat: 'core',
    muscles: ['Oblíquos', 'Core Lateral', 'Ombros'], pose: 'plank',
    mColor: '#10b981', xp: 80, diff: 'Médio', isPremium: true,
    steps: [
      'Deite de lado apoiado em um cotovelo alinhado com o ombro',
      'Mantenha as pernas esticadas e pés empilhados',
      'Eleve o quadril do chão mantendo o corpo reto',
      'Mantenha a contração e troque o lado na sequência'
    ]
  },
  {
    id: 'p9', name: 'Salto de Corda Virtual', icon: '⚡',
    base: 30, max: 120, sets: 2, unit: 'saltos', type: 'reps', cat: 'cardio',
    muscles: ['Panturrilhas', 'Cardio', 'Resistência'], pose: 'jumpingjack',
    mColor: '#ef4444', xp: 75, diff: 'Fácil', isPremium: true,
    steps: [
      'Simule segurar uma corda com as mãos ao lado',
      'Dê saltos curtos na ponta dos pés mantendo os joelhos amortecidos',
      'Movimente os punhos em sincronia com os saltos',
      'Mantenha um ritmo cardiovascular ágil e consistente'
    ]
  }
];

export const ELITE_MISSIONS: EliteMission[] = [
  {
    id: 'e1',
    title: 'Volume de Flexões Semanal',
    desc: 'Complete 300 flexões acumuladas esta semana',
    xp: 800,
    medalId: 'em1',
    medalTitle: 'Medalha de Peitoral',
    medalIcon: '🥇',
    target: 300,
    type: 'flexoes'
  },
  {
    id: 'e2',
    title: 'Consistência Máxima',
    desc: 'Registre treinos por 5 dias consecutivos',
    xp: 1000,
    medalId: 'em2',
    medalTitle: 'Consistência de Ouro',
    medalIcon: '🔥',
    target: 5,
    type: 'streak'
  },
  {
    id: 'e3',
    title: 'Volume de Agachamentos',
    desc: 'Faça 1.000 agachamentos acumulados no mês',
    xp: 1200,
    medalId: 'em3',
    medalTitle: 'Força de Membros Inferiores',
    medalIcon: '👑',
    target: 1000,
    type: 'agachamentos'
  },
  {
    id: 'e4',
    title: 'Conclusão Semanal Plena',
    desc: 'Complete todas as metas e missões da semana',
    xp: 1500,
    medalId: 'em4',
    medalTitle: 'Mestre da Frequência',
    medalIcon: '🏆',
    target: 4,
    type: 'all_weekly'
  }
];
