import { ChatbotWidget } from '@/components/ChatbotWidget';
import { FloatingNav } from '@/components/FloatingNav';
import { ChatbotProvider } from '@/providers/ChatbotProvider';
import { TopActions } from '@/components/TopActions';
import { Footer } from '@/components/Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  /** Content rendered before `<main>`, outside the centered column (e.g. home page header) */
  beforeMain?: React.ReactNode;
}

export function PageLayout({ children, beforeMain }: PageLayoutProps): React.ReactElement {
  return (
    <div className="relative min-h-screen bg-bg-main">
      {beforeMain}
      <TopActions />

      <main className="relative z-10 w-[580px] mx-auto pt-[40px] pb-[120px]">
        {children}

        <div className="mt-[40px]">
          <Footer />
        </div>
      </main>

      <ChatbotProvider>
        <FloatingNav />
        <ChatbotWidget />
      </ChatbotProvider>
    </div>
  );
}
