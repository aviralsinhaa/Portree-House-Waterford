import { useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { MAMBEG_MEDIA } from '../../data/mediaAssets';
import { ArrowLeft, Car, Train, MapPin, X, Phone, Mail } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { ResponsiveImage } from '../ui/ResponsiveImage';

interface GettingHereDestinationViewProps {
  onClose: () => void;
  onOpenBooking: () => void;
}

export function GettingHereDestinationView({
  onClose,
  onOpenBooking,
}: GettingHereDestinationViewProps) {
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
      aria-label="Getting to Mambeg Country Guest House"
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
            Travel & Directions
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
            GARELOCHHEAD · ARGYLL
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold mt-1">
            How to Reach Mambeg
          </h1>
          <p className="text-sm text-[#75675c] italic mt-1">
            {mambegConfig.address}
          </p>
        </div>

        <div className="aspect-[16/9] rounded-xl overflow-hidden bg-[#ded8cb] relative shadow-sm border border-[#191c1a]/8">
          <ResponsiveImage
            src={MAMBEG_MEDIA.surroundings.rosneathRoad}
            alt="Rosneath Road at Mambeg"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#1e3325] font-semibold flex items-center gap-2">
                <Car className="w-5 h-5 text-[#3d5642]" />
                <span>Driving Directions</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#3c443f] leading-relaxed">
                From Glasgow or the south, follow the A82 along Loch Lomond or the A814 via Helensburgh to Garelochhead. From the village roundabout, take the B833 southward toward Kilcreggan.
              </p>
              <p className="text-xs text-[#626c65] leading-relaxed bg-[#f5f2eb] p-3.5 rounded-lg border border-[#191c1a]/6">
                <strong>Arrival Landmark:</strong> After passing the MAMBEG road sign, take the second driveway on the right. Large white signs marked <em>Mambeg House</em> stand at the bottom of the private drive.
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-editorial text-2xl text-[#1e3325] font-semibold flex items-center gap-2">
                <Train className="w-5 h-5 text-[#3d5642]" />
                <span>Train Services</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#3c443f] leading-relaxed">
                Garelochhead Railway Station is situated approximately 1.2 miles away on the iconic West Highland Line. Trains operate regularly to and from Glasgow Queen Street, with north-bound services continuing to Crianlarich, Fort William, and Mallaig.
              </p>
            </div>
          </div>

          <div className="bg-[#f5f2eb] p-6 rounded-xl border border-[#191c1a]/8 space-y-5">
            <h3 className="font-editorial text-xl text-[#1e3325] font-semibold">
              Property & Contact Notes
            </h3>

            <div className="space-y-2.5 text-xs text-[#282d2a] border-b border-[#191c1a]/8 pb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#3d5642] shrink-0" />
                <span>Postcode for GPS: <strong>G84 0EN</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#3d5642] shrink-0" />
                <span>Phone: <strong>{mambegConfig.phone}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3d5642] shrink-0" />
                <span>Email: <strong>{mambegConfig.email}</strong></span>
              </div>
            </div>

            <div className="text-xs text-[#626c65] space-y-1">
              <p><strong>Check-in:</strong> 2:00 PM (14:00)</p>
              <p><strong>Check-out:</strong> 10:00 AM</p>
              <p><strong>Parking:</strong> Free private parking with CCTV coverage.</p>
            </div>

            <div className="pt-2">
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
