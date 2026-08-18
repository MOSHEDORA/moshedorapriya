import React from 'react';
import { Heart, Sparkles, Crown } from 'lucide-react';
import { weddingInfo } from '../data/weddingData';
import { PhotoItem } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface CoupleSectionProps {
  photos: PhotoItem[];
  onSelectPhoto: (photo: PhotoItem) => void;
}

export const CoupleSection: React.FC<CoupleSectionProps> = ({
  photos,
  onSelectPhoto,
}) => {
  // Find default groom, bride and couple hero photos
  const groomPhoto = photos.find(p => p.category === 'portrait' && p.title.toLowerCase().includes('groom')) || photos[1];
  const bridePhoto = photos.find(p => p.category === 'portrait' && p.title.toLowerCase().includes('bride')) || photos[2];
  const coupleHero = photos.find(p => p.category === 'couple') || photos[0];

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#F4F8F5] border-b border-[#D4AF37]/20 overflow-hidden" id="couple">
      {/* Visual Jungle Foliage & Tree Silhouettes */}
      <div className="absolute top-0 left-0 text-8xl opacity-15 pointer-events-none select-none">🌴</div>
      <div className="absolute top-1/3 -left-6 text-7xl opacity-15 pointer-events-none select-none">🌿</div>
      <div className="absolute bottom-0 right-0 text-8xl opacity-15 pointer-events-none select-none">🌴</div>
      <div className="absolute top-1/4 right-2 text-6xl opacity-15 pointer-events-none select-none">🦜</div>
      <div className="absolute bottom-10 left-8 text-5xl opacity-15 pointer-events-none select-none">🦌</div>
      <div className="absolute bottom-8 right-12 text-6xl opacity-15 pointer-events-none select-none">🦚</div>

      {/* Jungle Vines Border Decorator Top */}
      <div className="absolute top-0 inset-x-0 flex justify-between px-6 pointer-events-none opacity-25 text-2xl">
        <span>🍃 🌿 🌺 🌿</span>
        <span className="hidden sm:inline">🌿 🌸 🍃 🌺</span>
        <span>🌿 🌺 🌿 🍃</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Title (Pure Wedding Text with Jungle Botanical Styling) */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>Holy Matrimony · Sacred Covenant</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              The Bride &amp; Groom
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-xl mx-auto mt-2">
              Two souls joined in Holy Matrimony, united forever in love, faith, and joy in Christ.
            </p>

            <div className="flex items-center justify-center gap-3 mt-4 text-xs font-cinzel text-[#0F3D32]/85">
              <span>🌿 Devotion</span>
              <span className="h-[1px] w-8 bg-[#D4AF37]" />
              <Heart className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="h-[1px] w-8 bg-[#D4AF37]" />
              <span>Eternal Love 🌿</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Featured Center Couple Portrait with Royal Golden Botanical Frame */}
        <div className="mb-16">
          <ScrollReveal direction="zoom" delay={100} threshold={0.15}>
            <div className="relative max-w-3xl mx-auto bg-gradient-to-b from-[#FBF6EC] to-[#FFFDF9] p-3.5 sm:p-5 rounded-2xl border-2 border-[#D4AF37] gold-box-shadow group shadow-xl">
              {/* Corner Filigree Badges */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-[#996515]" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-[#996515]" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-[#996515]" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-[#996515]" />

              <div 
                className="relative overflow-hidden rounded-xl aspect-[16/10] cursor-pointer"
                onClick={() => onSelectPhoto(coupleHero)}
              >
                <img
                  src={coupleHero.imageUrl}
                  alt={`${weddingInfo.groom.name} & ${weddingInfo.bride.name}`}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.triedFallback) {
                      target.dataset.triedFallback = 'true';
                      target.src = coupleHero.imageUrl.startsWith('/assets/')
                        ? coupleHero.imageUrl.replace('/assets/', '/')
                        : `/assets${coupleHero.imageUrl}`;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D32]/90 via-black/20 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
                
                <div className="absolute bottom-0 inset-x-0 p-6 text-white text-center">
                  <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#F1DFA6] font-semibold">
                    Together Under God's Grace
                  </span>
                  <h3 className="font-vibes text-4xl sm:text-5xl md:text-6xl text-[#FFFDF9] my-1 drop-shadow-md">
                    {weddingInfo.groom.name} &amp; {weddingInfo.bride.name}
                  </h3>
                  <p className="font-cormorant text-sm sm:text-base italic text-[#F1DFA6]/90 max-w-lg mx-auto">
                    {coupleHero.caption}
                  </p>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <div className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-cinzel flex items-center gap-1.5 border border-white/20">
                    <Sparkles className="w-3 h-3 text-[#F1DFA6]" />
                    <span>View Photo</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Groom and Bride Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Groom Profile */}
          <ScrollReveal direction="left" delay={150} threshold={0.15}>
            <div className="bg-[#FBF6EC] border border-[#D4AF37]/70 rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#D4AF37] h-full shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.2),transparent_70%)] pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 text-7xl opacity-10 pointer-events-none">🌿</div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Groom Photo Frame */}
                <div 
                  className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-md flex-shrink-0 cursor-pointer group"
                  onClick={() => onSelectPhoto(groomPhoto)}
                >
                  <img
                    src={groomPhoto.imageUrl}
                    alt={weddingInfo.groom.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = groomPhoto.imageUrl.startsWith('/assets/')
                          ? groomPhoto.imageUrl.replace('/assets/', '/')
                          : `/assets${groomPhoto.imageUrl}`;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1.5 right-1.5 bg-[#0F3D32] text-[#F1DFA6] text-[10px] font-cinzel px-2.5 py-0.5 rounded-full border border-[#D4AF37]/50 shadow-xs font-semibold">
                    The Groom
                  </div>
                </div>

                {/* Groom Bio & Lineage */}
                <div className="text-center sm:text-left flex-1">
                  <div className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#0F3D32] font-bold">
                    {weddingInfo.groom.title}
                  </div>
                  <h3 className="font-decorative text-2xl sm:text-3xl text-[#5E1626] font-bold mt-1 mb-1">
                    {weddingInfo.groom.fullName}
                  </h3>
                  <div className="text-xs font-cinzel text-[#996515] font-semibold tracking-wider mb-3">
                    {weddingInfo.groom.parents}
                  </div>
                  <p className="font-cormorant text-base sm:text-lg text-[#2A2A2A] leading-relaxed italic">
                    "{weddingInfo.groom.bio}"
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-center sm:justify-start gap-2 text-xs font-cinzel text-[#0F3D32]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Blessings &amp; Honour in Christ</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Bride Profile */}
          <ScrollReveal direction="right" delay={150} threshold={0.15}>
            <div className="bg-[#FBF6EC] border border-[#D4AF37]/70 rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-[#D4AF37] h-full shadow-md">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_100%_0%,rgba(94,22,38,0.15),transparent_70%)] pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 text-7xl opacity-10 pointer-events-none">🌺</div>
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Bride Photo Frame */}
                <div 
                  className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-md flex-shrink-0 cursor-pointer group"
                  onClick={() => onSelectPhoto(bridePhoto)}
                >
                  <img
                    src={bridePhoto.imageUrl}
                    alt={weddingInfo.bride.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.dataset.triedFallback) {
                        target.dataset.triedFallback = 'true';
                        target.src = bridePhoto.imageUrl.startsWith('/assets/')
                          ? bridePhoto.imageUrl.replace('/assets/', '/')
                          : `/assets${bridePhoto.imageUrl}`;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-1.5 right-1.5 bg-[#5E1626] text-[#F1DFA6] text-[10px] font-cinzel px-2.5 py-0.5 rounded-full border border-[#D4AF37]/50 shadow-xs font-semibold">
                    The Bride (Nelluri Family)
                  </div>
                </div>

                {/* Bride Bio & Lineage */}
                <div className="text-center sm:text-left flex-1">
                  <div className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#5E1626] font-bold">
                    {weddingInfo.bride.title}
                  </div>
                  <h3 className="font-decorative text-2xl sm:text-3xl text-[#5E1626] font-bold mt-1 mb-1">
                    {weddingInfo.bride.fullName}
                  </h3>
                  <div className="text-xs font-cinzel text-[#996515] font-semibold tracking-wider mb-3">
                    {weddingInfo.bride.parents}
                  </div>
                  <p className="font-cormorant text-base sm:text-lg text-[#2A2A2A] leading-relaxed italic">
                    "{weddingInfo.bride.bio}"
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#D4AF37]/30 flex items-center justify-center sm:justify-start gap-2 text-xs font-cinzel text-[#5E1626]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                    <span>Nelluri Lineage · Grace &amp; Devotion</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
