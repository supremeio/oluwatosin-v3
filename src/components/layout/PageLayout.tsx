import { ChatbotWidget } from '@/components/ChatbotWidget';
import { FloatingNav } from '@/components/FloatingNav';
import { ChatbotProvider } from '@/providers/ChatbotProvider';
import { TopActions } from '@/components/TopActions';
import { Footer } from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  /** Content rendered before `<main>`, outside the centered column (e.g. home page header) */
  beforeMain?: React.ReactNode;
  /** Hide the floating bottom navigation */
  hideNav?: boolean;
}

export function PageLayout({ children, beforeMain, hideNav }: PageLayoutProps): React.ReactElement {
  return (
    <div className="relative min-h-screen bg-bg-main overflow-x-hidden">
      {beforeMain}
      <TopActions />

      <main className="relative z-10 w-full px-[24px] md:w-[580px] md:px-0 mx-auto pt-[40px] pb-[120px]">
        {children}

        <div className="mt-[40px]">
          <Footer />
        </div>
      </main>

      <ChatbotProvider>
        {!hideNav && <FloatingNav />}
        <ChatbotWidget />
      </ChatbotProvider>
    </div>
  );
}
