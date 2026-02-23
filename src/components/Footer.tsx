export function Footer(): React.ReactElement {
  return (
    <footer className="bg-bg-on-colour rounded-[32px] p-[24px] flex flex-col gap-[40px] items-start text-text-on-colour h-[154px] w-[580px]">
      <div className="font-figtree font-normal text-[12px] uppercase leading-[19.2px] opacity-0 shrink-0 w-full" aria-hidden>
        TOP MOVIES
      </div>
      <div className="flex flex-col gap-[12px] items-start leading-normal shrink-0 w-full">
        <p className="font-kode-mono font-semibold text-[13px] uppercase opacity-60 w-full">
          Last updated: Dec 27, 2025, 10:33 AM [CET]
        </p>
        <div className="flex items-center justify-between w-full text-[14px]">
          <p className="font-figtree font-semibold">&copy;2026 Oluwatosin Kazeem</p>
          <p className="font-figtree font-medium">Colophon</p>
        </div>
      </div>
    </footer>
  );
}
