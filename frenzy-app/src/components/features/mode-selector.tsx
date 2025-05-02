'use client';

import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { GameMode, useQuizStore } from '@/store/test-quiz-store';

interface Props {
  onSelect: (mode: GameMode) => void;
}

export default function ModeSelector({ onSelect }: Props) {
  const [localMode, setLocalMode] = useState<GameMode | ''>('');

  const handleBegin = () => {
    if (!localMode) {
      toast.error('Please select a game mode first!', {
        description: 'You need to pick a mode to continue.',
        position: 'top-center',
      });
      return;
    }

    if (localMode !== 'classic') {
      toast.error(
        'Other game modes are unavailable yet. Stay tuned for updates!',
        {
          description: 'Classic mode is the only one you can pick right now.',
          position: 'top-center',
        }
      );
      return;
    }
    console.log('Sending localMode to setGameMode:', localMode);
    onSelect(localMode);
  };

  return (
    <div className='mx-auto w-full max-w-xs space-y-4 text-white'>
      <label className='mb-2 block text-sm font-medium text-gray-700'>
        Select Game Mode
      </label>
      <Select
        value={localMode}
        onValueChange={(value) => setLocalMode(value as GameMode)}
      >
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Choose mode' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='classic'>Classic</SelectItem>
          <SelectItem value='classic-cranked'>Classic Cranked</SelectItem>
          <SelectItem value='open-ended'>Open-Ended</SelectItem>
          <SelectItem value='multi-choice'>Multi-Choice</SelectItem>
          <SelectItem value='cranked-choice'>Cranked-Choice</SelectItem>
        </SelectContent>
      </Select>

      <Button onClick={handleBegin} disabled={false} className='w-full'>
        Load in {localMode || '…'} Mode
      </Button>
    </div>
  );
}
