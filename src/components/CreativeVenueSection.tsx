import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation,
  Train, 
  Plane, 
  Car, 
  Copy, 
  Check, 
  ExternalLink, 
  Share2, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { venueInfo } from '../data/weddingData';
import { ScrollReveal } from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext';

export const CreativeVenueSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const { language, t } = useLanguage();

  const fullAddress = language === 'te'
    ? `వేదిక ఫంక్షన్ హాల్, గ్రాండ్ ఏసీ ఆడిటోరియం, మెయిన్ రోడ్, ఏలేశ్వరం మండలం, ఆంధ్రప్రదేశ్ 533429`
    : `${venueInfo.name}, ${venueInfo.hallName}, ${venueInfo.addressLine1}, ${venueInfo.city}, ${venueInfo.state} - ${venueInfo.pincode}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      language === 'te'
        ? `💍 వివాహ వేదిక & ముహూర్తం:\n👰 వధువు: నెల్లూరి ప్రియ & 🤵 వరుడు: వేల్నాటి మోషే దొర\n📅 ముహూర్తం: గురువారం, సెప్టెంబర్ 03, 2026 ఉదయం 10:00 గంటలకు\n📍 వేదిక: వేదిక ఫంక్షన్ హాల్, ఏలేశ్వరం\n\nగూగుల్ మ్యాప్స్ దారి: https://maps.app.goo.gl/gLeSdH2zKB5729Lb6`
        : `💍 Wedding Venue & Date Details:\n👰 Bride: Nelluri Priya & 🤵 Groom: Velnati Moshe Dora\n📅 Date: Thursday, September 03, 2026 at 10:00 AM IST\n📍 Venue: Vedika Function Hall, Yeleswaram\n\nGoogle Maps Navigation: https://maps.app.goo.gl/gLeSdH2zKB5729Lb6`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const transitHubs = language === 'te' ? [
    { icon: Train, name: "సామర్లకోట జంక్షన్ (SLO)", dist: "32 కి.మీ · 40 నిమిషాలు", desc: "ప్రధాన రైల్వే జంక్షన్" },
    { icon: Plane, name: "రాజమండ్రి విమానాశ్రయం (RJA)", dist: "62 కి.మీ · 1 గం. 15 ని.", desc: "విమాన ప్రయాణ కేంద్రం" },
    { icon: Car, name: "NH-16 కత్తిపూడి జంక్షన్", dist: "18 కి.మీ · 20 నిమిషాలు", desc: "4 లైన్ల జాతీయ రహదారి" },
    { icon: Train, name: "తుని రైల్వే స్టేషన్ (TUNI)", dist: "38 కి.మీ · 45 నిమిషాలు", desc: "రైల్వే లింక్" }
  ] : [
    { icon: Train, name: "Samalkot Junction (SLO)", dist: "32 km · 40 mins", desc: "Main express railway junction" },
    { icon: Plane, name: "Rajahmundry Airport (RJA)", dist: "62 km · 1 hr 15 mins", desc: "Commercial flights from metro hubs" },
    { icon: Car, name: "NH-16 Kathipudi Corridor", dist: "18 km · 20 mins", desc: "4-lane highway into Yeleswaram" },
    { icon: Train, name: "Tuni Railway Station (TUNI)", dist: "38 km · 45 mins", desc: "Coastal mainline rail link" }
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#F4F8F5] border-b border-[#D4AF37]/30 overflow-hidden" id="venue">
      {/* Background Visual Rainforest Plants & Wildlife */}
      <div className="absolute top-0 right-0 text-8xl opacity-15 pointer-events-none select-none">🌴</div>
      <div className="absolute bottom-0 left-0 text-8xl opacity-15 pointer-events-none select-none">🌿</div>
      <div className="absolute top-1/3 left-4 text-6xl opacity-15 pointer-events-none select-none">🦜</div>
      <div className="absolute bottom-1/3 right-4 text-6xl opacity-15 pointer-events-none select-none">🦚</div>

      {/* Jungle Vines Top Accent */}
      <div className="absolute top-0 inset-x-0 flex justify-around px-4 pointer-events-none opacity-25 text-xl select-none">
        <span>🌿 🌴 🌺</span>
        <span className="hidden sm:inline">🍃 🌸 🌿 🌴</span>
        <span>🌺 🌴 🌿</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>{t('venue.badge')}</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              {language === 'te' ? 'వివాహ వేదిక & స్థల వివరణ' : 'Place & Location Map'}
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-2xl mx-auto mt-2">
              {language === 'te' 
                ? 'ఏలేశ్వరం వేదిక ఫంక్షన్ హాల్ వద్ద జరిగే పరిశుద్ధ వివాహ మహోత్సవానికి విచ్చేసి వధూవరులను ఆశీర్వదించండి.' 
                : 'Join us at Vedika Function Hall in Yeleswaram for this blessed matrimonial covenant.'}
            </p>
          </div>
        </ScrollReveal>

        {/* Place and Maps Side by Side Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Place Information, Amenities & Transit Hubs */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-6">
            <ScrollReveal direction="left" delay={100} threshold={0.15} className="h-full flex flex-col justify-between">
              {/* Venue Details Box */}
              <div className="bg-gradient-to-r from-[#FBF6EC] via-[#FFFDF9] to-[#FBF6EC] rounded-2xl border-2 border-[#D4AF37] gold-box-shadow p-6 sm:p-7 shadow-xl">
                <div className="inline-flex items-center gap-1.5 font-cinzel text-xs uppercase tracking-widest text-[#996515] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>{language === 'te' ? 'గ్రాండ్ ఏసీ ఆడిటోరియం & భోజన శాల' : 'Grand A/C Auditorium & Dining Hall'}</span>
                </div>
                
                <h3 className="font-decorative text-2xl sm:text-3xl text-[#0F3D32] font-bold mt-1">
                  {t('venue.title')}
                </h3>
                
                <p className="font-cormorant text-base sm:text-lg text-[#2A2A2A] mt-1 font-medium leading-relaxed">
                  {t('venue.address')}
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-[#D4AF37]/30">
                  <a
                    href={venueInfo.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#996515] text-[#2b2205] font-cinzel text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all shadow-md"
                  >
                    <Navigation className="w-3.5 h-3.5 fill-current" />
                    <span>{t('venue.openMaps')}</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>

                  <button
                    onClick={handleCopyAddress}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white border border-[#D4AF37] text-[#0F3D32] font-cinzel text-xs font-semibold hover:bg-[#FBF6EC] transition-all shadow-xs cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">{language === 'te' ? 'కాపీ అయింది!' : 'Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>{t('venue.copyAddress')}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#25D366]/15 text-[#0F3D32] border border-[#25D366]/40 font-cinzel text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-all shadow-xs cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{language === 'te' ? 'వాట్సాప్' : 'WhatsApp'}</span>
                  </button>
                </div>
              </div>

              {/* Transit & Travel Distances */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                {transitHubs.map((hub, index) => {
                  const IconComponent = hub.icon;
                  return (
                    <div key={index} className="p-3 bg-[#FFFDF9] rounded-xl border border-[#D4AF37]/50 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-[#0F3D32] mb-0.5">
                        <IconComponent className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
                        <h4 className="font-cinzel text-[11px] font-bold truncate">{hub.name}</h4>
                      </div>
                      <div className="font-decorative text-xs font-bold text-[#5E1626]">
                        {hub.dist}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Live Interactive Google Maps Frame */}
          <div className="lg:col-span-6 flex flex-col">
            <ScrollReveal direction="right" delay={100} threshold={0.15} className="h-full">
              <div className="rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl relative bg-stone-100 flex flex-col h-full">
                {/* Header Strip */}
                <div className="bg-[#0F3D32] text-[#F1DFA6] px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2 font-cinzel text-xs sm:text-sm font-semibold tracking-wider">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span>{language === 'te' ? 'వేదిక ఫంక్షన్ హాల్, ఏలేశ్వరం' : 'Vedika Function Hall, Yeleswaram'}</span>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/gLeSdH2zKB5729Lb6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-cinzel text-[#F1DFA6] hover:underline flex items-center gap-1 font-semibold"
                  >
                    <span>{language === 'te' ? 'రూట్ మ్యాప్' : 'Route Map'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Google Maps Interactive Frame */}
                <div className="flex-1 w-full min-h-[380px] sm:min-h-[420px] relative">
                  <iframe
                    title="Vedika Function Hall Location"
                    src="https://maps.google.com/maps?q=Vedika+Function+Hall+Yeleswaram&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full min-h-[380px] sm:min-h-[420px]"
                  />
                </div>

                {/* Footer Strip with Destination Address */}
                <div className="bg-[#FFFDF9] border-t border-[#D4AF37]/40 px-4 py-2.5 flex items-center justify-between text-xs font-cinzel text-[#0F3D32]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                    <span>{language === 'te' ? 'GPS లొకేషన్ వెరిఫై చేయబడింది' : 'Live GPS Destination Verified'}</span>
                  </div>
                  <a 
                    href="https://maps.app.goo.gl/gLeSdH2zKB5729Lb6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#996515] hover:underline"
                  >
                    {language === 'te' ? 'గూగుల్ జీపీఎస్ నావిగేషన్ ప్రారంభించండి →' : 'Start Turn-by-Turn GPS Navigation →'}
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
