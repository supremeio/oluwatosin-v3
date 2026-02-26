'use client';

import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';

interface ChatbotContextValue {
  isChatOpen: boolean;
  openChat: (rect?: DOMRect) => void;
  closeChat: () => void;
  toggleChat: (rect?: DOMRect) => void;
  /** Bounding rect of the button that launched the chat (for dock animation) */
  originRect: DOMRect | null;
}

const ChatbotContext = createContext<ChatbotContextValue>({
  isChatOpen: false,
  openChat: () => { },
  closeChat: () => { },
  toggleChat: () => { },
  originRect: null,
});

export function ChatbotProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const originRectRef = useRef<DOMRect | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const openChat = useCallback((rect?: DOMRect) => {
    if (rect) {
      originRectRef.current = rect;
      setOriginRect(rect);
    }
    setIsChatOpen(true);
  }, []);

  const closeChat = useCallback(() => setIsChatOpen(false), []);

  const toggleChat = useCallback((rect?: DOMRect) => {
    setIsChatOpen((prev) => {
      if (!prev && rect) {
        originRectRef.current = rect;
        setOriginRect(rect);
      }
      return !prev;
    });
  }, []);

  return (
    <ChatbotContext.Provider value={{ isChatOpen, openChat, closeChat, toggleChat, originRect }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbotContext(): ChatbotContextValue {
  return useContext(ChatbotContext);
}
