//utils/gameSummaryCalculator.ts

// Constants
const RANK_THRESHOLDS = {
    MASTER: 200,
    ADVANCED: 120,
    INTERMEDIATE: 50
  };
  
  const PERFORMANCE_THRESHOLD = 0.7;
  const PERFORMANCE_BONUS = 10;
  const STREAK_SIZE = 3;
  const STREAK_REWARD = 3;
  const PERSONAL_BEST_BONUS = 5;
  const MAX_TIME_EFFICIENCY = 1.2;
  
  // Grade calculation weights
  const WEIGHTS = {
    POINTS: 0.45,
    COINS: 0.2,
    EXACT_MATCHES: 0.2,
    TIME_EFFICIENCY: 0.15
  };
  
  export type FinalRank = 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  
  export interface FinalGameSummary {
    totalPoints: number;
    totalCoins: number;
    rank: FinalRank;
    performanceBonus: number;
    streakBonus: number;
    personalBestBonus: number;
    finalGrade: number; // 0.0 to 1.0
  }
  
  /**
   * Determines the rank based on total points.
   */
  function determineRank(points: number): FinalRank {
    if (points >= RANK_THRESHOLDS.MASTER) return 'Master';
    if (points >= RANK_THRESHOLDS.ADVANCED) return 'Advanced';
    if (points >= RANK_THRESHOLDS.INTERMEDIATE) return 'Intermediate';
    return 'Beginner';
  }
  
  /**
   * Calculates performance bonus.
   * Returns bonus coins if performance threshold is met.
   */
  function calculatePerformanceBonus(totalPoints: number, maxPoints: number): number {
    if (maxPoints <= 0) return 0;
    const performanceRatio = totalPoints / maxPoints;
    return performanceRatio >= PERFORMANCE_THRESHOLD ? PERFORMANCE_BONUS : 0;
  }
  
  /**
   * Calculates streak bonus.
   * Coins awarded per completed streak of exact matches.
   */
  function calculateStreakBonus(exactMatchCount: number): number {
    if (exactMatchCount <= 0) return 0;
    const streaksCompleted = Math.floor(exactMatchCount / STREAK_SIZE);
    return streaksCompleted * STREAK_REWARD;
  }
  
  /**
   * Calculates personal best bonus.
   * Returns bonus coins if player beat their personal best.
   */
  function calculatePersonalBestBonus(didBeatPersonalBest: boolean): number {
    return didBeatPersonalBest ? PERSONAL_BEST_BONUS : 0;
  }
  
  /**
   * Calculates a final grade between 0.0 - 1.0.
   * Based on weighted factors: points, coins, exact matches, and time efficiency.
   */
  function calculateFinalGrade(params: {
    totalPoints: number;
    maxPoints: number;
    totalCoins: number;
    maxCoinsPossible: number;
    exactMatches: number;
    totalQuestions: number;
    optimalTotalTime: number;
    actualTotalTime: number;
  }): number {
    const {
      totalPoints,
      maxPoints,
      totalCoins,
      maxCoinsPossible,
      exactMatches,
      totalQuestions,
      optimalTotalTime,
      actualTotalTime,
    } = params;
  
    // Prevent division by zero
    const safeMaxPoints = Math.max(maxPoints, 1);
    const safeMaxCoins = Math.max(maxCoinsPossible, 1);
    const safeTotalQuestions = Math.max(totalQuestions, 1);
    const safeActualTime = Math.max(actualTotalTime, 1);
  
    const pointScore = totalPoints / safeMaxPoints;
    const coinScore = totalCoins / safeMaxCoins;
    const exactMatchScore = exactMatches / safeTotalQuestions;
    
    // Calculate time efficiency with a cap on bonus for very fast times
    const timeEfficiency = Math.min(optimalTotalTime / safeActualTime, MAX_TIME_EFFICIENCY);
    
    // Calculate weighted grade
    const grade = (WEIGHTS.POINTS * pointScore) + 
                  (WEIGHTS.COINS * coinScore) + 
                  (WEIGHTS.EXACT_MATCHES * exactMatchScore) + 
                  (WEIGHTS.TIME_EFFICIENCY * timeEfficiency);
    
    // Ensure grade is within valid range
    return Math.min(Math.max(grade, 0), 1);
  }
  
  /**
   * Validates input parameters to ensure they are positive.
   * Throws an error if validation fails.
   */
  function validateGameParameters(params: {
    maxPoints: number;
    maxCoinsPossible: number;
    totalQuestions: number;
    optimalTotalTime: number;
  }): void {
    const { maxPoints, maxCoinsPossible, totalQuestions, optimalTotalTime } = params;
    
    if (maxPoints <= 0) {
      throw new Error("Invalid game parameter: maxPoints must be positive");
    }
    
    if (maxCoinsPossible <= 0) {
      throw new Error("Invalid game parameter: maxCoinsPossible must be positive");
    }
    
    if (totalQuestions <= 0) {
      throw new Error("Invalid game parameter: totalQuestions must be positive");
    }
    
    if (optimalTotalTime <= 0) {
      throw new Error("Invalid game parameter: optimalTotalTime must be positive");
    }
  }
  
  /**
   * Summarizes the final game results.
   * Returns a comprehensive summary including points, coins, rank, and grade.
   */
  export function summarizeFinalGame(params: {
    totalPoints: number;
    totalCoins: number;
    maxPoints: number;
    maxCoinsPossible: number;
    exactMatches: number;
    totalQuestions: number;
    optimalTotalTime: number; // usually 80s * totalQuestions
    actualTotalTime: number;
    didBeatPersonalBest: boolean;
    exactMatchStreaks?: number; // Optional: actual count of completed streaks during gameplay
  }): FinalGameSummary {
    try {
      // Validate critical parameters
      validateGameParameters({
        maxPoints: params.maxPoints,
        maxCoinsPossible: params.maxCoinsPossible,
        totalQuestions: params.totalQuestions,
        optimalTotalTime: params.optimalTotalTime
      });
      
      const {
        totalPoints,
        totalCoins,
        maxPoints,
        maxCoinsPossible,
        exactMatches,
        totalQuestions,
        optimalTotalTime,
        actualTotalTime,
        didBeatPersonalBest,
        exactMatchStreaks
      } = params;
      
      // Calculate bonuses
      const performanceBonus = calculatePerformanceBonus(totalPoints, maxPoints);
      
      // Use exact streak count if provided, otherwise estimate from exact matches
      const streakBonus = exactMatchStreaks !== undefined 
        ? exactMatchStreaks * STREAK_REWARD
        : calculateStreakBonus(exactMatches);
        
      const personalBestBonus = calculatePersonalBestBonus(didBeatPersonalBest);
      
      // Calculate final coins including all bonuses
      const finalCoins = totalCoins + performanceBonus + streakBonus + personalBestBonus;
      
      // Calculate final grade
      const finalGrade = calculateFinalGrade({
        totalPoints,
        maxPoints,
        totalCoins: finalCoins,
        maxCoinsPossible,
        exactMatches,
        totalQuestions,
        optimalTotalTime,
        actualTotalTime,
      });
      
      // Determine rank based on total points
      const rank = determineRank(totalPoints);
      
      return {
        totalPoints,
        totalCoins: finalCoins,
        rank,
        performanceBonus,
        streakBonus,
        personalBestBonus,
        finalGrade,
      };
    } catch (error) {
      console.error("Error calculating game summary:", error);
      // Return a default summary with zero values in case of error
      return {
        totalPoints: 0,
        totalCoins: 0,
        rank: 'Beginner',
        performanceBonus: 0,
        streakBonus: 0,
        personalBestBonus: 0,
        finalGrade: 0,
      };
    }
  }