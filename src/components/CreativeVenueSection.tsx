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
  ShieldCheck,
  Calendar,
  Clock,
  Building2,
  Trees
} from 'lucide-react';
import { venueInfo } from '../data/weddingData';
import { ScrollReveal } from './ScrollReveal';

export const CreativeVenueSection: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const fullAddress = `${venueInfo.name}, ${venueInfo.hallName}, ${venueInfo.addressLine1}, ${venueInfo.city}, ${venueInfo.state} - ${venueInfo.pincode}`;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `💍 Wedding Venue & Date Details:\n👰 Bride: Nelluri Priya & 🤵 Groom: Velnati Moshe Dora\n📅 Date: Thursday, September 03, 2026 at 10:00 AM IST\n📍 Venue: Vedika Function Hall, Yeleswaram\n\nGoogle Maps Navigation: https://maps.app.goo.gl/gLeSdH2zKB5729Lb6`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const transitHubs = [
    { icon: Train, name: "Samalkot Junction (SLO)", dist: "32 km · 40 mins", desc: "Main express railway junction connecting Hyderabad, Vijayawada & Vizag." },
    { icon: Plane, name: "Rajahmundry Airport (RJA)", dist: "62 km · 1 hr 15 mins", desc: "Daily direct commercial flights from major metro hubs." },
    { icon: Car, name: "NH-16 Kathipudi / Prathipadu", dist: "18 km · 20 mins", desc: "Direct 4-lane highway corridor turning into Yeleswaram." },
    { icon: Train, name: "Tuni Railway Station (TUNI)", dist: "38 km · 45 mins", desc: "Convenient rail link on the coastal mainline corridor." }
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
        {/* Section Header (Pure Wedding Title with Jungle Botanical Styling) */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>Wedding Venue &amp; Location Guide</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              Wedding Venue &amp; Location
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-2xl mx-auto mt-2">
              Join us at the prestigious Vedika Function Hall in Yeleswaram for this blessed matrimonial covenant.
            </p>
          </div>
        </ScrollReveal>

        {/* Highlighted Date and Place Golden Botanical Banner */}
        <ScrollReveal direction="zoom" delay={100} threshold={0.15}>
          <div className="mb-12 p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#0F3D32] via-[#164e40] to-[#0F3D32] text-white border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-0 right-10 text-6xl opacity-15 pointer-events-none select-none">🌴</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">
              {/* Highlighted Date */}
              <div className="flex items-start gap-4 border-b md:border-b-0 md:border-r border-[#D4AF37]/40 pb-4 md:pb-0 md:pr-6">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37] text-[#0F3D32] flex items-center justify-center flex-shrink-0 shadow-md">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-cinzel text-xs uppercase tracking-widest text-[#F1DFA6] font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Auspicious Wedding Date
                  </span>
                  <h3 className="font-decorative text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Thursday, September 03, 2026
                  </h3>
                  <p className="font-cinzel text-xs text-[#F1DFA6]/90 mt-1 flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>10:00 AM IST Onwards · Holy Matrimony &amp; Grand Feast</span>
                  </p>
                </div>
              </div>

              {/* Highlighted Place */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37] text-[#0F3D32] flex items-center justify-center flex-shrink-0 shadow-md">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-cinzel text-xs uppercase tracking-widest text-[#F1DFA6] font-bold flex items-center gap-1.5">
                    <Building2 className="w-3 h-3 text-[#D4AF37]" /> Function Hall Destination
                  </span>
                  <h3 className="font-decorative text-xl sm:text-2xl font-bold text-white mt-0.5">
                    Vedika Function Hall
                  </h3>
                  <p className="font-cinzel text-xs text-[#F1DFA6]/90 mt-1">
                    Main Road, Near Town Center · Yeleswaram, AP - 533429
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Venue Details & Actions Box */}
        <ScrollReveal direction="up" delay={150} threshold={0.15}>
          <div className="mb-10 bg-gradient-to-r from-[#FBF6EC] via-[#FFFDF9] to-[#FBF6EC] rounded-2xl border-2 border-[#D4AF37] gold-box-shadow p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 font-cinzel text-xs uppercase tracking-widest text-[#996515] font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Grand A/C Auditorium &amp; Banquet</span>
                </div>
                <h3 className="font-decorative text-2xl sm:text-3xl text-[#0F3D32] font-bold mt-1">
                  {venueInfo.name}
                </h3>
                <p className="font-cormorant text-base sm:text-lg text-[#2A2A2A] mt-1 font-medium">
                  {venueInfo.hallName} · {venueInfo.addressLine1}, {venueInfo.city}, {venueInfo.state} - {venueInfo.pincode}
                </p>

                {/* Amenities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-5">
                  {venueInfo.amenities.slice(0, 4).map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-cinzel text-[#0F3D32] font-semibold">
                      <ShieldCheck className="w-4 h-4 text-[#C59B27] flex-shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={venueInfo.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#C59B27] to-[#996515] text-[#2b2205] font-cinzel text-xs font-bold uppercase tracking-wider hover:shadow-lg transition-all shadow-md"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </a>

                <button
                  onClick={handleCopyAddress}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#D4AF37] text-[#0F3D32] font-cinzel text-xs font-semibold hover:bg-[#FBF6EC] transition-all shadow-xs cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied Address!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#C59B27]" />
                      <span>Copy Address</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareWhatsApp}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366]/10 text-[#0F3D32] border border-[#25D366]/40 font-cinzel text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-all shadow-xs cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share Venue on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Live Interactive Map Frame */}
        <ScrollReveal direction="up" delay={200} threshold={0.15}>
          <div className="mb-10 rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-xl relative bg-stone-100">
            <div className="bg-[#0F3D32] text-[#F1DFA6] px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 font-cinzel text-xs sm:text-sm font-semibold tracking-wider">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Direct Google Maps Location · Vedika Function Hall, Yeleswaram</span>
              </div>
              <a
                href="https://maps.app.goo.gl/gLeSdH2zKB5729Lb6"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-cinzel text-[#F1DFA6] hover:underline flex items-center gap-1 font-semibold"
              >
                <span>Google Maps Route</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <iframe
              title="Vedika Function Hall Location"
              src="https://maps.google.com/maps?q=Vedika+Function+Hall+Yeleswaram&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="360"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-80 sm:h-96"
            />
          </div>
        </ScrollReveal>

        {/* Transit Hubs & Route Guide Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {transitHubs.map((hub, index) => {
            const IconComponent = hub.icon;
            return (
              <ScrollReveal key={index} direction="up" delay={100 + index * 60} threshold={0.1}>
                <div className="p-4 bg-[#FBF6EC] rounded-xl border border-[#D4AF37]/50 shadow-xs flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                  <div>
                    <div className="flex items-center gap-2 text-[#0F3D32] mb-1">
                      <IconComponent className="w-4 h-4 text-[#C59B27]" />
                      <h4 className="font-cinzel text-xs font-bold">{hub.name}</h4>
                    </div>
                    <div className="font-decorative text-sm text-[#5E1626] font-bold">
                      {hub.dist}
                    </div>
                    <p className="font-cormorant text-xs text-[#2A2A2A]/80 mt-1">
                      {hub.desc}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
