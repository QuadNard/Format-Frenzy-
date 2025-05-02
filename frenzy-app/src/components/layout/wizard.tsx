'use client';

import ModeSelector from '../features/mode-selector';
import QuizWizard from './quiz-wizard';
import { ChoiceCrankedWizard, CrankedWizard } from './cranked-wizard';
import OpenEndedWizard from './open-ended-wizard';
import MultiChoiceWizard from './choice-wizard';
import { DBQuestionSet } from '@/lib/queries/getRandomIds';
import { GameMode, useQuizStore } from '@/store/test-quiz-store';
import { useState } from 'react';

interface Props {
  initialData: DBQuestionSet[];
}

export default function GameWizard({ initialData }: Props) {
  const [gameMode, setGameMode] = useState<GameMode | ''>('');
  const setSelectedMode = useQuizStore((s) => s.setSelectedMode);

  const handleSelect = (mode: GameMode) => {
    setGameMode(mode); // Local control for rendering
    setSelectedMode(mode); // Push into Zustand for quiz prep
  };

  if (!gameMode) {
    return <ModeSelector onSelect={handleSelect} />;
  }
  // Mode is set → dispatch to the correct wizard
  switch (gameMode) {
    case 'classic':
      console.log('initialData:', initialData);
      return <QuizWizard initialData={initialData} />;
    case 'classic-cranked':
      return <CrankedWizard />;
    case 'cranked-choice':
      return <ChoiceCrankedWizard />;
    case 'multi-choice':
      return <MultiChoiceWizard />;
    case 'open-ended':
      return <OpenEndedWizard />;
    default:
      return null;
  }
}
