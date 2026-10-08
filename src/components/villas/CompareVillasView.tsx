import { useEffect, useRef } from 'react';
import { GuestRoom } from '../../types';
import { ArrowLeft, Check, X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ResponsiveImage } from '../ui/ResponsiveImage';

interface CompareVillasViewProps {
  villas: GuestRoom[];
  onClose: () => void;
  onSelectVilla: (roomId: string) => void;
  onRequestStay: (roomId: string) => void;
  onAskConcierge: (prompt: string) => void;
}

export function CompareVillasView({
  villas: rooms,
  onClose,
  onSelectVilla: onSelectRoom,
  onRequestStay,
}: CompareVillasViewProps) {
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
      aria-label="Compare Rooms"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#faf8f4] text-[#191c1a] animate-fade-in"
    >
      <header className="sticky top-0 z-40 w-full bg-[#faf8f4]/95 backdrop-blur-md border-b border-[#191c1a]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1e3325] hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Property</span>
          </button>
          <span className="text-[#ded8cb]">/</span>
          <span className="font-editorial text-lg text-[#1e3325] font-semibold">
            Compare Accommodations
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-md hover:bg-[#ded8cb]/40 text-[#191c1a] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#5c7562] font-semibold">
            SIDE-BY-SIDE OVERVIEW
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold mt-1">
            Compare Guest Rooms
          </h1>
          <p className="text-sm text-[#626c65] mt-2 max-w-2xl leading-relaxed">
            Review features, capacity, bed configurations, and en-suite details across all four guest room options at Mambeg Country Guest House.
          </p>
        </div>

        <div className="overflow-x-auto pb-6">
          <div className="grid grid-cols-4 gap-4 min-w-[800px]">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-[#f5f2eb] rounded-xl border border-[#191c1a]/8 p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="aspect-[16/10] rounded-lg overflow-hidden bg-[#ded8cb] mb-3">
                    <ResponsiveImage
                      src={room.featuredImage}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#5c7562] font-semibold block">
                    {room.type}
                  </span>
                  <h3 className="font-editorial text-lg text-[#1e3325] font-semibold mt-0.5">
                    {room.name}
                  </h3>
                </div>

                <div className="space-y-3 text-xs text-[#282d2a] border-t border-[#191c1a]/8 pt-3">
                  <div>
                    <span className="text-[#626c65] block">Capacity:</span>
                    <span className="font-medium">{room.capacity}</span>
                  </div>
                  <div>
                    <span className="text-[#626c65] block">Bed Setup:</span>
                    <span className="font-medium">{room.bedSetup}</span>
                  </div>
                  <div>
                    <span className="text-[#626c65] block">Bathroom:</span>
                    <span className="font-medium">{room.bathroom}</span>
                  </div>
                  <div>
                    <span className="text-[#626c65] block">Outlook:</span>
                    <span className="font-medium">{room.view}</span>
                  </div>
                  <div>
                    <span className="text-[#626c65] block mb-1">Amenities:</span>
                    <ul className="space-y-1 text-[11px] text-[#3c443f]">
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3d5642]" /> Silent In-Room Fridge
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3d5642]" /> Tea & Coffee Tray
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3d5642]" /> TV & DVD Player
                      </li>
                      <li className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#3d5642]" /> Free High-Speed Wi-Fi
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-2 space-y-2 border-t border-[#191c1a]/8">
                  <button
                    onClick={() => onRequestStay(room.id)}
                    className="w-full py-2 px-3 rounded-md bg-[#1e3325] hover:bg-[#2a4734] text-[#faf8f4] text-xs font-medium transition-colors text-center"
                  >
                    Enquire Now
                  </button>
                  <button
                    onClick={() => onSelectRoom(room.id)}
                    className="w-full py-1.5 px-3 rounded-md border border-[#191c1a]/15 hover:bg-[#faf8f4] text-[#1e3325] text-xs font-medium transition-colors text-center"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
