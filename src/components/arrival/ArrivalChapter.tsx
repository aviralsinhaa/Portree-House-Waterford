import { useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { ArrowDown, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ResponsiveImage } from '../ui/ResponsiveImage';

gsap.registerPlugin(ScrollTrigger);

interface ArrivalChapterProps {
  onOpenBooking: () => void;
  onOpenStayAssistant: (prompt?: string) => void;
}

export function ArrivalChapter({
  onOpenBooking,
  onOpenStayAssistant,
}: ArrivalChapterProps) {
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroImageMaskRef = useRef<HTMLDivElement>(null);
  const heroImageInnerRef = useRef<HTMLDivElement>(null);
  const heroDarkenOverlayRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const featureBadgesRef = useRef<HTMLDivElement>(null);
  const ctaGroupRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const isReduced = mediaQuery.matches;

    const ctx = gsap.context(() => {
      if (isReduced) {
        // Immediate clean static state for reduced motion
        gsap.set(
          [
            eyebrowRef.current,
            headlineLine1Ref.current,
            headlineLine2Ref.current,
            subheadlineRef.current,
            featureBadgesRef.current,
            ctaGroupRef.current,
            scrollIndicatorRef.current,
          ],
          { opacity: 1, y: 0 }
        );
        return;
      }

      // ==========================================
      // 1. MASTER CINEMATIC HERO INTRO TIMELINE
      // ==========================================
      const masterTl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.15,
      });

      // A. Initial image mask reveal (clip-path opening from inset) & settle
      if (heroImageMaskRef.current && heroImageInnerRef.current) {
        masterTl
          .fromTo(
            heroImageMaskRef.current,
            { clipPath: 'inset(4% 4% 4% 4%)', opacity: 0.8 },
            { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.6, ease: 'expo.out' },
            0
          )
          .fromTo(
            heroImageInnerRef.current,
            { scale: 1.14 },
            { scale: 1.0, duration: 2.2, ease: 'power2.out' },
            0
          );
      }

      // B. Regional eyebrow enters with letter-spacing growth
      if (eyebrowRef.current) {
        masterTl.fromTo(
          eyebrowRef.current,
          { opacity: 0, y: 12, letterSpacing: '0.12em' },
          { opacity: 1, y: 0, letterSpacing: '0.24em', duration: 0.9, ease: 'power2.out' },
          0.35
        );
      }

      // C. Headline reveals line-by-line using overflow masks translateY(115% -> 0%)
      const lines = [headlineLine1Ref.current, headlineLine2Ref.current].filter(Boolean);
      if (lines.length > 0) {
        masterTl.fromTo(
          lines,
          { yPercent: 115, rotateZ: 1.2 },
          { yPercent: 0, rotateZ: 0, duration: 1.15, stagger: 0.12, ease: 'power3.out' },
          0.5
        );
      }

      // D. Narrative body copy & feature tags follow
      if (subheadlineRef.current) {
        masterTl.fromTo(
          subheadlineRef.current,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' },
          0.9
        );
      }

      if (featureBadgesRef.current) {
        masterTl.fromTo(
          featureBadgesRef.current.children,
          { opacity: 0, y: 8 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.7, ease: 'power2.out' },
          1.05
        );
      }

      // E. CTAs enter last
      if (ctaGroupRef.current) {
        masterTl.fromTo(
          ctaGroupRef.current.children,
          { opacity: 0, y: 16, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.8, ease: 'power2.out' },
          1.2
        );
      }

      // F. Scroll indicator enters after everything else
      if (scrollIndicatorRef.current) {
        masterTl.fromTo(
          scrollIndicatorRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          1.55
        );
      }

      // ==========================================
      // 2. SCRUBBED HERO SCROLL TRANSFORMATION
      // ==========================================
      if (heroContainerRef.current) {
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });

        // Background slowly translates downward and scales subtly
        if (heroImageInnerRef.current) {
          scrollTl.to(
            heroImageInnerRef.current,
            { yPercent: 18, scale: 1.05, ease: 'none' },
            0
          );
        }

        // Overlay deepens to transition naturally into next chapter
        if (heroDarkenOverlayRef.current) {
          scrollTl.to(
            heroDarkenOverlayRef.current,
            { opacity: 0.8, ease: 'none' },
            0
          );
        }

        // Headline subtly lifts and fades as user leaves hero
        if (heroContentRef.current) {
          scrollTl.to(
            heroContentRef.current,
            { yPercent: -15, opacity: 0.2, ease: 'none' },
            0
          );
        }

        // Fade scroll indicator out immediately upon scroll
        if (scrollIndicatorRef.current) {
          scrollTl.to(
            scrollIndicatorRef.current,
            { opacity: 0, y: 15, ease: 'none', duration: 0.2 },
            0
          );
        }
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  const scrollToRooms = () => {
    const element = document.querySelector('#stay');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToHouse = () => {
    const element = document.querySelector('#the-house');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroContainerRef}
      className="relative w-full h-[100svh] min-h-[680px] flex items-center justify-center overflow-hidden bg-[#16261b]"
      aria-label="Mambeg Country Guest House Welcome"
    >
      {/* Cinematic Masked Photographic Backdrop */}
      <div
        ref={heroImageMaskRef}
        className="absolute inset-0 overflow-hidden will-change-[clip-path,transform]"
      >
        <div
          ref={heroImageInnerRef}
          className="absolute inset-0 w-full h-full will-change-transform"
        >
          <ResponsiveImage
            priority
            src={mambegConfig.hero.image}
            alt="Scenic outlook over Gare Loch and surrounding hills from Mambeg Country Guest House"
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
          />
        </div>

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16261b] via-[#16261b]/40 to-[#16261b]/65 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#16261b]/30 to-[#16261b]/70 pointer-events-none" />
        <div
          ref={heroDarkenOverlayRef}
          className="absolute inset-0 bg-[#0d1610] opacity-25 pointer-events-none will-change-[opacity]"
        />
      </div>

      {/* Hero Foreground Content */}
      <div
        ref={heroContentRef}
        className="relative z-20 w-full max-w-5xl mx-auto px-6 md:px-12 text-center flex flex-col items-center justify-center pt-16 sm:pt-20 will-change-transform"
      >
        {/* Regional Label with Dot Marker */}
        <div
          ref={eyebrowRef}
          className="flex items-center gap-2.5 mb-4 sm:mb-6 opacity-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#9cb1a1] animate-pulse" />
          <span className="text-xs uppercase tracking-[0.24em] font-sans text-[#f4efe6] font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#9cb1a1]" />
            <span>Mambeg · Garelochhead · Argyll, Scotland</span>
          </span>
        </div>

        {/* Hero Display Headline with Line-Mask Overflow Reveals */}
        <h1 className="font-display-hero text-[#fdfcf9] select-none text-balance drop-shadow-[0_4px_30px_rgba(0,0,0,0.65)] mb-5 sm:mb-6">
          <div className="overflow-hidden inline-block w-full">
            <span
              ref={headlineLine1Ref}
              className="inline-block will-change-transform"
            >
              A quieter side
            </span>
          </div>
          <div className="overflow-hidden inline-block w-full">
            <span
              ref={headlineLine2Ref}
              className="inline-block will-change-transform font-serif italic font-light text-[#ded8cb]"
            >
              of Scotland.
            </span>
          </div>
        </h1>

        {/* Narrative Subtitle */}
        <div className="space-y-5 mb-10 sm:mb-12 max-w-2xl mx-auto">
          <p
            ref={subheadlineRef}
            className="font-sans text-base sm:text-lg md:text-[19px] text-[#f4efe6]/90 leading-relaxed font-normal drop-shadow-sm opacity-0"
          >
            {mambegConfig.hero.subheadline}
          </p>

          <div
            ref={featureBadgesRef}
            className="text-[13px] sm:text-[14px] text-[#ded8cb]/80 font-sans tracking-wide flex flex-wrap items-center justify-center gap-x-3 gap-y-1 pt-1 opacity-0"
          >
            <span>4 En-Suite Rooms</span>
            <span className="opacity-40">·</span>
            <span>Full Scottish Breakfast</span>
            <span className="opacity-40">·</span>
            <span>Residents Lounge</span>
            <span className="opacity-40">·</span>
            <span>Free On-Site Parking</span>
          </div>
        </div>

        {/* Canonical Button Pair */}
        <div
          ref={ctaGroupRef}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={scrollToRooms}
            data-cursor="ROOMS"
            className="btn-primary w-full sm:w-auto text-[14px] tracking-[0.06em] py-3.5 px-8"
          >
            <span>Explore the Rooms</span>
          </button>

          <button
            onClick={onOpenBooking}
            data-cursor="ENQUIRE"
            className="btn-secondary w-full sm:w-auto text-[14px] tracking-[0.06em] py-3.5 px-8 text-[#faf8f4] border-[#faf8f4]/40 hover:bg-[#faf8f4]/15 hover:border-[#faf8f4]"
          >
            <span>Enquire About a Stay</span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Anchor */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-center pointer-events-none pb-[env(safe-area-inset-bottom)] opacity-0 will-change-transform"
      >
        <button
          onClick={scrollToHouse}
          data-cursor="VIEW"
          className="flex flex-col items-center gap-1.5 pointer-events-auto text-[#f4efe6]/75 hover:text-white transition-colors focus:outline-none group cursor-pointer"
          aria-label="Scroll to discover the guest house"
        >
          <span className="text-[10px] uppercase tracking-[0.24em] font-sans group-hover:text-[#9cb1a1] transition-colors">
            Discover The House
          </span>
          <ArrowDown className="w-3.5 h-3.5 text-[#9cb1a1] animate-bounce" />
        </button>
      </div>
    </section>
  );
}
