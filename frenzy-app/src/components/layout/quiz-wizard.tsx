'use client';

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Disclosure,
  DisclosureContent,
  DisclosureTrigger,
} from '@/components/ui/disclosure';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Zap } from 'lucide-react';
import { Play, ChevronRight, Settings } from 'lucide-react';
import { useMobile } from '../hooks/use-mobile';
import Step from '../hooks/steps';
import CodeEditor from './code-editor';
import { Editor } from '@monaco-editor/react';
import MorphingCodeEditor from './code-editor';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';

// Quiz data
const fakeQuizQuestionData = [
  {
    id: 1,
    question: "What's your favorite season?",
    options: ['Spring', 'Summer', 'Fall', 'Winter'],
  },
  {
    id: 2,
    question: 'How do you prefer to spend your free time?',
    options: ['Reading', 'Exercising', 'Watching movies', 'Socializing'],
  },
  {
    id: 3,
    question: "What's your preferred work environment?",
    options: ['Home office', 'Coffee shop', 'Corporate office', 'Outdoors'],
  },
  {
    id: 4,
    question: "What's your favorite type of cuisine?",
    options: ['Italian', 'Asian', 'Mexican', 'Mediterranean'],
  },
];

// Spring transition for smoother, more natural animations
const transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
};

export default function QuizWizard() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(3);
  const totalSteps = 10;
  const isLastStep = currentStep === totalSteps;
  const [answers, setAnswers] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState<string>('// add content here');
  const [gameMode, setGameMode] = useState<string>('');
  const [showModeButton, setShowModeButton] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleClick = () => {
    if (!gameMode) {
      // Alert the user to select a game mode
      window.alert('Select game mode before beginning');

      // Show toast notification
      toast.error('Please select a game mode', {
        description: 'Choose a difficulty level to continue',
        position: 'top-center',
      });

      // Show the floating select mode button
      setShowModeButton(true);
      return;
    }
  };

  const handleSelectOption = (option: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = option;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (isLastStep) {
      alert('Form submitted successfully!');
    } else {
      setCurrentStep(Math.min(totalSteps, currentStep + 1));
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setCurrentStep(0);
    setAnswers([]);
    setIsCompleted(false);
  };

  const progress = isCompleted
    ? 100
    : isStarted
      ? ((currentStep + 1) / fakeQuizQuestionData.length) * 100
      : 0;
  isError: false;

  // Step statuses: some complete, some with errors, some inactive
  // Step data with labels
  const stepStatuses = [
    { step: 1, label: 'Display Timer', isError: false },
    { step: 2, label: 'Display Timer', isError: false },
    { step: 3, label: 'Display Timer', isError: true },
    { step: 4, label: 'Display Timer', isError: false },
    { step: 5, label: 'Display Timer', isError: true },
    { step: 6, label: 'Display Timer', isError: false },
    { step: 7, label: 'Display Timer', isError: false },
    { step: 8, label: 'Display Timer', isError: true },
    { step: 9, label: 'Display Timer', isError: false },
    { step: 10, label: 'Submit', isError: false },
  ];

  const handleCodeChange = (value: string | undefined): void => {
    if (value !== undefined) {
      setCode(value);
      // You can add additional logic here, like validation
    }
  };

  // Get current task based on step
  const getCurrentTask = () => {
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
  };

  return (
    <div className='mx-auto w-full max-w-md'>
      <AnimatePresence mode='wait'>
        {!isStarted ? (
          <motion.div
            key='start-button'
            initial={{ scale: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className='relative flex flex-col items-center gap-8'
          >
            {/* Game Mode Selection */}
            <div ref={selectRef} className='mb-4 w-full max-w-xs'>
              <label className='mb-2 block text-sm font-medium text-gray-700'>
                Select Game Mode
              </label>
              <Select
                value={gameMode}
                onValueChange={(value) => {
                  setGameMode(value);
                  setShowModeButton(false);
                }}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Choose difficulty' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='easy'>Easy</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='hard'>Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleStart}
              size='lg'
              className='group relative h-12 cursor-pointer overflow-hidden overflow-x-hidden rounded-md bg-[#f5f5f5] px-8 py-6 text-lg font-semibold text-[#171717] shadow-lg'
            >
              <Play className='mr-2 h-5 w-5' />
              <span className='relative z-10'>Start Quiz</span>
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
              {/*top banner */}
              <div className='mb-8 flex flex-wrap items-center justify-end gap-[6px] text-white/50'>
                points
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
                    {/*Question */}
                    <h2 className='mb-6 font-medium text-white'>
                      hello world{' '}
                      {/*{fakeQuizQuestionData[currentStep].question} */}
                    </h2>

                    <div className='mb-6 space-y-3'>
                      {/* Dynamic content based on `step` */}
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
                                  defaultLanguage='python'
                                  defaultValue={code}
                                  onChange={handleCodeChange}
                                  theme='vs-dark'
                                  title={`Task ${currentStep}: ${getCurrentTask()}`}
                                />
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
                  <p className='mb-8 text-gray-600 dark:text-gray-300'>
                    Thank you for completing our quiz. Here are your answers:
                  </p>

                  <div className='mb-6 rounded-lg bg-gray-50 p-4 text-left dark:bg-gray-800/50'>
                    {fakeQuizQuestionData.map((q, index) => (
                      <div key={q.id} className='mb-3 last:mb-0'>
                        <p className='font-medium dark:text-white'>
                          {q.question}
                        </p>
                        <p className='font-semibold text-rose-500'>
                          {answers[index]}
                        </p>
                      </div>
                    ))}
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
                    disabled={currentStep === 1}
                  >
                    Back
                  </button>
                </div>

                {/* Step indicators in the middle */}
                <div className='flex flex-grow flex-wrap justify-center gap-[6px]'>
                  {stepStatuses.map((status) => (
                    <Step
                      label={status.label}
                      key={status.step}
                      step={status.step}
                      currentStep={currentStep}
                      isError={status.step < currentStep && status.isError}
                    />
                  ))}
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
