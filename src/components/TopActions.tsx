import { IconButton } from '@/components/ui/IconButton';

function MoonIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13.36 9.7a5.5 5.5 0 01-7.06-7.06A5.5 5.5 0 1013.36 9.7z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TopActions(): React.ReactElement {
  return (
    <div className="absolute top-[24px] right-[24px] md:fixed md:top-[40px] md:right-[40px] z-10 flex gap-[8px] items-center">
      <IconButton label="Text size">
        <span className="font-figtree font-medium text-[14px] leading-[20px]">1x</span>
      </IconButton>
      <IconButton label="Toggle theme">
        <MoonIcon />
      </IconButton>
    </div>
  );
}
