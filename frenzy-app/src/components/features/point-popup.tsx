'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/test-quiz-store';

interface Popup {
  id: number;
  value: number;
}

export default function PointsPopup() {
  // Subscribe to the last delta from the store
  const lastPointsDelta = useQuizStore((state) => state.lastPointsDelta);
  const [popups, setPopups] = useState<Popup[]>([]);
  const idCounter = useRef(0);

  useEffect(() => {
    if (lastPointsDelta === 0) return;
    // Generate a unique id by combining timestamp with a counter
    idCounter.current += 1;
    const id = Date.now() + idCounter.current;

    setPopups((prev) => [...prev, { id, value: lastPointsDelta }]);

    // Remove after animation
    const timer = setTimeout(() => {
      setPopups((prev) => prev.filter((p) => p.id !== id));
    }, 1000);

    return () => clearTimeout(timer);
  }, [lastPointsDelta]);

  return (
    <div className='pointer-events-none absolute top-4 left-1/2 -translate-x-1/2 transform'>
      <AnimatePresence>
        {popups.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className='text-2xl font-bold text-green-400'
          >
            {p.value > 0 ? `+${p.value}` : p.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
