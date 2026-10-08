import { mambegConfig } from '../../data/resortConfig';
import { ArrowUp, Phone, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenStayAssistant: () => void;
  onOpenCompareRooms?: () => void;
  onOpenBreakfast?: () => void;
  onOpenExplore?: () => void;
  onOpenGettingHere?: () => void;
  onOpenPracticalInfo?: () => void;
}

export function Footer({
  onOpenBooking,
  onOpenStayAssistant,
  onOpenCompareRooms,
  onOpenBreakfast,
  onOpenExplore,
  onOpenGettingHere,
  onOpenPracticalInfo,
}: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative w-full bg-[#16261b] text-[#f4efe6] pt-16 sm:pt-20 pb-12 border-t border-white/10 overflow-hidden">
      <div className="editorial-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand & Narrative */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <span className="font-editorial text-2xl sm:text-3xl text-[#fdfcf9] font-semibold tracking-tight">
                MAMBEG
              </span>
              <span className="block text-xs uppercase tracking-[0.2em] text-[#9cb1a1] font-medium">
                Country Guest House
              </span>
            </div>

            <p className="font-editorial text-lg text-[#ded8cb] italic font-light max-w-sm">
              &ldquo;{mambegConfig.tagline}&rdquo;
            </p>

            <p className="text-xs text-[#9cb1a1] leading-relaxed max-w-sm">
              A welcoming independent guest house along the western shores of Gare Loch near Helensburgh, offering comfortable en-suite bedrooms and hearty Scottish breakfasts.
            </p>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[11px] uppercase tracking-widest text-[#9cb1a1] font-semibold block mb-2">
              ACCOMMODATION & PROPERTY
            </span>
            <ul className="space-y-2 text-xs text-[#ded8cb]">
              <li>
                <a href="#stay" className="hover:text-white transition-colors">Guest Rooms</a>
              </li>
              <li>
                <a href="#the-house" className="hover:text-white transition-colors">The House & Grounds</a>
              </li>
              {onOpenBreakfast && (
                <li>
                  <button onClick={onOpenBreakfast} className="hover:text-white transition-colors text-left">
                    Breakfast & Residents Lounge
                  </button>
                </li>
              )}
              {onOpenCompareRooms && (
                <li>
                  <button onClick={onOpenCompareRooms} className="hover:text-white transition-colors text-left">
                    Compare All 4 Rooms
                  </button>
                </li>
              )}
              {onOpenExplore && (
                <li>
                  <button onClick={onOpenExplore} className="hover:text-white transition-colors text-left">
                    Explore Local Area
                  </button>
                </li>
              )}
              {onOpenPracticalInfo && (
                <li>
                  <button onClick={onOpenPracticalInfo} className="hover:text-white transition-colors text-left">
                    Practical Info & FAQs
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-4 space-y-3.5">
            <span className="text-[11px] uppercase tracking-widest text-[#9cb1a1] font-semibold block mb-2">
              CONTACT & LOCATION
            </span>

            <div className="space-y-2 text-xs text-[#ded8cb]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#9cb1a1] shrink-0 mt-0.5" />
                <span>{mambegConfig.address}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9cb1a1] shrink-0" />
                <a href={`tel:${mambegConfig.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                  {mambegConfig.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#9cb1a1] shrink-0" />
                <a href={`mailto:${mambegConfig.email}`} className="hover:text-white transition-colors">
                  {mambegConfig.email}
                </a>
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 rounded-md bg-[#faf8f4] hover:bg-[#eae3d5] text-[#1e3325] text-xs font-medium transition-colors"
              >
                Send Stay Enquiry
              </button>
              <button
                onClick={onOpenStayAssistant}
                className="px-3.5 py-2 rounded-md border border-white/20 hover:border-white text-xs text-[#f4efe6] transition-colors"
              >
                Stay Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with Discreet Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] text-[#9cb1a1] font-sans">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()} Mambeg Country Guest House.</span>
            <span className="hidden sm:inline">·</span>
            <span className="text-[12px] text-[#ded8cb]/80 italic">
              Concept preview · Northcrest & Co. Not the official property website.
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors text-xs"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
