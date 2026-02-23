import Image from 'next/image';
import type { ReactNode } from 'react';

interface CaseStudyHeroProps {
  /** Hero image, video, or custom content. If not provided, shows dotted placeholder. */
  children?: ReactNode;
}

export function CaseStudyHero({ children }: CaseStudyHeroProps): React.ReactElement {
  if (children) {
    return (
      <div className="w-full rounded-[24px] overflow-hidden bg-bg-secondary">
        {children}
      </div>
    );
  }

  return (
    <div className="w-full h-[380px] rounded-[24px] bg-bg-secondary overflow-hidden relative">
      <Image
        src="/Empty state image.svg"
        alt=""
        fill
        className="object-cover"
        aria-hidden
      />
    </div>
  );
}
