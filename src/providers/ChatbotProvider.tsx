'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ChatbotContextValue {
  isChatOpen: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
}

const ChatbotContext = createContext<ChatbotContextValue>({
  isChatOpen: false,
  openChat: () => {},
  closeChat: () => {},
  toggleChat: () => {},
});

export function ChatbotProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const openChat = useCallback(() => setIsChatOpen(true), []);
  const closeChat = useCallback(() => setIsChatOpen(false), []);
  const toggleChat = useCallback(() => setIsChatOpen((prev) => !prev), []);

  return (
    <ChatbotContext.Provider value={{ isChatOpen, openChat, closeChat, toggleChat }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbotContext(): ChatbotContextValue {
  return useContext(ChatbotContext);
}
