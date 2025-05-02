import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizStore } from '@/store/test-quiz-store';

export default function QuizSummary({ onReset }: { onReset: () => void }) {
  const summary = useQuizStore((s) => s.gameSummary);

  if (!summary) return null; // nothing to show if summary not set

  const {
    totalPoints,
    totalCoins,
    rank,
    performanceBonus,
    streakBonus,
    personalBestBonus,
    finalGrade,
  } = summary;

  return (
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
        className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30'
      >
        <CheckCircle className='h-10 w-10 text-emerald-500' />
      </motion.div>

      <h2 className='mb-4 text-2xl font-bold dark:text-white'>
        Quiz Completed!
      </h2>

      <div className='mb-6 inline-block space-y-2 text-left text-gray-700 dark:text-gray-300'>
        <p>
          <strong>Total Points:</strong> {totalPoints}
        </p>
        <p>
          <strong>Total Coins:</strong> {totalCoins}
        </p>
        <p>
          <strong>Rank:</strong> {rank}
        </p>
        <p>
          <strong>Performance Bonus:</strong> +{performanceBonus} coins
        </p>
        <p>
          <strong>Streak Bonus:</strong> +{streakBonus} coins
        </p>
        <p>
          <strong>Personal Best Bonus:</strong> +{personalBestBonus} coins
        </p>
        <p>
          <strong>Final Grade:</strong> {(finalGrade * 100).toFixed(1)}%
        </p>
      </div>

      <Button
        onClick={onReset}
        className='bg-rose-500 text-white hover:bg-rose-600'
      >
        Take Quiz Again
      </Button>
    </motion.div>
  );
}
