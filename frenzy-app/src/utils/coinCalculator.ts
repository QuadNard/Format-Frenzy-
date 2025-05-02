// utils/coinCalculator.ts


// Constants for score types
const SCORE_EXACT_MATCH = 27;
const SCORE_SLIGHT_SYNTAX = 4;
const SCORE_WRONG_SYNTAX = 1;

export interface CoinResult {
  baseCoins: number;
  bonusCoins: number;
  newExactStreak: number;
  newThresholdsAwarded: number[];
}

// Predefined point thresholds and bonuses
const positiveThresholds = [50, 100, 150, 200, 250];
const positiveThresholdRewards: Record<number, number> = {
  50: 3,
  100: 5,
  150: 8,
  200: 12,
  250: 15,
};

const negativeThresholds = [-10, -20, -30];
const negativeThresholdPenalties: Record<number, number> = {
  [-10]: -2,
  [-20]: -3,
  [-30]: -5,
};

export function calculateCoins(params: {
  score: number;
  currentPoints: number;
  exactStreak: number;
  thresholdsAwarded: Set<number>;
  answerTime?: number;  // in seconds
  isBlitzMode?: boolean;
  previousPoints?: number; // for checking if threshold was crossed with this answer
}): CoinResult {
  const { 
    score, 
    currentPoints, 
    exactStreak, 
    thresholdsAwarded, 
    answerTime,
    previousPoints = currentPoints - score // Default to current score if not provided
  } = params;

  let baseCoins = 0;
  let bonusCoins = 0;
  let newExactStreak = exactStreak;
  const newThresholdsAwarded: number[] = [];

  // Calculate base coins from score
  baseCoins = getBaseCoinsForScore(score);
  
  // Update exact match streak
  newExactStreak = updateExactMatchStreak(score, exactStreak);
  
  // Add streak bonus if applicable
  if (newExactStreak > 0 && newExactStreak % 3 === 0) {
    bonusCoins += 3;
  }
  
  // Add speed bonus if applicable
  if (isCorrectAnswer(score) && answerTime !== undefined && answerTime < 80) {
    bonusCoins += 1;
  }

  // Process threshold crossings
  const thresholdResults = processThresholds(
    previousPoints, 
    currentPoints, 
    thresholdsAwarded
  );
  
  bonusCoins += thresholdResults.bonusCoins;
  newThresholdsAwarded.push(...thresholdResults.newThresholds);

  return {
    baseCoins,
    bonusCoins,
    newExactStreak,
    newThresholdsAwarded,
  };
}

function getBaseCoinsForScore(score: number): number {
  switch (score) {
    case SCORE_EXACT_MATCH:
      return 5;
    case SCORE_SLIGHT_SYNTAX:
      return 2;
    case SCORE_WRONG_SYNTAX:
      return 1;
    default:
      return 0;
  }
}

function updateExactMatchStreak(score: number, currentStreak: number): number {
  return score === SCORE_EXACT_MATCH ? currentStreak + 1 : 0;
}

function isCorrectAnswer(score: number): boolean {
  return score === SCORE_EXACT_MATCH || score === SCORE_SLIGHT_SYNTAX;
}

function processThresholds(
  previousPoints: number,
  currentPoints: number,
  thresholdsAwarded: Set<number>
): { bonusCoins: number, newThresholds: number[] } {
  let bonusCoins = 0;
  const newThresholds: number[] = [];

  // Check if crossed any positive thresholds with this answer
  for (const threshold of positiveThresholds) {
    if (currentPoints >= threshold && 
        previousPoints < threshold && 
        !thresholdsAwarded.has(threshold)) {
      bonusCoins += positiveThresholdRewards[threshold];
      newThresholds.push(threshold);
    }
  }

  // Check if crossed any negative thresholds with this answer
  for (const threshold of negativeThresholds) {
    if (currentPoints <= threshold && 
        previousPoints > threshold && 
        !thresholdsAwarded.has(threshold)) {
      bonusCoins += negativeThresholdPenalties[threshold];
      newThresholds.push(threshold);
    }
  }

  return { bonusCoins, newThresholds };
}

export function calculateFinalPerformanceBonus(totalPoints: number, maxPoints: number): number {
  const percentage = totalPoints / maxPoints;
  if (percentage >= 0.7) {
    return 10;
  }
  return 0;
}