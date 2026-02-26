import Link from 'next/link';
import type { Metadata } from 'next';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProfileHeader } from '@/components/ProfileHeader';
import { CaseStudyHeader, CaseStudyHero, CaseStudyBody } from '@/components/case-study';
import { caseStudies } from '@/data/case-studies';

interface CaseStudyPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];
  const title = caseStudy?.title ?? slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return {
    title: `${title} — Case Study — Oluwatosin Kazeem`,
    description: `Case study: ${title}. Product design and design engineering by Oluwatosin Kazeem.`,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps): Promise<React.ReactElement> {
  const { slug } = await params;
  const caseStudy = caseStudies[slug];

  const title = caseStudy?.title ?? slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');

  return (
    <PageLayout>
      {/* Floating back button (left) + reading progress (right) — fixed positioned, no layout impact */}
      <CaseStudyHeader slug={slug} sectionCount={5} activeSectionIndex={1} />


      {/* Profile header — matches homepage layout */}
      <ProfileHeader />

      {/* Main content — 80px gap below profile header, matches Figma */}
      <div className="mt-[80px] flex flex-col gap-[40px]">

        {/* Project info: title + hero image + metadata */}
        <div className="flex flex-col gap-[24px]">
          {/* Mobile back button */}
          <Link
            href="/"
            className="flex md:hidden gap-[4px] items-center text-text-primary"
            aria-label="Back to home"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
              <path d="M4 10H14C15.7239 10 17.3772 10.6848 18.5962 11.9038C19.8152 13.1228 20.5 14.7761 20.5 16.5V18.5M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="font-figtree font-normal italic text-[16px] leading-normal">Back</span>
          </Link>
          <p
            className="font-figtree font-semibold text-[16px] leading-[1.45] tracking-[-0.32px] text-text-primary"
            style={{ fontFeatureSettings: "'lnum', 'tnum'" }}
          >
            {title}
          </p>
          <CaseStudyHero />
          <CaseStudyBody metadata={caseStudy?.metadata} />
        </div>

        {/* Story */}
        {caseStudy?.story ? (
          <div className="flex flex-col gap-[16px]">
            {caseStudy.story.map((paragraph, i) => (
              <p
                key={i}
                className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full"
              >
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
            Story...
          </p>
        )}

        {/* Status */}
        <div className="flex flex-col items-start w-full">
          <p className="font-figtree font-bold text-[15px] leading-[1.5] text-text-primary w-full">
            Case study coming soon...
          </p>
        </div>

      </div>
    </PageLayout>
  );
}
