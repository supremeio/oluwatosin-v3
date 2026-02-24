import type { Metadata } from 'next';
import Image from 'next/image';
import { PageLayout } from '@/components/layout/PageLayout';
import { ArrowTopRightIcon } from '@/components/ui/ArrowTopRightIcon';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LinkedText } from '@/components/ui/LinkedText';
import { DottedSeparator } from '@/components/ui/DottedSeparator';
import { AboutPageHeader } from '@/components/AboutPageHeader';

export const metadata: Metadata = {
  title: 'About — Oluwatosin Kazeem',
  description:
    'Design. Develop. Gym. Sleep. Repeat. Product designer for over 4 years, focused on building products and mentoring designers.',
};

interface Experience {
  title: string;
  company: string;
  period: string;
}

const EXPERIENCES: Experience[] = [
  { title: '[design/engineer]', company: 'You decide', period: 'Future' },
  { title: 'Senior product designer', company: 'Autospend', period: '2023 - 2025' },
  { title: 'Founding product designer', company: 'SIPP', period: '2022 - Present' },
  { title: 'Founding product designer', company: 'PHPSandbox', period: '2021 - 2024' },
  { title: 'Product designer', company: 'Changera', period: '2019-2020' },
];

const SOCIAL_LINKS = [
  { name: 'GitHub', href: '#' },
  { name: 'Twitter (X)', href: '#' },
  { name: 'LinkedIn', href: '#' },
  { name: 'Medium', href: '#' },
] as const;


function EducationRow(): React.ReactElement {
  return (
    <div className="group flex gap-[8px] items-center w-full">
      <div className="flex gap-[8px] items-center min-w-0 md:shrink-0">
        <span className="font-figtree font-semibold text-[15px] leading-[24px] text-text-primary pb-[2px] whitespace-nowrap">
          Master&apos;s in digital design
        </span>
        <div className="flex gap-[4px] items-center shrink-0">
          <span className="font-figtree font-medium text-[14px] leading-[24px] text-text-secondary opacity-80 whitespace-nowrap">
            HvA
          </span>
          <ArrowTopRightIcon />
        </div>
      </div>
      <DottedSeparator />
      <span className="font-figtree font-medium text-[15px] leading-[25.6px] text-text-primary text-right whitespace-nowrap shrink-0">
        2025 - Present
      </span>
    </div>
  );
}

function EmptyStateImage(): React.ReactElement {
  return (
    <Image
      src="/Empty state image.svg"
      alt="Empty state placeholder"
      width={580}
      height={256}
      className="rounded-[24px] w-full h-auto"
    />
  );
}

function ExperienceRow({ experience }: { experience: Experience }): React.ReactElement {
  return (
    <div className="group flex gap-[8px] items-center w-full py-[8px] group-hover/experiences:opacity-40 hover:!opacity-100 transition-opacity duration-150">
      <div className="flex gap-[8px] items-center min-w-0">
        <span className="font-figtree font-semibold text-[15px] leading-[24px] text-text-primary pb-[2px] truncate">
          {experience.title}
        </span>
        <div className="relative flex items-center shrink-0">
          <span className="font-figtree font-medium text-[14px] leading-[24px] text-text-secondary opacity-80 whitespace-nowrap">
            {experience.company}
          </span>
          <div className="absolute left-full pl-[4px]">
            <ArrowTopRightIcon />
          </div>
        </div>
      </div>
      <DottedSeparator />
      <span className="font-figtree font-medium text-[15px] leading-[25.6px] text-text-primary text-right whitespace-nowrap shrink-0">
        {experience.period}
      </span>
    </div>
  );
}

function PastExperiencesSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[16px] items-start w-full">
      <SectionLabel>Past experiences</SectionLabel>
      <div className="flex flex-col items-start w-full group/experiences">
        {EXPERIENCES.map((exp) => (
          <ExperienceRow key={`${exp.title}-${exp.company}`} experience={exp} />
        ))}
      </div>
    </section>
  );
}

function SocialLinksSection(): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-x-[24px] gap-y-[8px] items-center">
      <span className="font-figtree font-normal text-[15px] leading-[24px] text-text-primary">
        Find me on
      </span>
      <div className="flex flex-wrap gap-x-[24px] gap-y-[8px] items-center">
        {SOCIAL_LINKS.map((link) => (
          <LinkedText
            key={link.name}
            className="font-figtree font-medium text-[15px] leading-[24px] text-text-primary"
          >
            {link.name}
          </LinkedText>
        ))}
      </div>
    </div>
  );
}

export default function AboutPage(): React.ReactElement {
  return (
    <PageLayout>
      <AboutPageHeader />

      <div className="mt-[40px] flex flex-col gap-[24px] items-start">
        <div className="flex flex-col w-full">
          <div className="border-b border-border-primary w-full" />
          <div className="py-[20px]">
            <EducationRow />
          </div>
          <div className="border-b border-border-primary w-full" />
        </div>
        <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
          I&apos;ve been a product designer for over 4 years. I currently work at a company focused
          on business and finance as a senior product designer. Prior to my current company, I
          focused on a healthcare platform and before that I worked at a startup focused on
          building developer tools. In my current role, I&apos;m focused on helping businesses and
          individuals send money internationally using USDC in seconds. In my previous role at
          a developer tools, I focused on improving the user experience of our IDE, by
          simplifying the onboarding process, we reduced the bounce rate by 40% and increased
          user retention by 20%. I helped my previous company (SIPP) get into Techsters in 2024
          and I&apos;ve helped other companies (Bonadocs, PHPSandbox, Changera) secure grants and
          funds.
        </p>
      </div>

      <div className="mt-[40px]">
        <EmptyStateImage />
      </div>

      <div className="mt-[40px]">
        <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
          I mentored and guided newer designers through projects that eventually helped them
          land their first roles, contributing to their professional growth. On the other hand,
          I love to build products using AI.
        </p>
        <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full mt-[22.5px]">
          I take pictures.
        </p>

      </div>

      <div className="mt-[40px]">
        <EmptyStateImage />
      </div>

      <div className="mt-[40px]">
        <PastExperiencesSection />
      </div>

      <div className="mt-[40px]">
        <SocialLinksSection />
      </div>
    </PageLayout>
  );
}
