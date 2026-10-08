import { useState, useEffect, useRef } from 'react';
import { mambegConfig } from '../../data/resortConfig';
import { X, CheckCircle, Mail, Calendar, Users, Phone, AlertCircle } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRoomId?: string;
  initialGuests?: number;
  initialNotes?: string;
}

export function BookingModal({
  isOpen,
  onClose,
  initialRoomId,
  initialGuests = 2,
  initialNotes,
}: BookingModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, isOpen, { autoFocusFirst: true });

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [guests, setGuests] = useState(initialGuests);
  const [selectedRoomId, setSelectedRoomId] = useState<string>(initialRoomId || 'any');
  const [notes, setNotes] = useState(initialNotes || '');
  const [isPrepared, setIsPrepared] = useState(false);
  const [dateError, setDateError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (initialRoomId) setSelectedRoomId(initialRoomId);
  }, [initialRoomId]);

  useEffect(() => {
    if (!isOpen) {
      setIsPrepared(false);
      setDateError('');
      return;
    }
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (arrivalDate && departureDate && departureDate <= arrivalDate) {
      setDateError('Departure date must be after your arrival date.');
      return;
    }
    setDateError('');
    setIsPrepared(true);
  };

  const selectedRoom = mambegConfig.rooms.find((r) => r.id === selectedRoomId);

  const emailSubject = encodeURIComponent(
    `Stay Enquiry: ${fullName || 'Guest'} (${guests} Guests${selectedRoom ? ` - ${selectedRoom.name}` : ''})`
  );

  const emailBody = encodeURIComponent(
    `Hello David,\n\nI would like to enquire about staying at Mambeg Country Guest House.\n\n` +
      `Guest Name: ${fullName}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone || 'Not provided'}\n` +
      `Arrival Date: ${arrivalDate || 'Flexible'}\n` +
      `Departure Date: ${departureDate || 'Flexible'}\n` +
      `Number of Guests: ${guests}\n` +
      `Room Choice: ${selectedRoom ? selectedRoom.name : 'Any Available Room'}\n` +
      `Special Notes / Requests: ${notes || 'None'}\n\n` +
      `Thank you!`
  );

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Prepare Stay Enquiry"
      className="fixed inset-0 z-50 overflow-y-auto bg-[#142218]/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-2xl bg-[#faf8f4] text-[#191c1a] rounded-2xl shadow-2xl border border-[#191c1a]/12 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 border-b border-[#191c1a]/10 flex items-center justify-between bg-[#f5f2eb]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-[#5c7562] font-semibold font-sans">
              DIRECT RESERVATION ENQUIRY
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#1e3325] font-semibold mt-0.5">
              Prepare Your Stay Enquiry
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#ded8cb]/60 text-[#191c1a] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {isPrepared ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-14 h-14 rounded-full bg-[#3d5642]/10 text-[#3d5642] flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-editorial text-3xl text-[#1e3325] font-semibold">
                Enquiry Details Prepared
              </h3>
              <p className="text-[15px] text-[#3c443f] max-w-md mx-auto leading-relaxed font-sans">
                Thank you, <strong>{fullName}</strong>. Your enquiry details have been formatted for host David. Click below to open your email client and send directly to the property.
              </p>

              <div className="bg-[#f5f2eb] p-5 rounded-xl border border-[#191c1a]/10 text-left text-[13.5px] space-y-2 max-w-md mx-auto font-sans">
                <p><strong>Dates:</strong> {arrivalDate || 'Flexible'} to {departureDate || 'Flexible'}</p>
                <p><strong>Party Size:</strong> {guests} Guests</p>
                <p><strong>Room Choice:</strong> {selectedRoom ? selectedRoom.name : 'Any Available Room'}</p>
                {notes && <p><strong>Notes:</strong> {notes}</p>}
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`mailto:${mambegConfig.email}?subject=${emailSubject}&body=${emailBody}`}
                  className="btn-primary w-full sm:w-auto text-[14px] py-3.5 px-7"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email ({mambegConfig.email})</span>
                </a>
                <button
                  onClick={onClose}
                  className="btn-secondary w-full sm:w-auto text-[14px] py-3.5 px-6"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Eleanor Campbell"
                    className="w-full h-[46px] px-3.5 text-[14.5px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. name@example.co.uk"
                    className="w-full h-[46px] px-3.5 text-[14.5px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+44 7..."
                    className="w-full h-[46px] px-3.5 text-[14.5px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                    Arrival Date
                  </label>
                  <input
                    type="date"
                    min={todayStr}
                    value={arrivalDate}
                    onChange={(e) => {
                      setArrivalDate(e.target.value);
                      setDateError('');
                    }}
                    className="w-full h-[46px] px-3 text-[14px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                    Departure Date
                  </label>
                  <input
                    type="date"
                    min={arrivalDate || todayStr}
                    value={departureDate}
                    onChange={(e) => {
                      setDepartureDate(e.target.value);
                      setDateError('');
                    }}
                    className="w-full h-[46px] px-3 text-[14px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                  />
                </div>
              </div>

              {dateError && (
                <div className="flex items-center gap-2 text-rose-700 text-[13px] bg-rose-50 p-2.5 rounded-lg border border-rose-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{dateError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                    Number of Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full h-[46px] px-3 text-[14.5px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                  >
                    <option value={1}>1 Guest</option>
                    <option value={2}>2 Guests</option>
                    <option value={3}>3 Guests (Family Suite)</option>
                    <option value={4}>4 Guests (Family Suite)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                    Room Preference
                  </label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full h-[46px] px-3 text-[14.5px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                  >
                    <option value="any">Any Available Room</option>
                    {mambegConfig.rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} ({r.type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#282d2a] mb-1.5">
                  Message / Special Requests
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Estimated arrival time, bringing a dog, dietary notes, etc."
                  className="w-full p-3 text-[14px] rounded-lg bg-[#f5f2eb] border border-[#191c1a]/15 focus:outline-none focus:border-[#1e3325] transition-colors"
                />
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#191c1a]/10">
                <div className="text-[13px] text-[#585145]">
                  <span>Or telephone directly: </span>
                  <a
                    href={`tel:${mambegConfig.phone.replace(/\s+/g, '')}`}
                    className="font-semibold text-[#1e3325] hover:underline"
                  >
                    {mambegConfig.phone}
                  </a>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full sm:w-auto text-[14px] py-3 px-7"
                >
                  Prepare Enquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
