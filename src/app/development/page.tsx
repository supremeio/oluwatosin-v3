import type { Metadata } from 'next';
import Image from 'next/image';
import { PageLayout } from '@/components/layout/PageLayout';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LinkedText } from '@/components/ui/LinkedText';
import { DottedSeparator } from '@/components/ui/DottedSeparator';

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

function ExternalLinkIndicator(): React.ReactElement {
  return (
    <span className="flex gap-[4px] items-start shrink-0">
      <Image src="/GitHub icon.svg" alt="" width={16} height={16} className="shrink-0" />
      <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className="text-text-primary shrink-0" aria-hidden>
        <path d="M1.75 1.75H6.25V6.25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6.25 1.75L1.75 6.25" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function CheckIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden>
      <path d="M3.33 8.67L6 11.33 12.67 4.67" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LoaderIcon({ color = '#111' }: { color?: string }): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden>
      <circle cx="8" cy="8" r="5.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4 4" />
    </svg>
  );
}

function UploadIcon(): React.ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden>
      <path d="M7.5 14.167V8.333l-2.5 2.5" stroke="#8aa8ba" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 8.333l2.5 2.5" stroke="#8aa8ba" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.333 8.333V12.5c0 4.167-1.666 5.833-5.833 5.833H7.5c-4.167 0-5.833-1.666-5.833-5.833V7.5c0-4.167 1.666-5.833 5.833-5.833h4.167" stroke="#8aa8ba" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.333 8.333H15c-2.5 0-3.333-.833-3.333-3.333V1.667l6.666 6.666z" stroke="#8aa8ba" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AgentLoaderIcon(): React.ReactElement {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0" aria-hidden>
      <circle cx="10" cy="10" r="6.5" stroke="#48ba77" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="5 5" />
    </svg>
  );
}

function PageHeader(): React.ReactElement {
  return (
    <header className="flex flex-col gap-[40px] items-start w-[580px]">
      <div className="flex items-start justify-between w-full">
        <div className="flex flex-col gap-[4px] items-start">
          <h1 className="font-figtree font-semibold text-[20px] leading-[24px] text-text-primary">
            Code meets design
          </h1>
          <p className="font-figtree font-medium text-[16px] leading-[19px] text-text-secondary">
            Design engineering lab
          </p>
        </div>
        <div className="flex gap-[4px] items-center">
          <Image src="/GitHub icon.svg" alt="" width={16} height={16} className="shrink-0" />
          <LinkedText className="font-figtree font-normal text-[15px] leading-[24px] text-text-primary text-right">
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

function LoadingDemoCard(): React.ReactElement {
  return (
    <div className="relative w-[440px] h-[294px] rounded-[12px] bg-bg-secondary shrink-0">
      <div className="absolute left-[78px] top-[69px] w-[285px] bg-white rounded-[8px] p-[24px] flex flex-col gap-[24px]">
        <div className="flex gap-[4px] items-center">
          <CheckIcon />
          <span className="font-figtree font-medium text-[14px] leading-[1.4] text-text-primary">
            Searching through LinkedIn
          </span>
        </div>
        <div className="flex gap-[4px] items-center">
          <LoaderIcon />
          <span className="font-figtree font-medium text-[14px] leading-[1.4] text-text-primary">
            Found a job
          </span>
        </div>
        <div className="flex gap-[4px] items-center">
          <LoaderIcon />
          <span className="font-figtree font-medium text-[14px] leading-[1.4] text-text-primary">
            Applying...
          </span>
        </div>
      </div>
    </div>
  );
}

function UploadDemoCard(): React.ReactElement {
  return (
    <div className="relative w-[440px] h-[294px] rounded-[12px] bg-bg-secondary shrink-0">
      <div className="absolute left-[124px] top-[125px] flex gap-[4px] items-center justify-center px-[16px] py-[8px] rounded-[8px] bg-[#151619] w-[192px] h-[44px]">
        <UploadIcon />
        <span className="font-figtree font-medium text-[14px] leading-[20px] text-[#8aa8ba]">
          Upload (.pdf, docs)
        </span>
      </div>
    </div>
  );
}

function AgentRunningDemoCard(): React.ReactElement {
  return (
    <div className="relative w-[440px] h-[294px] rounded-[12px] bg-bg-secondary shrink-0">
      <div className="absolute left-[139px] top-[125px] flex gap-[4px] items-center justify-center px-[24px] py-[12px] rounded-[8px] bg-[#123520]">
        <AgentLoaderIcon />
        <span className="font-figtree font-medium text-[14px] leading-[20px] text-[#48ba77]">
          Agent running
        </span>
      </div>
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
    <div className="flex items-start w-full">
      <div className="w-[140px] shrink-0">
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
          <LoadingDemoCard />
        </MicroInteractionRow>
        <MicroInteractionRow interaction={MICRO_INTERACTIONS[1]}>
          <UploadDemoCard />
        </MicroInteractionRow>
        <MicroInteractionRow interaction={MICRO_INTERACTIONS[2]}>
          <AgentRunningDemoCard />
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
