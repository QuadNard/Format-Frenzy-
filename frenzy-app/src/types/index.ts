

// Quiz modes
type QuizMode = "classic" | "blitz" | "open-end" | "multi-choice";

// UI state for the quiz
interface QuizState {
  currentIndex: number;
  correctCount: number;
  streakCount: number;
  maxStreak: number;
  timeAccumulated: number[];
  fetched: boolean;
  constructed: boolean;
}

// Final result breakdown
interface FinalResult {
  totalPoints: number;
  baseCoins: number;
  modifiers: {
    streakBonus: number;
    negativePenalty: number;
    timePenalty: number;
    speedBonus: number;
    personalBestBonus: number;
    performanceBonus: number;
  };
  finalCoins: number;
  breakdown: {
    accuracyPct: number;
    avgTimeSec: number;
    totalTimeSec: number;
    maxStreak: number;
  };
}

// 1) QuestionSet used on the client
interface QuestionSet {
  question_id:   string;
  question:      string;
  correct_code:  string;
}

// 2) Microservice construction API
interface ConstructAnswerItem {
  question_id:  string;
  correct_code: string;
}
interface ConstructAnswersResponse {
  [question_id: string]: string;
}

// 3) Microservice checking API
interface CheckAnswerRequest {
  question_id: string;
  user_code:   string;
  correct_code: string;  
  correct_ast?: string;  // ❓ optional (keep it optional if you want backwards compatibility)
}

// Detailed code issues per line
interface CodeIssue {
  line_number: number;
  column?: number;
  end_line_number?: number;
  end_column?: number;
  message: string;
}

// Aggregate feedback
interface Feedback {
  message: string
  issues:  CodeIssue[]
}

// Response from /check-answer
interface ScoreResponse {
  exact_match: boolean
  score:       number
  feedback:    Feedback
}

interface ScoreContext {
  totalPoints: number; // raw points
  maxExactStreak: number;
  anyQuestionPtsBelowThreshold: boolean;
  blitzOverruns: number;
  speedBonuses: number;
  isClassic: boolean;
  beatPersonalBest: boolean;
  finalPercent: number;   // from 0 to 100
}

interface LineFeedback {
  number: number;
  text: string;
  points: number;
  feedback: string[];
}

interface AnalysisResult { lines: LineFeedback[]; }


type SoundName = 
  | "addPoint"
  | "gameOver"
  | "addStreak"
  | "Streak"
  | "coinLose"
  | "coinCollect"
  | "losePoint"
  | "incorrectAnswer"
  | "startGame"
  | "coinGain"

  type GameMode = 'classic' | 'classic-cranked' | 'multi-choice' | 'open-ended' | 'cranked-choice';


export type {
  AnalysisResult,
  LineFeedback,
  ScoreContext,
  ScoreResponse,
  Feedback,
  CodeIssue,
  CheckAnswerRequest,
  FinalResult,
  ConstructAnswersResponse,
  QuizState,
  QuizMode,
  SoundName,
  GameMode,
  QuestionSet,
  ConstructAnswerItem,
}