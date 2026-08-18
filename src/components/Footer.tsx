import React from 'react';
import { weddingInfo, venueInfo } from '../data/weddingData';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();

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
              🌿 {language === 'te' ? 'పరిశుద్ధ వివాహం & దైవ సంకల్పం' : 'Holy Matrimony & Sacred Covenant'} 🌿
            </div>
            <h2 className="font-vibes text-4xl sm:text-5xl text-[#F1DFA6]">
              {language === 'te' ? 'మోషే దొర & ప్రియ' : `${weddingInfo.groom.name} & ${weddingInfo.bride.name}`}
            </h2>
            <p className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#FFFDF9]/80 mt-2">
              {language === 'te' ? 'గురువారం, సెప్టెంబర్ 03, 2026 · వేదిక ఫంక్షన్ హాల్, ఏలేశ్వరం' : `Thursday, September 03, 2026 · ${venueInfo.name}, ${venueInfo.city}`}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100} threshold={0.15}>
          <div className="max-w-md mx-auto p-4 rounded-xl bg-white/5 border border-[#D4AF37]/30 backdrop-blur-xs">
            <p className="font-cormorant italic text-sm text-[#F1DFA6]/90">
              {language === 'te' 
                ? '"కాగా విశ్వాసము, నిరీక్షణ, ప్రేమ యీ మూడును నిలుచును; వీటిలో శ్రేష్ఠమైనది ప్రేమయే."' 
                : '"And now these three remain: faith, hope and love. But the greatest of these is love."'}
            </p>
            <div className="font-cinzel text-[11px] uppercase tracking-widest text-[#FFFDF9]/60 mt-1 font-semibold">
              {language === 'te' ? '— 1 కొరింథీయులకు 13:13' : '— 1 Corinthians 13:13'}
            </div>
          </div>

          {/* Wedding Assistance & Family Contact Numbers */}
          <div className="max-w-lg mx-auto mt-6 p-4 rounded-2xl bg-white/10 border border-[#D4AF37]/50 shadow-lg backdrop-blur-md">
            <div className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#F1DFA6] font-bold mb-3 flex items-center justify-center gap-2">
              <span>📞</span>
              <span>{t('footer.familyHelp')}</span>
              <span>📞</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-cinzel text-xs">
              {/* Contact 1 */}
              <div className="p-3 rounded-xl bg-black/30 border border-[#D4AF37]/30 flex flex-col items-center gap-2">
                <div className="text-[#8EB69B] text-[11px] uppercase tracking-wider font-semibold">
                  {t('footer.contact1')}
                </div>
                <a 
                  href="tel:+919640448277" 
                  className="font-bold text-sm text-white hover:text-[#F1DFA6] transition-colors flex items-center gap-1.5"
                >
                  <span>+91 96404 48277</span>
                </a>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href="tel:+919640448277"
                    className="px-2.5 py-1 rounded-full bg-[#0F3D32] hover:bg-[#1B5A48] text-[#F1DFA6] text-[10px] font-bold border border-[#D4AF37]/60 cursor-pointer"
                  >
                    📞 {t('footer.call')}
                  </a>
                  <a
                    href="https://wa.me/919640448277?text=Hello%2C%20regarding%20Moshe%20Dora%20%26%20Priya%20Wedding%20Celebration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[10px] font-bold cursor-pointer"
                  >
                    💬 {t('footer.whatsapp')}
                  </a>
                </div>
              </div>

              {/* Contact 2 */}
              <div className="p-3 rounded-xl bg-black/30 border border-[#D4AF37]/30 flex flex-col items-center gap-2">
                <div className="text-[#8EB69B] text-[11px] uppercase tracking-wider font-semibold">
                  {t('footer.contact2')}
                </div>
                <a 
                  href="tel:+918374935230" 
                  className="font-bold text-sm text-white hover:text-[#F1DFA6] transition-colors flex items-center gap-1.5"
                >
                  <span>+91 83749 35230</span>
                </a>
                <div className="flex items-center gap-2 mt-1">
                  <a
                    href="tel:+918374935230"
                    className="px-2.5 py-1 rounded-full bg-[#0F3D32] hover:bg-[#1B5A48] text-[#F1DFA6] text-[10px] font-bold border border-[#D4AF37]/60 cursor-pointer"
                  >
                    📞 {t('footer.call')}
                  </a>
                  <a
                    href="https://wa.me/918374935230?text=Hello%2C%20regarding%20Moshe%20Dora%20%26%20Priya%20Wedding%20Celebration"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white text-[10px] font-bold cursor-pointer"
                  >
                    💬 {t('footer.whatsapp')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="pt-6 border-t border-white/10 text-xs font-cinzel text-[#FFFDF9]/60 tracking-wider">
          <p>© 2026 Velnati &amp; Nelluri Wedding. {t('footer.copyright')}.</p>
        </div>
      </div>
    </footer>
  );
};
