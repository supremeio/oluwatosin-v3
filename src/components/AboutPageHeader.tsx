'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const WORDS = ['Design.', 'Develop.', 'Gym.', 'Sleep.', 'Repeat.'];
const STAGGER_MS = 500;
const REPEAT_MS = 60000;

export function AboutPageHeader(): React.ReactElement {
  const [activeCount, setActiveCount] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const runSequence = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setActiveCount(0);

    WORDS.forEach((_, i) => {
      const id = setTimeout(() => setActiveCount(i + 1), (i + 1) * STAGGER_MS);
      timeoutsRef.current.push(id);
    });
  }, []);

  useEffect(() => {
    runSequence();
    const intervalId = setInterval(runSequence, REPEAT_MS);
    return () => {
      clearInterval(intervalId);
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [runSequence]);

  return (
    <header className="flex gap-[40px] items-start w-full">
      <div className="flex flex-col gap-[4px] items-start w-[261px]">
        <h1 className="font-figtree font-semibold text-[20px] leading-[normal] text-text-primary">
          {WORDS.map((word, i) => (
            <span
              key={word}
              style={{
                opacity: i < activeCount ? 1 : 0.2,
                transition: 'opacity 0.35s ease',
              }}
            >
              {word}
              {i < WORDS.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>
        <p className="font-figtree font-medium text-[16px] leading-[normal] text-text-secondary">
          That&apos;s all I do.
        </p>
      </div>
    </header>
  );
}
