import type { MetadataRow } from '@/data/case-studies';
import { LinkedText } from '@/components/ui/LinkedText';

const PLACEHOLDER_METADATA: MetadataRow[] = [
  {
    label: 'Here are the project platforms',
    items: [
      { text: 'Android,', linked: true },
      { text: 'iOS', linked: true },
      { text: 'and', linked: false },
      { text: 'web application', linked: true },
    ],
  },
  {
    label: 'My skills during the project include',
    items: [
      { text: 'Product design', linked: true },
      { text: 'Interactive prototyping', linked: true },
    ],
  },
  {
    label: 'My role',
    items: [{ text: '[design role]', linked: true }],
  },
  {
    label: 'Team',
    items: [
      { text: 'Elizabeth', linked: true },
      { text: 'Lanre', linked: true },
    ],
  },
  {
    label: 'Timeline',
    items: [{ text: 'Q2 2025 - Q4 2025', linked: true }],
  },
];

interface CaseStudyBodyProps {
  metadata?: MetadataRow[];
}

export function CaseStudyBody({ metadata = PLACEHOLDER_METADATA }: CaseStudyBodyProps): React.ReactElement {
  return (
    <div className="flex flex-col gap-[8px] items-start w-full">
      {metadata.map((row) => (
        <div key={row.label} className="flex gap-[4px] items-start flex-wrap w-full">
          <span className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary opacity-60 shrink-0">
            {row.label}
          </span>
          {row.items.map((item) =>
            item.linked ? (
              <LinkedText
                key={item.text}
                className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary shrink-0"
              >
                {item.text}
              </LinkedText>
            ) : (
              <span
                key={item.text}
                className="font-figtree font-medium text-[15px] leading-[1.5] text-text-primary shrink-0"
              >
                {item.text}
              </span>
            )
          )}
        </div>
      ))}
    </div>
  );
}
