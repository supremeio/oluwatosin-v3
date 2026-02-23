interface LinkedTextProps {
  children: React.ReactNode;
  as?: 'span' | 'button';
  onClick?: () => void;
  className?: string;
}

export function LinkedText({
  children,
  as: Tag = 'span',
  onClick,
  className = '',
}: LinkedTextProps): React.ReactElement {
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      onClick={onClick}
      className={`border-b-[0.5px] border-dashed border-border-active pb-[2px] cursor-pointer ${className}`}
    >
      {children}
    </Tag>
  );
}
