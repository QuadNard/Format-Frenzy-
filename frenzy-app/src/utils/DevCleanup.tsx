'use client';

import { useEffect } from 'react';

export default function DevCleanup() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.removeItem('quiz-storage');
      console.log('🧹 Zustand persist state cleared: quiz-storage (dev only)');
    }
  }, []);

  return null;
}
