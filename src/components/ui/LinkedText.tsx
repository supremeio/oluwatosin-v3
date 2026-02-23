import Link from 'next/link';

interface LinkedTextProps {
  children: React.ReactNode;
  as?: 'span' | 'button';
  href?: string;
  onClick?: () => void;
  className?: string;
}

export function LinkedText({
  children,
  as: Tag = 'span',
  href,
  onClick,
  className = '',
}: LinkedTextProps): React.ReactElement {
  const classes = `border-b-[0.5px] border-dashed border-border-active pb-[2px] cursor-pointer ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      onClick={onClick}
      className={classes}
    >
      {children}
    </Tag>
  );
}
