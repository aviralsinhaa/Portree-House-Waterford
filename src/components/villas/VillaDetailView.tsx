import { useEffect, useRef } from 'react';
import { GuestRoom } from '../../types';
import { ArrowLeft, Check, X, MapPin } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ResponsiveImage } from '../ui/ResponsiveImage';

interface VillaDetailViewProps {
  villa: GuestRoom;
  onClose: () => void;
  onRequestStay: (roomId: string) => void;
  onCompareVillas: () => void;
  onSelectOtherVilla: (roomId: string) => void;
  allVillas: GuestRoom[];
}

export function VillaDetailView({
  villa: room,
  onClose,
  onRequestStay,
  onCompareVillas,
  onSelectOtherVilla,
  allVillas: allRooms,
}: VillaDetailViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, true, { autoFocusFirst: true });

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${room.name} Details`}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#faf8f4] text-[#191c1a] animate-fade-in"
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#faf8f4]/95 backdrop-blur-md border-b border-[#191c1a]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1e3325] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property</span>
          </button>
          <span className="text-[#ded8cb]">/</span>
          <span className="font-editorial text-base sm:text-lg text-[#1e3325] font-semibold truncate">
            {room.name}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onRequestStay(room.id)}
            className="px-3.5 py-1.5 rounded-md bg-[#1e3325] hover:bg-[#2a4734] text-[#faf8f4] text-xs font-medium transition-colors shadow-xs"
          >
            Enquire About This Room
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-[#ded8cb]/40 text-[#191c1a] transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#5c7562] font-semibold">
            {room.type} · {room.capacity}
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold mt-1">
            {room.name}
          </h1>
          <p className="text-sm text-[#75675c] italic mt-1">
            {room.subtitle}
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 aspect-[16/10] rounded-xl overflow-hidden bg-[#ded8cb] shadow-sm">
            <ResponsiveImage
              src={room.featuredImage}
              alt={room.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-4 flex flex-col gap-4">
            {room.gallery.slice(1, 3).map((img, idx) => (
              <div key={idx} className="flex-1 aspect-[16/10] md:aspect-auto rounded-xl overflow-hidden bg-[#ded8cb] shadow-sm">
                <ResponsiveImage
                  src={img}
                  alt={`${room.name} view ${idx + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Specifications & Description */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-7 space-y-5">
            <div>
              <h2 className="font-editorial text-2xl text-[#1e3325] mb-2 font-semibold">
                About this room
              </h2>
              <p className="text-sm text-[#3c443f] leading-relaxed">
                {room.description}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider text-[#5c7562] font-semibold">
                KEY HIGHLIGHTS
              </h3>
              <ul className="space-y-1.5 text-xs text-[#282d2a]">
                {room.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3d5642] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-5 bg-[#f5f2eb] p-6 rounded-xl border border-[#191c1a]/8 space-y-5">
            <h3 className="font-editorial text-xl text-[#1e3325] font-semibold">
              Room Details
            </h3>

            <div className="space-y-2.5 text-xs text-[#282d2a] border-b border-[#191c1a]/8 pb-4">
              <div className="flex justify-between">
                <span className="text-[#626c65]">Capacity:</span>
                <span className="font-medium">{room.capacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#626c65]">Bed Setup:</span>
                <span className="font-medium">{room.bedSetup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#626c65]">Bathroom:</span>
                <span className="font-medium">{room.bathroom}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#626c65]">Outlook:</span>
                <span className="font-medium">{room.view}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-wider text-[#5c7562] font-semibold block mb-1">
                INCLUDED AMENITIES
              </span>
              <div className="grid grid-cols-1 gap-1 text-xs text-[#3c443f]">
                {room.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[#3d5642]" />
                    {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => onRequestStay(room.id)}
                className="w-full py-2.5 px-4 rounded-md bg-[#1e3325] hover:bg-[#2a4734] text-[#faf8f4] text-xs font-medium text-center transition-colors shadow-xs"
              >
                Send Stay Enquiry
              </button>
            </div>
          </div>
        </div>

        {/* Other Rooms Navigation */}
        <div className="border-t border-[#191c1a]/10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-editorial text-xl text-[#1e3325] font-semibold">
              Explore other rooms
            </h3>
            <button
              onClick={onCompareVillas}
              className="text-xs text-[#1e3325] hover:underline font-medium"
            >
              Compare all 4 rooms
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {allRooms
              .filter((r) => r.id !== room.id)
              .map((other) => (
                <button
                  key={other.id}
                  onClick={() => onSelectOtherVilla(other.id)}
                  className="text-left p-3 rounded-lg border border-[#191c1a]/8 hover:border-[#1e3325] hover:bg-[#f5f2eb] transition-all"
                >
                  <span className="text-xs uppercase tracking-wider text-[#5c7562] block">
                    {other.type}
                  </span>
                  <span className="font-editorial text-base text-[#1e3325] font-semibold block mt-0.5">
                    {other.name}
                  </span>
                  <span className="text-xs text-[#626c65] mt-1 block">
                    {other.capacity} · {other.bathroom}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
