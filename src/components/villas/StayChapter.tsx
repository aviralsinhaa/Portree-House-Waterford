import { useState, useLayoutEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { GuestRoom } from '../../types';
import { ArrowLeft, ArrowRight, Check, Eye } from 'lucide-react';
import { useScrollMotion } from '../../hooks/useScrollMotion';
import { ResponsiveImage } from '../ui/ResponsiveImage';
import gsap from 'gsap';

interface StayChapterProps {
  onReserveRoom: (roomId: string) => void;
  onOpenRoomDetail?: (roomId: string) => void;
  onOpenCompareRooms?: () => void;
  onOpenStayAssistant?: (prompt?: string, roomId?: string) => void;
}

export function StayChapter({
  onReserveRoom,
  onOpenRoomDetail,
  onOpenCompareRooms,
  onOpenStayAssistant,
}: StayChapterProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [outgoingRoom, setOutgoingRoom] = useState<GuestRoom | null>(null);
  const transitionIdRef = useRef<number>(0);

  const sectionRef = useRef<HTMLElement>(null);
  const chapterDotRef = useRef<HTMLSpanElement>(null);
  const chapterTextRef = useRef<HTMLSpanElement>(null);
  const chapterLineRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLSpanElement>(null);
  const headlineLine2Ref = useRef<HTMLSpanElement>(null);

  // Room details container refs for interactive switching
  const detailsContainerRef = useRef<HTMLDivElement>(null);
  const roomNumberRef = useRef<HTMLSpanElement>(null);
  const roomTypeRef = useRef<HTMLSpanElement>(null);
  const roomNameRef = useRef<HTMLHeadingElement>(null);
  const roomDescRef = useRef<HTMLParagraphElement>(null);
  const specsListRef = useRef<HTMLDivElement>(null);

  const imageFrameRef = useRef<HTMLDivElement>(null);
  const activeImgRef = useRef<HTMLDivElement>(null);
  const outgoingImgRef = useRef<HTMLDivElement>(null);

  const rooms = mambegConfig.rooms;
  const currentRoom = rooms[currentIndex];

  // Initial Section Entrance on scroll
  useScrollMotion(sectionRef, (_ctx, isReducedMotion) => {
    if (isReducedMotion || !sectionRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });

    if (chapterDotRef.current) {
      tl.fromTo(chapterDotRef.current, { scale: 0 }, { scale: 1, duration: 0.45, ease: 'power3.out' }, 0);
    }
    if (chapterTextRef.current) {
      tl.fromTo(chapterTextRef.current, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }, 0.04);
    }
    if (chapterLineRef.current) {
      tl.fromTo(chapterLineRef.current, { scaleX: 0 }, { scaleX: 1, transformOrigin: 'left', duration: 0.65, ease: 'power3.out' }, 0.08);
    }

    const headlineLines = [headlineLine1Ref.current, headlineLine2Ref.current].filter(Boolean);
    if (headlineLines.length > 0) {
      tl.fromTo(
        headlineLines,
        { yPercent: 115 },
        { yPercent: 0, duration: 0.85, stagger: 0.1, ease: 'power3.out' },
        0.15
      );
    }

    if (imageFrameRef.current) {
      tl.fromTo(
        imageFrameRef.current,
        { clipPath: 'inset(8% 0% 0% 0%)', opacity: 0.7 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.0, ease: 'power3.inOut' },
        0.25
      );
    }
  });

  // Controlled room transition handler (NO render mutation!)
  const switchRoom = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    setOutgoingRoom(rooms[currentIndex]);
    setCurrentIndex(newIndex);
    setSelectedPhotoIndex(0);
  };

  useLayoutEffect(() => {
    if (!outgoingRoom) return;

    const currentId = ++transitionIdRef.current;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (mediaQuery.matches) {
      setOutgoingRoom(null);
      return;
    }

    const outgoingEl = outgoingImgRef.current;
    const activeEl = activeImgRef.current;

    // Timeline for coordinated configurator transition
    const tl = gsap.timeline({
      onComplete: () => {
        if (transitionIdRef.current === currentId) {
          setOutgoingRoom(null);
        }
      },
    });

    // 1. Old Image Exit: subtle scale down + opacity fade out
    if (outgoingEl) {
      tl.to(outgoingEl, { opacity: 0, scale: 0.98, duration: 0.45, ease: 'power2.inOut' }, 0);
    }

    // 2. New Image Enter: masked wipe / clip-path inset + internal scale settle
    if (activeEl) {
      tl.fromTo(
        activeEl,
        { clipPath: 'inset(0% 100% 0% 0%)', opacity: 0.5, scale: 1.05 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          scale: 1.0,
          duration: 0.65,
          ease: 'power3.out',
        },
        0.05
      );
    }

    // 3. Room Number Counter Flip
    if (roomNumberRef.current) {
      tl.fromTo(
        roomNumberRef.current,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' },
        0.1
      );
    }

    // 4. Room Name Line Reveal
    if (roomNameRef.current) {
      tl.fromTo(
        roomNameRef.current,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' },
        0.15
      );
    }

    // 5. Room Type & Subtitle
    if (roomTypeRef.current) {
      tl.fromTo(
        roomTypeRef.current,
        { opacity: 0, x: -6 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' },
        0.12
      );
    }

    // 6. Description & Specs staggered
    if (roomDescRef.current) {
      tl.fromTo(
        roomDescRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        0.2
      );
    }

    if (specsListRef.current) {
      tl.fromTo(
        specsListRef.current.children,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, stagger: 0.04, duration: 0.4, ease: 'power2.out' },
        0.25
      );
    }

    return () => {
      tl.kill();
    };
  }, [outgoingRoom]);

  const handlePrev = () => {
    const prev = currentIndex === 0 ? rooms.length - 1 : currentIndex - 1;
    switchRoom(prev);
  };

  const handleNext = () => {
    const next = currentIndex === rooms.length - 1 ? 0 : currentIndex + 1;
    switchRoom(next);
  };

  const currentDisplayPhoto =
    currentRoom.gallery && currentRoom.gallery[selectedPhotoIndex]
      ? currentRoom.gallery[selectedPhotoIndex]
      : currentRoom.featuredImage;

  return (
    <section
      id="stay"
      ref={sectionRef}
      className="relative w-full py-24 sm:py-32 md:py-40 bg-[#f5f2eb] text-[#191c1a]"
      aria-label="Rooms & Accommodations"
    >
      <div className="editorial-container">
        {/* Section Header Signature */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span ref={chapterDotRef} className="w-2 h-2 rounded-full bg-[#3d5642]" />
              <span
                ref={chapterTextRef}
                className="text-[12px] uppercase tracking-[0.24em] font-sans text-[#3d5642] font-semibold"
              >
                CHAPTER II · ACCOMMODATION
              </span>
              <div ref={chapterLineRef} className="h-px bg-[#3d5642]/20 w-24 hidden sm:block" />
            </div>

            <h2 className="font-display-chapter text-[#1e3325] font-normal leading-[1.02]">
              <div className="overflow-hidden">
                <span ref={headlineLine1Ref} className="inline-block will-change-transform">
                  Comfortable en-suite rooms,
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  ref={headlineLine2Ref}
                  className="inline-block will-change-transform font-serif italic text-[#3d5642]"
                >
                  quiet countryside stillness.
                </span>
              </div>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {onOpenCompareRooms && (
              <button
                onClick={onOpenCompareRooms}
                data-cursor="COMPARE"
                className="text-[13.5px] font-sans font-medium text-[#1e3325] hover:underline cursor-pointer"
              >
                Compare Room Options
              </button>
            )}

            {onOpenStayAssistant && (
              <button
                onClick={() => onOpenStayAssistant('What rooms do you have?', currentRoom.id)}
                data-cursor="ASSISTANT"
                className="text-[13.5px] font-sans font-medium text-[#3d5642] hover:text-[#1e3325] hover:underline cursor-pointer"
              >
                Ask Stay Assistant
              </button>
            )}
          </div>
        </div>

        {/* Room Switcher Tabs */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-6 mb-8 border-b border-[#191c1a]/10">
          {rooms.map((room, idx) => (
            <button
              key={room.id}
              onClick={() => switchRoom(idx)}
              data-cursor="ROOM"
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-sans font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? 'bg-[#1e3325] text-[#faf8f4] shadow-xs'
                  : 'bg-[#ded8cb]/40 hover:bg-[#ded8cb]/80 text-[#3c443f]'
              }`}
            >
              <span>{room.name}</span>
            </button>
          ))}
        </div>

        {/* Interactive Configurator Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* Main Visual Display Frame */}
          <div className="lg:col-span-7 space-y-4">
            <div
              ref={imageFrameRef}
              className="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-[#ded8cb] shadow-lg will-change-[clip-path]"
            >
              {/* Outgoing Image During Transition */}
              {outgoingRoom && (
                <div
                  ref={outgoingImgRef}
                  className="absolute inset-0 w-full h-full z-10 will-change-transform"
                >
                  <ResponsiveImage
                    src={outgoingRoom.featuredImage}
                    alt={outgoingRoom.name}
                    className="w-full h-full object-cover select-none"
                  />
                </div>
              )}

              {/* Active Room Image */}
              <div
                ref={activeImgRef}
                className="absolute inset-0 w-full h-full z-20 will-change-[clip-path,transform]"
              >
                <ResponsiveImage
                  src={currentDisplayPhoto}
                  alt={currentRoom.name}
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Navigation Arrows */}
              <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full bg-[#faf8f4]/95 hover:bg-[#faf8f4] text-[#1e3325] flex items-center justify-center shadow-md transition-transform duration-200 active:scale-95 cursor-pointer"
                  aria-label="Previous room"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full bg-[#faf8f4]/95 hover:bg-[#faf8f4] text-[#1e3325] flex items-center justify-center shadow-md transition-transform duration-200 active:scale-95 cursor-pointer"
                  aria-label="Next room"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Room Photo Gallery Strip */}
            {currentRoom.gallery && currentRoom.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-1">
                {currentRoom.gallery.map((photo, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => setSelectedPhotoIndex(pIdx)}
                    data-cursor="VIEW"
                    className={`relative w-24 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0 cursor-pointer ${
                      selectedPhotoIndex === pIdx
                        ? 'border-[#1e3325] shadow-xs scale-102'
                        : 'border-transparent opacity-65 hover:opacity-100'
                    }`}
                  >
                    <ResponsiveImage
                      src={photo}
                      alt={`Photo ${pIdx + 1} for ${currentRoom.name}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Specifications Side */}
          <div ref={detailsContainerRef} className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  ref={roomTypeRef}
                  className="text-[12px] uppercase tracking-widest text-[#5c7562] font-semibold font-sans"
                >
                  {currentRoom.type} · {currentRoom.capacity}
                </span>
                <span
                  ref={roomNumberRef}
                  className="font-mono text-[11px] font-semibold text-[#1e3325]/60 bg-white/70 px-2.5 py-0.5 rounded-full"
                >
                  ROOM {currentRoom.number}
                </span>
              </div>

              <h3
                ref={roomNameRef}
                className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold leading-tight"
              >
                {currentRoom.name}
              </h3>
              <p className="text-[14px] text-[#585145] italic mt-1 font-sans">
                {currentRoom.subtitle}
              </p>
            </div>

            <p
              ref={roomDescRef}
              className="text-[15px] sm:text-[16px] text-[#3c443f] leading-[1.68] font-sans"
            >
              {currentRoom.description}
            </p>

            {/* Room Specifications (Clean, architectural list) */}
            <div
              ref={specsListRef}
              className="space-y-2.5 py-4 border-y border-[#191c1a]/10 text-[14px] font-sans"
            >
              <div className="flex items-center gap-2.5 text-[#282d2a]">
                <Check className="w-4 h-4 text-[#3d5642] shrink-0" />
                <span><strong>Bed:</strong> {currentRoom.bedSetup}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#282d2a]">
                <Check className="w-4 h-4 text-[#3d5642] shrink-0" />
                <span><strong>Bathroom:</strong> {currentRoom.bathroom}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#282d2a]">
                <Check className="w-4 h-4 text-[#3d5642] shrink-0" />
                <span><strong>Outlook:</strong> {currentRoom.view}</span>
              </div>
              <div className="flex items-center gap-2.5 text-[#282d2a]">
                <Check className="w-4 h-4 text-[#3d5642] shrink-0" />
                <span><strong>In-Room:</strong> Silent Fridge, Hospitality Tray, TV/DVD, Free Wi-Fi</span>
              </div>
            </div>

            {/* Rate & Direct Reservation Guidance */}
            <div className="text-[13px] text-[#585145] bg-[#faf8f4] p-3.5 rounded-xl border border-[#191c1a]/8 font-sans">
              <span className="font-semibold text-[#1e3325]">Direct Rates: </span>
              <span>{currentRoom.rateNote}</span>
            </div>

            {/* Action Buttons using Canonical Button System */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
              <button
                onClick={() => onReserveRoom(currentRoom.id)}
                data-cursor="ENQUIRE"
                className="btn-primary flex-1 text-[14px] py-3.5"
              >
                <span>Enquire About This Room</span>
              </button>

              {onOpenRoomDetail && (
                <button
                  onClick={() => onOpenRoomDetail(currentRoom.id)}
                  data-cursor="VIEW"
                  className="btn-secondary text-[14px] py-3.5 px-6"
                >
                  <Eye className="w-4 h-4" />
                  <span>Full Details</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
