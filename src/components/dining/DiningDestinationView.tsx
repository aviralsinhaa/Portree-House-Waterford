import { useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { MAMBEG_MEDIA } from '../../data/mediaAssets';
import { ArrowLeft, Check, Coffee, X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ResponsiveImage } from '../ui/ResponsiveImage';

interface DiningDestinationViewProps {
  onClose: () => void;
  onOpenBooking: () => void;
}

export function DiningDestinationView({ onClose, onOpenBooking }: DiningDestinationViewProps) {
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
      aria-label="Breakfast & Dining at Mambeg"
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
            Breakfast & Lounge
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

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#5c7562] font-semibold">
            MORNING HOSPITALITY
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold mt-1">
            {mambegConfig.breakfast.headline}
          </h1>
          <p className="text-sm text-[#75675c] italic mt-1">
            {mambegConfig.breakfast.subtitle}
          </p>
        </div>

        {/* Authentic Lounge Photo */}
        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#ded8cb] relative shadow-sm border border-[#191c1a]/8">
          <ResponsiveImage
            src={MAMBEG_MEDIA.property.lounge}
            alt="Mambeg Country Guest House residents lounge with dining table and microwave"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 bg-[#191c1a]/70 backdrop-blur-xs px-2.5 py-1 rounded text-xs text-[#faf8f4] font-sans">
            Residents Lounge with dining tables & evening microwave
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="font-editorial text-2xl text-[#1e3325] font-semibold">
              Breakfast Service
            </h2>
            <p className="text-xs sm:text-sm text-[#3c443f] leading-relaxed">
              Start the morning with breakfast before heading out to explore the surrounding area. Guest feedback consistently highlights the high food quality and warm service of the freshly cooked Full Scottish Breakfast.
            </p>
            <ul className="space-y-2 text-xs text-[#282d2a] pt-2">
              {mambegConfig.breakfast.details.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#3d5642] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#f5f2eb] p-6 rounded-xl border border-[#191c1a]/8 space-y-4">
            <h2 className="font-editorial text-xl text-[#1e3325] font-semibold">
              Residents Lounge Amenities
            </h2>
            <p className="text-xs text-[#626c65] leading-relaxed">
              For evening convenience, guests have round-the-clock access to the common lounge space to reheat meals or relax after outdoor excursions:
            </p>
            <ul className="space-y-2 text-xs text-[#282d2a] pt-1">
              {mambegConfig.breakfast.loungeAmenities.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#3d5642] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3">
              <button
                onClick={() => {
                  onClose();
                  onOpenBooking();
                }}
                className="w-full py-2.5 px-4 rounded-md bg-[#1e3325] hover:bg-[#2a4734] text-[#faf8f4] text-xs font-medium text-center transition-colors shadow-xs"
              >
                Enquire About a Stay
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
