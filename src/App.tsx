import { useState, lazy, Suspense } from 'react';
import { MessageSquare } from 'lucide-react';
import { CustomCursor } from './components/ui/CustomCursor';
import { Navbar } from './components/navigation/Navbar';
import { MegaMenu } from './components/navigation/MegaMenu';
import { ArrivalChapter } from './components/arrival/ArrivalChapter';
import { IslandChapter } from './components/island/IslandChapter';
import { StayChapter } from './components/villas/StayChapter';
import { IslandLifeChapter } from './components/island/IslandLifeChapter';
import { DayAtMambegChapter } from './components/day/DayAtMambegChapter';
import { DiscoverChapter } from './components/discover/DiscoverChapter';
import { GettingHereChapter } from './components/logistics/GettingHereChapter';
import { PlanEscapeSection } from './components/plan/PlanEscapeSection';
import { Footer } from './components/footer/Footer';
import type { ConciergeHandoffData } from './components/concierge/PrivateConciergeModal';
import { mambegConfig } from './data/resortConfig';

// Lazy load modals and deep destination views
const StayAssistantModal = lazy(() =>
  import('./components/concierge/PrivateConciergeModal').then((m) => ({
    default: m.PrivateConciergeModal,
  }))
);

const BookingModal = lazy(() =>
  import('./components/booking/BookingModal').then((m) => ({
    default: m.BookingModal,
  }))
);

const VillaDetailView = lazy(() =>
  import('./components/villas/VillaDetailView').then((m) => ({
    default: m.VillaDetailView,
  }))
);

const CompareVillasView = lazy(() =>
  import('./components/villas/CompareVillasView').then((m) => ({
    default: m.CompareVillasView,
  }))
);

const DiningDestinationView = lazy(() =>
  import('./components/dining/DiningDestinationView').then((m) => ({
    default: m.DiningDestinationView,
  }))
);

const ExperiencesDestinationView = lazy(() =>
  import('./components/experiences/ExperiencesDestinationView').then((m) => ({
    default: m.ExperiencesDestinationView,
  }))
);

const GettingHereDestinationView = lazy(() =>
  import('./components/logistics/GettingHereDestinationView').then((m) => ({
    default: m.GettingHereDestinationView,
  }))
);

const PracticalInfoView = lazy(() =>
  import('./components/faq/PracticalInfoView').then((m) => ({
    default: m.PracticalInfoView,
  }))
);

function OverlayFallback() {
  return (
    <div
      role="status"
      aria-label="Loading view"
      className="fixed inset-0 z-50 bg-[#faf8f4]/90 backdrop-blur-md flex items-center justify-center pointer-events-none select-none transition-opacity duration-300"
    >
      <div className="flex flex-col items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-[#1e3325] animate-ping" />
        <span className="font-editorial text-xs tracking-[0.25em] uppercase text-[#1e3325] font-semibold">
          MAMBEG
        </span>
      </div>
    </div>
  );
}

