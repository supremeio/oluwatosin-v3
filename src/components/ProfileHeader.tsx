import { LinkedText } from '@/components/ui/LinkedText';

export function ProfileHeader(): React.ReactElement {
  return (
    <header className="flex flex-col gap-[4px] items-start">
      <h1 className="font-sora font-medium text-[16px] leading-[24px] uppercase text-text-primary">
        Oluwatosin Kazeem
      </h1>
      <p className="font-figtree font-normal text-[12px] leading-[18px] uppercase text-text-secondary">
        PRODUCT DESIGNER
      </p>
      <p className="font-figtree font-normal text-[12px] leading-[18px] uppercase text-text-secondary">
        PORTFOLIO &apos;26
      </p>
      <LinkedText as="button" className="font-sora font-normal text-[12px] leading-normal uppercase text-text-primary">
        portfolio history
      </LinkedText>
    </header>
  );
}
