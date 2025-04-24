import { useState, useEffect } from 'react';

/**
 * Custom hook that returns whether a given media query matches
 *
 * @param query - The media query to check
 * @returns boolean indicating if the media query matches
 *
 * @example
 * // Check if viewport is at least medium size
 * const isMediumScreen = useMediaQuery('(min-width: 768px)');
 *
 * // Check if user prefers dark mode
 * const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
  // Initialize with null and update after mount to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    // Create media query list
    const mediaQueryList = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Define event listener
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the listener
    mediaQueryList.addEventListener('change', listener);

    // Clean up
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  // Return false during SSR to avoid hydration mismatch
  return mounted ? matches : false;
}

// Predefined breakpoints for convenience
export const Breakpoints = {
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
  dark: '(prefers-color-scheme: dark)',
  light: '(prefers-color-scheme: light)',
  motion: '(prefers-reduced-motion: no-preference)',
};

/**
 * Example usage in a component:
 *
 * import { useMediaQuery, Breakpoints } from '@/hooks/useMediaQuery';
 *
 * function MyComponent() {
 *   const isMobile = !useMediaQuery(Breakpoints.md);
 *   const isDarkMode = useMediaQuery(Breakpoints.dark);
 *
 *   return (
 *     <div>
 *       <p>Current mode: {isMobile ? 'Mobile' : 'Desktop'}</p>
 *       <p>Theme: {isDarkMode ? 'Dark' : 'Light'}</p>
 *     </div>
 *   );
 * }
 */
