'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LinkedText } from '@/components/ui/LinkedText';

const TITLES = ['PRODUCT DESIGNER', 'DESIGN ENGINEER'] as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export function ProfileHeader(): React.ReactElement {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % TITLES.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="flex flex-col gap-[4px] items-start">
      <h1 className="font-figtree font-semibold text-[16px] leading-[24px] uppercase text-text-primary">
        Oluwatosin Kazeem
      </h1>
      <div className="overflow-hidden h-[18px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={TITLES[index]}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="font-figtree font-normal text-[12px] leading-[18px] uppercase text-text-secondary"
          >
            {TITLES[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      <p className="font-figtree font-normal text-[12px] leading-[18px] uppercase text-text-secondary">
        PORTFOLIO &apos;26
      </p>
      <LinkedText as="button" className="font-sora font-normal text-[12px] leading-normal uppercase text-text-primary">
        portfolio history
      </LinkedText>
    </header>
  );
}
