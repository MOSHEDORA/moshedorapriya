import React, { useState } from 'react';
import { 
  Menu, 
  X,
  MessageSquareHeart,
  Globe
} from 'lucide-react';
import { HeaderHero } from './components/HeaderHero';
import { CoupleSection } from './components/CoupleSection';
import { InteractiveCalendar } from './components/InteractiveCalendar';
import { CreativeVenueSection } from './components/CreativeVenueSection';
import { PhotoGallery } from './components/PhotoGallery';
import { EngagementVideoSection } from './components/EngagementVideoSection';
import { WeddingChatbot } from './components/WeddingChatbot';
import { WeddingFunGame } from './components/WeddingFunGame';
import { BlessingsWall } from './components/BlessingsWall';
import { MusicPlayer } from './components/MusicPlayer';
import { Footer } from './components/Footer';
import { InvitationOpening } from './components/InvitationOpening';
import { JungleAtmosphere } from './components/JungleAtmosphere';
import { AnimatedWeddingAssistant } from './components/AnimatedWeddingAssistant';
import { defaultPhotos } from './data/weddingData';
import { PhotoItem } from './types';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
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
            <div className="w-9 h-9 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#FBF6EC] group-hover:scale-105 transition-transform shadow-2xs">
              <span className="font-vibes text-xl text-[#996515] font-bold">MP</span>
            </div>
            <div>
              <div className="font-cinzel text-xs font-bold text-[#0F3D32] tracking-wider uppercase">
                {language === 'te' ? 'మోషే దొర & ప్రియ' : 'Moshe Dora & Priya'}
              </div>
              <div className="text-[10px] font-cinzel text-[#C59B27] tracking-widest uppercase">
                {language === 'te' ? 'గురువారం, సెప్టెంబర్ 03, 2026' : 'Thursday, Sep 03, 2026'}
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-5 font-cinzel text-xs font-semibold uppercase tracking-wider text-[#2A2A2A]">
            <button 
              onClick={() => scrollToSection('calendar')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              {language === 'te' ? 'ముహూర్తం & తేదీ' : 'Calendar & Date'}
            </button>
            <button 
              onClick={() => scrollToSection('venue')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              {language === 'te' ? 'వేదిక & మ్యాప్' : 'Venue & Map'}
            </button>
            <button 
              onClick={() => scrollToSection('couple')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              {language === 'te' ? 'వధూవరులు' : 'The Couple'}
            </button>
            <button 
              onClick={() => scrollToSection('game')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              {language === 'te' ? 'గేమ్స్' : 'Games'}
            </button>
            <button 
              onClick={() => scrollToSection('blessings')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              {language === 'te' ? 'ఆశీర్వాదాలు' : 'Blessings'}
            </button>
            <button 
              onClick={() => scrollToSection('gallery')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              {language === 'te' ? 'ఫోటోలు' : 'Gallery'}
            </button>
            <button 
              onClick={() => scrollToSection('video')}
              className="hover:text-[#996515] transition-colors py-1 cursor-pointer"
            >
              {language === 'te' ? 'వీడియో' : 'Video'}
            </button>
          </nav>

          {/* Right Action Items: Language Toggle + Wedding Gates */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Bilingual English / Telugu Language Switcher */}
            <div className="flex items-center bg-[#FBF6EC] border border-[#D4AF37] rounded-full p-0.5 shadow-xs">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-cinzel font-bold transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-xs'
                    : 'text-[#0F3D32] hover:text-[#996515]'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  language === 'te'
                    ? 'bg-[#5E1626] text-[#FFFDF9] shadow-xs'
                    : 'text-[#0F3D32] hover:text-[#5E1626]'
                }`}
                title="తెలుగు భాషకు మారండి"
              >
                తెలుగు
              </button>
            </div>

            <button
              onClick={() => setIsEnvelopeOpen(false)}
              className="px-3.5 py-1.5 rounded-full border border-[#D4AF37] hover:bg-[#F2F7F4] text-[#0F3D32] font-cinzel text-xs font-semibold uppercase tracking-wider transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title="View the ceremonial wedding gates opening"
            >
              <span>{language === 'te' ? '🌿 ద్వారాలు' : '🌿 Wedding Gates'}</span>
            </button>

            <button
              onClick={() => scrollToSection('blessings')}
              className="px-4 py-1.5 rounded-full bg-[#0F3D32] hover:bg-[#1B5A48] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquareHeart className="w-3.5 h-3.5 fill-current" />
              <span>{language === 'te' ? 'ఆశీర్వదించండి' : 'Send Blessings'}</span>
            </button>
          </div>

          {/* Mobile Right Bar: Language Toggle + Menu */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1 rounded-full bg-[#FBF6EC] border border-[#D4AF37] text-xs font-bold text-[#0F3D32] flex items-center gap-1 cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3 h-3 text-[#C59B27]" />
              <span>{language === 'en' ? 'తెలుగు' : 'English'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#0F3D32] hover:bg-[#FBF6EC] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FFFDF9] border-b border-[#D4AF37]/40 px-6 py-4 space-y-2.5 font-cinzel text-sm max-h-[80vh] overflow-y-auto">
            {/* Language Selector in Mobile Menu */}
            <div className="flex items-center justify-between py-2 border-b border-[#D4AF37]/30">
              <span className="text-xs font-bold text-[#0F3D32]">Language / భాష:</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    language === 'en' ? 'bg-[#0F3D32] text-[#F1DFA6]' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    language === 'te' ? 'bg-[#5E1626] text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsEnvelopeOpen(false);
              }}
              className="block w-full text-left py-2 text-[#0F3D32] font-bold"
            >
              {language === 'te' ? '🌿 శుభ ద్వారాలు తెరవండి' : '🌿 View Wedding Gates'}
            </button>
            <button
              onClick={() => scrollToSection('calendar')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              {language === 'te' ? '📅 ముహూర్తం (సెప్టెంబర్ 03, 2026) & క్యాలెండర్' : '📅 Date (Sep 03, 2026) & Calendar'}
            </button>
            <button
              onClick={() => scrollToSection('venue')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              {language === 'te' ? '📍 వేదిక ఫంక్షన్ హాల్, ఏలేశ్వరం & మ్యాప్' : '📍 Vedika Function Hall & Location'}
            </button>
            <button
              onClick={() => scrollToSection('couple')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              {language === 'te' ? '👑 వధూవరులు & వంశ పరిచయం' : '👑 The Couple & Lineage'}
            </button>
            <button
              onClick={() => scrollToSection('game')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              {language === 'te' ? '🎉 వివాహ సరదా గేమ్స్' : '🎉 Wedding Fun Games'}
            </button>
            <button
              onClick={() => scrollToSection('blessings')}
              className="block w-full text-left py-1.5 text-[#5E1626] font-bold"
            >
              {language === 'te' ? '✍️ మీ ఆశీర్వాదాలు & ప్రార్థనలు' : '✍️ Guest Blessings & Prayers'}
            </button>
            <button
              onClick={() => scrollToSection('gallery')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              {language === 'te' ? '📷 ఫోటో ఆల్బమ్' : '📷 Photo Gallery'}
            </button>
            <button
              onClick={() => scrollToSection('video')}
              className="block w-full text-left py-1.5 text-[#0F3D32] font-semibold"
            >
              {language === 'te' ? '🎬 నిశ్చితార్థం వీడియో రికార్డింగ్' : '🎬 Engagement Video Livestream'}
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

        {/* Holy Engagement Ceremony Livestream & Video Recording (After Gallery) */}
        <EngagementVideoSection />
      </main>

      {/* Background Shehnai / Music Player Floating Control */}
      <MusicPlayer />

      {/* Animated Wedding Assistant & Guided Interactive Tour */}
      <AnimatedWeddingAssistant />

      {/* 24/7 Wedding Knowledge AI Chatbot */}
      <WeddingChatbot />

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
