import { useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { ArrowLeft, Check, MapPin, X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ResponsiveImage } from '../ui/ResponsiveImage';

interface ExperiencesDestinationViewProps {
  onClose: () => void;
  selectedAttractionId?: string;
  onOpenBooking: () => void;
}

export function ExperiencesDestinationView({
  onClose,
  selectedAttractionId,
  onOpenBooking,
}: ExperiencesDestinationViewProps) {
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

  const attraction = mambegConfig.attractions.find((a) => a.id === selectedAttractionId) || mambegConfig.attractions[0];

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Explore Argyll & Gare Loch"
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
            {attraction.title}
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

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#5c7562] font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#3d5642]" />
            <span>{attraction.distance} · {attraction.category}</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold">
            {attraction.title}
          </h1>
        </div>

        <div className="aspect-[16/10] rounded-xl overflow-hidden bg-[#ded8cb] relative shadow-sm border border-[#191c1a]/8">
          <ResponsiveImage
            src={attraction.image}
            alt={attraction.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-8 space-y-4">
            <h2 className="font-editorial text-2xl text-[#1e3325] font-semibold">
              About this location
            </h2>
            <p className="text-sm text-[#3c443f] leading-relaxed">
              {attraction.description}
            </p>

            <div className="space-y-2 pt-2">
              <h3 className="text-xs uppercase tracking-wider text-[#5c7562] font-semibold">
                LOCAL HIGHLIGHTS
              </h3>
              <ul className="space-y-1.5 text-xs text-[#282d2a]">
                {attraction.highlights.map((h) => (
                  <li key={h} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#3d5642] shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-4 bg-[#f5f2eb] p-6 rounded-xl border border-[#191c1a]/8 space-y-4">
            <h3 className="font-editorial text-xl text-[#1e3325] font-semibold">
              Stay at Mambeg
            </h3>
            <p className="text-xs text-[#626c65] leading-relaxed">
              Experience the tranquility of the Scottish countryside and explore the surrounding area from our welcoming guest house.
            </p>
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

        <div className="border-t border-[#191c1a]/10 pt-8">
          <h3 className="font-editorial text-xl text-[#1e3325] font-semibold mb-4">
            Other Nearby Highlights
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {mambegConfig.attractions
              .filter((a) => a.id !== attraction.id)
              .map((other) => (
                <div
                  key={other.id}
                  className="bg-[#f5f2eb] p-4 rounded-lg border border-[#191c1a]/8"
                >
                  <span className="text-[10px] text-[#5c7562] uppercase tracking-wider block">
                    {other.distance}
                  </span>
                  <h4 className="font-editorial text-base text-[#1e3325] font-semibold mt-1">
                    {other.title}
                  </h4>
                  <p className="text-xs text-[#626c65] line-clamp-2 mt-1">
                    {other.description}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
