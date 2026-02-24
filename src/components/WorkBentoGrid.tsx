'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { DottedSeparator } from '@/components/ui/DottedSeparator';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LinkedText } from '@/components/ui/LinkedText';

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

export function WorkSection(): React.ReactElement {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleMouseEnter = useCallback((name: string) => {
    setHoveredItem(name);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <section className="flex flex-col gap-[16px] items-start">
      <SectionLabel>Work</SectionLabel>
      <div className="flex flex-col items-start w-full">
        {WORK_ITEMS.map((item) => {
          const dimmed = hoveredItem !== null && hoveredItem !== item.name;

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

          const rowStyle = {
            opacity: dimmed ? 0.4 : 1,
            transition: 'opacity 0.15s ease',
          };

          if (item.slug) {
            return (
              <Link
                key={item.name}
                href={`/case-study/${item.slug}`}
                className="flex gap-[8px] items-center w-full py-[8px]"
                style={rowStyle}
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
              className="flex gap-[8px] items-center w-full py-[8px]"
              style={rowStyle}
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              {rowContent}
            </div>
          );
        })}
      </div>
    </section>
  );
}