export default function App() {
  // Modal & interactive states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingRoomId, setBookingRoomId] = useState<string | undefined>(undefined);
  const [bookingGuests, setBookingGuests] = useState<number>(2);
  const [bookingNotes, setBookingNotes] = useState<string | undefined>(undefined);

  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantPrompt, setAssistantPrompt] = useState<string | undefined>(undefined);
  const [assistantRoomId, setAssistantRoomId] = useState<string | undefined>(undefined);

  // Overlays
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [detailRoomId, setDetailRoomId] = useState<string | null>(null);
  const [isCompareRoomsOpen, setIsCompareRoomsOpen] = useState(false);
  const [isBreakfastOpen, setIsBreakfastOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [selectedAttractionId, setSelectedAttractionId] = useState<string | undefined>(undefined);
  const [isGettingHereOpen, setIsGettingHereOpen] = useState(false);
  const [isPracticalInfoOpen, setIsPracticalInfoOpen] = useState(false);

  // Handlers
  const handleOpenBooking = (roomId?: string, guests?: number, notes?: string) => {
    setBookingRoomId(roomId);
    if (guests) setBookingGuests(guests);
    if (notes) setBookingNotes(notes);
    setIsBookingOpen(true);
  };

  const handleOpenStayAssistant = (prompt?: string, roomId?: string) => {
    setAssistantPrompt(prompt);
    setAssistantRoomId(roomId);
    setIsAssistantOpen(true);
  };

  const handleAssistantHandoff = (data: ConciergeHandoffData) => {
    setIsAssistantOpen(false);
    handleOpenBooking(data.villaId, data.guests, data.notes);
  };

  const handleOpenExploreDetail = (attractionId: string) => {
    setSelectedAttractionId(attractionId);
    setIsExploreOpen(true);
  };

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const currentDetailRoom = detailRoomId
    ? mambegConfig.rooms.find((r) => r.id === detailRoomId) || mambegConfig.rooms[0]
    : null;

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#191c1a] relative font-sans selection:bg-[#3d5642]/20 selection:text-[#1e3325]">
      {/* Custom Pointer on non-touch devices */}
      <CustomCursor />

      {/* Top Navigation */}
      <Navbar
        onOpenBooking={() => handleOpenBooking()}
        onOpenStayAssistant={(prompt) => handleOpenStayAssistant(prompt)}
        onOpenMegaMenu={() => setIsMegaMenuOpen(true)}
      />

      {/* Slide-over Mega Menu */}
      <MegaMenu
        isOpen={isMegaMenuOpen}
        onClose={() => setIsMegaMenuOpen(false)}
        onNavigateSection={handleNavigateSection}
        onOpenRoomDetail={(id) => setDetailRoomId(id)}
        onOpenCompareRooms={() => setIsCompareRoomsOpen(true)}
        onOpenBreakfast={() => setIsBreakfastOpen(true)}
        onOpenExplore={() => {
          setSelectedAttractionId(undefined);
          setIsExploreOpen(true);
        }}
        onOpenPracticalInfo={() => setIsPracticalInfoOpen(true)}
        onOpenStayAssistant={() => handleOpenStayAssistant()}
        onOpenBooking={() => handleOpenBooking()}
      />

      {/* Main Editorial Chapters */}
      <main id="main-content">
        {/* 1. Countryside Hero */}
        <ArrivalChapter
          onOpenBooking={() => handleOpenBooking()}
          onOpenStayAssistant={(prompt) => handleOpenStayAssistant(prompt)}
        />

        {/* 2. The Property Story */}
        <IslandChapter
          onNavigateToStay={() => handleNavigateSection('stay')}
          onOpenBreakfast={() => setIsBreakfastOpen(true)}
          onOpenExplore={() => setIsExploreOpen(true)}
        />

        {/* 3. Room Explorer */}
        <StayChapter
          onReserveRoom={(roomId) => handleOpenBooking(roomId)}
          onOpenRoomDetail={(roomId) => setDetailRoomId(roomId)}
          onOpenCompareRooms={() => setIsCompareRoomsOpen(true)}
          onOpenStayAssistant={(prompt, roomId) => handleOpenStayAssistant(prompt, roomId)}
        />

        {/* 4. Grounds & Why Mambeg */}
        <IslandLifeChapter
          onOpenBreakfast={() => setIsBreakfastOpen(true)}
          onOpenExplore={() => setIsExploreOpen(true)}
        />

        {/* 5. A Day at Mambeg */}
        <DayAtMambegChapter />

        {/* 6. Explore From Mambeg & Photo Gallery */}
        <DiscoverChapter
          onOpenExploreDetail={handleOpenExploreDetail}
          onOpenBooking={() => handleOpenBooking()}
        />

        {/* 7. Getting Here & Directions */}
        <GettingHereChapter
          onOpenGettingHereDetails={() => setIsGettingHereOpen(true)}
        />

        {/* 8. Plan Your Stay (CTA Banner) */}
        <PlanEscapeSection
          onOpenStayAssistant={(prompt) => handleOpenStayAssistant(prompt)}
          onOpenBooking={() => handleOpenBooking()}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={() => handleOpenBooking()}
        onOpenStayAssistant={() => handleOpenStayAssistant()}
        onOpenCompareRooms={() => setIsCompareRoomsOpen(true)}
        onOpenBreakfast={() => setIsBreakfastOpen(true)}
        onOpenExplore={() => setIsExploreOpen(true)}
        onOpenGettingHere={() => setIsGettingHereOpen(true)}
        onOpenPracticalInfo={() => setIsPracticalInfoOpen(true)}
      />

      {/* Persistent Floating Stay Assistant Launcher */}
      {!isAssistantOpen && !isBookingOpen && (
        <aside aria-label="Quick Concierge Access" className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
          <button
            onClick={() => handleOpenStayAssistant()}
            data-cursor="ASSISTANT"
            aria-label="Open Mambeg Stay Assistant"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1e3325] text-[#faf8f4] hover:bg-[#2a4734] border border-[#ded8cb]/20 shadow-xl transition-all duration-300 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#9cb1a1]"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9cb1a1] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9cb1a1]" />
            </span>
            <MessageSquare className="w-4 h-4 text-[#ded8cb] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-sans font-medium tracking-wide">
              Stay Assistant
            </span>
          </button>
        </aside>
      )}

      {/* Modal / Deep Overlays */}
      <Suspense fallback={<OverlayFallback />}>
        {/* Direct Stay Enquiry Modal */}
        {isBookingOpen && (
          <BookingModal
            isOpen={isBookingOpen}
            onClose={() => setIsBookingOpen(false)}
            initialRoomId={bookingRoomId}
            initialGuests={bookingGuests}
            initialNotes={bookingNotes}
          />
        )}

        {/* Mambeg Stay Assistant Modal */}
        {isAssistantOpen && (
          <StayAssistantModal
            isOpen={isAssistantOpen}
            onClose={() => setIsAssistantOpen(false)}
            onHandoffToBooking={handleAssistantHandoff}
            initialPrompt={assistantPrompt}
            contextVillaId={assistantRoomId}
          />
        )}

        {/* Room Detail Modal View */}
        {detailRoomId && currentDetailRoom && (
          <VillaDetailView
            villa={currentDetailRoom}
            onClose={() => setDetailRoomId(null)}
            onRequestStay={(id) => {
              setDetailRoomId(null);
              handleOpenBooking(id);
            }}
            onCompareVillas={() => {
              setDetailRoomId(null);
              setIsCompareRoomsOpen(true);
            }}
            onSelectOtherVilla={(id) => setDetailRoomId(id)}
            allVillas={mambegConfig.rooms}
          />
        )}

        {/* Compare All Rooms View */}
        {isCompareRoomsOpen && (
          <CompareVillasView
            villas={mambegConfig.rooms}
            onClose={() => setIsCompareRoomsOpen(false)}
            onSelectVilla={(id) => {
              setIsCompareRoomsOpen(false);
              setDetailRoomId(id);
            }}
            onRequestStay={(id) => {
              setIsCompareRoomsOpen(false);
              handleOpenBooking(id);
            }}
            onAskConcierge={(prompt) => {
              setIsCompareRoomsOpen(false);
              handleOpenStayAssistant(prompt);
            }}
          />
        )}

        {/* Breakfast & Residents Lounge Destination View */}
        {isBreakfastOpen && (
          <DiningDestinationView
            onClose={() => setIsBreakfastOpen(false)}
            onOpenBooking={() => {
              setIsBreakfastOpen(false);
              handleOpenBooking();
            }}
          />
        )}

        {/* Explore Local Area Destination View */}
        {isExploreOpen && (
          <ExperiencesDestinationView
            selectedAttractionId={selectedAttractionId}
            onClose={() => setIsExploreOpen(false)}
            onOpenBooking={() => {
              setIsExploreOpen(false);
              handleOpenBooking();
            }}
          />
        )}

        {/* Getting Here & Directions View */}
        {isGettingHereOpen && (
          <GettingHereDestinationView
            onClose={() => setIsGettingHereOpen(false)}
            onOpenBooking={() => {
              setIsGettingHereOpen(false);
              handleOpenBooking();
            }}
          />
        )}

        {/* Practical Info & FAQ View */}
        {isPracticalInfoOpen && (
          <PracticalInfoView
            onClose={() => setIsPracticalInfoOpen(false)}
            onRequestStay={() => {
              setIsPracticalInfoOpen(false);
              handleOpenBooking();
            }}
          />
        )}
      </Suspense>
    </div>
  );
}
