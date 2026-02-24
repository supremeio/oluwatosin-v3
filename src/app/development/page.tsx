import type { Metadata } from 'next';
import Image from 'next/image';
import { PageLayout } from '@/components/layout/PageLayout';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LinkedText } from '@/components/ui/LinkedText';
import { DottedSeparator } from '@/components/ui/DottedSeparator';
import { ScrambleText } from '@/components/ui/ScrambleText';

export const metadata: Metadata = {
  title: 'Code meets design — Design Engineering Lab',
  description:
    'An experimental playground where I build production-ready UI components, micro-interactions, and interface experiments. All open-source, copy-paste ready, built with modern tech.',
};

const PROJECTS = [
  { name: 'Get tech events in Europe', year: '2025' },
  { name: 'Laptop sticker studio', year: '2025' },
  { name: 'Pamoja', year: '2025' },
  { name: "Oluwatosin's portfolio", year: '2026' },
] as const;

interface MicroInteraction {
  label: string;
  lines: string[];
}

const MICRO_INTERACTIONS: MicroInteraction[] = [
  { label: 'loading', lines: ['Loading...'] },
  { label: 'upload', lines: ['Upload', 'component'] },
  { label: 'agent', lines: ['Pause & play', 'button'] },
];

function GitHubIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden className="shrink-0 text-icon-active">
      <path fillRule="evenodd" clipRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C12.1381 15.0538 13.5181 14.0331 14.4958 12.6716C15.4734 11.31 15.9995 9.67619 16 8C16 3.58 12.42 0 8 0Z" fill="currentColor" />
    </svg>
  );
}

function ExternalLinkIndicator(): React.ReactElement {
  return (
    <span className="flex gap-[4px] items-start shrink-0">
      <GitHubIcon />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-text-primary shrink-0" aria-hidden>
        <path d="M1.75 1.75H6.25V6.25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.25 1.75L1.75 6.25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}


function PageHeader(): React.ReactElement {
  return (
    <header className="flex flex-col gap-[40px] items-start w-full">
      <div className="flex flex-col gap-[8px] items-start w-full">
        <div className="flex flex-col gap-[4px] items-start">
          <h1 className="font-figtree font-semibold text-[20px] leading-[24px] text-text-primary">
            <ScrambleText text="Code meets design" />
          </h1>
          <p className="font-figtree font-medium text-[16px] leading-[19px] text-text-secondary">
            Design engineering lab
          </p>
        </div>
        <div className="flex gap-[4px] items-center">
          <GitHubIcon />
          <LinkedText className="font-figtree font-normal text-[15px] leading-[24px] text-text-primary">
            GitHub
          </LinkedText>
        </div>
      </div>
      <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
        An experimental playground where I build production-ready UI components,
        micro-interactions, and interface experiments. All open-source, copy-paste
        ready, built with modern tech.
      </p>
    </header>
  );
}

function ProjectsSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[16px] items-start w-full">
      <SectionLabel>Projects</SectionLabel>
      <div className="flex flex-col gap-[16px] items-start w-full">
        {PROJECTS.map((project) => (
          <div key={project.name} className="flex gap-[8px] items-center w-full">
            <LinkedText className="font-figtree font-semibold text-[15px] leading-[24px] text-text-primary shrink-0">
              {project.name}
            </LinkedText>
            <DottedSeparator />
            <span className="font-figtree font-normal text-[15px] leading-[25.6px] text-text-primary text-right whitespace-nowrap shrink-0">
              {project.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function EmptyDemoCard(): React.ReactElement {
  return (
    <div className="w-full md:w-[440px] h-[294px] rounded-[12px] bg-bg-secondary shrink-0 flex items-center justify-center">
      <Image src="/Empty state image.svg" alt="" width={200} height={200} />
    </div>
  );
}

function MicroInteractionRow({
  interaction,
  children,
}: {
  interaction: MicroInteraction;
  children: React.ReactNode;
}): React.ReactElement {
  const isSingleLine = interaction.lines.length === 1;

  return (
    <div className="flex flex-col md:flex-row items-start w-full gap-[16px] md:gap-0">
      <div className="w-full md:w-[140px] shrink-0">
        <div className={`flex gap-[8px] ${isSingleLine ? 'items-center' : 'items-start'}`}>
          <LinkedText className="font-figtree font-normal text-[15px] leading-[24px] text-text-primary">
            {interaction.lines.map((line, i) => (
              <span key={line}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </LinkedText>
          <ExternalLinkIndicator />
        </div>
      </div>
      {children}
    </div>
  );
}

function MicroInteractionsSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[16px] items-start w-full">
      <SectionLabel>Micro-Interactions</SectionLabel>
      <div className="flex flex-col gap-[40px] items-start w-full">
        <MicroInteractionRow interaction={MICRO_INTERACTIONS[0]}>
          <EmptyDemoCard />
        </MicroInteractionRow>
        <MicroInteractionRow interaction={MICRO_INTERACTIONS[1]}>
          <EmptyDemoCard />
        </MicroInteractionRow>
        <MicroInteractionRow interaction={MICRO_INTERACTIONS[2]}>
          <EmptyDemoCard />
        </MicroInteractionRow>
      </div>
    </section>
  );
}

export default function DevelopmentPage(): React.ReactElement {
  return (
    <PageLayout>
      <PageHeader />

      <div className="mt-[40px]">
        <ProjectsSection />
      </div>

      <div className="mt-[80px]">
        <MicroInteractionsSection />
      </div>
    </PageLayout>
  );
}
