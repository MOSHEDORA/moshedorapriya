import React, { useState } from 'react';
import { 
  Menu, 
  X,
  MessageSquareHeart
} from 'lucide-react';
import { HeaderHero } from './components/HeaderHero';
import { CoupleSection } from './components/CoupleSection';
import { InteractiveCalendar } from './components/InteractiveCalendar';
import { CreativeVenueSection } from './components/CreativeVenueSection';
import { PhotoGallery } from './components/PhotoGallery';
import { WeddingFunGame } from './components/WeddingFunGame';
import { BlessingsWall } from './components/BlessingsWall';
import { MusicPlayer } from './components/MusicPlayer';
import { Footer } from './components/Footer';
import { InvitationOpening } from './components/InvitationOpening';
import { JungleAtmosphere } from './components/JungleAtmosphere';
import { defaultPhotos } from './data/weddingData';
import { PhotoItem } from './types';

export default function App() {
  // First look is the ceremonial double doors opening
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [photos] = useState<PhotoItem[]>(defaultPhotos);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-[#2A2A2A] selection:bg-[#D4AF37]/30 selection:text-[#0F3D32] relative overflow-x-hidden">
      {/* Floating Jungle Rainforest Atmosphere (Leaves, Vines, Canopy & Butterflies) */}
      <JungleAtmosphere />

      {/* Top Royal Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#D4AF37]/40 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo / Monogram */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-left cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#FBF6EC] group-hover:scale-105 transition-transform">
              <span className="font-vibes text-xl text-[#996515] font-bold">MP</span>
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold text-[#0F3D32] tracking-wider uppercase">
                Moshe Dora &amp; Priya
              </div>
              <div className="text-[10px] font-cinzel text-[#C59B27] tracking-widest uppercase">
                Thursday, Sep 03, 2026
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-6 font-cinzel text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]">
            <button 
              onClick={() => scrollToSection('calendar')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              Calendar &amp; Countdown
            </button>
            <button 
              onClick={() => scrollToSection('venue')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              Venue &amp; Location
            </button>
            <button 
              onClick={() => scrollToSection('couple')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              The Couple
            </button>
            <button 
              onClick={() => scrollToSection('game')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              Fun Games
            </button>
            <button 
              onClick={() => scrollToSection('blessings')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              Blessings
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              Gallery
            </button>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={() => setIsEnvelopeOpen(false)}
              className="px-3.5 py-1.5 rounded-full border border-[#D4AF37] hover:bg-[#F2F7F4] text-[#0F3D32] font-cinzel text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="View the ceremonial wedding gates opening"
            >
              <span>🌿 Wedding Gates</span>
            </button>

            <button
              onClick={() => scrollToSection('blessings')}
              className="px-4 py-1.5 rounded-full bg-[#0F3D32] hover:bg-[#1B5A48] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquareHeart className="w-3.5 h-3.5 fill-current" />
              <span>Send Blessings</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#0F3D32] hover:bg-[#FBF6EC] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF9] border-b border-[#D4AF37]/40 px-6 py-4 space-y-2.5 font-cinzel text-sm max-h-[80vh] overflow-y-auto">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEnvelopeOpen(false);
              }}
              className="block w-full text-left py-2 text-[#0F3D32] font-bold"
            >
              🌿 View Wedding Gates
            </button>
            <button
              onClick={() => scrollToSection('calendar')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              📅 Date (Sep 03, 2026) &amp; Calendar
            </button>
            <button
              onClick={() => scrollToSection('venue')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              📍 Vedika Function Hall &amp; Location
            </button>
            <button
              onClick={() => scrollToSection('couple')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              👑 The Couple &amp; Lineage
            </button>
            <button
              onClick={() => scrollToSection('game')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              🎉 Wedding Fun Games
            </button>
            <button
              onClick={() => scrollToSection('blessings')}
              className="block w-full text-left py-1.5 text-[#5E1626] font-bold"
            >
              ✍️ Guest Blessings &amp; Prayers
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              📷 Photo Gallery
            </button>
          </div>
        )}
      </header>

      {/* Main Content Sections */}
      <main>
        {/* Hero Section with John 2:2 Verse at Top */}
        <HeaderHero />

        {/* Countdown and Calendar (Positioned Above Location) */}
        <InteractiveCalendar />

        {/* Wedding Venue & Location Guide */}
        <CreativeVenueSection />

        {/* The Couple Profile & Lineage */}
        <CoupleSection
          photos={photos}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />

        {/* Interactive Wedding Fun Games */}
        <WeddingFunGame />

        {/* Guest Blessings & Prayer Wall */}
        <BlessingsWall />

        {/* Photo Album & Picture Gallery (Single Unified Album - Moved to Last) */}
        <PhotoGallery
          photos={photos}
          selectedPhoto={selectedPhoto}
          onSelectPhoto={(photo) => setSelectedPhoto(photo)}
        />
      </main>

      {/* Background Shehnai / Music Player Floating Control */}
      <MusicPlayer />

      {/* Royal Footer */}
      <Footer />

      {/* First Look Royal Invitation Opening Overlay with 3D Double Doors */}
      <InvitationOpening 
        isOpen={isEnvelopeOpen} 
        onOpen={() => setIsEnvelopeOpen(true)} 
      />
    </div>
  );
}
