'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useChatbotContext } from '@/providers/ChatbotProvider';

const TAGS = ['Instant responses', '6 major projects', '5+ years experience'] as const;
const POPULAR_QUESTION = "What's your experience with design system?";
const POPULAR_OPTIONS = [
  'Tell me about your fintech projects.',
  'How do you approach design engineering?',
  "What developer tools have you designed?",
] as const;
const AI_GREETING = [
  "Hi! I'm your AI assistant with instant answers about Oluwatosin's work.",
  'Got just 5 minutes? Ask me anything.',
];

type ChatbotState = 'default' | 'chat' | 'menu' | 'replied';

function CloseIcon(): React.ReactElement {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M8 2v12M4 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronDownIcon(): React.ReactElement {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DarkHeader({ onClose }: { onClose: () => void }): React.ReactElement {
  return (
    <div className="w-full flex items-start justify-between self-stretch rounded-t-[32px] pt-[24px] px-[24px] pb-[48px] -mb-[32px] shrink-0 relative bg-bg-on-colour">
      <div className="flex-[1_0_0] flex flex-col gap-[8px] items-start justify-center min-w-0 relative">
        <div className="shrink-0 w-[32px] h-[32px] relative">
          <Image src="/icons/ai-glowing-icon.svg" alt="" fill className="object-contain" />
        </div>
        <div className="flex flex-col items-start w-full shrink-0 text-text-on-colour">
          <p
            className="font-figtree font-semibold text-[16px] leading-[24px] tracking-[0.16px] w-full"
            style={{ fontFeatureSettings: "'salt' 1" }}
          >
            Quick answer AI
          </p>
          <p
            className="font-figtree font-medium text-[14px] leading-[18px] tracking-[0.14px] opacity-80 w-full"
            style={{ fontFeatureSettings: "'salt' 1, 'lnum' 1, 'tnum' 1" }}
          >
            I have instant access to Oluwatosin&apos;s projects, skills, and experience.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="w-[32px] h-[32px] rounded-[100px] flex items-center justify-center shrink-0 bg-bg-secondary text-text-primary"
        aria-label="Close"
      >
        <CloseIcon />
      </button>
    </div>
  );
}

function TagsRow(): React.ReactElement {
  return (
    <div className="flex flex-col items-start w-full shrink-0 relative">
      <div className="content-center flex flex-wrap gap-[8px] items-center w-full shrink-0 relative">
        {TAGS.map((tag) => (
          <div
            key={tag}
            className="flex items-center px-[16px] py-[8px] rounded-[8px] shrink-0 relative bg-bg-tertiary"
          >
            <p className="font-figtree font-medium text-[14px] leading-[20px] shrink-0 relative text-text-secondary">
              {tag}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChatbotDefault({ onExpand }: { onExpand: () => void }): React.ReactElement {
  return (
    <div
      className="bg-bg-on-colour rounded-[32px] p-[24px] flex items-start gap-[8px] w-[342px] md:w-full cursor-pointer"
      onClick={onExpand}
      onKeyDown={(e) => e.key === 'Enter' && onExpand()}
      role="button"
      tabIndex={0}
      aria-label="Open Quick answer AI"
    >
      <div className="flex-1 flex flex-col gap-[8px] items-start min-w-0">
        <Image src="/icons/ai-glowing-icon.svg" alt="" width={32} height={32} className="shrink-0" />
        <div className="flex flex-col items-start w-full text-text-on-colour">
          <p className="font-figtree font-semibold text-[16px] leading-[24px] tracking-[0.16px]">
            Quick answer AI
          </p>
          <p className="font-figtree font-medium text-[14px] leading-[18px] tracking-[0.14px] opacity-80">
            I have instant access to Oluwatosin&apos;s projects, skills, and experience.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChatbotHover({ onStartChat, onClose }: { onStartChat: () => void; onClose: () => void }): React.ReactElement {
  return (
    <div className="w-[calc(100vw-48px)] md:w-full flex flex-col items-start pb-[32px] relative">
      <DarkHeader onClose={onClose} />
      {/* Second card: white bg (bg-main #FFF) */}
      <div className="w-full rounded-[32px] p-[24px] flex flex-col items-start gap-[40px] self-stretch -mb-[32px] shrink-0 relative bg-bg-main">
        <TagsRow />
        <div className="flex flex-col gap-[24px] items-start w-full shrink-0 relative">
          <p className="font-figtree font-medium text-[15px] leading-[20px] w-full shrink-0 relative text-text-primary">
            Perfect for busy recruiters - get answers in seconds!
          </p>
          <div className="flex items-center shrink-0 relative">
            <button
              type="button"
              onClick={onStartChat}
              className="flex items-center justify-center pb-[4px] shrink-0 relative border-b-[0.5px] border-dashed border-border-active"
            >
              <p className="font-figtree font-medium text-[15px] leading-normal shrink-0 relative text-text-primary">
                Ask me anything
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatbotChat({
  state,
  onClose,
  onCloseMenu,
  onOpenMenu,
  onSelectQuestion,
  onSendUserMessage,
}: {
  state: 'chat' | 'menu' | 'replied';
  onClose: () => void;
  onCloseMenu: () => void;
  onOpenMenu: () => void;
  onSelectQuestion: (q: string) => void;
  onSendUserMessage: (q: string) => void;
}): React.ReactElement {
  const [input, setInput] = useState('');

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (text) {
      onSendUserMessage(text);
      setInput('');
    }
  }, [input, onSendUserMessage]);

  return (
    <div className="w-full h-full flex flex-col items-start md:pb-[32px] relative">
      <DarkHeader onClose={onClose} />
      <div className="w-full rounded-[32px] p-[24px] flex flex-col items-start justify-between -mb-[32px] relative bg-bg-main flex-1 md:flex-none md:h-[574px] min-h-0 overflow-y-auto">
        {/* Top: tags + messages */}
        <div className="flex flex-col gap-[24px] items-start w-full shrink-0 relative">
          <TagsRow />
          {/* Messages */}
          <div className="flex flex-col items-start w-full shrink-0 relative">
            <div className="flex gap-[8px] items-start pt-[8px] w-full shrink-0 relative">
              <div className="shrink-0 w-[32px] h-[32px] relative">
                <Image src="/icons/ai-glowing-icon.svg" alt="" fill className="object-contain" />
              </div>
              <div className="flex-[1_0_0] flex flex-col items-start justify-center min-w-0 relative">
                <div className="flex flex-col gap-[4px] items-start w-full shrink-0 relative">
                  {/* First bubble */}
                  <div className="flex items-center justify-center p-[8px] rounded-tr-[20px] rounded-br-[20px] rounded-tl-[16px] w-full shrink-0 relative bg-bg-tertiary" style={{ height: 56 }}>
                    <p
                      className="flex-[1_0_0] font-figtree font-medium text-[14px] leading-[1.45] tracking-[0.14px] min-w-0 relative text-text-primary"
                      style={{ fontFeatureSettings: "'salt' 1, 'lnum' 1, 'tnum' 1" }}
                    >
                      {AI_GREETING[0]}
                    </p>
                  </div>
                  {/* Second bubble */}
                  <div className="flex items-center justify-center p-[8px] rounded-tr-[20px] rounded-br-[20px] w-full shrink-0 relative bg-bg-tertiary">
                    <p
                      className="flex-[1_0_0] font-figtree font-medium text-[14px] leading-[1.45] tracking-[0.14px] min-w-0 relative text-text-primary"
                      style={{ fontFeatureSettings: "'salt' 1, 'lnum' 1, 'tnum' 1" }}
                    >
                      {AI_GREETING[1]}
                    </p>
                  </div>
                  {/* Third bubble: popular questions */}
                  <div className="flex flex-col gap-[10px] items-center justify-center p-[8px] rounded-tr-[20px] rounded-br-[20px] rounded-bl-[20px] w-full shrink-0 relative bg-bg-tertiary">
                    <p
                      className="font-figtree font-normal text-[12px] leading-[19.2px] uppercase w-full shrink-0 relative text-text-secondary"
                      style={{ fontFeatureSettings: "'salt' 1" }}
                    >
                      Popular questions
                    </p>
                    <button
                      type="button"
                      onClick={state === 'menu' ? onCloseMenu : onOpenMenu}
                      className="flex gap-[10px] items-start justify-center w-full shrink-0 relative text-left"
                    >
                      <p
                        className="flex-[1_0_0] font-figtree font-medium text-[14px] leading-[1.45] tracking-[0.14px] min-w-0 relative text-text-primary"
                        style={{ fontFeatureSettings: "'salt' 1, 'lnum' 1, 'tnum' 1" }}
                      >
                        {POPULAR_QUESTION}
                      </p>
                      <div className="shrink-0 w-[32px] h-[32px] rounded-full flex items-center justify-center bg-bg-main text-icon-active">
                        <ChevronDownIcon />
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* User reply */}
          {state === 'replied' && (
            <div className="flex gap-[8px] items-start pt-[8px] w-full shrink-0 relative">
              <div className="flex-[1_0_0] flex flex-col items-start justify-center min-w-0 relative">
                <div className="content-center flex flex-wrap items-center justify-end w-full shrink-0 relative">
                  <div className="flex-[1_0_0] flex flex-wrap items-center justify-center min-w-0 px-[16px] py-[8px] rounded-tl-[20px] rounded-bl-[20px] rounded-br-[20px] relative bg-bg-on-colour">
                    <p
                      className="flex-[1_0_0] font-figtree font-medium text-[14px] leading-[1.45] tracking-[0.14px] min-w-0 relative text-text-on-colour"
                      style={{ fontFeatureSettings: "'salt' 1, 'lnum' 1, 'tnum' 1" }}
                    >
                      {POPULAR_QUESTION}
                    </p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 w-[32px] h-[32px] rounded-full overflow-hidden relative">
                <Image src="/User avatar.png" alt="User" fill className="object-cover" />
              </div>
            </div>
          )}
        </div>
        {/* Footer input */}
        <div className="flex gap-[16px] items-center p-[16px] rounded-[12px] w-full shrink-0 relative bg-bg-main border-[0.5px] border-solid border-border-primary">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about experience, projects, design systems, availability..."
            rows={2}
            className="flex-[1_0_0] min-w-0 font-figtree font-medium text-[14px] leading-[24px] text-text-primary placeholder:text-text-secondary bg-transparent border-none outline-none resize-none"
            style={{ fontFeatureSettings: "'salt' 1" }}
          />
          <div className="shrink-0 w-[40px] h-[40px] relative self-end">
            <button
              type="button"
              onClick={handleSend}
              className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-bg-on-colour text-text-on-colour"
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </div>
        </div>
      </div>
      {/* Menu: local overlay + dropdown, scoped to chatbot widget only */}
      {state === 'menu' && (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={onCloseMenu}
            onKeyDown={(e) => e.key === 'Escape' && onCloseMenu()}
            className="absolute inset-0 rounded-[32px] z-10 bg-overlay-local"
            aria-label="Close menu"
          />
          <div
            className="absolute left-[24px] right-[24px] md:left-[35px] md:right-auto md:w-[287px] top-[160px] rounded-[16px] p-[16px] flex flex-col gap-[4px] z-20 backdrop-blur-[2px] bg-bg-secondary"
            onClick={(e) => e.stopPropagation()}
          >
            {[POPULAR_QUESTION, ...POPULAR_OPTIONS].map((opt, i) => (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onSelectQuestion(opt);
                  onSendUserMessage(opt);
                }}
                className={`w-full text-left font-figtree font-medium text-[14px] leading-[1.45] tracking-[0.14px] p-[8px] rounded-[8px] ${
                  i === 1 ? 'bg-bg-main text-text-primary' : 'bg-bg-secondary text-text-secondary'
                }`}
                style={{ fontFeatureSettings: "'salt' 1, 'lnum' 1, 'tnum' 1" }}
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function ChatbotWidget(): React.ReactElement {
  const [state, setState] = useState<ChatbotState>('default');
  const [isHovering, setIsHovering] = useState(false);
  const { isChatOpen, openChat, closeChat } = useChatbotContext();

  const showExpanded = isHovering && state === 'default';
  const showChat = state === 'chat' || state === 'menu' || state === 'replied';

  useEffect(() => {
    if (isChatOpen) {
      setState('chat');
    } else {
      setState('default');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatOpen]);

  useEffect(() => {
    if (showChat) {
      openChat();
    } else {
      closeChat();
    }
  }, [showChat, openChat, closeChat]);

  const handleClose = useCallback(() => setState('default'), []);
  const handleStartChat = useCallback(() => setState('chat'), []);
  const handleOpenMenu = useCallback(() => setState('menu'), []);
  const handleCloseMenu = useCallback(() => setState('chat'), []);
  const handleSelectQuestion = useCallback(() => setState('replied'), []);
  const handleSendUserMessage = useCallback(() => setState('replied'), []);

  return (
    <>
      {(showExpanded || showChat) && (
        <div
          className="fixed inset-0 z-20 bg-overlay-page"
          aria-hidden
        />
      )}
      <aside
        className={`fixed z-30 pointer-events-none ${
          showChat
            ? 'inset-0 md:inset-auto md:bottom-[40px] md:left-[16px] md:w-[min(440px,calc(50vw_-_346px))]'
            : 'bottom-[24px] left-[24px] md:bottom-[40px] md:left-[16px] md:w-[min(440px,calc(50vw_-_346px))] hidden md:block'
        }`}
        aria-label="Quick answer AI"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="pointer-events-auto h-full md:h-auto">
          {showChat && (
            <ChatbotChat
              state={state}
              onClose={handleClose}
              onCloseMenu={handleCloseMenu}
              onOpenMenu={handleOpenMenu}
              onSelectQuestion={handleSelectQuestion}
              onSendUserMessage={handleSendUserMessage}
            />
          )}
          {!showChat && showExpanded && (
            <ChatbotHover onStartChat={handleStartChat} onClose={handleClose} />
          )}
          {!showChat && !showExpanded && (
            <ChatbotDefault onExpand={handleStartChat} />
          )}
        </div>
      </aside>
    </>
  );
}
