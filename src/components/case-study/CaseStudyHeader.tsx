import Image from 'next/image';
import Link from 'next/link';

interface CaseStudyHeaderProps {
  progressPercent?: number;
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
          className={`border-b ${
            i === activeIndex
              ? 'border-border-active w-[16px]'
              : 'border-border-primary w-[12px]'
          }`}
        />
      ))}
    </div>
  );
}

export function CaseStudyHeader({
  progressPercent = 0,
  sectionCount = 5,
  activeSectionIndex = 1,
}: CaseStudyHeaderProps): React.ReactElement {
  return (
    <>
      {/* Back button — fixed to the left of the content column on desktop */}
      <Link
        href="/"
        className="hidden md:flex fixed left-[max(16px,calc(50vw_-_394px))] top-[209px] gap-[4px] items-center text-text-primary z-10"
        aria-label="Back to home"
      >
        <Image src="/Back arrow.svg" alt="" width={24} height={24} className="shrink-0" />
        <span className="font-figtree font-normal italic text-[16px] leading-normal">Back</span>
      </Link>

      {/* Progress indicator — fixed to the right of the content column on desktop */}
      <div
        className="hidden md:flex fixed right-[max(16px,calc(50vw_-_374px))] top-[209px] flex-col gap-[16px] items-center w-[44px] z-10"
        aria-hidden
      >
        <div className="bg-bg-secondary rounded-[40px] px-[8px] py-[4px] w-full flex items-center justify-center">
          <span className="font-figtree font-medium text-[14px] leading-[20px] text-text-primary text-center w-[28px]">
            {progressPercent}%
          </span>
        </div>
        <ProgressLines count={sectionCount} activeIndex={activeSectionIndex} />
      </div>
    </>
  );
}
