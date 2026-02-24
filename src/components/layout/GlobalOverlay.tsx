'use client';

import { usePathname } from 'next/navigation';
import { CanvasParticleBackground } from '@/components/ui/CanvasParticleBackground';
import { ChatbotWidget } from '@/components/ChatbotWidget';
import { FloatingNav } from '@/components/FloatingNav';
import { ChatbotProvider } from '@/providers/ChatbotProvider';

const HIDE_NAV_PATHS = ['/colophon'];

export function GlobalOverlay(): React.ReactElement {
  const pathname = usePathname();
  const hideNav = HIDE_NAV_PATHS.includes(pathname);

  return (
    <>
      <CanvasParticleBackground />
      <ChatbotProvider>
        {!hideNav && <FloatingNav />}
        <ChatbotWidget />
      </ChatbotProvider>
    </>
  );
}
