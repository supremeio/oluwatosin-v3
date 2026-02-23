import Image from 'next/image';

export function ArrowTopRightIcon(): React.ReactElement {
  return (
    <Image
      src="/Arrow icon.svg"
      alt=""
      width={16}
      height={16}
      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
    />
  );
}
