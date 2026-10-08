import { useState, useRef, useEffect } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { MapPin, ArrowRight, X, ArrowLeft } from 'lucide-react';
import { useScrollMotion } from '../../hooks/useScrollMotion';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import gsap from 'gsap';

interface DiscoverChapterProps {
  onOpenExploreDetail: (attractionId: string) => void;
  onOpenBooking: () => void;
}

export function DiscoverChapter({ onOpenExploreDetail }: DiscoverChapterProps) {
  const [selectedGalleryCategory, setSelectedGalleryCategory] = useState<'all' | 'property' | 'local-area'>('all');
  const [fullscreenPhotoIdx, setFullscreenPhotoIdx] = useState<number | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const galleryHeadlineRef = useRef<HTMLSpanElement>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);

  const galleryItems = mambegConfig.gallery;
  const filteredGallery =
    selectedGalleryCategory === 'all'
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedGalleryCategory);

  useScrollMotion(sectionRef, (_ctx, isReducedMotion) => {
    if (isReducedMotion || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
      },
    });

    if (headlineLine1Ref.current) {
      tl.fromTo(
        headlineLine1Ref.current,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.85, ease: 'power3.out' },
        0
      );
    }

    if (galleryHeadlineRef.current) {
      tl.fromTo(
        galleryHeadlineRef.current,
        { yPercent: 115 },
        {
          yPercent: 0,
          duration: 0.85,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '#gallery',
            start: 'top 80%',
          },
        },
        0.2
      );
    }
  });

  // Fullscreen keyboard navigation
  useEffect(() => {
    if (fullscreenPhotoIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenPhotoIdx(null);
      if (e.key === 'ArrowLeft') {
        setFullscreenPhotoIdx((prev) =>
          prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1
        );
      }
      if (e.key === 'ArrowRight') {
        setFullscreenPhotoIdx((prev) =>
          prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenPhotoIdx, filteredGallery.length]);

  const activeModalItem =
    fullscreenPhotoIdx !== null ? filteredGallery[fullscreenPhotoIdx] : null;

  return (
    <section
      id="explore"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 md:py-40 bg-[#faf8f4] text-[#191c1a]"
      aria-label="Explore From Mambeg"
    >
      <div className="editorial-container space-y-28 sm:space-y-36">
        {/* ========================================================= */}
        {/* 1. Explore From Mambeg (Editorial Destination Progression) */}
        {/* ========================================================= */}
        <div>
          <div className="max-w-3xl mb-14 sm:mb-20">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 rounded-full bg-[#3d5642]" />
              <span className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold">
                CHAPTER IV · THE LOCAL AREA
              </span>
              <div className="h-px bg-[#3d5642]/20 w-24 hidden sm:block" />
            </div>

            <h2 className="font-display-chapter text-[#1e3325] font-normal leading-[1.02]">
              <div className="overflow-hidden">
                <span ref={headlineLine1Ref} className="inline-block will-change-transform">
                  Explore from Mambeg.
                </span>
              </div>
            </h2>
            <p className="font-sans text-[16px] sm:text-[17px] text-[#585145] mt-4 leading-[1.68]">
              An effortless countryside base for discovering the quiet shores of Gare Loch, Charles Rennie Mackintosh architecture in Helensburgh, and the world-famous West Highland Line.
            </p>
          </div>

          {/* Asymmetric Alternating Destination Progression (De-SaaS: No 4 identical cards) */}
          <div className="space-y-16 sm:space-y-24">
            {mambegConfig.attractions.map((attr, idx) => {
              const isEven = idx % 2 === 1;

              return (
                <div
                  key={attr.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center border-t border-[#191c1a]/12 pt-12 sm:pt-16`}
                >
                  {/* Visual Side (60% dominant) */}
                  <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-[#ded8cb] shadow-md group">
                      <ResponsiveImage
                        src={attr.image}
                        alt={attr.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-103"
                      />
                      <div className="absolute top-4 left-4 bg-[#16261b]/80 backdrop-blur-xs px-3 py-1.5 rounded-md text-[11px] text-[#faf8f4] font-medium flex items-center gap-1.5 shadow-xs font-sans">
                        <MapPin className="w-3.5 h-3.5 text-[#9cb1a1]" />
                        <span>{attr.distance}</span>
                      </div>
                    </div>
                  </div>

                  {/* Editorial Text Side (40%) */}
                  <div className={`lg:col-span-5 space-y-4 ${isEven ? 'lg:order-1' : ''}`}>
                    <div className="flex items-center gap-3">
                      <span className="font-editorial text-3xl sm:text-4xl text-[#3d5642] font-light">
                        0{idx + 1}
                      </span>
                      <span className="text-[12px] uppercase tracking-wider text-[#5c7562] font-semibold font-sans">
                        {attr.category}
                      </span>
                    </div>

                    <h3 className="font-editorial text-2xl sm:text-3xl text-[#1e3325] font-semibold leading-snug">
                      {attr.title}
                    </h3>

                    <p className="text-[15px] sm:text-[16px] text-[#3c443f] leading-[1.68] font-sans">
                      {attr.description}
                    </p>

                    <div className="pt-2">
                      <button
                        onClick={() => onOpenExploreDetail(attr.id)}
                        data-cursor="EXPLORE"
                        className="btn-editorial cursor-pointer"
                      >
                        <span>View Attraction Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. Photo Gallery (Editorial Visual Archive) */}
        {/* ========================================================= */}
        <div id="gallery" className="border-t border-[#191c1a]/12 pt-20 sm:pt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="w-2 h-2 rounded-full bg-[#3d5642]" />
                <span className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold">
                  CHAPTER V · VISUAL ARCHIVE
                </span>
              </div>
              <h2 className="font-display-chapter text-[#1e3325] font-normal leading-[1.02]">
                <div className="overflow-hidden">
                  <span ref={galleryHeadlineRef} className="inline-block will-change-transform">
                    Moments & Surroundings
                  </span>
                </div>
              </h2>
              <p className="font-sans text-[15px] sm:text-[16px] text-[#585145] mt-3 max-w-xl leading-relaxed">
                A visual journey through the guest house bedrooms, common spaces, and scenic Argyll coastal landscape.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-[#f5f2eb] rounded-full border border-[#191c1a]/10">
              {(
                [
                  { id: 'all', label: 'All Photos' },
                  { id: 'property', label: 'The Guest House' },
                  { id: 'local-area', label: 'Gare Loch & Area' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedGalleryCategory(tab.id)}
                  data-cursor="VIEW"
                  className={`px-4 py-2 text-[13px] font-sans rounded-full whitespace-nowrap transition-all duration-200 cursor-pointer font-medium ${
                    selectedGalleryCategory === tab.id
                      ? 'bg-[#1e3325] text-[#faf8f4] shadow-xs'
                      : 'text-[#585145] hover:text-[#191c1a] hover:bg-white/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Asymmetric Editorial Gallery Grid */}
          <div
            ref={galleryGridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6"
          >
            {filteredGallery.map((item, idx) => {
              const isLarge = idx === 0 || idx === 5;
              const colSpan = isLarge ? 'lg:col-span-8' : 'lg:col-span-4';
              const aspectRatio = isLarge
                ? 'aspect-[16/10]'
                : item.aspectRatio === 'portrait'
                ? 'aspect-[4/5]'
                : 'aspect-[4/3]';

              return (
                <div
                  key={item.id}
                  onClick={() => setFullscreenPhotoIdx(idx)}
                  data-cursor="GALLERY"
                  className={`${colSpan} group cursor-pointer bg-[#f5f2eb] rounded-xl overflow-hidden border border-[#191c1a]/8 hover:border-[#3d5642]/40 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between`}
                >
                  <div className={`relative ${aspectRatio} overflow-hidden bg-[#ded8cb]`}>
                    <ResponsiveImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover select-none transition-transform duration-700 ease-out group-hover:scale-104"
                    />

                    {/* Gradient Depth Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#16261b]/85 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                    {/* Overlaid Caption on Hover */}
                    <div className="absolute bottom-4 inset-x-4 z-10 text-[#faf8f4] transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="font-editorial text-xl sm:text-2xl font-normal block leading-tight text-[#faf8f4]">
                        {item.title}
                      </span>
                      <p className="text-[12px] text-[#ded8cb]/90 line-clamp-2 mt-1 font-sans">
                        {item.caption}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 py-3 bg-[#f5f2eb] border-t border-[#191c1a]/6 flex items-center justify-between text-[12px] text-[#585145] font-sans">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-[#3d5642] font-semibold shrink-0 group-hover:underline">
                      Enlarge ↗
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. Fullscreen Editorial Lightbox Modal */}
      {/* ========================================================= */}
      {fullscreenPhotoIdx !== null && activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo Viewer"
          className="fixed inset-0 z-50 bg-[#16261b]/96 backdrop-blur-md flex flex-col justify-between p-4 sm:p-8 animate-fade-in"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between text-[#faf8f4] pb-4 border-b border-white/10 z-20">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-[#9cb1a1] font-semibold block font-sans">
                {activeModalItem.category === 'property' ? 'Mambeg Guest House' : 'Garelochhead & Surroundings'}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl font-normal text-[#fdfcf9] mt-0.5">
                {activeModalItem.title}
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-mono text-xs text-[#9cb1a1]">
                {fullscreenPhotoIdx + 1} / {filteredGallery.length}
              </span>
              <button
                onClick={() => setFullscreenPhotoIdx(null)}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#faf8f4] transition-colors cursor-pointer"
                aria-label="Close photo viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage Image with Navigation */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenPhotoIdx((prev) =>
                  prev !== null && prev > 0 ? prev - 1 : filteredGallery.length - 1
                );
              }}
              className="absolute left-3 sm:left-8 z-20 p-3.5 rounded-full bg-black/45 hover:bg-black/70 text-[#faf8f4] transition-colors cursor-pointer"
              aria-label="Previous photo"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="max-h-[75vh] max-w-[90vw] flex items-center justify-center">
              <img
                src={activeModalItem.image}
                alt={activeModalItem.title}
                className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              />
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenPhotoIdx((prev) =>
                  prev !== null && prev < filteredGallery.length - 1 ? prev + 1 : 0
                );
              }}
              className="absolute right-3 sm:right-8 z-20 p-3.5 rounded-full bg-black/45 hover:bg-black/70 text-[#faf8f4] transition-colors cursor-pointer"
              aria-label="Next photo"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Caption Bar */}
          <div className="bg-black/35 backdrop-blur-xs p-4 sm:p-5 rounded-xl border border-white/10 text-[#faf8f4] max-w-3xl mx-auto w-full text-center space-y-1.5 z-20">
            <p className="text-[14px] sm:text-[15px] text-[#ded8cb] leading-relaxed font-sans">
              {activeModalItem.caption}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
