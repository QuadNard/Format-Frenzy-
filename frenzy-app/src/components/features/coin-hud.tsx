'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/test-quiz-store';
import { AnimatedNumber } from '@/components/ui/animated-number';

interface CoinAnim {
  id: number;
  x: number;
  value?: string;
}

export function CoinHUD() {
  const totalCoins = useQuizStore((s) => s.totalCoins);

  // Audio refs for DOM API playback
  const addPointAudio = useRef<HTMLAudioElement | null>(null);
  const coinCollectAudio = useRef<HTMLAudioElement | null>(null);
  const losePointAudio = useRef<HTMLAudioElement | null>(null);
  const coinLoseAudio = useRef<HTMLAudioElement | null>(null);

  const prevRef = useRef<number>(totalCoins);
  const [coinPositions, setCoinPositions] = useState<CoinAnim[]>([]);
  const [lostCoinPositions, setLostCoinPositions] = useState<CoinAnim[]>([]);

  // Initialize audio elements once
  useEffect(() => {
    addPointAudio.current = new Audio('/assets/sfx/add-point.mp3');
    coinCollectAudio.current = new Audio('/assets/sfx/gain-multiple-coins.mp3');
    losePointAudio.current = new Audio('/assets/sfx/minus-point.mp3');
    coinLoseAudio.current = new Audio('/assets/sfx/lose-multiple-coins.mp3');
  }, []);

  // Detect coin total changes
  useEffect(() => {
    const prev = prevRef.current;
    if (prev === totalCoins) return;
    const diff = totalCoins - prev;
    if (diff > 0) animateGain(diff);
    else animateLoss(Math.abs(diff));
    prevRef.current = totalCoins;
  }, [totalCoins]);

  function animateGain(count: number) {
    // Play sound
    if (count === 1) addPointAudio.current?.play();
    else coinCollectAudio.current?.play();

    const max = Math.min(count, 5);
    for (let i = 0; i < max; i++) {
      setTimeout(() => {
        const x = Math.random() * 40 - 20;
        const id = Date.now() + i;
        setCoinPositions((p) => [...p, { id, x }]);
        setTimeout(
          () => setCoinPositions((p) => p.filter((c) => c.id !== id)),
          1000
        );
      }, i * 100);
    }
  }

  function animateLoss(count: number) {
    // Play sound
    if (count === 1) losePointAudio.current?.play();
    else coinLoseAudio.current?.play();

    const max = Math.min(count, 5);
    for (let i = 0; i < max; i++) {
      setTimeout(() => {
        const x = Math.random() * 40 - 20;
        const id = Date.now() + i;
        const label = i === 0 && count > 1 ? `-${count}` : '-1';
        setLostCoinPositions((p) => [...p, { id, x, value: label }]);
        setTimeout(
          () => setLostCoinPositions((p) => p.filter((c) => c.id !== id)),
          1000
        );
      }, i * 100);
    }
  }

  return (
    <div>
      {/* Display total coins with animation */}
      <div className='flex text-yellow-400 shadow'>
        <dd className='text-2xl font-semibold tabular-nums'>
          <AnimatedNumber
            value={totalCoins}
            springOptions={{ bounce: 0, duration: 500 }}
          />
        </dd>
      </div>

      {/* Gain coin animations */}
      <AnimatePresence>
        {coinPositions.map(({ id, x }) => (
          <motion.div
            key={id}
            initial={{ y: 0, x, opacity: 0, scale: 0.5 }}
            animate={{ y: -60, opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className='absolute z-10 flex items-center'
          >
            <div className='flex h-6 w-6 items-center justify-center rounded-full border-2 border-yellow-600 bg-yellow-400 text-xs font-bold text-yellow-800'>
              <div className='-rotate-12 transform'>₵</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Loss coin animations */}
      <AnimatePresence>
        {lostCoinPositions.map(({ id, x, value }) => (
          <motion.div
            key={id}
            initial={{ y: 0, x, opacity: 1, scale: 1 }}
            animate={{ y: 80, opacity: 0, scale: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeIn' }}
            className='absolute z-10 flex flex-col items-center'
          >
            {value && (
              <div className='mb-1'>
                <AnimatedNumber
                  value={Number(value)}
                  springOptions={{ bounce: 0, duration: 500 }}
                />
              </div>
            )}
            <div className='flex h-6 w-6 animate-spin items-center justify-center rounded-full border-2 border-yellow-600 bg-yellow-400 text-xs font-bold text-yellow-800'>
              <div className='-rotate-12 transform'>₵</div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
