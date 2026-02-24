interface IconButtonProps {
  children: React.ReactNode;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export function IconButton({ children, label, onClick }: IconButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative w-[40px] h-[40px]"
      aria-label={label}
    >
      <div className="w-[40px] h-[40px] rounded-full bg-bg-secondary" />
      <span className="absolute inset-0 flex items-center justify-center text-text-primary">
        {children}
      </span>
    </button>
  );
}
