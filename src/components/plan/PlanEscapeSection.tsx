import { useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { Phone, Mail, MapPin, MessageSquare, ArrowRight } from 'lucide-react';
import { useScrollMotion } from '../../hooks/useScrollMotion';
import gsap from 'gsap';

interface PlanEscapeSectionProps {
  onOpenStayAssistant: (prompt?: string) => void;
  onOpenBooking: () => void;
}

export function PlanEscapeSection({
  onOpenStayAssistant,
  onOpenBooking,
}: PlanEscapeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const contentColRef = useRef<HTMLDivElement>(null);
  const contactColRef = useRef<HTMLDivElement>(null);

  useScrollMotion(sectionRef, (_ctx, isReducedMotion) => {
    if (isReducedMotion || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    const lines = [headlineLine1Ref.current, headlineLine2Ref.current].filter(Boolean);
    if (lines.length > 0) {
      tl.fromTo(
        lines,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
        0
      );
    }

    if (contentColRef.current) {
      tl.fromTo(
        contentColRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.2
      );
    }

    if (contactColRef.current) {
      tl.fromTo(
        contactColRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.3
      );
    }
  });

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full py-28 sm:py-36 md:py-44 bg-[#142218] text-[#faf8f4] overflow-hidden"
      aria-label="Plan Your Stay"
    >
      {/* Huge subtle typographic watermark background */}
      <div
        aria-hidden="true"
        className="absolute -bottom-10 right-4 sm:right-10 pointer-events-none select-none font-editorial text-[140px] sm:text-[220px] md:text-[280px] font-semibold text-white/[0.03] leading-none tracking-tighter"
      >
        MAMBEG
      </div>

      <div className="editorial-container relative z-10">
        {/* Architectural Header */}
        <div className="max-w-4xl mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#9cb1a1]" />
            <span className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#9cb1a1] font-semibold">
              CHAPTER VI · RESERVATIONS & VISITING
            </span>
          </div>

          <h2 className="font-display-chapter text-[#fdfcf9] font-normal leading-[1.02]">
            <div className="overflow-hidden">
              <span ref={headlineLine1Ref} className="inline-block will-change-transform">
                Come away to the Scottish
              </span>
            </div>
            <div className="overflow-hidden">
              <span
                ref={headlineLine2Ref}
                className="inline-block will-change-transform font-serif italic text-[#ded8cb]"
              >
                countryside & loch shore.
              </span>
            </div>
          </h2>
        </div>

        {/* Full-bleed Architectural Layout (No Giant SaaS Card) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start border-t border-white/15 pt-12 sm:pt-16">
          {/* Narrative & Action Side */}
          <div ref={contentColRef} className="lg:col-span-7 space-y-8">
            <p className="font-sans text-[17px] sm:text-[18px] text-[#ded8cb] leading-[1.72] max-w-xl">
              Whether you are seeking quiet rest along the shores of Gare Loch, hiking the Arrochar Alps, or travelling along the world-renowned West Highland railway line, Mambeg offers attentive personal hospitality and comfortable en-suite accommodation.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                data-cursor="ENQUIRE"
                className="btn-primary bg-[#faf8f4] hover:bg-[#eae3d5] text-[#1e3325] text-[14px] py-4 px-8"
              >
                <span>Prepare Stay Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenStayAssistant('Tell me about the rooms')}
                data-cursor="ASSISTANT"
                className="btn-secondary text-[#faf8f4] border-white/35 hover:border-white hover:bg-white/10 text-[14px] py-4 px-7"
              >
                <MessageSquare className="w-4 h-4 text-[#9cb1a1]" />
                <span>Ask Stay Assistant</span>
              </button>
            </div>
          </div>

          {/* Architectural Contact Column */}
          <div ref={contactColRef} className="lg:col-span-5 space-y-8 border-t lg:border-t-0 lg:border-l border-white/15 pt-8 lg:pt-0 lg:pl-12">
            <div>
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#9cb1a1] font-semibold block font-sans mb-1">
                Direct Host Contact
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Host David · Mambeg House
              </h3>
            </div>

            <div className="space-y-5 text-[14.5px] text-[#ded8cb] font-sans">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-4 h-4 text-[#9cb1a1] shrink-0 mt-1" />
                <span className="leading-relaxed">{mambegConfig.address}</span>
              </div>

              <div className="flex items-center gap-3.5">
                <Phone className="w-4 h-4 text-[#9cb1a1] shrink-0" />
                <div>
                  <a
                    href={`tel:${mambegConfig.phone.replace(/\s+/g, '')}`}
                    className="text-[16px] font-semibold text-white hover:text-[#9cb1a1] transition-colors"
                  >
                    {mambegConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <Mail className="w-4 h-4 text-[#9cb1a1] shrink-0" />
                <div>
                  <a
                    href={`mailto:${mambegConfig.email}`}
                    className="text-[15px] font-medium text-white hover:text-[#9cb1a1] transition-colors"
                  >
                    {mambegConfig.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-[12.5px] text-[#9cb1a1] font-sans flex items-center justify-between">
              <span>Check-in from 2:00 PM</span>
              <span className="opacity-40">·</span>
              <span>Check-out by 10:00 AM</span>
              <span className="opacity-40">·</span>
              <span>CCTV Parking</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
