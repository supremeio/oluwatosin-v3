import Image from 'next/image';
import { PageLayout } from '@/components/layout/PageLayout';
import { ProfileHeader } from '@/components/ProfileHeader';
import { WorkSection } from '@/components/WorkBentoGrid';
import { ArrowTopRightIcon } from '@/components/ui/ArrowTopRightIcon';
import { DottedSeparator } from '@/components/ui/DottedSeparator';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { LinkedText } from '@/components/ui/LinkedText';

const WRITINGS_ITEMS = [
  { title: '2025 recap', year: '2025' },
  { title: 'Error handling in design', year: '2025' },
  { title: 'Product Designer beyond wireframes at a startup', year: '2024' },
  { title: '5 mistakes I made when I started in product design', year: '2020' },
] as const;

const TOOLS = [
  { name: 'Figma,', linked: true },
  { name: 'Cursor,', linked: true },
  { name: 'Tailwind CSS,', linked: true },
  { name: 'and', linked: false },
  { name: 'shadcn/ui', linked: true },
] as const;

function AboutSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[24px] items-start">
      <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
        Product Designer and design engineer who bridges design and development
        through systematic problem-solving, scalable design systems, and
        AI-accelerated front-end implementation.
      </p>
      <div className="flex gap-[8px] items-center">
        <Image src="/icons/nl-flag.svg" alt="Netherlands flag" width={16} height={16} className="shrink-0" />
        <p className="font-sora font-normal text-[12px] leading-normal uppercase text-text-secondary">
          Based in the Netherlands
        </p>
      </div>
    </section>
  );
}

function WritingsSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[16px] items-start">
      <SectionLabel>WRITINGS</SectionLabel>
      <div className="flex flex-col gap-[16px] items-start w-full">
        {WRITINGS_ITEMS.map((item) => (
          <div key={item.title} className="group flex gap-[8px] items-center w-full">
            <div className="flex gap-[4px] items-center min-w-0 md:shrink-0">
              <LinkedText className="font-figtree font-semibold text-[15px] leading-[24px] text-text-primary truncate min-w-0">
                {item.title}
              </LinkedText>
              <ArrowTopRightIcon />
            </div>
            <DottedSeparator />
            <span className="font-figtree font-normal text-[15px] leading-[25.6px] text-text-primary text-right whitespace-nowrap shrink-0">
              {item.year}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MyStrengthSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[8px] items-start">
      <SectionLabel>MY STRENGTH</SectionLabel>
      <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary w-full">
        I specialize in user research, product design, and design engineering,
        moving from research insights to production-ready code. I conduct
        qualitative interviews and usability testing, design end-to-end product
        experiences, and build high-fidelity prototypes that validate concepts
        before development. I translate Figma designs into scalable Next.js
        components and create design systems with consistent tokens.
      </p>
      <div className="flex gap-[4px] items-start flex-wrap w-full">
        <span className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          Tools
        </span>
        {TOOLS.map((tool) =>
          tool.linked ? (
            <LinkedText key={tool.name} className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
              {tool.name}
            </LinkedText>
          ) : (
            <span key={tool.name} className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
              {tool.name}
            </span>
          )
        )}
      </div>
    </section>
  );
}

function MyProcessSection(): React.ReactElement {
  return (
    <section className="flex flex-col gap-[8px] items-start">
      <div className="flex gap-[8px] items-center">
        <SectionLabel>MY PROCESS</SectionLabel>
        <LinkedText className="font-figtree font-medium text-[13px] leading-[1.5] text-text-primary whitespace-nowrap">
          What it means
        </LinkedText>
      </div>
      <div className="relative w-full aspect-[620/223]">
        <Image
          src="/my process - light.svg"
          alt="Non-linear design process: Understand, Define, Sketch, Wireframe, Design & Iteration, Test & Refine"
          fill
          className="object-contain"
          sizes="(min-width: 768px) 580px, 100vw"
        />
      </div>
    </section>
  );
}

export default function PortfolioPage(): React.ReactElement {
  const profileHeader = (
    <div className="relative z-10 w-full px-[24px] pt-[24px] md:w-[580px] md:px-0 md:mx-auto md:pt-[40px]">
      <ProfileHeader />
    </div>
  );

  return (
    <PageLayout beforeMain={profileHeader}>
      <div className="-mt-[4px]">
        <AboutSection />
      </div>

      <div className="mt-[80px]">
        <WorkSection />
      </div>

      <div className="mt-[80px]">
        <WritingsSection />
      </div>

      <div className="mt-[80px]">
        <MyStrengthSection />
      </div>

      <div className="mt-[80px]">
        <MyProcessSection />
      </div>
    </PageLayout>
  );
}
