import { GameState } from '../types';

export interface FitnessProfile {
  nivel: string;
  rankLetter: string;
  text: string;
  flexoes: number;
  agachamentos: number;
  prancha: number;
}

/**
 * Calculates a highly personalized fitness target and rank based on
 * gender, age, height, weight, fitness goals, training frequency, and test results.
 */
export function calculatePersonalizedFitness({
  sexo,
  idade,
  altura,
  peso,
  objetivo,
  frequenciaTreino,
  flexoesTest,
  agachamentosTest,
  pranchaTest,
}: {
  sexo: string;
  idade: number | string;
  altura: number;
  peso: number;
  objetivo: string;
  frequenciaTreino: string;
  flexoesTest: number;
  agachamentosTest: number;
  pranchaTest: number;
}): FitnessProfile {
  // 1. Resolve age (handle year of birth vs raw age)
  const currentYear = new Date().getFullYear();
  let resolvedAge = typeof idade === 'string' ? parseInt(idade) : idade;
  if (resolvedAge > 1900) {
    resolvedAge = currentYear - resolvedAge;
  }
  if (!resolvedAge || isNaN(resolvedAge)) {
    resolvedAge = 25; // default fallback
  }

  // 2. Calculate Body Mass Index (BMI)
  const heightInMeters = altura / 100;
  const bmi = heightInMeters > 0 ? peso / (heightInMeters * heightInMeters) : 22;

  // 3. Determine Rank and Level with sophisticated scoring
  // This ensures women, lightweight individuals, or older adults get fair, physiologically accurate assessments.
  let score = 0;

  // Training Frequency Base Points
  if (frequenciaTreino === 'Nunca treino') score += 1;
  else if (frequenciaTreino === 'Treino raramente') score += 3;
  else if (frequenciaTreino === 'Treino 2-3 vezes por semana') score += 6;
  else if (frequenciaTreino === 'Treino 4 ou mais vezes por semana') score += 10;

  // Adjust test scores based on biological realities
  // Women generally have a different upper-to-lower body ratio, making raw bodyweight pushups and planks harder relative to absolute fitness.
  const isFemale = sexo === 'Feminino';
  const pushupMultiplier = isFemale ? 1.4 : 1.0;
  const plankMultiplier = isFemale ? 1.25 : 1.0;

  // BMI impact: carrying extra body weight makes bodyweight movements harder
  const isOverweight = bmi >= 25 && bmi < 30;
  const isObese = bmi >= 30;
  const isUnderweight = bmi < 18.5;

  score += (flexoesTest * pushupMultiplier) * 0.8;
  score += agachamentosTest * 0.4;
  score += (pranchaTest * plankMultiplier) * 0.2;

  // Biometric modifiers to overall classification score
  if (bmi >= 18.5 && bmi <= 24.9) {
    score += 4; // optimal bodyweight composition
  } else if (isOverweight) {
    score += 1.5;
  } else if (isObese) {
    score -= 3; // high resistance from weight
  }

  if (resolvedAge >= 18 && resolvedAge <= 35) {
    score += 3; // peak biological physical state
  } else if (resolvedAge >= 36 && resolvedAge <= 45) {
    score += 1;
  } else if (resolvedAge > 52) {
    score -= 2;
  }

  // Level classification
  let nivel = 'Iniciante';
  let rankLetter = 'E';
  let text = 'O Sistema identificou sua aptidão inicial. Foco no fortalecimento das articulações, regularidade diária e alicerce muscular.';

  if (score >= 15 && score < 32) {
    nivel = 'Intermediário';
    rankLetter = 'E';
    text = 'Você possui boa coordenação e resistência de base. Foco em aprimorar a cadência, hipertrofia leve e densidade metabólica.';
  } else if (score >= 32) {
    nivel = 'Avançado';
    rankLetter = 'E';
    text = 'Seu perfil demonstrou excelente aptidão neuromuscular. O Sistema gerou um cronograma avançado para maximizar sua força, potência e superação.';
  }

  // 4. Calculate Exercise Target Factors (Percentage of capacity, strictly between 60% and 80%)
  // Base target is 70% of capacity (midpoint of the requested 60% - 80% range)
  let flexFactor = 0.70;
  let squatFactor = 0.70;
  let plankFactor = 0.70;

  // Modifiers based on objective
  if (objetivo === 'Criar hábito de treinar') {
    flexFactor -= 0.08;
    squatFactor -= 0.08;
    plankFactor -= 0.08; // Shift toward lower limit (62% target)
  } else if (objetivo === 'Manter a saúde') {
    flexFactor -= 0.04;
    squatFactor -= 0.04;
    plankFactor -= 0.04; // Shift toward 66% target
  } else if (objetivo === 'Emagrecer') {
    flexFactor += 0.01;
    squatFactor += 0.02;
    plankFactor += 0.01; // Shift toward 71%-72% target (metabolic burn)
  } else if (objetivo === 'Melhorar condicionamento') {
    flexFactor += 0.04;
    squatFactor += 0.04;
    plankFactor += 0.05; // Shift toward 74%-75% target (muscular endurance)
  } else if (objetivo === 'Ganhar massa muscular') {
    flexFactor += 0.06;
    squatFactor += 0.06;
    plankFactor += 0.04; // Shift toward 74%-76% target (hypertrophy stimulation)
  }

  // Modifiers based on Training Frequency (Activity Level)
  if (frequenciaTreino === 'Nunca treino') {
    flexFactor -= 0.08;
    squatFactor -= 0.08;
    plankFactor -= 0.08;
  } else if (frequenciaTreino === 'Treino raramente') {
    flexFactor -= 0.03;
    squatFactor -= 0.03;
    plankFactor -= 0.03;
  } else if (frequenciaTreino === 'Treino 2-3 vezes por semana') {
    flexFactor += 0.02;
    squatFactor += 0.02;
    plankFactor += 0.02;
  } else if (frequenciaTreino === 'Treino 4 ou mais vezes por semana') {
    flexFactor += 0.06;
    squatFactor += 0.06;
    plankFactor += 0.06;
  }

  // Modifiers based on Gender
  if (isFemale) {
    flexFactor -= 0.08; // Upper body pushups are biologically more taxing relative to max
    squatFactor += 0.04; // Relatively stronger lower body endurance
    plankFactor += 0.02; // Relatively stronger core stamina
  } else if (sexo === 'Masculino') {
    flexFactor += 0.02; // Relative upper body advantage
    squatFactor -= 0.02;
  }

  // Modifiers based on Age
  if (resolvedAge < 25) {
    flexFactor += 0.04;
    squatFactor += 0.04;
    plankFactor += 0.04; // Peak hormonal recovery speed
  } else if (resolvedAge >= 25 && resolvedAge <= 35) {
    flexFactor += 0.01;
    squatFactor += 0.01;
    plankFactor += 0.01;
  } else if (resolvedAge >= 42 && resolvedAge <= 50) {
    flexFactor -= 0.05;
    squatFactor -= 0.05;
    plankFactor -= 0.05;
  } else if (resolvedAge > 50) {
    flexFactor -= 0.12;
    squatFactor -= 0.12;
    plankFactor -= 0.12; // Joint protection focus
  }

  // Modifiers based on BMI (carrying extra weight makes bodyweight work much harder)
  if (isObese) {
    flexFactor -= 0.14;
    plankFactor -= 0.12;
    squatFactor -= 0.08;
  } else if (isOverweight) {
    flexFactor -= 0.07;
    plankFactor -= 0.06;
    squatFactor -= 0.04;
  } else if (bmi >= 18.5 && bmi < 25) {
    flexFactor += 0.02;
    squatFactor += 0.02;
    plankFactor += 0.02; // Optimal strength-to-weight ratio
  } else if (isUnderweight) {
    flexFactor -= 0.04;
    squatFactor -= 0.04;
    plankFactor -= 0.04; // Low muscle fuel reserves
  }

  // 5. Clamp factors strictly between 60% (0.60) and 80% (0.80) of capacity
  // This complies perfectly with the user's explicit safety and progressive guidelines.
  const minF = 0.60;
  const maxF = 0.80;

  flexFactor = Math.min(maxF, Math.max(minF, flexFactor));
  squatFactor = Math.min(maxF, Math.max(minF, squatFactor));
  plankFactor = Math.min(maxF, Math.max(minF, plankFactor));

  // 6. Calculate Final Targets and mathematically enforce the 60% to 80% boundaries
  let finalFlexoes = Math.round(flexoesTest * flexFactor);
  let finalAgachamentos = Math.round(agachamentosTest * squatFactor);
  let finalPrancha = Math.round(pranchaTest * plankFactor);

  if (flexoesTest > 0) {
    const minCap = Math.max(1, Math.round(flexoesTest * 0.60));
    const maxCap = Math.max(1, Math.round(flexoesTest * 0.80));
    finalFlexoes = Math.min(maxCap, Math.max(minCap, finalFlexoes));
  } else {
    finalFlexoes = isFemale || resolvedAge > 45 ? 3 : 5; // Knee pushups baseline
  }

  if (agachamentosTest > 0) {
    const minCap = Math.max(2, Math.round(agachamentosTest * 0.60));
    const maxCap = Math.max(2, Math.round(agachamentosTest * 0.80));
    finalAgachamentos = Math.min(maxCap, Math.max(minCap, finalAgachamentos));
  } else {
    finalAgachamentos = isFemale && peso < 48 ? 5 : 8; // Air squat baseline
  }

  if (pranchaTest > 0) {
    const minCap = Math.max(5, Math.round(pranchaTest * 0.60));
    const maxCap = Math.max(5, Math.round(pranchaTest * 0.80));
    finalPrancha = Math.min(maxCap, Math.max(minCap, finalPrancha));
  } else {
    finalPrancha = 10; // Plank baseline
  }

  return {
    nivel,
    rankLetter,
    text,
    flexoes: finalFlexoes,
    agachamentos: finalAgachamentos,
    prancha: finalPrancha,
  };
}

