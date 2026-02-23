interface SectionLabelProps {
  children: React.ReactNode;
}

export function SectionLabel({ children }: SectionLabelProps): React.ReactElement {
  return (
    <p className="font-figtree font-normal text-[12px] leading-[19.2px] uppercase text-text-secondary w-full">
      {children}
    </p>
  );
}
