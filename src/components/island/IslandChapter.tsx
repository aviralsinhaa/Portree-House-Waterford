import { useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { MAMBEG_MEDIA } from '../../data/mediaAssets';
import { ArrowRight } from 'lucide-react';
import { useScrollMotion } from '../../hooks/useScrollMotion';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import gsap from 'gsap';

interface IslandChapterProps {
  onNavigateToStay: () => void;
  onOpenBreakfast: () => void;
  onOpenExplore: () => void;
}

export function IslandChapter({ onNavigateToStay, onOpenBreakfast }: IslandChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const chapterDotRef = useRef<HTMLSpanElement>(null);
  const chapterTextRef = useRef<HTMLSpanElement>(null);
  const chapterLineRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const introCopyRef = useRef<HTMLDivElement>(null);
  const mainImageFrameRef = useRef<HTMLDivElement>(null);
  const mainImageInnerRef = useRef<HTMLDivElement>(null);
  const secondaryImageFrameRef = useRef<HTMLDivElement>(null);
  const architecturalPillarsRef = useRef<HTMLDivElement>(null);

  useScrollMotion(sectionRef, (_ctx, isReducedMotion) => {
    if (isReducedMotion || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    // 1. Signature chapter label
    if (chapterDotRef.current) {
      tl.fromTo(chapterDotRef.current, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'power3.out' }, 0);
    }
    if (chapterTextRef.current) {
      tl.fromTo(chapterTextRef.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out' }, 0.05);
    }
    if (chapterLineRef.current) {
      tl.fromTo(chapterLineRef.current, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', duration: 0.7, ease: 'power3.out' }, 0.1);
    }

    // 2. Line-masked headline reveal
    const lines = [headlineLine1Ref.current, headlineLine2Ref.current].filter(Boolean);
    if (lines.length > 0) {
      tl.fromTo(
        lines,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' },
        0.18
      );
    }

    // 3. Narrative body
    if (introCopyRef.current) {
      tl.fromTo(
        introCopyRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        0.35
      );
    }

    // 4. Cinematic clip-path image reveals + inner scale settle
    if (mainImageFrameRef.current && mainImageInnerRef.current) {
      tl.fromTo(
        mainImageFrameRef.current,
        { clipPath: 'inset(12% 0% 0% 0%)', opacity: 0.6 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.1, ease: 'power3.inOut' },
        0.4
      ).fromTo(
        mainImageInnerRef.current,
        { scale: 1.08 },
        { scale: 1.0, duration: 1.4, ease: 'power2.out' },
        0.4
      );
    }

    if (secondaryImageFrameRef.current) {
      tl.fromTo(
        secondaryImageFrameRef.current,
        { clipPath: 'inset(0% 0% 12% 0%)', opacity: 0.7 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.0, ease: 'power3.inOut' },
        0.55
      );
    }

    // 5. Architectural pillars
    if (architecturalPillarsRef.current) {
      tl.fromTo(
        architecturalPillarsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power3.out' },
        0.65
      );
    }
  });

  return (
    <section
      id="the-house"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 md:py-40 bg-[#faf8f4] text-[#191c1a]"
      aria-label="The Property Story"
    >
      <div className="editorial-container">
        {/* Chapter Header Signature */}
        <div className="flex items-center gap-3.5 mb-10 sm:mb-14">
          <span ref={chapterDotRef} className="w-2 h-2 rounded-full bg-[#3d5642]" />
          <span
            ref={chapterTextRef}
            className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold"
          >
            CHAPTER I · THE HOUSE & GROUNDS
          </span>
          <div ref={chapterLineRef} className="h-px bg-[#3d5642]/20 flex-1 max-w-xs" />
        </div>

        {/* Asymmetrical Editorial Story Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 mb-20 sm:mb-28 items-start">
          <div className="lg:col-span-7">
            <h2 className="font-display-chapter text-[#1e3325] text-balance font-normal leading-[1.02]">
              <div className="overflow-hidden">
                <span ref={headlineLine1Ref} className="inline-block will-change-transform">
                  A small guest house
                </span>
              </div>
              <div className="overflow-hidden">
                <span ref={headlineLine2Ref} className="inline-block will-change-transform font-serif italic text-[#3d5642]">
                  with room to breathe.
                </span>
              </div>
            </h2>
          </div>

          <div ref={introCopyRef} className="lg:col-span-5 space-y-5 pt-3 opacity-0">
            <p className="font-sans text-[16px] sm:text-[17px] text-[#282d2a] leading-[1.68]">
              {mambegConfig.story.paragraphs[0]}
            </p>
            <p className="font-sans text-[15px] sm:text-[16px] text-[#585145] leading-[1.68]">
              {mambegConfig.story.paragraphs[1]}
            </p>

            <div className="pt-3 flex items-center gap-6 text-[13.5px] text-[#1e3325] font-sans font-medium border-t border-[#191c1a]/10">
              <span>Independent Country B&B</span>
              <span className="text-[#ded8cb]">·</span>
              <span>1.2 miles to Garelochhead Village</span>
            </div>
          </div>
        </div>

        {/* Asymmetric Photographic Composition (No Boxed Cards) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-24 sm:mb-32">
          {/* Panoramic Outlook over Gare Loch */}
          <div
            ref={mainImageFrameRef}
            className="lg:col-span-8 overflow-hidden rounded-xl bg-[#ded8cb] relative aspect-[16/10] shadow-lg will-change-[clip-path]"
          >
            <div ref={mainImageInnerRef} className="w-full h-full will-change-transform">
              <ResponsiveImage
                src={MAMBEG_MEDIA.property.outlook}
                alt="Outlook over Gare Loch waters and surrounding hills from Mambeg Country Guest House"
                className="w-full h-full object-cover select-none"
              />
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#16261b]/92 via-[#16261b]/40 to-transparent p-6 sm:p-10 text-[#faf8f4]">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#9cb1a1] font-semibold block mb-1.5 font-sans">
                Gare Loch Outlook
              </span>
              <p className="font-editorial text-2xl sm:text-3xl font-normal text-[#faf8f4] leading-snug">
                Tidal waters, hill shadows, and morning mist along the Rosneath shore.
              </p>
            </div>
          </div>

          {/* Editorial Factual Side Column */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <div
              ref={secondaryImageFrameRef}
              className="overflow-hidden rounded-xl bg-[#ded8cb] aspect-[4/3] relative shadow-md will-change-[clip-path]"
            >
              <ResponsiveImage
                src={MAMBEG_MEDIA.property.lounge}
                alt="Residents lounge at Mambeg with dining tables, microwave, and library"
                className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#16261b]/85 via-transparent to-transparent p-5 flex flex-col justify-end text-[#faf8f4]">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#9cb1a1] font-semibold font-sans">
                  Residents Lounge
                </span>
                <span className="font-editorial text-xl text-[#faf8f4]">
                  Dining Tables & Evening Microwave
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <h4 className="font-editorial text-2xl text-[#1e3325] font-semibold leading-tight">
                Guest autonomy & quiet comfort.
              </h4>
              <p className="text-[15px] text-[#585145] leading-[1.65] font-sans">
                Private guest wing access gives you freedom to come and go at your own pace, with generous CCTV-monitored parking set safely back from Rosneath Road.
              </p>
              <div className="pt-2 flex items-center gap-6">
                <button
                  onClick={onNavigateToStay}
                  data-cursor="ROOMS"
                  className="btn-editorial"
                >
                  <span>View Accommodations</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={onOpenBreakfast}
                  className="text-[13.5px] text-[#3d5642] hover:text-[#1e3325] hover:underline font-medium font-sans"
                >
                  Breakfast & Lounge
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Editorial Pillars (De-SaaS: No identical cards, clean architectural layout) */}
        <div
          ref={architecturalPillarsRef}
          className="border-t border-[#191c1a]/12 pt-12 sm:pt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8"
        >
          {mambegConfig.story.features.map((feat, idx) => (
            <div key={feat.title} className="group space-y-3">
              <span className="font-editorial text-2xl sm:text-3xl text-[#3d5642] block font-light">
                0{idx + 1}
              </span>
              <h3 className="font-editorial text-xl sm:text-2xl text-[#1e3325] font-semibold leading-snug">
                {feat.title}
              </h3>
              <p className="text-[14.5px] text-[#585145] leading-relaxed font-sans">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
