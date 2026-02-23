'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useChatbotContext } from '@/providers/ChatbotProvider';

const NAV_ITEMS = [
  { label: 'Home', href: '/', activeIcon: '/icons/home-active.svg', inactiveIcon: '/icons/home-inactive.svg' },
  { label: 'Development', href: '/development', activeIcon: '/icons/development-active.svg', inactiveIcon: '/icons/development-inactive.svg' },
  { label: 'About', href: '/about', activeIcon: '/icons/about-active.svg', inactiveIcon: '/icons/about-inactive.svg' },
  { label: 'Chatbot', href: '#', activeIcon: '/icons/chatbot-active.svg', inactiveIcon: '/icons/chatbot-inactive.svg' },
  { label: 'Resources', href: '/resources', activeIcon: '/icons/resources-active.svg', inactiveIcon: '/icons/resources-inactive.svg' },
] as const;

const ROUTE_TO_LABEL: Record<string, string> = {
  '/': 'Home',
  '/development': 'Development',
  '/about': 'About',
  '/resources': 'Resources',
};

export function FloatingNav(): React.ReactElement {
  const { isChatOpen, toggleChat, closeChat } = useChatbotContext();
  const pathname = usePathname();
  const currentPageLabel = ROUTE_TO_LABEL[pathname] ?? 'Home';

  return (
    <nav
      className={`fixed bottom-[24px] left-0 right-0 z-50 justify-center pointer-events-none ${
        isChatOpen ? 'hidden md:flex' : 'flex'
      }`}
      aria-label="Main navigation"
    >
      <div className="relative flex gap-[2px] items-center rounded-[16px] pointer-events-auto">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[299px] h-[40px] bg-bg-secondary rounded-[40px] z-[1]" />

        {NAV_ITEMS.map((item, i) => {
          const isActive = isChatOpen
            ? item.label === 'Chatbot'
            : item.label === currentPageLabel;

          const hasRoute = item.href !== '#';

          return (
            <div
              key={item.label}
              className="bg-bg-secondary flex items-center p-[2px] rounded-[40px] shrink-0 relative"
              style={{ zIndex: 6 - i }}
            >
              {hasRoute ? (
                <Link
                  href={item.href}
                  onClick={closeChat}
                  className={`flex items-center justify-center p-[16px] rounded-[40px] ${
                    isActive ? 'bg-bg-on-colour' : 'bg-bg-main'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Image
                    src={isActive ? item.activeIcon : item.inactiveIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.label === 'Chatbot' ? toggleChat : undefined}
                  className={`flex items-center justify-center p-[16px] rounded-[40px] ${
                    isActive ? 'bg-bg-on-colour' : 'bg-bg-main'
                  }`}
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Image
                    src={isActive ? item.activeIcon : item.inactiveIcon}
                    alt=""
                    width={24}
                    height={24}
                  />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
