import React from 'react';
import { weddingInfo, defaultPhotos } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

export const HeaderHero: React.FC = () => {
  const coupleHeroPhoto = defaultPhotos[0]?.imageUrl;
  const { language, t } = useLanguage();

  return (
    <section id="hero" className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 py-16 sm:py-20 bg-gradient-to-b from-[#F2F8F4] via-[#E8F2EC] to-[#F5F9F6] border-b border-[#D4AF37]/30 overflow-hidden">
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
        {/* Biblical Verse Card - Prominently at Top */}
        <div className="max-w-xl mx-auto p-3.5 sm:p-4 rounded-xl border border-[#D4AF37]/60 bg-[#FFFDF9]/95 shadow-sm relative mb-4">
          <p className="font-cormorant italic text-base sm:text-lg text-[#0F3D32] leading-relaxed">
            {t('hero.verseQuote')}
          </p>
          <p className="font-cinzel text-xs uppercase tracking-widest text-[#5E1626] font-semibold mt-1">
            {t('hero.verseRef')}
          </p>
        </div>

        {/* Monogram Badge (Pure Wedding Title) */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0F3D32] text-[#F1DFA6] font-cinzel text-xs uppercase tracking-[0.25em] font-semibold mb-3 border border-[#D4AF37]/60 shadow-md">
          <span className="text-sm">🌿</span>
          <span>{t('hero.badge')}</span>
          <span className="text-sm">🌿</span>
        </div>

        {/* Family Title */}
        <div className="font-cinzel tracking-[0.2em] text-xs sm:text-sm uppercase text-[#0F3D32] font-semibold mb-3 flex items-center gap-2">
          <span className="h-[1px] w-6 sm:w-10 bg-[#D4AF37]" />
          <span>{language === 'te' ? 'వేల్నాటి & నెల్లూరి కుటుంబముల వివాహ ఆహ్వానం' : weddingInfo.familyTitle}</span>
          <span className="h-[1px] w-6 sm:w-10 bg-[#D4AF37]" />
        </div>

        {/* Groom & Bride Names */}
        <div className="my-1 sm:my-2">
          <h1 className="font-vibes text-5xl sm:text-7xl md:text-8xl shimmer-gold leading-tight tracking-wide drop-shadow-sm">
            {language === 'te' ? 'మోషే దొర' : weddingInfo.groom.name}
          </h1>
          <div className="font-decorative text-xl sm:text-2xl text-[#5E1626] font-semibold my-1 tracking-widest flex items-center justify-center gap-3">
            <span className="h-[1px] w-8 bg-[#D4AF37]/60" />
            <span>{t('hero.and')}</span>
            <span className="h-[1px] w-8 bg-[#D4AF37]/60" />
          </div>
          <h1 className="font-vibes text-5xl sm:text-7xl md:text-8xl shimmer-gold leading-tight tracking-wide drop-shadow-sm">
            {language === 'te' ? 'ప్రియ' : weddingInfo.bride.name}
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/DSC04713.JPG';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-left text-white">
                <div className="font-cinzel text-xs uppercase tracking-widest text-[#F1DFA6]">
                  {language === 'te' ? 'పవిత్ర బంధం' : 'Sacred Covenant'}
                </div>
                <div className="font-cormorant text-lg sm:text-xl font-bold">
                  {t('hero.title1')} {t('hero.and')} {t('hero.title2')}
                </div>
              </div>
            </div>
            
            {/* Top Leaf Accent on Card */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#0F3D32] border border-[#D4AF37] text-[#F1DFA6] text-[10px] font-cinzel tracking-wider uppercase flex items-center gap-1 shadow-sm">
              <span>🍃</span>
              <span>{language === 'te' ? 'పరిశుద్ధ వివాహం' : 'United in Christ'}</span>
              <span>🍃</span>
            </div>
          </div>
        </div>

        {/* Date, Time & Venue Highlight Pill */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-cinzel text-[#0F3D32] font-semibold">
          <div className="px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/60 shadow-xs flex items-center gap-2">
            <span className="text-[#996515]">📅</span>
            <span>{t('hero.date')}</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/60 shadow-xs flex items-center gap-2">
            <span className="text-[#996515]">⏰</span>
            <span>{t('hero.time')}</span>
          </div>

          <div className="px-4 py-2 rounded-xl bg-[#FFFDF9] border border-[#D4AF37]/60 shadow-xs flex items-center gap-2">
            <span className="text-[#996515]">📍</span>
            <span>{t('hero.venue')}</span>
          </div>
        </div>

        {/* Subtitle Lineage Note */}
        <p className="font-cormorant italic text-base sm:text-lg text-[#2A2A2A] max-w-2xl mt-4 leading-relaxed px-4">
          {t('hero.familyLineage')}
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <a
            href="#calendar"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#0F3D32] via-[#2D7A62] to-[#0F3D32] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all border border-[#D4AF37] flex items-center gap-2 cursor-pointer"
          >
            <span>{t('hero.ctaCalendar')}</span>
          </a>
          <a
            href="#venue"
            className="px-6 py-3 rounded-full bg-white hover:bg-[#F2F7F4] text-[#0F3D32] font-cinzel text-xs font-semibold uppercase tracking-wider shadow-xs hover:scale-105 transition-all border border-[#D4AF37]/60 flex items-center gap-2 cursor-pointer"
          >
            <span>{t('hero.ctaVenue')}</span>
          </a>
        </div>
      </div>
    </section>
  );
};
