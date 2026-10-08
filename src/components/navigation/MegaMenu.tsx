import { useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { X, ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import gsap from 'gsap';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenRoomDetail: (roomId: string) => void;
  onOpenCompareRooms: () => void;
  onOpenBreakfast: () => void;
  onOpenExplore: () => void;
  onOpenPracticalInfo: () => void;
  onOpenStayAssistant: () => void;
  onOpenBooking: () => void;
}

export function MegaMenu({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenRoomDetail,
  onOpenCompareRooms,
  onOpenBreakfast,
  onOpenExplore,
  onOpenPracticalInfo,
  onOpenStayAssistant,
  onOpenBooking,
}: MegaMenuProps) {
  const lastActiveElementRef = useRef<HTMLElement | null>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  useFocusTrap(menuContainerRef, isOpen, { autoFocusFirst: true });

  useEffect(() => {
    if (!isOpen) return;
    lastActiveElementRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // GSAP Stagger Entrance for Menu
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches && menuItemsRef.current) {
      gsap.fromTo(
        menuItemsRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out', delay: 0.1 }
      );
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      if (lastActiveElementRef.current && typeof lastActiveElementRef.current.focus === 'function') {
        lastActiveElementRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuContainerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation Menu"
      className="fixed inset-0 z-50 bg-[#faf8f4]/98 backdrop-blur-xl text-[#191c1a] flex flex-col justify-between overflow-y-auto animate-fade-in"
    >
      {/* Top Header */}
      <div className="w-full px-6 sm:px-10 py-5 border-b border-[#191c1a]/10 flex items-center justify-between">
        <div>
          <span className="font-editorial text-2xl font-semibold text-[#1e3325]">
            MAMBEG
          </span>
          <span className="block text-xs uppercase tracking-[0.2em] text-[#5c7562] font-medium">
            Country Guest House
          </span>
        </div>

        <button
          onClick={onClose}
          data-cursor="CLOSE"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#191c1a]/15 hover:bg-[#ded8cb]/40 text-[#191c1a] text-xs font-medium transition-colors cursor-pointer"
          aria-label="Close Navigation Menu"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>

      {/* Main Body */}
      <div className="w-full max-w-[1280px] mx-auto px-6 sm:px-10 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Columns */}
        <div className="lg:col-span-7 space-y-6">
          <p className="text-xs uppercase tracking-widest text-[#5c7562] font-semibold">
            EXPLORE THE PROPERTY
          </p>

          <div ref={menuItemsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => {
                onClose();
                onNavigateSection('stay');
              }}
              className="text-left p-4 rounded-xl border border-[#191c1a]/8 hover:border-[#1e3325] hover:bg-[#f5f2eb] transition-all group cursor-pointer"
            >
              <span className="font-editorial text-xl text-[#1e3325] block group-hover:translate-x-1 transition-transform">
                Guest Rooms & Suites
              </span>
              <span className="text-xs text-[#626c65] mt-1 block">
                Double, twin, and family accommodations with en-suite bathrooms.
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateSection('the-house');
              }}
              className="text-left p-4 rounded-xl border border-[#191c1a]/8 hover:border-[#1e3325] hover:bg-[#f5f2eb] transition-all group cursor-pointer"
            >
              <span className="font-editorial text-xl text-[#1e3325] block group-hover:translate-x-1 transition-transform">
                The House & Grounds
              </span>
              <span className="text-xs text-[#626c65] mt-1 block">
                Countryside setting, residents lounge, gardens, and CCTV parking.
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenBreakfast();
              }}
              className="text-left p-4 rounded-xl border border-[#191c1a]/8 hover:border-[#1e3325] hover:bg-[#f5f2eb] transition-all group cursor-pointer"
            >
              <span className="font-editorial text-xl text-[#1e3325] block group-hover:translate-x-1 transition-transform">
                Breakfast & Dining
              </span>
              <span className="text-xs text-[#626c65] mt-1 block">
                Full Scottish Breakfast, tea & coffee, and microwave amenities.
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenExplore();
              }}
              className="text-left p-4 rounded-xl border border-[#191c1a]/8 hover:border-[#1e3325] hover:bg-[#f5f2eb] transition-all group cursor-pointer"
            >
              <span className="font-editorial text-xl text-[#1e3325] block group-hover:translate-x-1 transition-transform">
                Explore the Local Area
              </span>
              <span className="text-xs text-[#626c65] mt-1 block">
                Gare Loch, Garelochhead station, Helensburgh & The Hill House.
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateSection('gallery');
              }}
              className="text-left p-4 rounded-xl border border-[#191c1a]/8 hover:border-[#1e3325] hover:bg-[#f5f2eb] transition-all group cursor-pointer"
            >
              <span className="font-editorial text-xl text-[#1e3325] block group-hover:translate-x-1 transition-transform">
                Photo Gallery
              </span>
              <span className="text-xs text-[#626c65] mt-1 block">
                Authentic photographs of the guest house, rooms, and surroundings.
              </span>
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenPracticalInfo();
              }}
              className="text-left p-4 rounded-xl border border-[#191c1a]/8 hover:border-[#1e3325] hover:bg-[#f5f2eb] transition-all group cursor-pointer"
            >
              <span className="font-editorial text-xl text-[#1e3325] block group-hover:translate-x-1 transition-transform">
                Practical Info & FAQs
              </span>
              <span className="text-xs text-[#626c65] mt-1 block">
                Check-in times, parking, Wi-Fi, dog policy, and directions.
              </span>
            </button>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenCompareRooms();
              }}
              className="text-xs font-medium text-[#1e3325] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Compare All 4 Rooms <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-[#c8bfad]">·</span>
            <button
              onClick={() => {
                onClose();
                onOpenStayAssistant();
              }}
              className="text-xs font-medium text-[#1e3325] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Ask Mambeg Stay Assistant <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Property Information Card */}
        <div className="lg:col-span-5 bg-[#f5f2eb] p-6 sm:p-7 rounded-2xl border border-[#191c1a]/8 space-y-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-[#5c7562] font-semibold">
              DIRECT PROPERTY ENQUIRIES
            </p>
            <h3 className="font-editorial text-2xl text-[#1e3325] mt-1 font-semibold">
              Plan Your Stay
            </h3>
            <p className="text-xs text-[#626c65] mt-2 leading-relaxed">
              We welcome enquiries directly for current seasonal rates and availability across our double, twin, and family accommodations.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-[#282d2a]">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#3d5642] shrink-0 mt-0.5" />
              <span>{mambegConfig.address}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#3d5642] shrink-0" />
              <a href={`tel:${mambegConfig.phone.replace(/\s+/g, '')}`} className="hover:underline font-medium">
                {mambegConfig.phone}
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#3d5642] shrink-0" />
              <a href={`mailto:${mambegConfig.email}`} className="hover:underline font-medium">
                {mambegConfig.email}
              </a>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenBooking();
              }}
              className="w-full py-3 px-4 rounded-lg bg-[#1e3325] hover:bg-[#2a4734] text-[#faf8f4] text-xs font-semibold transition-colors text-center shadow-xs cursor-pointer"
            >
              Send Stay Enquiry
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-6 sm:px-10 py-4 border-t border-[#191c1a]/10 text-xs text-[#626c65] flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>Concept website preview · Not the official Mambeg Country Guest House website.</span>
        <span>Check-in: 2:00 PM · Check-out: 10:00 AM</span>
      </div>
    </div>
  );
}
