import { useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { MAMBEG_MEDIA } from '../../data/mediaAssets';
import { ArrowRight } from 'lucide-react';
import { useScrollMotion } from '../../hooks/useScrollMotion';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import gsap from 'gsap';

interface IslandLifeChapterProps {
  onOpenBreakfast: () => void;
  onOpenExplore: () => void;
}

export function IslandLifeChapter({ onOpenBreakfast, onOpenExplore }: IslandLifeChapterProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLineRef = useRef<HTMLSpanElement>(null);
  const wideBannerFrameRef = useRef<HTMLDivElement>(null);
  const wideBannerImgRef = useRef<HTMLDivElement>(null);
  const editorialSequenceRef = useRef<HTMLDivElement>(null);

  useScrollMotion(sectionRef, (_ctx, isReducedMotion) => {
    if (isReducedMotion || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });

    if (headlineLineRef.current) {
      tl.fromTo(
        headlineLineRef.current,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.85, ease: 'power3.out' },
        0
      );
    }

    if (wideBannerFrameRef.current) {
      tl.fromTo(
        wideBannerFrameRef.current,
        { clipPath: 'inset(8% 0% 8% 0%)', opacity: 0.6 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.1, ease: 'power3.inOut' },
        0.15
      );
    }

    if (editorialSequenceRef.current) {
      tl.fromTo(
        editorialSequenceRef.current.children,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' },
        0.35
      );
    }

    // Gentle parallax scrub on the banner image
    if (wideBannerImgRef.current) {
      gsap.fromTo(
        wideBannerImgRef.current,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: 'none',
          scrollTrigger: {
            trigger: wideBannerFrameRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    }
  });

  return (
    <section
      id="island-life"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 md:py-40 bg-[#faf8f4] text-[#191c1a]"
      aria-label="Gardens and Grounds"
    >
      <div className="editorial-container">
        {/* Section Heading with Line Mask */}
        <div className="max-w-3xl mb-14 sm:mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-[#3d5642]" />
            <span className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold">
              CHAPTER III · NATURE & PACE
            </span>
            <div className="h-px bg-[#3d5642]/20 w-24 hidden sm:block" />
          </div>

          <h2 className="font-display-chapter text-[#1e3325] font-normal leading-[1.02]">
            <div className="overflow-hidden">
              <span ref={headlineLineRef} className="inline-block will-change-transform">
                Surrounded by coastal green.
              </span>
            </div>
          </h2>
          <p className="font-sans text-[16px] sm:text-[17px] text-[#585145] mt-4 leading-[1.68]">
            Framed by woodland along Rosneath Road, Mambeg creates a peaceful natural buffer from busy travel routes. Enjoy fresh coastal loch air, birdsong, and open garden space with views across the water.
          </p>
        </div>

        {/* Immersive Wide Grounds Image with Clip-Path Entrance & Parallax */}
        <div
          ref={wideBannerFrameRef}
          className="relative aspect-[21/9] sm:aspect-[16/7] rounded-2xl overflow-hidden bg-[#ded8cb] mb-20 sm:mb-28 shadow-lg will-change-[clip-path]"
        >
          <div ref={wideBannerImgRef} className="absolute inset-0 w-full h-[112%] -top-[6%] will-change-transform">
            <ResponsiveImage
              src={MAMBEG_MEDIA.property.outlook}
              alt="Scenic outlook over Gare Loch and Argyll landscape from Mambeg Country Guest House"
              className="w-full h-full object-cover select-none"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#16261b]/92 via-[#16261b]/30 to-transparent flex items-end p-6 sm:p-12">
            <div className="max-w-2xl text-[#fdfcf9]">
              <span className="text-[11px] uppercase tracking-[0.22em] text-[#9cb1a1] font-semibold block mb-2 font-sans">
                Rosneath Peninsula
              </span>
              <p className="font-editorial text-2xl sm:text-4xl font-light text-[#faf8f4] leading-snug">
                Tranquil countryside setting overlooking the waters of Gare Loch.
              </p>
            </div>
          </div>
        </div>

        {/* Editorial Sequence: Why Mambeg (No Identical Cards) */}
        <div className="mb-10 sm:mb-14">
          <span className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold block mb-2">
            THE STAY PHILOSOPHY
          </span>
          <h3 className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold leading-tight">
            Why guests choose Mambeg Country Guest House
          </h3>
        </div>

        <div ref={editorialSequenceRef} className="space-y-16 sm:space-y-24">
          {/* 01: A quieter setting */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center border-t border-[#191c1a]/12 pt-12">
            <div className="lg:col-span-2">
              <span className="font-editorial text-4xl sm:text-5xl text-[#3d5642] font-light">01</span>
            </div>
            <div className="lg:col-span-4">
              <h4 className="font-editorial text-2xl sm:text-3xl text-[#1e3325] font-semibold leading-snug">
                A quieter coastal setting
              </h4>
              <span className="text-[12px] uppercase tracking-wider text-[#5c7562] font-semibold font-sans mt-1 block">
                Countryside Stillness
              </span>
            </div>
            <div className="lg:col-span-6 space-y-3">
              <p className="text-[15.5px] text-[#3c443f] leading-[1.68] font-sans">
                Set peacefully on the Rosneath Peninsula away from busy trunk roads, Mambeg offers unhurried night stillness, clear lochside skies, and birdsong each morning.
              </p>
            </div>
          </div>

          {/* 02: A personal stay & common areas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center border-t border-[#191c1a]/12 pt-12">
            <div className="lg:col-span-2">
              <span className="font-editorial text-4xl sm:text-5xl text-[#3d5642] font-light">02</span>
            </div>
            <div className="lg:col-span-4">
              <h4 className="font-editorial text-2xl sm:text-3xl text-[#1e3325] font-semibold leading-snug">
                Dedicated residents lounge
              </h4>
              <span className="text-[12px] uppercase tracking-wider text-[#5c7562] font-semibold font-sans mt-1 block">
                Light Evening Dining & Relaxation
              </span>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <p className="text-[15.5px] text-[#3c443f] leading-[1.68] font-sans">
                Beyond your bedroom, enjoy full access to the guest lounge with dining tables, chairs, microwave, tableware, books, board games, and an extensive DVD library.
              </p>
              <button onClick={onOpenBreakfast} className="btn-editorial cursor-pointer">
                <span>View Lounge & Dining</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 03: Cooked Scottish Breakfast */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center border-t border-[#191c1a]/12 pt-12">
            <div className="lg:col-span-2">
              <span className="font-editorial text-4xl sm:text-5xl text-[#3d5642] font-light">03</span>
            </div>
            <div className="lg:col-span-4">
              <h4 className="font-editorial text-2xl sm:text-3xl text-[#1e3325] font-semibold leading-snug">
                Freshly cooked breakfast
              </h4>
              <span className="text-[12px] uppercase tracking-wider text-[#5c7562] font-semibold font-sans mt-1 block">
                Made to Order Every Morning
              </span>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <p className="text-[15.5px] text-[#3c443f] leading-[1.68] font-sans">
                A hearty Full Scottish Breakfast prepared fresh to order, complemented by porridge, cereals, toast, fruit, fresh juices, and pots of coffee and Scottish tea.
              </p>
            </div>
          </div>

          {/* 04: Base for exploring Argyll & West Highland Line */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center border-t border-[#191c1a]/12 pt-12">
            <div className="lg:col-span-2">
              <span className="font-editorial text-4xl sm:text-5xl text-[#3d5642] font-light">04</span>
            </div>
            <div className="lg:col-span-4">
              <h4 className="font-editorial text-2xl sm:text-3xl text-[#1e3325] font-semibold leading-snug">
                Argyll & West Highland base
              </h4>
              <span className="text-[12px] uppercase tracking-wider text-[#5c7562] font-semibold font-sans mt-1 block">
                1.2 Miles to Railway Station
              </span>
            </div>
            <div className="lg:col-span-6 space-y-4">
              <p className="text-[15.5px] text-[#3c443f] leading-[1.68] font-sans">
                Conveniently located 1.2 miles from Garelochhead station on the West Highland Line and 15 minutes from Helensburgh and Loch Lomond, offering seamless road and rail connections.
              </p>
              <button onClick={onOpenExplore} className="btn-editorial cursor-pointer">
                <span>Discover Local Sights</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
