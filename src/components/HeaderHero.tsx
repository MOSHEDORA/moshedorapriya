import React from 'react';
import { Calendar, MapPin, Sparkles, Navigation, Camera, Heart, Clock } from 'lucide-react';
import { weddingInfo, defaultPhotos } from '../data/weddingData';

interface HeaderHeroProps {
  onOpenCalendar: () => void;
  onOpenVenue: () => void;
  onOpenGallery: () => void;
  onOpenBlessings: () => void;
}

export const HeaderHero: React.FC<HeaderHeroProps> = ({
  onOpenCalendar,
  onOpenVenue,
  onOpenGallery,
  onOpenBlessings
}) => {
  const coupleHeroPhoto = defaultPhotos[0]?.imageUrl;

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 bg-gradient-to-b from-[#F2F8F4] via-[#E8F2EC] to-[#F5F9F6] border-b border-[#D4AF37]/30 overflow-hidden">
      {/* Background Decorative Veils & Ambient Botanical Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(circle_at_50%_0%,rgba(15,61,50,0.22)_0%,rgba(212,175,55,0.15)_40%,transparent_70%)]" />
      <div className="absolute inset-0 pointer-events-none opacity-20 subtle-dots-bg" />

      {/* Jungle Rainforest Side Trees, Flora & Wildlife Silhouettes */}
      <div className="absolute top-12 left-2 sm:left-6 pointer-events-none hidden lg:flex flex-col items-center opacity-85 z-10 select-none">
        <span className="text-5xl filter drop-shadow animate-pulse">🌴</span>
        <span className="text-3xl mt-1">🦜</span>
        <span className="text-4xl mt-3">🌿</span>
        <span className="text-3xl mt-1">🦌</span>
        <span className="text-3xl mt-2">🌱</span>
      </div>

      <div className="absolute top-12 right-2 sm:right-6 pointer-events-none hidden lg:flex flex-col items-center opacity-85 z-10 select-none">
        <span className="text-5xl filter drop-shadow animate-pulse">🌴</span>
        <span className="text-3xl mt-1">🕊️</span>
        <span className="text-4xl mt-3">🌺</span>
        <span className="text-4xl mt-1">🦚</span>
        <span className="text-3xl mt-2">🦋</span>
      </div>

      {/* Jungle Canopy Vines Border Top */}
      <div className="absolute top-0 inset-x-0 flex justify-around px-4 pointer-events-none opacity-30 text-xl select-none">
        <span>🌿 🍃 🌺 🌿</span>
        <span className="hidden sm:inline">🌴 🌸 🍃 🌴</span>
        <span>🌿 🌺 🍃 🌿</span>
      </div>

      {/* Corner Botanical Floral Ornaments */}
      <div className="absolute top-4 left-4 w-14 h-14 sm:w-20 sm:h-20 border-t-2 border-l-2 border-[#0F3D32]/60 pointer-events-none">
        <span className="absolute -top-3 -left-2 text-sm sm:text-base">🌿</span>
      </div>
      <div className="absolute top-4 right-4 w-14 h-14 sm:w-20 sm:h-20 border-t-2 border-r-2 border-[#0F3D32]/60 pointer-events-none">
        <span className="absolute -top-3 -right-2 text-sm sm:text-base">🌿</span>
      </div>
      <div className="absolute bottom-4 left-4 w-14 h-14 sm:w-20 sm:h-20 border-b-2 border-l-2 border-[#0F3D32]/60 pointer-events-none">
        <span className="absolute -bottom-3 -left-2 text-sm sm:text-base">🌸</span>
      </div>
      <div className="absolute bottom-4 right-4 w-14 h-14 sm:w-20 sm:h-20 border-b-2 border-r-2 border-[#0F3D32]/60 pointer-events-none">
        <span className="absolute -bottom-3 -right-2 text-sm sm:text-base">🌸</span>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
        {/* Monogram Badge (Pure Wedding Title) */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-xs uppercase tracking-[0.25em] font-semibold mb-4 border border-[#D4AF37]/60 shadow-md">
          <span className="text-sm">🌿</span>
          <span>Holy Matrimony Celebration</span>
          <span className="text-sm">🌿</span>
        </div>

        {/* Family Title */}
        <div className="font-cinzel tracking-[0.2em] text-xs sm:text-sm uppercase text-[#0F3D32] font-semibold mb-3 flex items-center gap-2">
          <span className="h-[1px] w-6 sm:w-10 bg-[#D4AF37]" />
          <span>{weddingInfo.familyTitle}</span>
          <span className="h-[1px] w-6 sm:w-10 bg-[#D4AF37]" />
        </div>

        {/* Groom & Bride Names */}
        <div className="my-1 sm:my-2">
          <h1 className="font-vibes text-5xl sm:text-7xl md:text-8xl shimmer-gold leading-tight tracking-wide drop-shadow-sm">
            {weddingInfo.groom.name}
          </h1>
          <div className="font-decorative text-xl sm:text-2xl text-[#5E1626] font-semibold my-1 tracking-widest flex items-center justify-center gap-3">
            <span className="h-[1px] w-8 bg-[#D4AF37]/60" />
            <span>&amp;</span>
            <span className="h-[1px] w-8 bg-[#D4AF37]/60" />
          </div>
          <h1 className="font-vibes text-5xl sm:text-7xl md:text-8xl shimmer-gold leading-tight tracking-wide drop-shadow-sm">
            {weddingInfo.bride.name}
          </h1>
        </div>

        {/* Hero Photo Card Frame with Jungle Foliage Accents */}
        <div className="my-5 max-w-2xl w-full px-2">
          <div className="relative p-2.5 sm:p-3.5 rounded-2xl bg-white border-2 border-[#D4AF37] gold-box-shadow group shadow-xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-stone-100">
              <img
                src={coupleHeroPhoto}
                alt="Velnati Moshe Dora and Nelluri Priya"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 opacity-75" />
              
              <div className="absolute bottom-3 inset-x-3 text-center text-white">
                <p className="font-vibes text-2xl sm:text-3xl text-[#FFFDF9] drop-shadow-md">
                  Velnati Moshe Dora &amp; Nelluri Priya
                </p>
                <p className="font-cinzel text-[10px] sm:text-xs uppercase tracking-widest text-[#F1DFA6]">
                  United in Sacred Holy Matrimony · Under Divine Grace
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="font-cinzel text-xs sm:text-sm tracking-[0.18em] uppercase text-[#2A2A2A]/85 max-w-2xl mx-auto leading-relaxed">
          Cordially request the honour of your esteemed presence and prayerful blessings on our auspicious wedding day
        </p>

        {/* Highlighted Date and Venue Primary Interactive Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 w-full max-w-2xl px-2">
          {/* Highlighted Date Card */}
          <button
            onClick={onOpenCalendar}
            className="group p-4 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#FFFDF9] via-[#FBF6EC] to-[#FFFDF9] text-left hover:shadow-xl hover:border-[#0F3D32] transition-all cursor-pointer shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.25),transparent_70%)] pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-widest text-[#0F3D32] font-bold mb-1">
              <Calendar className="w-4 h-4 text-[#C59B27] group-hover:scale-110 transition-transform" />
              <span>Auspicious Wedding Date</span>
            </div>
            <div className="font-decorative text-lg sm:text-xl font-bold text-[#5E1626]">
              Thursday, Sep 03, 2026
            </div>
            <div className="text-xs font-cinzel text-[#0F3D32] font-semibold mt-0.5">
              10:00 AM IST · Holy Matrimony &amp; Grand Feast
            </div>
          </button>

          {/* Highlighted Venue Card */}
          <button
            onClick={onOpenVenue}
            className="group p-4 rounded-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#FFFDF9] via-[#FBF6EC] to-[#FFFDF9] text-left hover:shadow-xl hover:border-[#0F3D32] transition-all cursor-pointer shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle_at_100%_0%,rgba(15,61,50,0.2),transparent_70%)] pointer-events-none" />
            <div className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-widest text-[#0F3D32] font-bold mb-1">
              <MapPin className="w-4 h-4 text-[#C59B27] group-hover:scale-110 transition-transform" />
              <span>Wedding Venue</span>
            </div>
            <div className="font-decorative text-lg sm:text-xl font-bold text-[#0F3D32]">
              Vedika Function Hall
            </div>
            <div className="text-xs font-cinzel text-[#996515] font-semibold mt-0.5">
              Grand A/C Auditorium · Yeleswaram
            </div>
          </button>
        </div>

        {/* Biblical Verse Card */}
        <div className="max-w-xl mx-auto p-4 rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9]/95 shadow-sm relative">
          <p className="font-cormorant italic text-base sm:text-lg text-[#0F3D32] leading-relaxed">
            "{weddingInfo.biblicalVerse.quote}"
          </p>
          <p className="font-cinzel text-xs uppercase tracking-widest text-[#5E1626] font-semibold mt-1">
            — {weddingInfo.biblicalVerse.reference}
          </p>
        </div>

        {/* Interactive Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
          <a
            href="https://maps.app.goo.gl/gLeSdH2zKB5729Lb6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#996515] text-[#2b2205] font-cinzel text-xs sm:text-sm font-bold tracking-wider uppercase hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all duration-300 shadow-md"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Open Google Maps Location</span>
          </a>

          <button
            onClick={onOpenCalendar}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#0F3D32] text-[#0F3D32] font-cinzel text-xs sm:text-sm font-semibold tracking-wider hover:bg-[#0F3D32] hover:text-[#FFFDF9] transition-all bg-white/90 shadow-xs cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#C59B27]" />
            <span>Wedding Date &amp; Countdown</span>
          </button>

          <button
            onClick={onOpenGallery}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#D4AF37] text-[#5E1626] font-cinzel text-xs sm:text-sm font-semibold tracking-wider hover:bg-[#5E1626] hover:text-white transition-all bg-white/90 shadow-xs cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Photo Gallery</span>
          </button>

          <button
            onClick={onOpenBlessings}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#0F3D32]/40 text-[#0F3D32] font-cinzel text-xs sm:text-sm font-semibold tracking-wider hover:bg-[#0F3D32] hover:text-white transition-all bg-white/90 shadow-xs cursor-pointer"
          >
            <Heart className="w-4 h-4 text-[#C59B27]" />
            <span>Guest Blessings</span>
          </button>
        </div>
      </div>
    </section>
  );
};
