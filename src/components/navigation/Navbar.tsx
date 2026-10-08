import { useState, useEffect, useRef } from 'react';
import { Menu, MessageSquare } from 'lucide-react';
import gsap from 'gsap';

interface NavbarProps {
  onOpenBooking: () => void;
  onOpenStayAssistant: (prompt?: string) => void;
  onOpenMegaMenu: () => void;
}

export function Navbar({ onOpenBooking, onOpenStayAssistant, onOpenMegaMenu }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 40;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setIsScrolled(next);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial Navbar entrance animation
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mediaQuery.matches && headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.25 }
      );
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Stay', href: '#stay' },
    { label: 'The House', href: '#the-house' },
    { label: 'Breakfast', href: '#breakfast' },
    { label: 'Explore', href: '#explore' },
  ];

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 pt-[env(safe-area-inset-top)] ${
        isScrolled
          ? 'bg-[#faf8f4]/96 backdrop-blur-md border-b border-[#191c1a]/10 py-3 sm:py-3.5 shadow-2xs text-[#191c1a]'
          : 'bg-gradient-to-b from-[#16261b]/85 via-[#16261b]/40 to-transparent py-4 sm:py-5 text-[#faf8f4]'
      }`}
    >
      <div className="w-full max-w-[1360px] mx-auto px-5 sm:px-8 md:px-10 flex items-center justify-between">
        {/* Brand Wordmark */}
        <a
          href="#"
          className="group flex flex-col focus:outline-none shrink-0"
          aria-label="Mambeg Country Guest House Home"
        >
          <span
            className={`font-editorial text-[26px] sm:text-[28px] tracking-tight font-semibold leading-none transition-colors duration-300 ${
              isScrolled ? 'text-[#1e3325]' : 'text-[#fdfcf9]'
            }`}
          >
            MAMBEG
          </span>
          <span
            className={`text-[9.5px] uppercase tracking-[0.26em] font-sans font-medium mt-0.5 transition-colors duration-300 ${
              isScrolled ? 'text-[#5c7562]' : 'text-[#9cb1a1]'
            }`}
          >
            Country Guest House
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 xl:gap-10" aria-label="Primary Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className={`text-[14px] tracking-wide font-sans transition-colors duration-200 relative py-1 group font-medium ${
                isScrolled
                  ? 'text-[#282d2a]/80 hover:text-[#1e3325]'
                  : 'text-[#ded8cb] hover:text-[#faf8f4]'
              }`}
            >
              {link.label}
              <span
                className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-[width] duration-300 group-hover:w-full ${
                  isScrolled ? 'bg-[#1e3325]' : 'bg-[#9cb1a1]'
                }`}
              />
            </a>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Stay Assistant Quick Action */}
          <button
            onClick={() => onOpenStayAssistant()}
            data-cursor="ASSISTANT"
            aria-label="Ask Mambeg Stay Assistant"
            className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[13px] font-sans font-medium transition-all duration-200 ${
              isScrolled
                ? 'border border-[#3d5642]/25 hover:border-[#1e3325] bg-[#3d5642]/5 hover:bg-[#3d5642]/10 text-[#1e3325]'
                : 'border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/15 text-[#faf8f4] backdrop-blur-xs'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#9cb1a1]" />
            <span>Stay Assistant</span>
          </button>

          {/* Direct Stay Enquiry Action */}
          <button
            onClick={onOpenBooking}
            data-cursor="ENQUIRE"
            aria-label="Enquire about a stay at Mambeg"
            className={`px-5 py-2.5 rounded-full text-[13.5px] font-sans font-semibold transition-all duration-200 shadow-xs active:scale-[0.98] ${
              isScrolled
                ? 'bg-[#1e3325] hover:bg-[#2a4734] text-[#faf8f4]'
                : 'bg-[#faf8f4] hover:bg-[#eae3d5] text-[#1e3325]'
            }`}
          >
            Enquire About a Stay
          </button>

          {/* Menu Trigger */}
          <button
            onClick={onOpenMegaMenu}
            data-cursor="MENU"
            className={`p-2 rounded-full transition-colors ${
              isScrolled
                ? 'text-[#191c1a] hover:bg-[#ded8cb]/50'
                : 'text-[#faf8f4] hover:bg-white/10'
            }`}
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
