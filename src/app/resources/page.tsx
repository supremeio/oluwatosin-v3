import type { Metadata } from 'next';
import Image from 'next/image';
import { PageLayout } from '@/components/layout/PageLayout';
import { LinkedText } from '@/components/ui/LinkedText';

export const metadata: Metadata = {
  title: 'Tips & Resources — Oluwatosin Kazeem',
  description:
    'A curated dump of the tools, systems, and references I actually use. Constantly updated. Search anything.',
};

const FILTER_TABS = [
  { label: 'All', active: true },
  { label: 'Design system & UI kits', active: false },
  { label: 'Icons', active: false },
  { label: 'Dev & front-end tools', active: false },
  { label: 'Typography', active: false },
  { label: 'Colour & theming', active: false },
  { label: 'Learnings', active: false },
  { label: 'Design inspiration', active: false },
] as const;

interface LearningItem {
  title: string;
  linkLabel: string;
}

const LEARNINGS: LearningItem[] = [
  { title: 'Design system', linkLabel: '[channel / video]' },
  { title: 'Claude Code', linkLabel: '[channel / video]' },
  { title: 'Converting your design to code using Cursor', linkLabel: '[channel / video]' },
  { title: 'How to use Figma', linkLabel: '[channel / video]' },
  { title: 'How to use Figma', linkLabel: '[channel / video]' },
];

function TipsIcon(): React.ReactElement {
  return (
    <Image src="/Tips icon.svg" alt="" width={20} height={20} className="shrink-0" />
  );
}

function PageHeader(): React.ReactElement {
  return (
    <header className="flex items-start w-full">
      <div className="flex flex-col gap-[4px] items-start w-[261px]">
        <h1 className="font-figtree font-semibold text-[20px] leading-[normal] text-text-primary">
          Tips &amp; resources
        </h1>
        <p className="font-figtree font-medium text-[16px] leading-[normal] text-text-secondary">
          You&apos;re welcome!
        </p>
      </div>
    </header>
  );
}

function SearchBar(): React.ReactElement {
  return (
    <div className="flex items-center justify-between py-[16px] border-b border-border-primary w-full leading-[1.5] text-[15px]">
      <p className="font-figtree font-normal text-text-secondary opacity-40">
        Search by name or category...
      </p>
      <div className="flex gap-[4px] items-start pl-[16px] border-l border-border-primary font-figtree font-medium">
        <span className="text-text-primary">44</span>
        <span className="text-text-secondary opacity-50">of</span>
        <span className="text-text-secondary opacity-50">44</span>
        <span className="text-text-secondary opacity-50">resources</span>
      </div>
    </div>
  );
}

function FilterTabs(): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-[8px] items-start w-full">
      {FILTER_TABS.map((tab) => (
        <button
          key={tab.label}
          type="button"
          className={`flex items-center justify-center px-[16px] py-[8px] rounded-[80px] shrink-0 font-figtree font-normal text-[14px] leading-[20px] ${
            tab.active
              ? 'bg-bg-on-colour text-text-on-colour'
              : 'bg-bg-main border-[0.8px] border-border-primary text-text-secondary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function ResourceSectionTitle({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <p className="font-figtree font-bold text-[15px] leading-[1.5] text-text-primary w-full">
      {children}
    </p>
  );
}

function InfoCallout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex gap-[8px] items-start p-[8px] rounded-[8px] bg-bg-secondary w-full">
      <TipsIcon />
      <p className="flex-1 font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
        {children}
      </p>
    </div>
  );
}

function IconsSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[8px] items-start w-full">
      <ResourceSectionTitle>Icons</ResourceSectionTitle>
      <div className="flex gap-[4px] items-start flex-wrap">
        <span className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          I&apos;m a fan of line icons so I use these libraries on Figma community
        </span>
        <LinkedText className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          Vuesax
        </LinkedText>
        <LinkedText className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          Phosphor
        </LinkedText>
      </div>
      <div className="flex gap-[4px] items-start w-full">
        <span className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          In addition to that, I use
        </span>
        <LinkedText className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          Iconify
        </LinkedText>
        <span className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          plugin
        </span>
      </div>
      <InfoCallout>
        You are most likely not going to see all icons needed for a project in a library,
        you can combine icons from different libraries, but with the same style.
      </InfoCallout>
    </section>
  );
}

function TypographySection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[8px] items-start w-full">
      <ResourceSectionTitle>Typography</ResourceSectionTitle>
      <div className="flex gap-[4px] items-start">
        <span className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          My go to platform is
        </span>
        <LinkedText className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          Google fonts
        </LinkedText>
      </div>
      <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
        However, I love big typefaces, but I&apos;m most times limited by the licenses so I hardly
        use them. Regardless, I have a library where I put nice big typefaces, mostly inspired
        by website on{' '}
        <LinkedText className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary inline">
          Awwwards
        </LinkedText>
        . You can get them{' '}
        <LinkedText className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary inline">
          here
        </LinkedText>
        .
      </p>
      <InfoCallout>
        Before you use any fonts outside Google fonts, make sure to check their
        licenesce do you don&apos;t get sued. The fines are super heavy haha.
      </InfoCallout>
    </section>
  );
}

function LearningsSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[8px] items-start w-full">
      <ResourceSectionTitle>Learnings</ResourceSectionTitle>
      <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
        You can be the best at anything for free with constant practice (the main price).
      </p>
      {LEARNINGS.map((item, i) => (
        <div key={`${item.title}-${i}`} className="flex gap-[4px] items-start">
          <span className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
            {item.title}
          </span>
          <LinkedText className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
            {item.linkLabel}
          </LinkedText>
        </div>
      ))}
    </section>
  );
}

function DesignInspirationSection({ name, href }: { name: string; href: string }): React.ReactElement {
  return (
    <section className="flex flex-col gap-[8px] items-start w-full">
      <ResourceSectionTitle>Design inspiration</ResourceSectionTitle>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="border-b-[0.5px] border-dashed border-border-active pb-[2px] font-figtree font-medium text-[15px] leading-[1.5] text-text-primary cursor-pointer"
      >
        {name}
      </a>
    </section>
  );
}

export default function ResourcesPage(): React.ReactElement {
  return (
    <PageLayout>
      <div className="flex flex-col gap-[40px] items-start w-full">
        <PageHeader />

        <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
          A curated dump of the tools, systems, and references I actually use. Constantly
          updated. Search anything.
        </p>

        <SearchBar />
        <FilterTabs />
        <IconsSection />
        <TypographySection />
        <LearningsSection />

        <DesignInspirationSection
          name="Amelie Schlueter"
          href="https://www.amelieschlueter.com/"
        />
        <DesignInspirationSection
          name="Amelie Schlueter"
          href="https://www.amelieschlueter.com/"
        />
      </div>
    </PageLayout>
  );
}
