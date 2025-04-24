import { motion } from 'framer-motion';
import { ComponentProps } from 'react';

// Spring transition for smoother, more natural animations
const transition = {
  type: 'spring',
  stiffness: 260,
  damping: 28,
};

function Step({
  step,
  label,
  currentStep,
  isError = false,
}: {
  step: number;
  label: string;
  currentStep: number;
  isError?: boolean;
}) {
  let status =
    currentStep === step
      ? 'active'
      : currentStep < step
        ? 'inactive'
        : isError
          ? 'error'
          : 'complete';

  // Custom colors
  const completeColor = '#00DDA6'; // Custom green for completed steps
  const errorColor = '#E90811';
  return (
    <motion.div animate={status} className='relative'>
      <motion.div
        variants={{
          active: {
            scale: 1,
            transition: {
              delay: 0,
              duration: 0.2,
            },
          },
          complete: {
            scale: 1.25,
          },
          error: {
            scale: 1.25,
          },
        }}
        transition={{
          duration: 0.6,
          delay: 0.2,
          type: 'tween',
          ease: 'circOut',
        }}
        className={`absolute inset-0 rounded-full ${
          status === 'error'
            ? 'bg-[#FF2930]/10'
            : status === 'complete'
              ? 'bg-[#0DFFC5]/19'
              : 'bg-[#00DDA6]/5'
        }`}
      />
      <motion.button
        initial={false}
        variants={{
          inactive: {
            backgroundColor: 'var(--tw-bg-white)',
            borderColor: 'var(--tw-border-neutral-200)',
            color: 'var(--tw-text-neutral-400)',
          },
          active: {
            backgroundColor: 'var(--tw-bg-white)',
            borderColor: 'var(--tw-border-blue-500)',
            color: 'var(--tw-text-blue-500)',
          },
          complete: {
            backgroundColor: completeColor,
            borderColor: completeColor,
            color: 'var(--tw-text-white)',
          },
          error: {
            backgroundColor: errorColor,
            borderColor: errorColor,
            color: 'var(--tw-text-white)',
          },
        }}
        animate={{
          width: currentStep === step ? 100 : 10,
          height: 26,
        }}
        transition={{ duration: 0.2 }}
        className={`relative flex h-[26px] w-[8px] items-center justify-center rounded-full border-2 bg-white/15 text-sm font-semibold ${status === 'inactive' ? 'border-neutral-200 bg-white text-neutral-400' : ' '} ${status === 'active' ? 'border-blue-500 bg-white text-blue-500' : ''} ${status === 'complete' ? 'text-white' : ''} ${status === 'error' ? 'text-white' : ''} `}
      >
        <div className='flex items-center justify-center'>
          {status === 'complete' ? (
            <span> </span>
          ) : status === 'error' ? (
            <span> </span>
          ) : status === 'active' ? (
            <motion.span
              initial={false}
              animate={{
                opacity: currentStep === step ? 1 : 0,
                scale: currentStep === step ? 1 : 0,
                filter: currentStep === step ? 'blur(0)' : 'blur(4px)',
              }}
              transition={transition}
              className='block px-3 py-1 whitespace-nowrap text-white/50'
            >
              {label}
            </motion.span>
          ) : (
            <span> </span>
          )}
        </div>
      </motion.button>
    </motion.div>
  );
}

function CheckIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={3}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M5 13l4 4L19 7'
      />
    </svg>
  );
}

function XIcon(props: ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      fill='none'
      viewBox='0 0 24 24'
      stroke='currentColor'
      strokeWidth={3}
    >
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{
          delay: 0.2,
          type: 'tween',
          ease: 'easeOut',
          duration: 0.3,
        }}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M6 18L18 6M6 6l12 12'
      />
    </svg>
  );
}

export default Step;
