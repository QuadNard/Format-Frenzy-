import { useEffect, useState } from 'react';

/**
 * Gradually “types” out `target` over `speed` ms per character.
 * Returns the current substring.
 */
export function useTypingAnimation(target: string, speed = 30) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    setIndex(0);
    if (!target) return;
    const id = window.setInterval(() => {
      setIndex((i) => {
        if (i + 1 >= target.length) {
          clearInterval(id);
          return target.length;
        }
        return i + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [target, speed]);
  return target.slice(0, index);
}
