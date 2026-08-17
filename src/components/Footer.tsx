import React from 'react';
import { Heart, Sparkles, Crown } from 'lucide-react';
import { weddingInfo, venueInfo } from '../data/weddingData';
import { ScrollReveal } from './ScrollReveal';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#08221B] via-[#051813] to-[#020B08] text-[#FFFDF9] py-16 px-4 text-center relative border-t-2 border-[#D4AF37]/50 overflow-hidden">
      {/* Background Jungle Rainforest Flora & Wildlife Silhouettes */}
      <div className="absolute top-4 left-4 text-5xl opacity-20 pointer-events-none select-none">🌴</div>
      <div className="absolute top-4 right-4 text-5xl opacity-20 pointer-events-none select-none">🌴</div>
      <div className="absolute bottom-4 left-10 text-4xl opacity-20 pointer-events-none select-none">🦌</div>
      <div className="absolute bottom-4 right-10 text-4xl opacity-20 pointer-events-none select-none">🦚</div>
      <div className="absolute top-1/2 left-1/4 text-4xl opacity-10 pointer-events-none select-none">🌿</div>
      <div className="absolute top-1/2 right-1/4 text-4xl opacity-10 pointer-events-none select-none">🌺</div>

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <ScrollReveal direction="up" threshold={0.15}>
          {/* Monogram Crest */}
          <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] mx-auto flex items-center justify-center bg-white/5 mb-4 shadow-md">
            <span className="font-vibes text-3xl text-[#F1DFA6]">MP</span>
          </div>

          <div>
            <div className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#8EB69B] mb-1 font-semibold">
              🌿 Holy Matrimony &amp; Sacred Covenant 🌿
            </div>
            <h2 className="font-vibes text-4xl sm:text-5xl text-[#F1DFA6]">
              {weddingInfo.groom.name} &amp; {weddingInfo.bride.name}
            </h2>
            <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#FFFDF9]/80 mt-2">
              Thursday, September 03, 2026 &nbsp;·&nbsp; {venueInfo.name}, {venueInfo.city}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} threshold={0.15}>
          <div className="max-w-md mx-auto p-4 rounded-xl bg-white/5 border border-[#D4AF37]/30 backdrop-blur-xs">
            <p className="font-cormorant italic text-sm text-[#F1DFA6]/90">
              "And now these three remain: faith, hope and love. But the greatest of these is love."
            </p>
            <div className="font-cinzel text-[11px] uppercase tracking-widest text-[#FFFDF9]/60 mt-1 font-semibold">
              — 1 Corinthians 13:13
            </div>
          </div>
        </ScrollReveal>

        <div className="pt-6 border-t border-white/10 text-xs font-cinzel text-[#FFFDF9]/60 tracking-wider">
          {weddingInfo.familyTitle} &nbsp;|&nbsp; Celebrated with Prayer, Joy &amp; Gratitude
        </div>
      </div>
    </footer>
  );
};
