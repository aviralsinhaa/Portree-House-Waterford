import { useState, useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function DayAtMambegChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLineRef = useRef<HTMLSpanElement>(null);
  const imageFrameRef = useRef<HTMLDivElement>(null);
  const milestonesContainerRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const timeline = mambegConfig.dayPace;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mediaQuery.matches;

    const ctx = gsap.context(() => {
      // 1. Line-masked headline entrance
      if (!isReduced && headlineLineRef.current) {
        gsap.fromTo(
          headlineLineRef.current,
          { yPercent: 115 },
          {
            yPercent: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }

      // 2. Desktop Scroll-Driven Milestone Detection (Syncing sticky image)
      const isDesktop = window.innerWidth >= 1024;
      if (isDesktop && milestonesContainerRef.current) {
        const milestones = milestonesContainerRef.current.querySelectorAll('.story-milestone-step');

        milestones.forEach((step, idx) => {
          ScrollTrigger.create({
            trigger: step,
            start: 'top 52%',
            end: 'bottom 52%',
            onEnter: () => setActiveIdx(idx),
            onEnterBack: () => setActiveIdx(idx),
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="day"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 md:py-40 bg-[#f5f2eb] text-[#191c1a]"
      aria-label="A Day at Mambeg"
    >
      <div className="editorial-container">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-24">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3d5642]" />
            <span className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold">
              THE RHYTHM OF STAY · A DAY AT MAMBEG
            </span>
            <div className="h-px bg-[#3d5642]/20 w-24 hidden sm:block" />
          </div>

          <h2 className="font-display-chapter text-[#1e3325] font-normal leading-[1.02]">
            <div className="overflow-hidden">
              <span ref={headlineLineRef} className="inline-block will-change-transform">
                A day in the Scottish countryside.
              </span>
            </div>
          </h2>
          <p className="font-sans text-[16px] sm:text-[17px] text-[#585145] mt-4 leading-[1.68]">
            From soft morning light across Gare Loch to freshly cooked breakfasts and tranquil night stillness, time at Mambeg unfolds at an unhurried, natural pace.
          </p>
        </div>

        {/* Scroll-Driven Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Desktop Sticky Visual Anchor (58% width, 60fps synced transition) */}
          <div className="lg:col-span-7 lg:sticky lg:top-28">
            <div
              ref={imageFrameRef}
              className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-[#ded8cb] shadow-xl"
            >
              {timeline.map((item, idx) => (
                <div
                  key={item.time}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    activeIdx === idx ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <ResponsiveImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover select-none transition-transform duration-1000 ease-out"
                    style={{
                      transform: activeIdx === idx ? 'scale(1.0)' : 'scale(1.04)',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16261b]/90 via-[#16261b]/20 to-transparent pointer-events-none" />

                  {/* Overlaid Large Serif Time Indicator */}
                  <div className="absolute bottom-6 left-6 right-6 z-20 text-[#faf8f4]">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-editorial text-4xl sm:text-5xl font-light text-[#ded8cb]">
                        {item.time}
                      </span>
                      <span className="text-[11px] uppercase tracking-widest text-[#9cb1a1] font-semibold font-sans">
                        · {item.subtitle}
                      </span>
                    </div>
                    <span className="font-editorial text-2xl sm:text-3xl font-normal block leading-tight text-white">
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Time Jump Strip */}
            <div className="hidden lg:flex items-center justify-between gap-2 mt-4 pt-4 border-t border-[#191c1a]/10">
              {timeline.map((item, idx) => (
                <button
                  key={item.time}
                  onClick={() => {
                    setActiveIdx(idx);
                    const el = document.getElementById(`milestone-${idx}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  className={`px-4 py-2 rounded-full text-[13px] font-sans font-medium transition-all duration-200 cursor-pointer ${
                    activeIdx === idx
                      ? 'bg-[#1e3325] text-[#faf8f4] shadow-xs'
                      : 'text-[#585145] hover:text-[#1e3325] hover:bg-white/60'
                  }`}
                >
                  {item.time}
                </button>
              ))}
            </div>
          </div>

          {/* Right Editorial Story Chapters (De-SaaS: Minimal blocks, NO rounded cards) */}
          <div
            ref={milestonesContainerRef}
            className="lg:col-span-5 relative pl-6 sm:pl-8 border-l border-[#191c1a]/15 space-y-16 sm:space-y-24 lg:py-6"
          >
            {timeline.map((item, idx) => {
              const isActive = activeIdx === idx;
              return (
                <div
                  key={item.time}
                  id={`milestone-${idx}`}
                  onClick={() => setActiveIdx(idx)}
                  className={`story-milestone-step space-y-3 cursor-pointer transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-45 hover:opacity-80'
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-editorial text-3xl sm:text-4xl text-[#3d5642] font-light">
                      {item.time}
                    </span>
                    <span className="text-[12px] uppercase tracking-widest text-[#5c7562] font-semibold font-sans">
                      {item.subtitle}
                    </span>
                  </div>

                  <h3 className="font-editorial text-2xl sm:text-3xl text-[#1e3325] font-semibold leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-[15px] sm:text-[16px] text-[#3c443f] leading-[1.68] font-sans">
                    {item.description}
                  </p>

                  {/* Mobile Inline Image Preview */}
                  <div className="mt-4 lg:hidden aspect-[16/10] rounded-xl overflow-hidden bg-[#ded8cb] shadow-sm">
                    <ResponsiveImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
