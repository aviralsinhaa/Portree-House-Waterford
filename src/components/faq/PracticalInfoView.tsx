import { useState, useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { ArrowLeft, ChevronDown, X, Phone, Mail } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface PracticalInfoViewProps {
  onClose: () => void;
  onRequestStay: () => void;
}

export function PracticalInfoView({
  onClose,
  onRequestStay,
}: PracticalInfoViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, true, { autoFocusFirst: true });

  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Practical Information & FAQs"
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
            Practical Info & FAQs
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
            ESSENTIAL DETAILS
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#1e3325] font-semibold mt-1">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#626c65] mt-2 max-w-2xl leading-relaxed">
            Verified information for guests planning a stay at Mambeg Country Guest House in Garelochhead.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {mambegConfig.faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="bg-[#f5f2eb] rounded-xl border border-[#191c1a]/8 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-editorial text-lg text-[#1e3325] font-semibold"
                  aria-expanded={isOpen}
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#5c7562] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-[#3c443f] leading-relaxed border-t border-[#191c1a]/6 mt-1">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Direct Contact Card */}
        <div className="bg-[#f5f2eb] p-6 rounded-xl border border-[#191c1a]/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-editorial text-xl text-[#1e3325] font-semibold">
              Have a specific question?
            </h3>
            <p className="text-xs text-[#626c65] mt-1">
              Contact host directly by telephone or email for immediate assistance.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#1e3325] mt-2">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#3d5642]" />
                {mambegConfig.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#3d5642]" />
                {mambegConfig.email}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onRequestStay();
            }}
            className="py-2.5 px-5 rounded-md bg-[#1e3325] hover:bg-[#2a4734] text-[#faf8f4] text-xs font-medium whitespace-nowrap shadow-xs"
          >
            Send Stay Enquiry
          </button>
        </div>
      </main>
    </div>
  );
}
