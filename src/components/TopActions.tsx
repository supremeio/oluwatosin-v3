'use client';

import { useTheme } from '@/components/ThemeProvider';
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

function SunIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 1.5V3M8 13v1.5M14.5 8H13M3 8H1.5M12.36 3.64l-1.06 1.06M4.7 11.3l-1.06 1.06M12.36 12.36l-1.06-1.06M4.7 4.7L3.64 3.64"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TopActions(): React.ReactElement {
  const { theme, toggle } = useTheme();

  const handleThemeToggle: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    document.documentElement.style.setProperty('--vt-x', `${rect.left + rect.width / 2}px`);
    document.documentElement.style.setProperty('--vt-y', `${rect.top + rect.height / 2}px`);
    toggle();
  };

  return (
    <div className="absolute top-[24px] right-[24px] md:fixed md:top-[40px] md:right-[40px] z-20 flex gap-[8px] items-center">
      <IconButton label="Text size">
        <span className="font-figtree font-medium text-[14px] leading-[20px]">1x</span>
      </IconButton>
      <IconButton label="Toggle theme" onClick={handleThemeToggle}>
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </IconButton>
    </div>
  );
}
