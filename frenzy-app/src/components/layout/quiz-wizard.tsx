'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from '@/components/ui/disclosure';
import { Button } from '@/components/ui/button';
import { CheckCircle, Play } from 'lucide-react';
import Step from '../hooks/steps';
import MorphingCodeEditor from './code-editor';
import { toast } from 'sonner';
import { DBQuestionSet } from '@/lib/queries/getRandomIds';
import { useQuery } from '@tanstack/react-query';
import { useConstructAnswers } from '@/hooks/useConstructAnswers';
import { useCheckAnswer } from '@/hooks/useCheckAnswer';
import { useTypingAnimation } from '../hooks/use-type-animation';
import { useQuizStore } from '@/store/test-quiz-store';
import { TimerDisplay } from '../features/timer-hud';
import { calculateCoins } from '@/utils/coinCalculator';
import { summarizeFinalGame } from '@/utils/gameSummaryCalculator';
import { CoinHUD } from '../features/coin-hud';
import PointsPopup from '../features/point-popup';

interface Props {
  initialData: DBQuestionSet[];
}

export default function QuizWizard({ initialData }: Props) {
  // Get everything we need from Zustand using hooks
  const questions = useQuizStore((s) => s.questions);
  const answers = useQuizStore((s) => s.answers);
  const currentStep = useQuizStore((s) => s.currentStep);
  const isCompleted = useQuizStore((s) => s.isCompleted);
  const stepStatuses = useQuizStore((s) => s.stepStatuses);
  const ready = useQuizStore((s) => s.ready);
  const isStarted = useQuizStore((s) => s.isStarted);
  // Store actions & getters we need:
  const addPoints = useQuizStore((s) => s.addPoints);
  const addCoins = useQuizStore((s) => s.addCoins);
  const setExactStreak = useQuizStore((s) => s.setExactStreak);
  const addThresholdAwarded = useQuizStore((s) => s.addThresholdAwarded);
  const setGameSummary = useQuizStore((s) => s.setGameSummary);

  const getCurrentPoints = () => useQuizStore.getState().currentPoints;
  const getExactStreak = () => useQuizStore.getState().exactStreak;
  const getThresholds = () => useQuizStore.getState().thresholdsAwarded;
  const getTotalCoins = () => useQuizStore.getState().totalCoins;
  const summary = useQuizStore((s) => s.gameSummary);

  // Add a new state for tracking question timing
  const [startTime, setStartTime] = useState<number | null>(null);
  const [questionTimings, setQuestionTimings] = useState<
    Record<number, number>
  >({});

  const setQuestions = useQuizStore((s) => s.setQuestions);
  const setAnswers = useQuizStore((s) => s.setAnswers);
  const setCurrentStep = useQuizStore((s) => s.setCurrentStep);
  const setIsCompleted = useQuizStore((s) => s.setIsCompleted);
  const setStepStatuses = useQuizStore((s) => s.setStepStatuses);
  const resetQuiz = useQuizStore((s) => s.resetQuiz);
  const setReady = useQuizStore((s) => s.setReady);
  const setIsStarted = useQuizStore((s) => s.setIsStarted);
  const startGame = useQuizStore((s) => s.startGame);

  const construct = useConstructAnswers();
  const checkAnswer = useCheckAnswer();
  const [feedback, setFeedback] = useState<string | null>(null);
  const totalSteps = initialData.length;
  const lastIndex = totalSteps - 1;
  const isLastStep = currentStep === lastIndex;
  const [isAnimating, setIsAnimating] = useState(false);
  const [animatedCode, setAnimatedCode] = useState('');
  const typedCode = useTypingAnimation(animatedCode, 25);

  // 1. PRIMARY INITIALIZATION EFFECT - must run first to setup state
  useEffect(() => {
    if (initialData.length > 0) {
      console.log('Initializing with data of length:', initialData.length);

      // Initialize stepStatuses first
      const initialStatuses = initialData.map((q, idx) => ({
        step: idx + 1,
        label: `Question ${idx + 1}`,
        isError: true,
      }));

      // Set everything in the store
      setQuestions(initialData);
      setAnswers(initialData.map(() => ''));
      setStepStatuses(initialStatuses);

      console.log('Initial statuses set:', initialStatuses);
    }

    return () => {
      // Cleanup if component unmounts during initialization
      console.log('Initialization effect cleanup');
    };
  }, [initialData, setQuestions, setAnswers, setStepStatuses]);

  // 2. STEP CHANGE EFFECT - track question start time when step changes
  useEffect(() => {
    if (ready && !isCompleted && questionTimings[currentStep] === undefined) {
      setStartTime(Date.now());
      console.log(`Starting timer for question ${currentStep + 1}`);
      setStartTime(Date.now());
      setFeedback(null); // Reset feedback when step changes
    }
  }, [currentStep, ready, isCompleted, questionTimings]);

  // 3. QUIZ COMPLETION EFFECT - log timings when completed
  useEffect(() => {
    if (isCompleted) {
      console.log('📊 Question Timings:', questionTimings);
      // Could add analytics submission here
    }
  }, [isCompleted, questionTimings]);

  // 4. DEBUG EFFECT - monitor stepStatuses changes
  useEffect(() => {
    console.log('Step Statuses updated:', stepStatuses);
  }, [stepStatuses]);

  // Query setup
  const { refetch, isFetching } = useQuery<DBQuestionSet[]>({
    queryKey: ['randomIds'],
    queryFn: () => initialData,
    initialData,
    enabled: false,
  });

  // Animation completion handler
  useEffect(() => {
    if (isAnimating && typedCode === animatedCode) {
      // Record time spent on this question
      if (startTime !== null) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        setQuestionTimings((prev) => ({
          ...prev,
          [currentStep]: timeSpent,
        }));
        console.log(`⏱️ (Auto) Time on Q${currentStep + 1}: ${timeSpent}s`);
      }

      // Move to next question
      setIsAnimating(false);
      setCurrentStep(Math.min(totalSteps, currentStep + 1));
      setFeedback(null);
    }
  }, [
    typedCode,
    animatedCode,
    isAnimating,
    currentStep,
    startTime,
    setCurrentStep,
    totalSteps,
  ]);

  // Event handlers - using useCallback to memoize handlers
  const handleStart = useCallback(async () => {
    // First preserve any existing stepStatuses
    const existingStatuses = [...stepStatuses];

    // Then start the game
    startGame();

    // If we have existing statuses, restore them immediately
    if (existingStatuses.length > 0) {
      setStepStatuses(existingStatuses);
    }

    const result = await refetch();
    if (result.isError || !result.data) {
      console.error('Failed to load questions', result.error);
      toast.error('Failed to load questions');
      return;
    }

    const payload = result.data.map((q) => ({
      question_id: String(q.id),
      question: q.question,
      correct_code: q.answer,
    }));

    construct.mutate(payload, {
      onSuccess: () => {
        toast('Success', {
          description: 'Answers constructed and sent',
        });
        setReady(true);
        console.log('🏷️ questions:', questions);
      },
      onError: () => {
        toast('Error', {
          description: 'Construction failed. Please try again.',
        });
      },
    });
  }, [stepStatuses, startGame, setStepStatuses, refetch, construct, setReady]);

  const handleTimeUp = useCallback(() => {
    // Record that the user took the full time
    setQuestionTimings((prev) => ({
      ...prev,
      [currentStep]: 80, // Full time in seconds (1:20)
    }));

    // Optionally show a gentle reminder
    toast.info("Time's up! You can still continue working on this question.");
  }, [currentStep]);

  const handleNext = useCallback(() => {
    const userCode = answers[currentStep]?.trim() ?? '';
    const question = initialData[currentStep];

    if (!userCode) {
      toast.error('You must write code to get code evaluated');
      return;
    }

    // ✅ Capture actual time spent
    if (startTime !== null) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      setQuestionTimings((prev) => ({
        ...prev,
        [currentStep]: timeSpent,
      }));
      console.log(`⏱️ Time spent on Q${currentStep + 1}: ${timeSpent}s`);
    }

    checkAnswer.mutate(
      {
        question_id: String(question.id),
        user_code: userCode,
        correct_code: question.answer,
      },
      {
        onSuccess: ({ exact_match, score, feedback: fb }) => {
          console.log('Score:', score);
          console.log('Feedback:', fb);
          // Use existing stepStatuses without clearing them
          if (stepStatuses && stepStatuses.length > 0) {
            const updatedStatuses = stepStatuses.map((s) =>
              s.step === currentStep + 1 ? { ...s, isError: !exact_match } : s
            );
            setStepStatuses(updatedStatuses);
          }
          setFeedback(fb.message);

          // 2) Points: add to store
          const prevPoints = getCurrentPoints();
          addPoints(score); // also sets lastPointsDelta
          const newPoints = prevPoints + score;

          // 3) Compute coin rewards
          const {
            baseCoins,
            bonusCoins,
            newExactStreak,
            newThresholdsAwarded,
          } = calculateCoins({
            score,
            currentPoints: newPoints,
            exactStreak: getExactStreak(),
            thresholdsAwarded: getThresholds(),
            answerTime: questionTimings[currentStep],
          });

          // 4) Push coins & streak updates
          addCoins(baseCoins + bonusCoins);
          setExactStreak(newExactStreak);
          newThresholdsAwarded.forEach((t) => addThresholdAwarded(t));

          if (exact_match) {
            toast.success('Correct! Moving to next question');
            if (isLastStep) {
              // 🚀 Personal Best logic
              const BEST_KEY = 'quiz-personalBest';
              const prevBest = parseInt(
                localStorage.getItem(BEST_KEY) ?? '0',
                10
              );
              const didBeat = newPoints > prevBest;
              if (didBeat) {
                localStorage.setItem(BEST_KEY, String(newPoints));
              }

              // Summarize final game
              const summary = summarizeFinalGame({
                totalPoints: newPoints,
                totalCoins: getTotalCoins(),
                maxPoints: questions.length * 27,
                maxCoinsPossible: questions.length * (5 + 3 + 1),
                exactMatches: stepStatuses.filter((s) => !s.isError).length,
                totalQuestions: questions.length,
                optimalTotalTime: questions.length * 80,
                actualTotalTime: Object.values(questionTimings).reduce(
                  (a, b) => a + b,
                  0
                ),
                didBeatPersonalBest: didBeat,
                exactMatchStreaks: getExactStreak(),
              });
              setGameSummary(summary);
              setIsCompleted(true);
              alert('Form submitted successfully!');
            } else {
              setTimeout(() => {
                setFeedback(null);
                setCurrentStep(Math.min(totalSteps, currentStep + 1));
              }, 800);
            }
          } else {
            setAnimatedCode(question.answer);
            setIsAnimating(true);
            toast.error('Incorrect — watch the correction');
          }
        },
        onError: (err) => {
          console.error('Check answer failed', err);
          toast.error('Error checking answer');
        },
      }
    );
  }, [
    answers,
    currentStep,
    initialData,
    startTime,
    checkAnswer,
    stepStatuses,
    setStepStatuses,
    setFeedback,
    isLastStep,
    setIsCompleted,
    totalSteps,
    setCurrentStep,
    setQuestionTimings,
  ]);

  const handleReset = useCallback(() => {
    setIsStarted(false);
    setCurrentStep(0);
    setAnswers([]);
    setIsCompleted(false);
    setQuestionTimings({});
    // Don't reset stepStatuses here - we need it to persist
  }, [setIsStarted, setCurrentStep, setAnswers, setIsCompleted]);

  const handleCodeChange = useCallback(
    (value: string | undefined): void => {
      const newCode = value ?? '';
      const currentAnswers = [...answers];
      currentAnswers[currentStep] = newCode;
      setAnswers(currentAnswers);
    },
    [answers, currentStep, setAnswers]
  );

  const getCurrentTask = useCallback(() => {
    switch (currentStep) {
      case 1:
        return 'Create a function that adds two numbers';
      case 2:
        return 'Write a function that sorts an array';
      case 3:
        return 'Create a simple calculator function';
      case 4:
        return 'Write a recursive Fibonacci function';
      default:
        return 'Complete the coding task';
    }
  }, [currentStep]);

  return (
    <div className='mx-auto w-full max-w-md'>
      <AnimatePresence mode='wait'>
        {!ready ? (
          <motion.div
            key='start-button'
            initial={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='relative flex flex-col items-center gap-8'
          >
            <Button
              onClick={handleStart}
              size='lg'
              className='group relative h-12 cursor-pointer overflow-hidden overflow-x-hidden rounded-md bg-[#f5f5f5] px-8 py-6 text-lg font-semibold text-[#171717] shadow-lg'
            >
              <Play className='mr-2 h-5 w-5' />
              <span className='relative z-10'>
                {' '}
                {isFetching ? 'Loading…' : 'Start Quiz'}
              </span>
              <span className='absolute inset-0 overflow-hidden rounded-md'>
                <span className='absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-[#52A9FF] transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150'></span>
              </span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key='quiz-container'
            initial={{ scale: 0, opacity: 0, height: 0 }}
            animate={{ scale: 1, opacity: 1, height: 'auto' }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.4,
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className='overflow-hidden rounded-xl border border-white/5 bg-[#0D0D0D] text-sm opacity-5 shadow-sm dark:bg-slate-800'
          >
            <div className='p-5'>
              {/* GameDashboard */}
              <div className='mb-8 flex flex-wrap items-center justify-end gap-[6px] text-white/50'>
                {/* import CoinHUD here */}
                <dt className='truncate text-sm font-medium text-white/50'>
                  Total Coins
                </dt>
                <CoinHUD />
              </div>
              {!isCompleted ? (
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={`question-${currentStep}`}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Check questions exists before accessing index */}
                    <h2 className='mb-4 text-2xl font-semibold text-white'>
                      {questions[currentStep]?.question ?? 'Loading question…'}
                    </h2>

                    <div className='mb-6 space-y-3'>
                      {/* Dynamic content based on `step` */}
                      <PointsPopup />
                      <Disclosure className='w-[330px] rounded-md border border-zinc-200 px-3 text-white/50 dark:border-zinc-700'>
                        <DisclosureTrigger>
                          <button
                            className='w-full cursor-pointer py-2 text-left text-sm'
                            type='button'
                          >
                            Show editor
                          </button>
                        </DisclosureTrigger>
                        <DisclosureContent>
                          <div className='overflow-hidden pb-3'>
                            <div className='pt-1 font-mono text-sm'>
                              <p>
                                This example demonstrates how you can use{' '}
                                <strong className='font-bold'>
                                  Disclosure
                                </strong>{' '}
                                component.
                              </p>
                              {/* Code Editor - Now using the morphing code editor */}
                              <div className='w-full'>
                                <MorphingCodeEditor
                                  defaultValue={answers[currentStep]}
                                  value={
                                    isAnimating
                                      ? typedCode
                                      : answers[currentStep]
                                  }
                                  readOnlyDuringAnimation={isAnimating}
                                  onChange={handleCodeChange}
                                  theme='vs-dark'
                                  title={`Task ${currentStep}: ${getCurrentTask()}`}
                                />
                                {/* Points animation */}
                                <motion.div></motion.div>
                              </div>
                            </div>
                          </div>
                        </DisclosureContent>
                      </Disclosure>
                    </div>
                  </motion.div>
                </AnimatePresence>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className='py-8 text-center'
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.2,
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                    }}
                    className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900/30'
                  >
                    <CheckCircle className='h-10 w-10 text-rose-500' />
                  </motion.div>

                  <h2 className='mb-4 text-2xl font-bold dark:text-white'>
                    Quiz Completed!
                  </h2>
                  <div className='mb-6 inline-block space-y-2 text-left text-gray-700 dark:text-gray-300'>
                    <p>
                      <strong>Total Points:</strong> {summary?.totalPoints}
                    </p>
                    <p>
                      <strong>Total Coins:</strong> {summary?.totalCoins}
                    </p>
                    <p>
                      <strong>Rank:</strong> {summary?.rank}
                    </p>
                    <p>
                      <strong>Performance Bonus:</strong> +
                      {summary?.performanceBonus} coins
                    </p>
                    <p>
                      <strong>Streak Bonus:</strong> +{summary?.streakBonus}{' '}
                      coins
                    </p>
                    <p>
                      <strong>Personal Best Bonus:</strong> +
                      {summary?.personalBestBonus} coins
                    </p>
                    <p>
                      <strong>Final Grade:</strong>{' '}
                      {(summary!.finalGrade * 100).toFixed(1)}%
                    </p>
                  </div>

                  <Button
                    onClick={handleReset}
                    className='bg-rose-500 text-white hover:bg-rose-600'
                  >
                    Take Quiz Again
                  </Button>
                </motion.div>
              )}
              {/* button */}
              <div className='mb-2 flex w-full items-center justify-between gap-2'>
                {/* Previous button */}
                <div className='flex-shrink-0'>
                  <button
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    className='rounded bg-blue-500 px-2 py-2 text-white hover:bg-blue-600'
                    disabled={
                      currentStep === 0 ||
                      questionTimings[currentStep - 1] !== undefined
                    }
                  >
                    Back
                  </button>
                </div>

                {/* Step indicators with null check */}
                <div className='flex flex-grow flex-wrap justify-center gap-2'>
                  {stepStatuses && stepStatuses.length > 0 ? (
                    stepStatuses.map((status) => {
                      const isCurrent = status.step === currentStep + 1;

                      return (
                        <Step
                          key={status.step}
                          step={status.step}
                          currentStep={currentStep + 1}
                          isError={status.isError}
                          label={
                            isCurrent ? (
                              <div>
                                <TimerDisplay
                                  key={currentStep} // ensure it resets on step change
                                  questionIndex={currentStep}
                                  isActive={true}
                                  duration={80}
                                  onTimeUp={handleTimeUp}
                                />
                              </div>
                            ) : (
                              status.label
                            )
                          }
                        />
                      );
                    })
                  ) : (
                    <div className='text-white/50'>Loading steps...</div>
                  )}
                </div>

                {/* Next/Submit button */}
                <div className='flex-shrink-0'>
                  <button
                    onClick={handleNext}
                    className={`rounded px-2 py-2 text-white ${
                      isLastStep
                        ? 'bg-emerald-400 hover:bg-emerald-500'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {isLastStep ? 'Submit' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
