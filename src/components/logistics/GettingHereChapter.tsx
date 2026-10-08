import { useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { MAMBEG_MEDIA } from '../../data/mediaAssets';
import { Car, Train, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import { useScrollMotion } from '../../hooks/useScrollMotion';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import gsap from 'gsap';

interface GettingHereChapterProps {
  onOpenGettingHereDetails: () => void;
}

export function GettingHereChapter({ onOpenGettingHereDetails }: GettingHereChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const chapterDotRef = useRef<HTMLSpanElement>(null);
  const chapterTextRef = useRef<HTMLSpanElement>(null);
  const headlineLineRef = useRef<HTMLSpanElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const directionCardsRef = useRef<HTMLDivElement>(null);

  useScrollMotion(sectionRef, (_ctx, isReducedMotion) => {
    if (isReducedMotion || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    });

    if (chapterDotRef.current) {
      tl.fromTo(chapterDotRef.current, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'power3.out' }, 0);
    }
    if (chapterTextRef.current) {
      tl.fromTo(chapterTextRef.current, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0.04);
    }
    if (headlineLineRef.current) {
      tl.fromTo(headlineLineRef.current, { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 0.1);
    }
    if (bodyRef.current) {
      tl.fromTo(bodyRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, 0.2);
    }
    if (directionCardsRef.current) {
      tl.fromTo(
        directionCardsRef.current.children,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out' },
        0.28
      );
    }
    if (frameRef.current) {
      tl.fromTo(
        frameRef.current,
        { clipPath: 'inset(8% 0% 0% 0%)', opacity: 0.6 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.0, ease: 'power3.inOut' },
        0.25
      );
    }
  });

  return (
    <section
      id="getting-here"
      ref={sectionRef}
      className="relative w-full py-20 sm:py-28 md:py-36 bg-[#f5f2eb] text-[#191c1a]"
      aria-label="Getting Here and Location"
    >
      <div className="editorial-container">
        {/* Section Marker */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <span ref={chapterDotRef} className="w-2 h-2 rounded-full bg-[#3d5642]" />
          <span
            ref={chapterTextRef}
            className="text-xs uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold"
          >
            LOCATION & DIRECTIONS · GARELOCHHEAD
          </span>
          <div className="h-px bg-[#3d5642]/20 w-24 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="font-display-chapter text-[#1e3325] font-normal leading-[1.08]">
              <div className="overflow-hidden">
                <span ref={headlineLineRef} className="inline-block will-change-transform">
                  Reaching Mambeg House.
                </span>
              </div>
            </h2>

            <p ref={bodyRef} className="font-sans text-sm sm:text-base text-[#3c443f] leading-relaxed opacity-0">
              Situated in the quiet hamlet of Mambeg along the B833 Rosneath Road, the property is easy to locate while remaining peaceful and tucked away from noisy highway traffic.
            </p>

            <div ref={directionCardsRef} className="space-y-4 pt-1">
              <div className="flex items-start gap-3.5 bg-[#faf8f4] p-5 rounded-xl border border-[#191c1a]/6 shadow-xs">
                <Car className="w-5 h-5 text-[#3d5642] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#1e3325] block text-sm mb-1 font-semibold">By Road (B833)</strong>
                  <p className="text-[#626c65] leading-relaxed">
                    Take the B833 south from Garelochhead toward Kilcreggan. Look for large white signs saying <em>Mambeg House</em> at the foot of our private driveway, second on the right after the MAMBEG road sign.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#faf8f4] p-5 rounded-xl border border-[#191c1a]/6 shadow-xs">
                <Train className="w-5 h-5 text-[#3d5642] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#1e3325] block text-sm mb-1 font-semibold">By Rail (West Highland Line)</strong>
                  <p className="text-[#626c65] leading-relaxed">
                    Garelochhead railway station is only 1.2 miles away, with direct train connections from Glasgow Queen Street running up to Oban, Fort William, and Mallaig.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 bg-[#faf8f4] p-5 rounded-xl border border-[#191c1a]/6 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-[#3d5642] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <strong className="text-[#1e3325] block text-sm mb-1 font-semibold">Dedicated CCTV Parking</strong>
                  <p className="text-[#626c65] leading-relaxed">
                    Generous complimentary private parking with CCTV surveillance is provided on site well away from the road.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenGettingHereDetails}
                data-cursor="DIRECTIONS"
                className="editorial-link cursor-pointer"
              >
                <span>Full Travel Directions & Local Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div
              ref={frameRef}
              className="aspect-[16/11] rounded-3xl overflow-hidden bg-[#ded8cb] relative shadow-md border border-[#191c1a]/10 will-change-[clip-path]"
            >
              <ResponsiveImage
                src={MAMBEG_MEDIA.surroundings.rosneathRoad}
                alt="Rosneath Road B833 approach at Mambeg by Thomas Nugent"
                className="w-full h-full object-cover select-none"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#16261b]/85 backdrop-blur-xs p-5 rounded-2xl text-[#fdfcf9] border border-white/10 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-[#9cb1a1] mb-1 font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{mambegConfig.address}</span>
                </div>
                <p className="text-xs text-[#ded8cb]">
                  Quiet country road along the western shore of Gare Loch (Geograph CC-BY-SA 2.0)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
