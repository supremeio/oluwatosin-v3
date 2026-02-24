'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&';

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)];
}

interface ScrambleTextProps {
  text: string;
  className?: string;
  /** How long between auto-scrambles in ms. Default: 60000 */
  interval?: number;
}

export function ScrambleText({
  text,
  className,
  interval = 60000,
}: ScrambleTextProps): React.ReactElement {
  const [displayed, setDisplayed] = useState(text);
  const rafRef = useRef<number | null>(null);
  const progressRef = useRef(0);

  const runScramble = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    progressRef.current = 0;

    const step = () => {
      progressRef.current += 0.55;
      const resolved = Math.floor(progressRef.current);

      setDisplayed(
        text
          .split('')
          .map((char, i) => (char === ' ' || i < resolved ? char : randomChar()))
          .join('')
      );

      if (resolved < text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayed(text);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [text]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') runScramble();
    };

    document.addEventListener('visibilitychange', onVisible);
    runScramble();
    const id = setInterval(runScramble, interval);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      clearInterval(id);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [runScramble, interval]);

  return <span className={className}>{displayed}</span>;
}
