import React from 'react';
import { Church, UtensilsCrossed, Sparkles, Clock, MapPin, Heart } from 'lucide-react';
import { weddingEvents } from '../data/weddingData';
import { ScrollReveal } from './ScrollReveal';

export const EventTimeline: React.FC = () => {
  const eventImages = [
    "/assets/DSC04713.JPG",
    "/assets/DSC04767.JPG",
    "/assets/DSC04710.JPG"
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#F4F8F5] border-b border-[#D4AF37]/30 overflow-hidden" id="schedule">
      {/* Background Jungle Shadows */}
      <div className="absolute top-12 left-4 text-7xl opacity-15 pointer-events-none select-none">🌿</div>
      <div className="absolute bottom-12 right-4 text-7xl opacity-15 pointer-events-none select-none">🌴</div>
      <div className="absolute top-1/2 right-4 text-6xl opacity-15 pointer-events-none select-none">🦜</div>
      <div className="absolute bottom-1/4 left-4 text-6xl opacity-15 pointer-events-none select-none">🦌</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header (Pure Wedding Titles with Jungle Accents) */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>Wedding Order of Services</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              Programme &amp; Schedule
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-xl mx-auto mt-2">
              Every sacred moment celebrated with joy, prayer, thanksgiving, and fellowship.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline Cards */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-1/2 before:-translate-x-1/2 before:w-[2px] before:bg-gradient-to-b before:from-transparent before:via-[#D4AF37] before:to-transparent hidden md:block">
          {weddingEvents.map((event, idx) => {
            const isEven = idx % 2 === 0;
            const photoUrl = eventImages[idx] || eventImages[0];

            return (
              <div key={event.id} className="relative flex items-center justify-between">
                {/* Left side content (if even) */}
                <div className={`w-[45%] ${isEven ? 'text-right' : 'order-last text-left'}`}>
                  <ScrollReveal direction={isEven ? 'left' : 'right'} delay={idx * 150} threshold={0.15}>
                    <div className="bg-[#FBF6EC] p-6 rounded-2xl border-2 border-[#D4AF37]/60 shadow-md hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 overflow-hidden">
                      {/* Event Photo Vignette */}
                      <div className="h-32 -mx-6 -mt-6 mb-4 overflow-hidden relative">
                        <img
                          src={photoUrl}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FBF6EC] via-transparent to-black/30" />
                        <div className="absolute top-2 right-2 bg-[#0F3D32]/90 text-[#F1DFA6] text-[10px] font-cinzel px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 font-semibold shadow-xs">
                          {event.date}
                        </div>
                      </div>

                      <h3 className="font-decorative text-2xl text-[#0F3D32] font-bold">
                        {event.title}
                      </h3>
                      {event.teluguTitle && (
                        <div className="font-serif text-sm text-[#5E1626] font-semibold my-1">
                          {event.teluguTitle}
                        </div>
                      )}
                      <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-cinzel font-bold text-[#5E1626] border border-[#D4AF37]/30 my-2 shadow-xs">
                        ⏰ {event.time}
                      </div>
                      <p className="font-cormorant text-base text-[#2A2A2A] italic mt-1 leading-relaxed">
                        "{event.description}"
                      </p>
                      <div className={`mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center gap-2 text-xs font-cinzel text-[#0F3D32] ${isEven ? 'justify-end' : 'justify-start'}`}>
                        <MapPin className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
                        <span>{event.venue}</span>
                      </div>
                    </div>
                  </ScrollReveal>
                </div>

                {/* Center Badge Icon */}
                <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-[#0F3D32] border-2 border-[#D4AF37] flex items-center justify-center text-[#F1DFA6] shadow-lg z-10">
                  {idx === 0 && <Church className="w-5 h-5" />}
                  {idx === 1 && <UtensilsCrossed className="w-5 h-5" />}
                  {idx === 2 && <Sparkles className="w-5 h-5" />}
                </div>

                {/* Empty opposite side spacer */}
                <div className="w-[45%]" />
              </div>
            );
          })}
        </div>

        {/* Mobile View Timeline List */}
        <div className="space-y-6 md:hidden">
          {weddingEvents.map((event, idx) => {
            const photoUrl = eventImages[idx] || eventImages[0];

            return (
              <ScrollReveal key={event.id} direction="up" delay={idx * 120} threshold={0.1}>
                <div className="bg-[#FBF6EC] rounded-2xl border-2 border-[#D4AF37]/60 shadow-md overflow-hidden">
                  <div className="h-36 w-full overflow-hidden relative">
                    <img
                      src={photoUrl}
                      alt={event.title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 text-white">
                      <span className="bg-[#0F3D32]/90 text-[#F1DFA6] text-[10px] font-cinzel px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 font-semibold shadow-xs">
                        {event.date}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-full bg-[#0F3D32] text-[#F1DFA6] flex items-center justify-center flex-shrink-0 text-xs shadow-sm">
                        {idx === 0 && <Church className="w-3.5 h-3.5" />}
                        {idx === 1 && <UtensilsCrossed className="w-3.5 h-3.5" />}
                        {idx === 2 && <Sparkles className="w-3.5 h-3.5" />}
                      </div>
                      <h3 className="font-decorative text-xl text-[#0F3D32] font-bold">
                        {event.title}
                      </h3>
                    </div>

                    {event.teluguTitle && (
                      <div className="text-xs font-serif text-[#5E1626] font-semibold mb-2">
                        {event.teluguTitle}
                      </div>
                    )}

                    <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-cinzel font-bold text-[#5E1626] border border-[#D4AF37]/30 my-1 shadow-xs">
                      ⏰ {event.time}
                    </div>

                    <p className="font-cormorant text-base text-[#2A2A2A] italic mt-2">
                      "{event.description}"
                    </p>

                    <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center gap-2 text-xs font-cinzel text-[#0F3D32]">
                      <MapPin className="w-3.5 h-3.5 text-[#C59B27] flex-shrink-0" />
                      <span>{event.venue}</span>
                    </div>
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
