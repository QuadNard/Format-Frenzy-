import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { DBQuestionSet } from '@/lib/queries/getRandomIds';
import { FinalGameSummary } from '@/utils/gameSummaryCalculator';

export type GameMode =
  | 'classic'
  | 'classic-cranked'
  | 'multi-choice'
  | 'open-ended'
  | 'cranked-choice';

interface StepStatus {
  step: number;
  label: string;
  isError: boolean;
}

interface QuizState {
  questions: DBQuestionSet[];
  answers: string[];
  currentStep: number;
  isCompleted: boolean;
  stepStatuses: StepStatus[];
  isStarted: boolean;
  ready: boolean;
  fetched: boolean;
  constructed: boolean;
  asts: Record<string, string>;
  selectedMode: GameMode | null;
  totalCoins: number;
  thresholdsAwarded: Set<number>;
  exactStreak: number;
  currentPoints: number;
  gameSummary: FinalGameSummary | null;
  lastPointsDelta: number;

  // Actions
  startGame: () => void;
  nextStep: () => void;
  prevStep: () => void;
  resetQuiz: () => void;

  // Manual setters
  setGameSummary: (summary: FinalGameSummary) => void;
  setThresholdsAwarded: (ts: Set<number>) => void;
  addThresholdAwarded: (threshold: number) => void;
  setExactStreak: (streak: number) => void;
  resetExactStreak: () => void;
  setTotalCoins: (coins: number) => void;
  addCoins: (delta: number) => void;
  setCurrentPoints: (points: number) => void;
  addPoints: (delta: number) => void;
  setSelectedMode: (mode: GameMode) => void;
  setFetched: (val: boolean) => void;
  setConstructed: (val: boolean) => void;
  setAsts: (asts: Record<string, string>) => void;
  setQuestions: (qs: DBQuestionSet[]) => void;
  setAnswers: (answers: string[]) => void;
  setCurrentStep: (step: number) => void;
  setIsCompleted: (completed: boolean) => void;
  setStepStatuses: (statuses: StepStatus[]) => void;
  setIsStarted: (val: boolean) => void;
  setReady: (val: boolean) => void;
}

export const useQuizStore = create<QuizState>()(
  devtools(
    (set, get) => ({
      // Initial state
      questions: [],
      answers: [],
      currentStep: 0,
      isCompleted: false,
      stepStatuses: [],
      isStarted: false,
      ready: false,
      fetched: false,
      constructed: false,
      asts: {},
      selectedMode: null,
      totalCoins: 0,
      thresholdsAwarded: new Set(),
      exactStreak: 0,
      currentPoints: 0,
      gameSummary: null,
      lastPointsDelta: 0,

      // Flow control actions
      setSelectedMode: (mode) => {
        set({
          selectedMode: mode,
          isStarted: false,
          ready: false,
          currentStep: 1,
          isCompleted: false,
          questions: [],
          answers: [],
        });
      },

      startGame: () =>
        set({
          isStarted: true,
          ready: true,
          currentStep: 0,
          isCompleted: false,
          answers: [],
          totalCoins: 0,
          exactStreak: 0,
          thresholdsAwarded: new Set(),
          gameSummary: null,
          currentPoints: 0,
          lastPointsDelta: 0,
          fetched: false,
          constructed: false,
          asts: {},
          selectedMode: null,
        }),

      nextStep: () => {
        const { currentStep } = get();
        set({ currentStep: currentStep + 1 });
      },

      prevStep: () => {
        const { currentStep } = get();
        set({ currentStep: Math.max(1, currentStep - 1) });
      },

      setFetched: (val) => set({ fetched: val }),
      setConstructed: (val) => set({ constructed: val }),
      setAsts: (asts) => set({ asts }),

      resetQuiz: () =>
        set({
          questions: [],
          answers: [],
          currentStep: 0,
          isCompleted: false,
          stepStatuses: [],
          isStarted: false,
          ready: false,
          fetched: false,
          constructed: false,
          asts: {},
          selectedMode: null,
          totalCoins: 0,
          thresholdsAwarded: new Set(),
          exactStreak: 0,
          currentPoints: 0,
          gameSummary: null,
          lastPointsDelta: 0,
        }),

      // Points & coins actions
      addPoints: (delta: number) =>
        set((state) => ({
          currentPoints: state.currentPoints + delta,
          lastPointsDelta: delta,
        })),
      addCoins: (delta: number) =>
        set((state) => ({ totalCoins: state.totalCoins + delta })),

      // Manual field setters
      setGameSummary: (summary) => set({ gameSummary: summary }),
      setThresholdsAwarded: (ts) => set({ thresholdsAwarded: ts }),
      addThresholdAwarded: (threshold) =>
        set((state) => {
          const updated = new Set(state.thresholdsAwarded);
          updated.add(threshold);
          return { thresholdsAwarded: updated };
        }),
      setExactStreak: (streak) => set({ exactStreak: streak }),
      resetExactStreak: () => set({ exactStreak: 0 }),
      setTotalCoins: (coins) => set({ totalCoins: coins }),
      setCurrentPoints: (points) => set({ currentPoints: points }),
      setQuestions: (qs) => set({ questions: qs }),
      setAnswers: (answers) => set({ answers }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setIsCompleted: (val) => set({ isCompleted: val }),
      setStepStatuses: (statuses) => set({ stepStatuses: statuses }),
      setIsStarted: (val) => set({ isStarted: val }),
      setReady: (val) => set({ ready: val }),
    }),
    {
      name: 'quiz-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
