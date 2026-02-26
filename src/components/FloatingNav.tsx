'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useChatbotContext } from '@/providers/ChatbotProvider';
import { useTheme } from '@/components/ThemeProvider';

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

const PILL_SPRING = { type: 'spring' as const, stiffness: 280, damping: 22, mass: 0.8 };

export function FloatingNav(): React.ReactElement {
  const { isChatOpen, toggleChat, closeChat } = useChatbotContext();
  const { theme } = useTheme();
  const pathname = usePathname();
  const [pendingLabel, setPendingLabel] = useState<string | null>(null);

  // Once pathname catches up to the pending destination, clear it
  useEffect(() => {
    if (pendingLabel && ROUTE_TO_LABEL[pathname] === pendingLabel) {
      setPendingLabel(null);
    }
  }, [pathname, pendingLabel]);

  const currentPageLabel = pendingLabel ?? ROUTE_TO_LABEL[pathname] ?? 'Home';

  return (
    <nav
      className={`fixed bottom-[24px] left-0 right-0 z-50 justify-center pointer-events-none ${isChatOpen ? 'hidden md:flex' : 'flex'
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

          const content = (
            <>
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-[40px] bg-bg-on-colour"
                  transition={PILL_SPRING}
                />
              )}
              <Image
                src={isActive ? item.activeIcon : item.inactiveIcon}
                alt=""
                width={24}
                height={24}
                className={`relative z-10${isActive && theme === 'dark' ? ' invert' : ''}`}
              />
            </>
          );

          return (
            <div
              key={item.label}
              className="bg-bg-secondary flex items-center p-[2px] rounded-[40px] shrink-0 relative"
              style={{ zIndex: 6 - i }}
            >
              {hasRoute ? (
                <Link
                  href={item.href}
                  onClick={() => { closeChat(); setPendingLabel(item.label); }}
                  className="relative flex items-center justify-center p-[16px] rounded-[40px] bg-bg-main"
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {content}
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={item.label === 'Chatbot' ? (e: React.MouseEvent<HTMLButtonElement>) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    toggleChat(rect);
                  } : undefined}
                  className="relative flex items-center justify-center p-[16px] rounded-[40px] bg-bg-main"
                  aria-label={item.label}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {content}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
