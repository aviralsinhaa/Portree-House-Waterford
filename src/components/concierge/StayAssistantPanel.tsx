import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, Phone, ArrowRight, Home } from 'lucide-react';
import {
  processAssistantQuery,
  AssistantResponse,
  AssistantAction,
} from '../../data/stayAssistantEngine';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import gsap from 'gsap';

export interface ConciergeHandoffData {
  villaId?: string;
  nights?: number;
  guests?: number;
  notes?: string;
}

export interface StayAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onHandoffToBooking: (data: ConciergeHandoffData) => void;
  initialPrompt?: string;
  contextRoomId?: string;
  contextVillaId?: string;
}

interface DisplayMessage {
  id: string;
  sender: 'user' | 'assistant';
  fullText: string;
  visibleText: string;
  isStreaming?: boolean;
  timestamp: string;
  actions?: AssistantAction[];
}

export function StayAssistantPanel({
  isOpen,
  onClose,
  onHandoffToBooking,
  initialPrompt,
  contextRoomId,
  contextVillaId,
}: StayAssistantPanelProps) {
  const activeRoomId = contextRoomId || contextVillaId;
  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streamTimerRef = useRef<NodeJS.Timeout | null>(null);
  const thinkingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useFocusTrap(panelRef, isOpen, { autoFocusFirst: false });

  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMounted, setIsMounted] = useState(isOpen);

  const [messages, setMessages] = useState<DisplayMessage[]>(() => [
    {
      id: 'welcome-1',
      sender: 'assistant',
      fullText:
        'Hello — planning a stay at Mambeg?\n\nI can help with room options, freshly cooked Scottish breakfast, free parking, dog-friendly stays, travel directions, or preparing an enquiry.',
      visibleText:
        'Hello — planning a stay at Mambeg?\n\nI can help with room options, freshly cooked Scottish breakfast, free parking, dog-friendly stays, travel directions, or preparing an enquiry.',
      timestamp: 'Just now',
      actions: [
        { label: 'Explore rooms', type: 'prompt', prompt: 'What rooms do you have?' },
        { label: 'Cooked breakfast', type: 'prompt', prompt: 'What is included for breakfast?' },
        { label: 'Parking & location', type: 'prompt', prompt: 'Where is Mambeg and is parking free?' },
        { label: 'Dog-friendly policy', type: 'prompt', prompt: 'Can I bring a dog?' },
        { label: 'Prepare enquiry', type: 'booking' },
      ],
    },
  ]);

  const quickChips = [
    'What rooms do you have?',
    'Is breakfast included?',
    'Is parking available?',
    'Can I bring a dog?',
    'Where is Mambeg located?',
    'Can I arrive by train?',
    'What are check-in times?',
    'How do I enquire for dates?',
  ];

  const formatTimestamp = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Restore input focus reliably without causing scrolling
  const restoreFocus = useCallback(() => {
    requestAnimationFrame(() => {
      inputRef.current?.focus({ preventScroll: true });
    });
  }, []);

  // GSAP enter / exit choreography
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      requestAnimationFrame(() => {
        if (panelRef.current) {
          gsap.fromTo(
            panelRef.current,
            { opacity: 0, y: 24, scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.42,
              ease: 'power3.out',
              onComplete: () => {
                restoreFocus();
              },
            }
          );
        }
      });
    } else if (isMounted) {
      if (panelRef.current) {
        gsap.to(panelRef.current, {
          opacity: 0,
          y: 20,
          scale: 0.96,
          duration: 0.28,
          ease: 'power2.in',
          onComplete: () => {
            setIsMounted(false);
          },
        });
      } else {
        setIsMounted(false);
      }
    }
  }, [isOpen, restoreFocus, isMounted]);

  // Clean timers on unmount
  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
      if (thinkingTimerRef.current) clearTimeout(thinkingTimerRef.current);
    };
  }, []);

  // Progressive streaming response
  const streamResponse = useCallback(
    (response: AssistantResponse) => {
      const msgId = `assistant-${Date.now()}`;
      const fullText = response.text;
      let currentIndex = 0;

      // Add empty assistant message container
      setMessages((prev) => [
        ...prev,
        {
          id: msgId,
          sender: 'assistant',
          fullText,
          visibleText: '',
          isStreaming: true,
          timestamp: formatTimestamp(),
        },
      ]);

      setIsStreaming(true);

      // Stream 2-4 chars every 38ms (approx 45-60 chars/second)
      streamTimerRef.current = setInterval(() => {
        currentIndex += 3;
        if (currentIndex >= fullText.length) {
          if (streamTimerRef.current) clearInterval(streamTimerRef.current);
          setMessages((prev) =>
            prev.map((m) =>
              m.id === msgId
                ? {
                    ...m,
                    visibleText: fullText,
                    isStreaming: false,
                    actions: response.actions,
                  }
                : m
            )
          );
          setIsStreaming(false);

          // CRITICAL: Restore input focus immediately after response finishes
          restoreFocus();
        } else {
          const chunk = fullText.slice(0, currentIndex);
          setMessages((prev) =>
            prev.map((m) => (m.id === msgId ? { ...m, visibleText: chunk } : m))
          );
        }
      }, 38);
    },
    [restoreFocus]
  );

  const handleSend = useCallback(
    (textToSend?: string) => {
      const text = (textToSend || input).trim();
      if (!text || isThinking || isStreaming) return;

      const userMsg: DisplayMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        fullText: text,
        visibleText: text,
        timestamp: formatTimestamp(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsThinking(true);

      // Variable thinking time based on query complexity
      const response = processAssistantQuery(text, activeRoomId);
      let thinkingDelay = 950;
      if (response.complexity === 'simple') thinkingDelay = 650;
      else if (response.complexity === 'compound') thinkingDelay = 1350;
      else if (response.complexity === 'unknown') thinkingDelay = 800;

      thinkingTimerRef.current = setTimeout(() => {
        setIsThinking(false);
        streamResponse(response);
      }, thinkingDelay);

      // Keep focus on input even while thinking starts
      restoreFocus();
    },
    [input, isThinking, isStreaming, activeRoomId, streamResponse, restoreFocus]
  );

  const handleActionClick = (action: AssistantAction) => {
    if (action.type === 'booking') {
      onClose();
      onHandoffToBooking({
        villaId: action.roomId,
        guests: action.guests,
        notes: action.notes,
      });
    } else if (action.type === 'phone') {
      window.location.href = 'tel:+441436810136';
    } else if (action.prompt) {
      handleSend(action.prompt);
    }
  };

  useEffect(() => {
    if (initialPrompt && isOpen) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt, isOpen, handleSend]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking, isStreaming]);

  if (!isMounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Mambeg Stay Assistant"
      className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 pointer-events-none flex items-end justify-center sm:block"
    >
      {/* Mobile Backdrop Only (Desktop has no dark overlay so user sees the website) */}
      <div
        className="fixed inset-0 bg-[#16261b]/35 backdrop-blur-2xs sm:hidden pointer-events-auto"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Floating Concierge Panel */}
      <aside
        ref={panelRef}
        className="pointer-events-auto w-[calc(100vw-16px)] sm:w-[480px] md:w-[500px] max-w-[520px] h-[min(82svh,720px)] sm:h-[640px] md:h-[680px] bg-[#faf8f4] text-[#191c1a] rounded-t-2xl sm:rounded-2xl shadow-[0_20px_60px_-15px_rgba(22,38,27,0.35)] border border-[#191c1a]/12 flex flex-col overflow-hidden will-change-transform z-10"
      >
        {/* Header: Editorial serif + clear supporting line (No AI labels) */}
        <div className="px-6 py-4 border-b border-[#191c1a]/10 bg-[#f5f2eb] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1e3325] text-[#faf8f4] flex items-center justify-center shrink-0 shadow-xs">
              <Home className="w-5 h-5 text-[#9cb1a1]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-editorial text-[22px] font-semibold text-[#1e3325] leading-none tracking-tight">
                  Mambeg Stay Assistant
                </h3>
                <span className="w-2 h-2 rounded-full bg-[#3d5642] animate-pulse" />
              </div>
              <p className="text-[13px] text-[#5c7562] font-sans font-medium mt-1">
                Your guide to rooms, stays & Mambeg.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#ded8cb]/60 text-[#191c1a]/70 hover:text-[#191c1a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e3325]"
            aria-label="Close Stay Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-[15.5px] leading-[1.62] no-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] rounded-2xl px-4 py-3 shadow-2xs whitespace-pre-line font-sans ${
                  msg.sender === 'user'
                    ? 'bg-[#1e3325] text-[#faf8f4] rounded-br-xs'
                    : 'bg-[#f5f2eb] text-[#282d2a] border border-[#191c1a]/8 rounded-bl-xs'
                }`}
              >
                {msg.visibleText}
                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 bg-[#1e3325] animate-pulse align-middle" />
                )}
              </div>

              {/* Timestamp */}
              <span className="text-[11px] text-[#718576] mt-1.5 px-1 font-sans">
                {msg.sender === 'user' ? 'You' : 'Mambeg Guide'} · {msg.timestamp}
              </span>

              {/* Action chips attached to message */}
              {msg.actions && msg.actions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5 max-w-[92%]">
                  {msg.actions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(act)}
                      className="inline-flex items-center gap-1.5 text-[12.5px] font-sans font-medium px-3 py-1.5 rounded-full bg-[#1e3325]/8 hover:bg-[#1e3325] text-[#1e3325] hover:text-[#faf8f4] border border-[#1e3325]/15 transition-all shadow-2xs active:scale-95"
                    >
                      {act.type === 'phone' && <Phone className="w-3.5 h-3.5" />}
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Three-Dot Thinking Indicator */}
          {isThinking && (
            <div className="flex flex-col items-start animate-fade-in">
              <div className="bg-[#f5f2eb] border border-[#191c1a]/8 rounded-2xl rounded-bl-xs px-4 py-3 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#1e3325] animate-bounce [animation-delay:-0.3s]" />
                <span className="w-2 h-2 rounded-full bg-[#1e3325] animate-bounce [animation-delay:-0.15s]" />
                <span className="w-2 h-2 rounded-full bg-[#1e3325] animate-bounce" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips Bar */}
        <div className="px-4 py-2.5 border-t border-[#191c1a]/8 bg-[#faf8f4] flex gap-2 overflow-x-auto no-scrollbar shrink-0">
          {quickChips.map((chip) => (
            <button
              key={chip}
              disabled={isThinking || isStreaming}
              onClick={() => {
                handleSend(chip);
                restoreFocus();
              }}
              className="text-[12.5px] whitespace-nowrap px-3 py-1.5 rounded-full bg-[#f5f2eb] hover:bg-[#ded8cb]/70 text-[#1e3325] border border-[#191c1a]/10 transition-colors disabled:opacity-50 shrink-0 font-sans font-medium active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar: Input NEVER disabled, focus preserved */}
        <div className="p-3.5 border-t border-[#191c1a]/10 bg-[#f5f2eb] flex items-center gap-2.5 shrink-0">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about rooms, breakfast, parking, pets..."
            className="flex-1 h-[48px] px-4 text-[15px] rounded-xl bg-[#faf8f4] border border-[#191c1a]/15 text-[#191c1a] placeholder:text-[#191c1a]/45 focus:outline-none focus:border-[#1e3325] focus:ring-1 focus:ring-[#1e3325] transition-all font-sans"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isThinking || isStreaming}
            className="w-[48px] h-[48px] rounded-xl bg-[#1e3325] text-[#faf8f4] hover:bg-[#2a4734] disabled:opacity-40 transition-all shadow-xs flex items-center justify-center active:scale-95 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Direct Booking Fast Action Footer */}
        <div className="px-5 py-2.5 bg-[#eae3d5] text-[12.5px] flex items-center justify-between text-[#1e3325] shrink-0 border-t border-[#191c1a]/8">
          <span className="font-sans font-medium">Ready to confirm dates?</span>
          <button
            onClick={() => {
              onClose();
              onHandoffToBooking({});
            }}
            className="font-semibold text-[#1e3325] hover:underline inline-flex items-center gap-1.5 group font-sans"
          >
            <span>Prepare Stay Enquiry</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </aside>
    </div>
  );
}
