import React, { useState } from 'react';
import { 
  Play, 
  Tv, 
  ExternalLink, 
  Sparkles, 
  Share2, 
  Check, 
  Heart, 
  Volume2, 
  Maximize2, 
  Film, 
  Clock, 
  Calendar,
  Church
} from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';
import { weddingInfo } from '../data/weddingData';
import { useLanguage } from '../context/LanguageContext';

export const EngagementVideoSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'highlights'>('video');
  const { language, t } = useLanguage();

  const youtubeVideoId = 'PfYwSUQuexk';
  const liveUrl = `https://www.youtube.com/live/${youtubeVideoId}?si=ua0g3_g_eCHx_a8V`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeVideoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: language === 'te' 
            ? `వేల్నాటి మోషే దొర & నెల్లూరి ప్రియ — నిశ్చితార్థ వేడుక వీడియో`
            : `${weddingInfo.groom.name} & ${weddingInfo.bride.name} — Holy Engagement Ceremony`,
          text: language === 'te'
            ? `మోషే దొర & ప్రియల పవిత్ర నిశ్చితార్థం లైవ్ రికార్డింగ్ వీడియోని చూడండి!`
            : `Watch the sacred engagement livestream recording of Moshe Dora & Priya!`,
          url: liveUrl,
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const highlights = language === 'te' ? [
    {
      title: 'ప్రారంభ ప్రార్థన & దైవ ఆశీర్వాదం',
      desc: 'దేవుని సన్నిధిని ఆహ్వానిస్తూ వాక్య పఠనం మరియు సంఘ కాపరుల ప్రార్థనలు.',
      icon: '🕊️'
    },
    {
      title: 'పరిశుద్ధ నిశ్చితార్థ ప్రమాణాలు',
      desc: 'కుటుంబ సభ్యుల సమక్షంలో మోషే దొర మరియు ప్రియల పవిత్ర ప్రమాణాలు.',
      icon: '✝️'
    },
    {
      title: 'నిశ్చితార్థపు ఉంగరాల మార్పిడి',
      desc: 'దైవ సంకల్పంలో పవిత్రమైన ఉంగరాలు ధరింపజేసిన మధుర క్షణాలు.',
      icon: '💍'
    },
    {
      title: 'పూలమాలల వేడుక & శుభాకాంక్షలు',
      desc: 'వేల్నాటి మరియు నెల్లూరి కుటుంబ సభ్యుల పూలమాలలు మరియు సత్కారాలు.',
      icon: '🌺'
    }
  ] : [
    {
      title: 'Opening Prayer & Pastoral Benediction',
      desc: 'Invoking God’s holy presence, thanksgiving scripture readings, and church blessings.',
      icon: '🕊️'
    },
    {
      title: 'Holy Matrimonial Engagement Vows',
      desc: 'Sacred commitment between Moshe Dora and Priya in the presence of families and God.',
      icon: '✝️'
    },
    {
      title: 'Exchange of Sacred Engagement Rings',
      desc: 'Blessed gold rings exchanged sealing the matrimonial covenant under divine grace.',
      icon: '💍'
    },
    {
      title: 'Family Garland Ceremony & Felicitation',
      desc: 'Joyous garlanding, pastoral blessings, and fellowship from Velnati & Nelluri families.',
      icon: '🌺'
    }
  ];

  return (
    <section 
      id="video" 
      className={`relative py-20 sm:py-24 px-4 sm:px-6 transition-colors duration-500 overflow-hidden border-b border-[#D4AF37]/30 ${
        isCinemaMode ? 'bg-[#0a1410] text-[#FBF6EC]' : 'bg-[#F4FAF6] text-[#2A2A2A]'
      }`}
    >
      {/* Background Jungle Vines Decor */}
      <div className="absolute top-6 left-6 text-6xl opacity-10 pointer-events-none select-none">🌴</div>
      <div className="absolute bottom-6 right-6 text-6xl opacity-10 pointer-events-none select-none">🌿</div>
      <div className="absolute top-1/2 right-4 text-5xl opacity-10 pointer-events-none select-none">🦜</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#D4AF37]/60 shadow-sm text-xs font-cinzel uppercase tracking-[0.25em] text-[#0F3D32] font-semibold mb-3">
              <Film className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{t('video.badge')}</span>
              <Film className="w-3.5 h-3.5 text-[#C59B27]" />
            </div>

            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F3D32] dark:text-[#F1DFA6]">
              {t('video.title')}
            </h2>

            <p className="font-cormorant text-lg sm:text-xl italic max-w-xl mx-auto mt-2 text-[#2A2A2A]/85 dark:text-[#FFFDF9]/80">
              {t('video.subtitle')}
            </p>

            {/* Quick Controls Bar */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
              <button
                onClick={() => setIsCinemaMode(!isCinemaMode)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-cinzel font-semibold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  isCinemaMode 
                    ? 'bg-[#D4AF37] text-[#0F3D32] border-[#D4AF37]' 
                    : 'bg-white text-[#0F3D32] border-[#D4AF37]/60 hover:bg-[#FBF6EC]'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>{isCinemaMode ? t('video.dayMode') : t('video.cinemaMode')}</span>
              </button>

              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 rounded-full bg-white border border-[#D4AF37]/60 text-[#0F3D32] text-xs font-cinzel font-semibold hover:bg-[#FBF6EC] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">{language === 'te' ? 'లింక్ కాపీ అయింది!' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#996515]" />
                    <span>{t('video.share')}</span>
                  </>
                )}
              </button>

              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-full bg-[#CC0000] text-white text-xs font-cinzel font-semibold hover:bg-[#b00000] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>{t('video.watchYoutube')}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Video Player Frame Container */}
        <ScrollReveal direction="zoom" delay={100} threshold={0.15}>
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37] gold-box-shadow shadow-2xl bg-black">
            {/* Top YouTube Video Player Stream Bar */}
            <div className="p-3 sm:p-4 bg-gradient-to-r from-[#0F3D32] via-[#1A5043] to-[#0F3D32] text-[#F1DFA6] flex items-center justify-between border-b border-[#D4AF37]/40">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#CC0000] animate-pulse" />
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wide">
                  {language === 'te' 
                    ? 'మోషే దొర & ప్రియ — నిశ్చితార్థ వేడుక లైవ్ రికార్డింగ్' 
                    : 'Moshe Dora & Priya — Holy Engagement Ceremony'}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[11px] font-cinzel text-[#FFFDF9]/80">
                <Church className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{language === 'te' ? 'పవిత్ర నిశ్చితార్థం' : 'Sacred Ceremony'}</span>
              </div>
            </div>

            {/* Responsive 16:9 YouTube Video Embed */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={embedUrl}
                title="Velnati Moshe Dora and Nelluri Priya Sacred Engagement Ceremony Live Stream"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Bottom Stream Info Bar */}
            <div className="p-3 bg-[#0c241e] text-[#FFFDF9] border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-between text-xs font-cinzel gap-2">
              <div className="flex items-center gap-2 text-[#F1DFA6]">
                <span>💍</span>
                <span>{language === 'te' ? 'వేల్నాటి & నెల్లూరి కుటుంబాలు' : 'Velnati & Nelluri Families'}</span>
                <span>·</span>
                <span>{language === 'te' ? 'యూట్యూబ్ లైవ్ స్ట్రీమ్' : 'YouTube Official Stream'}</span>
              </div>

              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
              >
                <span>{language === 'te' ? 'యూట్యూబ్ యాప్‌లో ఓపెన్ చేయండి →' : 'Open in YouTube App →'}</span>
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* Engagement Highlights Grid */}
        <div className="mt-12">
          <div className="text-center mb-6">
            <h3 className="font-decorative text-2xl text-[#0F3D32] dark:text-[#F1DFA6] font-bold">
              {language === 'te' ? 'నిశ్చితార్థ వేడుక ముఖ్యాంశాలు' : 'Ceremonial Highlights & Blessings'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {highlights.map((item, index) => (
              <div 
                key={index}
                className="p-4 rounded-xl bg-white/90 border border-[#D4AF37]/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h4 className="font-cinzel text-xs font-bold text-[#0F3D32] mb-1">
                    {item.title}
                  </h4>
                  <p className="font-cormorant text-sm text-[#2A2A2A]/80 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
