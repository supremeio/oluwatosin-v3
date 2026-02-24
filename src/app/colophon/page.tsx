import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';

function GitHubIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function InlineLink({ href, children }: { href: string; children: React.ReactNode }): React.ReactElement {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="border-b-[0.5px] border-dashed border-border-active pb-[2px]"
    >
      {children}
    </a>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }): React.ReactElement {
  return (
    <section className="flex flex-col gap-[8px] items-start">
      <p className="font-figtree font-bold text-[15px] leading-[1.5] text-text-primary">
        {heading}
      </p>
      {children}
    </section>
  );
}

export default function ColophonPage(): React.ReactElement {
  return (
    <PageLayout hideNav>
      {/* Back button — fixed to the left of the content column on desktop */}
      <Link
        href="/"
        className="hidden md:flex fixed left-[max(16px,calc(50vw_-_394px))] top-[209px] gap-[4px] items-center text-text-primary z-10"
        aria-label="Back to home"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
          <path d="M4 10H14C15.7239 10 17.3772 10.6848 18.5962 11.9038C19.8152 13.1228 20.5 14.7761 20.5 16.5V18.5M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="font-figtree font-normal italic text-[16px] leading-normal">Back</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-[8px] items-start w-full">
        <div className="flex flex-col gap-[4px] items-start">
          <h1 className="font-figtree font-semibold text-[20px] leading-normal text-text-primary">
            Colophon
          </h1>
          <p className="font-figtree font-medium text-[16px] leading-normal text-text-secondary">
            How I put this portfolio together
          </p>
        </div>
        <div className="flex gap-[4px] items-center">
          <a
            href="https://github.com/supremeio/oluwatosin-v3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-primary"
            aria-label="GitHub repository"
          >
            <GitHubIcon />
          </a>
          <InlineLink href="https://github.com/supremeio/oluwatosin-v3">
            <span className="font-figtree font-normal text-[15px] leading-[24px] text-text-primary">
              GitHub
            </span>
          </InlineLink>
          <span className="font-figtree font-normal text-[15px] leading-[24px] text-text-primary">
            /
          </span>
          <span className="opacity-50">
            <InlineLink href="https://github.com/supremeio/oluwatosin-v3/commit/488a8ea">
              <span className="font-figtree font-normal text-[15px] leading-[24px] text-text-secondary">
                #488a8ea
              </span>
            </InlineLink>
          </span>
        </div>
      </div>

      {/* Intro — md:mt-[111px] pushes it to align with the back button at top-[209px]:
          main pt-[40] + header (30+4+24=58px) + 111 = 209px */}
      <div className="flex flex-col gap-[16px] items-start mt-[80px] md:mt-[111px]">
        {/* Mobile back button */}
        <Link
          href="/"
          className="flex md:hidden gap-[4px] items-center text-text-primary"
          aria-label="Back to home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
          <path d="M4 10H14C15.7239 10 17.3772 10.6848 18.5962 11.9038C19.8152 13.1228 20.5 14.7761 20.5 16.5V18.5M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
          <span className="font-figtree font-normal italic text-[16px] leading-normal">Back</span>
        </Link>
        <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
          This portfolio demonstrates my approach to solving complex problems. Each case study is
          structured the same way: I identify the challenge, describe my method for tackling it,
          and show the real-world impact. This mirrors how I work on professional projects.
        </p>
      </div>

      <div className="flex flex-col gap-[40px] mt-[40px]">
        {/* Design and development */}
        <Section heading="Design and development">
          <div className="flex flex-col gap-[8px] items-start">
            <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
              Designed in{' '}
              <InlineLink href="https://figma.com">Figma</InlineLink>
            </p>
            <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
              Built with{' '}
              <InlineLink href="https://nextjs.org">Next.js,</InlineLink>{' '}
              <InlineLink href="https://tailwindcss.com">Tailwind CSS</InlineLink>{' '}
              and{' '}
              <InlineLink href="https://ui.shadcn.com">shadcn/ui</InlineLink>
            </p>
            <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
              Used{' '}
              <InlineLink href="https://www.cursor.com">Cursor</InlineLink>{' '}
              to turn designs into code accurately
            </p>
          </div>
        </Section>

        {/* Design system */}
        <Section heading="Design system">
          <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
            I use a consistent system for typography, spacing, and colors, designed in Figma and
            applied in code. All components are built to be reused easily and maintained long-term.
          </p>
        </Section>

        {/* Inspiration */}
        <Section heading="Inspiration">
          <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
            <InlineLink href="https://www.amelieschlueter.com/">Amelie Schlueter</InlineLink>
          </p>
        </Section>

        {/* Open source */}
        <Section heading="Open source">
          <p className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary">
            This site is available and open source on{' '}
            <InlineLink href="https://github.com/supremeio/oluwatosin-v3">GitHub</InlineLink>
          </p>
        </Section>
      </div>
    </PageLayout>

  );
}
