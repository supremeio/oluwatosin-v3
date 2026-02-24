'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DottedSeparator } from '@/components/ui/DottedSeparator';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LinkedText } from '@/components/ui/LinkedText';

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

interface WorkItem {
  name: string;
  years: string;
  slug?: string;
}

const WORK_ITEMS: WorkItem[] = [
  { name: 'Autospend', years: '2024-2025', slug: 'autospend' },
  { name: 'CollectAfrica', years: '2023-2024', slug: 'collectafrica' },
  { name: 'ClaraWave', years: '2025', slug: 'clarawave' },
  { name: 'Bonadocs', years: '2023-2024' },
  { name: 'PHPSandbox', years: '2021-2023', slug: 'phpsandbox' },
  { name: 'Sandbox', years: '2021-2023' },
  { name: 'SendpackAfrica', years: '2021-2023', slug: 'sendpackafrica' },
];

function BentoCard({ className }: { className?: string }): React.ReactElement {
  return (
    <div className={`rounded-[20px] border border-border-primary bg-bg-main ${className ?? ''}`} />
  );
}

function BentoGrid(): React.ReactElement {
  return (
    <div className="w-[378px] flex flex-col gap-[4px] items-start">
      <div className="flex gap-[4px] w-full h-[183px]">
        <BentoCard className="flex-[1_0_0] h-full" />
        <BentoCard className="flex-[1_0_0] h-full" />
      </div>
      <div className="flex gap-[4px] w-full">
        <BentoCard className="w-[252px] h-[256px] shrink-0" />
        <BentoCard className="flex-[1_0_0] h-[256px]" />
      </div>
      <div className="flex gap-[4px] w-full">
        <BentoCard className="flex-[1_0_0] h-[256px]" />
        <BentoCard className="w-[252px] h-[256px] shrink-0" />
      </div>
    </div>
  );
}

export function WorkSection(): React.ReactElement {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleMouseEnter = useCallback((name: string) => {
    setHoveredItem(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <section className="flex flex-col gap-[16px] items-start relative">
      <SectionLabel>Work</SectionLabel>
      <div className="flex flex-col gap-[16px] items-start w-full">
        {WORK_ITEMS.map((item) => {
          const rowContent = (
            <>
              <LinkedText className="font-figtree font-semibold text-[15px] leading-[24px] text-text-primary shrink-0">
                {item.name}
              </LinkedText>
              <DottedSeparator />
              <span className="font-figtree font-normal text-[15px] leading-[25.6px] text-text-primary text-right whitespace-nowrap shrink-0">
                {item.years}
              </span>
            </>
          );

          if (item.slug) {
            return (
              <Link
                key={item.name}
                href={`/case-study/${item.slug}`}
                className="flex gap-[8px] items-center w-full"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                {rowContent}
              </Link>
            );
          }

          return (
            <div
              key={item.name}
              className="flex gap-[8px] items-center w-full"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {rowContent}
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {hoveredItem && (
          <motion.div
            key="bento-preview"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="absolute left-full top-0 ml-[44px] hidden md:block"
          >
            <BentoGrid />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
