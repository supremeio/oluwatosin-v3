'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { caseStudies, caseStudySlugs } from '@/data/case-studies';

interface CaseStudyHeaderProps {
  slug: string;
  sectionCount?: number;
  activeSectionIndex?: number;
}

function ProgressLines({
  count = 5,
  activeIndex = 1,
}: {
  count?: number;
  activeIndex?: number;
}): React.ReactElement {
  return (
    <div className="flex flex-col justify-between h-[80px] w-[16px]" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className={`border-b ${i === activeIndex
            ? 'border-border-active w-[16px]'
            : 'border-border-primary w-[12px]'
            }`}
        />
      ))}
    </div>
  );
}

function getNextProject(currentSlug: string): { slug: string; title: string } | null {
  const idx = caseStudySlugs.indexOf(currentSlug as typeof caseStudySlugs[number]);
  if (idx === -1) return null;
  const nextIdx = (idx + 1) % caseStudySlugs.length;
  const nextSlug = caseStudySlugs[nextIdx];
  return { slug: nextSlug, title: caseStudies[nextSlug]?.title ?? nextSlug };
}

export function CaseStudyHeader({
  slug,
  sectionCount = 5,
  activeSectionIndex = 1,
}: CaseStudyHeaderProps): React.ReactElement {
  const [progress, setProgress] = useState(0);
  const [isHoveringNext, setIsHoveringNext] = useState(false);
  const nextProject = getNextProject(slug);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      setProgress(Math.min(pct, 100));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Back button — fixed to the left of the content column */}
      <Link
        href="/"
        className="hidden md:flex fixed left-[max(16px,calc(50vw_-_394px))] top-[209px] gap-[4px] items-center text-text-primary z-10"
        aria-label="Back to home"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
          <path d="M4 10H14C15.7239 10 17.3772 10.6848 18.5962 11.9038C19.8152 13.1228 20.5 14.7761 20.5 16.5V18.5M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-figtree font-normal italic text-[16px] leading-normal">Back</span>
      </Link>

      {/* Progress indicator — original position, untouched */}
      <div
        className="hidden md:flex fixed right-[max(16px,calc(50vw_-_374px))] top-[209px] flex-col gap-[16px] items-center w-[48px] z-10"
        aria-hidden
      >
        <div className="bg-bg-secondary rounded-[40px] px-[8px] py-[4px] w-full flex items-center justify-center">
          <span className="font-figtree font-medium text-[14px] leading-[20px] text-text-primary tabular-nums">
            {progress}%
          </span>
        </div>
        <ProgressLines count={sectionCount} activeIndex={activeSectionIndex} />
      </div>

      {/* Next project — to the RIGHT of the progress, 40px gap, same top */}
      {nextProject && (
        <Link
          href={`/case-study/${nextProject.slug}`}
          className="hidden md:flex fixed top-[209px] items-center z-10"
          style={{ right: 'calc(max(16px, 50vw - 374px) - 48px - 40px)' }}
          aria-label={`Next project: ${nextProject.title}`}
          onMouseEnter={() => setIsHoveringNext(true)}
          onMouseLeave={() => setIsHoveringNext(false)}
        >
          {/* Hover label — 16px above */}
          <span
            className={`font-figtree font-medium text-[16px] leading-normal text-text-primary absolute bottom-[calc(100%_+_16px)] right-0 whitespace-nowrap transition-all duration-200 ${isHoveringNext ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[4px]'
              }`}
          >
            {nextProject.title}
          </span>

          {/* "Next" text + forward arrow */}
          <span className="font-figtree font-normal italic text-[16px] leading-normal text-text-primary">Next</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 text-text-primary ml-[4px]" aria-hidden>
            <path d="M20 10H10C8.27614 10 6.62279 10.6848 5.40381 11.9038C4.18482 13.1228 3.5 14.7761 3.5 16.5V18.5M20 10L15 5M20 10L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      )}
    </>
  );
}