/**
 * Calculates gradual, safe progression for reassessments.
 * Never increases difficulty excessively to maintain user motivation.
 */
export function calculateReassessmentProgression({
  gameState,
  newFlexoesTest,
  newAgachamentosTest,
  newPranchaTest,
  newPeso,
}: {
  gameState: GameState;
  newFlexoesTest: number;
  newAgachamentosTest: number;
  newPranchaTest: number;
  newPeso: number;
}): { flexoes: number; agachamentos: number; prancha: number } {
  // 1. Calculate the raw personalized target using their updated inputs
  const currentProfile = calculatePersonalizedFitness({
    sexo: gameState.sexo || 'Prefiro não dizer',
    idade: gameState.idade || 25,
    altura: gameState.altura || 170,
    peso: newPeso || gameState.peso || 70,
    objetivo: gameState.objetivo || 'Criar hábito de treinar',
    frequenciaTreino: gameState.frequencia_treino || 'Treino raramente',
    flexoesTest: newFlexoesTest,
    agachamentosTest: newAgachamentosTest,
    pranchaTest: newPranchaTest,
  });

  const oldMissions = gameState.missao_personalizada || {
    flexoes: 5,
    agachamentos: 10,
    prancha: 15,
  };

  // 2. Set strict progression limits to avoid over-exertion (never jump too high!)
  // Max increase limit based on current fitness tier
  const isAvançado = gameState.nivel_fitness === 'Avançado';
  const isIntermediario = gameState.nivel_fitness === 'Intermediário';

  const maxFlexIncrease = isAvançado ? 6 : isIntermediario ? 4 : 3;
  const maxSquatIncrease = isAvançado ? 10 : isIntermediario ? 7 : 5;
  const maxPlankIncrease = isAvançado ? 20 : isIntermediario ? 15 : 10;

  // Let's progressive target but keep it scaled
  let nextFlex = currentProfile.flexoes;
  let nextSquat = currentProfile.agachamentos;
  let nextPlank = currentProfile.prancha;

  // Make sure it doesn't jump higher than previous mission + max increase
  nextFlex = Math.min(oldMissions.flexoes + maxFlexIncrease, nextFlex);
  nextSquat = Math.min(oldMissions.agachamentos + maxSquatIncrease, nextSquat);
  nextPlank = Math.min(oldMissions.prancha + maxPlankIncrease, nextPlank);

  // Maintain existing target if new test was low, but let's allow a slight reduction if performance significantly dropped (more than 30%)
  const flexDropped = newFlexoesTest < (gameState.flexoes_inicial || 0) * 0.7;
  if (!flexDropped) {
    nextFlex = Math.max(oldMissions.flexoes, nextFlex);
  } else {
    nextFlex = Math.max(3, nextFlex);
  }

  const squatDropped = newAgachamentosTest < (gameState.agachamentos_inicial || 0) * 0.7;
  if (!squatDropped) {
    nextSquat = Math.max(oldMissions.agachamentos, nextSquat);
  } else {
    nextSquat = Math.max(5, nextSquat);
  }

  const plankDropped = newPranchaTest < (gameState.prancha_inicial || 0) * 0.7;
  if (!plankDropped) {
    nextPlank = Math.max(oldMissions.prancha, nextPlank);
  } else {
    nextPlank = Math.max(10, nextPlank);
  }

  return {
    flexoes: nextFlex,
    agachamentos: nextSquat,
    prancha: nextPlank,
  };
}
