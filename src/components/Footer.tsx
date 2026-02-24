import Link from 'next/link';

function formatBuildDate(isoString: string | undefined): string {
  if (!isoString) return 'Unknown';
  const date = new Date(isoString);
  const parts = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Europe/Amsterdam',
    timeZoneName: 'short',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('month')} ${get('day')}, ${get('year')}, ${get('hour')}:${get('minute')} ${get('dayPeriod')} [${get('timeZoneName')}]`;
}

export function Footer(): React.ReactElement {
  const lastUpdated = formatBuildDate(process.env.NEXT_PUBLIC_BUILD_DATE);

  return (
    <footer className="bg-bg-on-colour rounded-[32px] p-[24px] flex flex-col gap-[40px] items-start text-text-on-colour w-full">
      <div className="font-figtree font-normal text-[12px] uppercase leading-[19.2px] opacity-0 shrink-0 w-full" aria-hidden>
        TOP MOVIES
      </div>
      <div className="flex flex-col gap-[12px] items-start leading-normal shrink-0 w-full">
        <p className="font-kode-mono font-semibold text-[13px] uppercase opacity-60 w-full">
          Last updated: {lastUpdated}
        </p>
        <div className="flex items-center justify-between w-full text-[14px]">
          <p className="font-figtree font-semibold">&copy;2026 Oluwatosin Kazeem</p>
          <Link href="/colophon" className="font-figtree font-medium">Colophon</Link>
        </div>
      </div>
    </footer>
  );
}
