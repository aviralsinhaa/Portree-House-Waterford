import { useEffect, useRef, useState } from 'react';
import { veloraResort } from '../../data/resortConfig';
import { oceanAudio } from '../../utils/audio';
import { ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ResponsiveImage } from '../ui/ResponsiveImage';

gsap.registerPlugin(ScrollTrigger);

interface ArrivalChapterProps {
  onOpenBooking: () => void;
  onOpenConcierge: (prompt?: string) => void;
}

export function ArrivalChapter({
  onOpenConcierge,
}: ArrivalChapterProps) {
  const [loadingState, setLoadingState] = useState<'initial' | 'monogram' | 'reveal' | 'ready'>('initial');
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const heroMediaRef = useRef<HTMLDivElement>(null);
  const heroOverlayRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroSubtitleRef = useRef<HTMLDivElement>(null);
  const heroHeadlineRef = useRef<HTMLDivElement>(null);
  const heroSecondaryRef = useRef<HTMLDivElement>(null);
  const heroCtaRef = useRef<HTMLDivElement>(null);
  const heroAnchorRef = useRef<HTMLDivElement>(null);

  // 1. CINEMATIC FILM OPENING WITH MONOGRAM
  useEffect(() => {
    try {
      if (sessionStorage.getItem('velora_intro_seen')) {
        setLoadingState('ready');
        return;
      }
    } catch {
      // Sandbox fallback
    }

    const t1 = setTimeout(() => setLoadingState('monogram'), 120);
    const t2 = setTimeout(() => setLoadingState('reveal'), 900);
    const t3 = setTimeout(() => {
      setLoadingState('ready');
      try {
        sessionStorage.setItem('velora_intro_seen', 'true');
      } catch {
        // Ignore
      }
    }, 1700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const heroZoomMediaRef = useRef<HTMLDivElement>(null);

  // 2. GSAP SCROLLTRIGGER HERO TRANSFORMATION & AUTONOMOUS CINEMATIC ZOOM
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const targetZoom = isMobile ? 1.03 : (isTablet ? 1.035 : 1.04);
    const zoomDuration = isMobile ? 14 : 12;

    const ctx = gsap.context(() => {
      // 1. Autonomous Slow Cinematic Film Zoom (runs immediately across desktop, tablet, and mobile)
      if (heroZoomMediaRef.current) {
        gsap.fromTo(
          heroZoomMediaRef.current,
          { scale: 1.0 },
          {
            scale: targetZoom,
            duration: zoomDuration,
            ease: 'sine.out',
            transformOrigin: 'center center',
          }
        );
      }

      // 2. Initial Hero Entrance Animation (fade & gentle rise across all devices)
      const entranceElements = [
        heroSubtitleRef.current,
        heroHeadlineRef.current,
        heroSecondaryRef.current,
        heroCtaRef.current,
        heroAnchorRef.current,
      ].filter(Boolean);

      if (entranceElements.length > 0) {
        gsap.fromTo(
          entranceElements,
          { opacity: 0, y: isMobile ? 12 : 16 },
          { opacity: 1, y: 0, duration: 0.85, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
        );
      }

      if (!heroContainerRef.current) return;

      // 3. Exactly ONE scrubbed ScrollTrigger on the entire homepage (Mobile, Tablet, Desktop)
      // Note: Outer wrapper handles scroll choreography while inner wrapper handles slow zoom (zero scale jump!)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainerRef.current,
          start: 'top top',
          end: isMobile ? '+=75%' : '+=85%',
          scrub: 0.4,
        },
      });

      // Dark overlay opacity increases 0.35 -> 0.70 (15% to 60%)
      if (heroOverlayRef.current) {
        tl.fromTo(
          heroOverlayRef.current,
          { opacity: 0.35 },
          { opacity: 0.70, duration: 0.45, ease: 'power2.out' },
          0.15
        );
      }

      // Anchor indicator fades out early (0.05 to 0.18)
      if (heroAnchorRef.current) {
        tl.to(
          heroAnchorRef.current,
          { opacity: 0, duration: 0.13, ease: 'power2.out' },
          0.05
        );
      }

      // Subtitle fades out first (15% to 35%)
      if (heroSubtitleRef.current) {
        tl.to(
          heroSubtitleRef.current,
          { opacity: 0, y: isMobile ? -6 : -8, duration: 0.2, ease: 'power2.out' },
          0.15
        );
      }

      // Main headline gently rises & fades (20% to 55%)
      if (heroHeadlineRef.current) {
        tl.to(
          heroHeadlineRef.current,
          { y: isMobile ? -20 : -32, opacity: 0, duration: 0.35, ease: 'power3.out' },
          0.20
        );
      }

      // Secondary copy dissolves (28% to 52%)
      if (heroSecondaryRef.current) {
        tl.to(
          heroSecondaryRef.current,
          { opacity: 0, y: isMobile ? -10 : -16, duration: 0.24, ease: 'power2.out' },
          0.28
        );
      }

      // CTAs fade out cleanly (35% to 60%)
      if (heroCtaRef.current) {
        tl.to(
          heroCtaRef.current,
          { opacity: 0, y: isMobile ? -8 : -12, duration: 0.25, ease: 'power2.out' },
          0.35
        );
      }
    }, heroContainerRef);

    return () => ctx.revert();
  }, []);

  const scrollToIsland = () => {
    const el = document.getElementById('island');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const isIntroActive = loadingState !== 'ready';

  return (
    <section id="arrive" ref={heroContainerRef} className="relative w-full bg-[#04080f] text-[#ece6dc]">
      {/* 1. BLACK FILM OPENING OVERLAY */}
      {isIntroActive && (
        <div
          aria-hidden={loadingState === 'reveal'}
          className={`fixed inset-0 z-[95] bg-[#04080f] flex flex-col items-center justify-center transition-opacity duration-1000 ease-out ${
            loadingState === 'reveal' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="relative flex flex-col items-center text-center px-6">
            <div
              className={`relative w-20 h-20 rounded-full border border-[#c4a97d]/35 flex items-center justify-center mb-6 overflow-hidden transition-[opacity,transform] duration-1000 ${
                loadingState === 'monogram' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
            >
              <span className="font-editorial text-3xl text-[#dfcaa3] tracking-widest font-normal">V</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[#dfcaa3]/30 to-transparent animate-light-sweep" />
            </div>

            <h2
              className={`font-editorial text-2xl sm:text-3xl text-white tracking-[0.38em] font-light transition-[opacity,transform] duration-1000 ${
                loadingState === 'monogram' ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              {veloraResort.brandName}
            </h2>

            <p
              className={`text-[9.5px] uppercase tracking-[0.32em] text-[#dfcaa3]/80 font-sans mt-3.5 transition-opacity duration-700 delay-300 ${
                loadingState === 'monogram' ? 'opacity-100' : 'opacity-0'
              }`}
            >
              NOONU ATOLL · MALDIVES
            </p>
          </div>
        </div>
      )}

      {/* 2. HERO STAGE */}
      <div className="relative w-full h-[100svh] min-h-[660px] flex items-center justify-center overflow-hidden">
        {/* Photographic Backdrop (Responsive Image Layer, Priority High) */}
        <div ref={heroMediaRef} className="absolute inset-0 overflow-hidden">
          {/* Inner Autonomous Slow Cinematic Film Zoom Layer (Desktop, Tablet, Mobile) */}
          <div ref={heroZoomMediaRef} className="absolute inset-0 w-full h-full will-change-transform">
            <ResponsiveImage
              priority
              src={veloraResort.hero.backgroundImage}
              alt="Velora Private Island Maldives Hero"
              sizes="100vw"
              className="absolute inset-0 w-full h-full object-cover select-none"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#04080f] via-[#04080f]/35 to-[#04080f]/55 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#04080f]/20 to-[#04080f]/75 pointer-events-none" />
          <div ref={heroOverlayRef} className="absolute inset-0 bg-[#04080f] opacity-0 pointer-events-none" />
        </div>

        {/* Hero Foreground Content */}
        <div
          ref={heroContentRef}
          className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 text-center flex flex-col items-center justify-center pt-8 sm:pt-12"
        >
          {/* Location Subtitle */}
          <div ref={heroSubtitleRef} className="flex items-center gap-2.5 mb-4 sm:mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dfcaa3] shadow-[0_0_8px_#dfcaa3]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-sans text-white/90 font-medium">
              NOONU ATOLL · MALDIVES
            </span>
          </div>

          {/* Monumental Hero Wordmark */}
          <div ref={heroHeadlineRef} className="overflow-hidden w-full mb-3 sm:mb-4">
            <h1 className="font-display-hero text-white select-none drop-shadow-[0_12px_48px_rgba(0,0,0,0.8)]">
              {veloraResort.hero.title}
            </h1>
          </div>

          {/* Poetic Brand Statement */}
          <div ref={heroSecondaryRef} className="space-y-4 mb-8">
            <p className="font-editorial-quote text-[#dfcaa3] tracking-wide max-w-2xl mx-auto font-light text-xl sm:text-2xl md:text-3xl">
              &ldquo;{veloraResort.hero.headline}&rdquo;
            </p>

            <p className="font-sans text-xs sm:text-sm text-white/75 tracking-[0.06em] max-w-md mx-auto leading-relaxed font-light hidden sm:block">
              {veloraResort.hero.subheadline}
            </p>
          </div>

          {/* Actions: ONE Primary, ONE subtle secondary (Refined button hover scale max 1.015) */}
          <div ref={heroCtaRef} className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
            <button
              onClick={scrollToIsland}
              data-cursor="EXPLORE"
              className="w-full sm:w-auto px-9 py-3.5 rounded-full bg-[#dfcaa3] hover:bg-[#f0e2c8] text-[#04080f] font-sans text-xs uppercase tracking-[0.22em] font-medium transition-[background-color,transform,box-shadow] duration-300 shadow-[0_0_24px_rgba(223,202,163,0.3)] hover:scale-[1.015]"
            >
              EXPLORE THE ISLAND
            </button>

            <button
              onClick={() => onOpenConcierge()}
              data-cursor="CONCIERGE"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/30 hover:border-[#dfcaa3] text-white hover:text-[#dfcaa3] font-sans text-xs uppercase tracking-[0.22em] font-medium transition-[color,border-color,background-color,transform] duration-300 hover:bg-white/5 backdrop-blur-xs hover:scale-[1.015]"
            >
              <span>PRIVATE CONCIERGE ✦</span>
            </button>
          </div>
        </div>

        {/* Bottom Floating Island Anchor */}
        <div
          ref={heroAnchorRef}
          className="absolute bottom-6 left-6 right-6 z-20 flex items-end justify-center pointer-events-none pb-[env(safe-area-inset-bottom)]"
        >
          <button
            onClick={scrollToIsland}
            className="flex flex-col items-center gap-2 pointer-events-auto text-white/60 hover:text-white transition-colors focus:outline-none group"
            aria-label="Scroll to enter"
          >
            <span className="text-[9px] uppercase tracking-[0.28em] font-sans group-hover:text-[#dfcaa3] transition-colors">
              THE ISLAND
            </span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#dfcaa3]" />
          </button>
        </div>
      </div>
    </section>
  );
}
