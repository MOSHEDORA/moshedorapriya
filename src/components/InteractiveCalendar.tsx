import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Bell, Check, Share2, Sparkles, Crown, Gift, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingInfo } from '../data/weddingData';
import { generateIcsFile, getGoogleCalendarUrl, getOutlookCalendarUrl, getYahooCalendarUrl } from '../utils/calendar';
import { ScrollReveal } from './ScrollReveal';

export const InteractiveCalendar: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<number>(3); // Default to wedding day Sep 3
  const [calendarAdded, setCalendarAdded] = useState(false);

  // Real-time Countdown calculation
  const weddingTimestamp = new Date(weddingInfo.weddingDate).getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = Date.now();
      const diff = weddingTimestamp - now;
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingTimestamp]);

  const triggerCelebration = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#0F3D32', '#5E1626', '#F1DFA6']
    });
  };

  const handleDownloadIcs = () => {
    generateIcsFile();
    setCalendarAdded(true);
    triggerCelebration();
    setTimeout(() => setCalendarAdded(false), 4000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `💍 Wedding Invitation: Moshe Dora & Priya\n📅 Date: Thursday, September 03, 2026 at 10:00 AM IST\n📍 Venue: Vedika Function Hall, Yeleswaram\n\nPlease join us and celebrate! View invitation details: ${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Calendar Days Grid for September 2026
  const daysInSeptember = 30;
  const startDayOfWeek = 2; // Tuesday is index 2

  const calendarGrid = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarGrid.push({ day: null, isWedding: false });
  }
  for (let d = 1; d <= daysInSeptember; d++) {
    calendarGrid.push({
      day: d,
      isWedding: d === 3
    });
  }

  // Selected Day Details
  const getSelectedDayDetails = (day: number) => {
    if (day === 3) {
      return {
        title: "The Auspicious Wedding Day & Holy Matrimony",
        badge: "👑 Royal Matrimony & Banquet",
        time: "10:00 AM – 03:00 PM IST",
        events: [
          "10:00 AM: Holy Matrimony & Sacred Service at Main Auditorium",
          "11:30 AM: Pastoral Benediction & Garland Ceremony",
          "12:45 PM: Royal Wedding Andhra & Multi-Cuisine Feast at Banquet Hall"
        ],
        dress: "Royal Gold, Emerald & Traditional Elegance",
        bgClass: "bg-[#FBF6EC] border-[#D4AF37]"
      };
    } else {
      return {
        title: `September ${day}, 2026`,
        badge: day < 3 ? "Countdown Period" : "Wedding Blessings Period",
        time: "Preparation & Prayers",
        events: [
          day < 3 
            ? `${3 - day} day(s) until the Holy Matrimony of Velnati Moshe Dora & Nelluri Priya.`
            : `United in holy matrimony on Thursday, September 03, 2026 at Vedika Function Hall.`
        ],
        dress: "Traditional Festive Attire",
        bgClass: "bg-white border-gray-200"
      };
    }
  };

  const dayDetails = getSelectedDayDetails(selectedDay);

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-gradient-to-b from-[#F2F8F4] via-[#E8F2EC] to-[#F5F9F6] border-b border-[#D4AF37]/30 overflow-hidden" id="calendar">
      {/* Visual Jungle Rainforest Foliage & Wildlife Decor */}
      <div className="absolute top-10 right-4 text-7xl opacity-15 pointer-events-none select-none">🌴</div>
      <div className="absolute bottom-10 left-4 text-7xl opacity-15 pointer-events-none select-none">🌿</div>
      <div className="absolute top-1/2 left-2 text-6xl opacity-15 pointer-events-none select-none">🦜</div>
      <div className="absolute bottom-1/4 right-2 text-6xl opacity-15 pointer-events-none select-none">🦚</div>

      {/* Jungle Vines Border Top */}
      <div className="absolute top-0 inset-x-0 flex justify-between px-8 pointer-events-none opacity-25 text-xl select-none">
        <span>🌿 🍃 🌺</span>
        <span>🌴 🌿 🌸 🍃</span>
        <span>🌺 🍃 🌿</span>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header (Pure Wedding Text with Jungle Green Accents) */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>Wedding Date &amp; Countdown · Sep 03, 2026</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              Wedding Date &amp; Calendar
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-xl mx-auto mt-2">
              Mark your calendar for Thursday, September 03, 2026. Click the dates below to explore the celebration timeline!
            </p>
          </div>
        </ScrollReveal>

        {/* Live Countdown Grid with Botanical Glowing Ornaments */}
        <ScrollReveal direction="zoom" delay={100} threshold={0.15}>
          <div className="mb-14 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#0F3D32] via-[#1B5A48] to-[#0c332a] rounded-2xl p-6 sm:p-8 text-[#FFFDF9] emerald-box-shadow relative overflow-hidden border-2 border-[#D4AF37]/70 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.3),transparent_70%)] pointer-events-none" />
              <div className="absolute -bottom-6 -left-6 text-7xl opacity-15 pointer-events-none select-none">🌴</div>
              
              <div className="relative z-10 text-center">
                <div className="font-cinzel text-xs uppercase tracking-[0.3em] text-[#F1DFA6] font-semibold mb-1 flex items-center justify-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  The Auspicious Wedding Day Draws Near
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                </div>
                <h3 className="font-decorative text-xl sm:text-2xl text-[#FFFDF9] mb-6">
                  Counting Down to Holy Matrimony
                </h3>

                {/* Countdown Numbers */}
                <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-xl mx-auto">
                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-[#D4AF37]/40 text-center">
                    <div className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#F1DFA6] drop-shadow">
                      {String(timeLeft.days).padStart(2, '0')}
                    </div>
                    <div className="font-cinzel text-[10px] sm:text-xs uppercase tracking-widest text-[#FFFDF9]/80 mt-1">
                      Days
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-[#D4AF37]/40 text-center">
                    <div className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#F1DFA6] drop-shadow">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </div>
                    <div className="font-cinzel text-[10px] sm:text-xs uppercase tracking-widest text-[#FFFDF9]/80 mt-1">
                      Hours
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-[#D4AF37]/40 text-center">
                    <div className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#F1DFA6] drop-shadow">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </div>
                    <div className="font-cinzel text-[10px] sm:text-xs uppercase tracking-widest text-[#FFFDF9]/80 mt-1">
                      Minutes
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 border border-[#D4AF37]/40 text-center">
                    <div className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#F1DFA6] drop-shadow animate-pulse">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </div>
                    <div className="font-cinzel text-[10px] sm:text-xs uppercase tracking-widest text-[#FFFDF9]/80 mt-1">
                      Seconds
                    </div>
                  </div>
                </div>

                <div className="mt-6 inline-flex items-center gap-2 text-xs font-cinzel text-[#F1DFA6]/90 bg-white/5 px-4 py-1.5 rounded-full border border-[#D4AF37]/30">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>10:00 AM IST · Indian Standard Time (GMT+5:30)</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main Interactive Calendar Section: Month Grid + Interactive Day Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* September 2026 Interactive Visual Calendar */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={150} threshold={0.15}>
              <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#D4AF37]/70 p-6 sm:p-8 gold-box-shadow shadow-xl">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#D4AF37]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#0F3D32] flex items-center justify-center text-[#F1DFA6] shadow-sm">
                      <Crown className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-decorative text-xl sm:text-2xl text-[#0F3D32] font-bold">
                        September 2026
                      </h4>
                      <p className="font-cinzel text-xs text-[#996515] uppercase tracking-wider font-semibold">
                        Auspicious Month of Holy Matrimony
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="bg-[#5E1626] text-[#FFFDF9] font-cinzel text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                      Wedding Day
                    </span>
                  </div>
                </div>

                {/* Days of the Week Header */}
                <div className="grid grid-cols-7 gap-1 text-center font-cinzel text-xs font-bold text-[#0F3D32] mb-3">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
                    <div key={d} className={`py-1.5 ${i === 0 ? 'text-[#5E1626]' : ''}`}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Month Calendar Day Tiles */}
                <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                  {calendarGrid.map((item, index) => {
                    if (!item.day) {
                      return <div key={`empty-${index}`} className="h-10 sm:h-12 rounded-lg bg-transparent" />;
                    }

                    const isWeddingDay = item.isWedding;
                    const isSelected = selectedDay === item.day;

                    return (
                      <button
                        key={`day-${item.day}`}
                        onClick={() => {
                          setSelectedDay(item.day);
                          if (isWeddingDay) triggerCelebration();
                        }}
                        className={`h-11 sm:h-14 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer font-cinzel text-xs sm:text-sm font-semibold
                          ${isSelected ? 'ring-2 ring-[#0F3D32] ring-offset-2 scale-105 z-10' : 'hover:scale-105'}
                          ${isWeddingDay 
                            ? 'bg-gradient-to-br from-[#D4AF37] via-[#C59B27] to-[#996515] text-[#2b2205] font-bold shadow-lg shadow-[#D4AF37]/40' 
                            : 'bg-[#FBF6EC] text-[#2A2A2A] hover:bg-[#F1DFA6]/40 border border-[#D4AF37]/20'
                          }
                        `}
                      >
                        {isWeddingDay && (
                          <span className="absolute -top-1.5 -right-1.5 text-xs text-[#5E1626] bg-[#FFFDF9] rounded-full p-0.5 shadow">
                            👑
                          </span>
                        )}

                        <span>{item.day}</span>

                        {isWeddingDay && (
                          <span className="text-[9px] uppercase font-bold tracking-tighter text-[#2b2205] leading-none">
                            Wedding
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Calendar Legend */}
                <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-[#D4AF37]/20 text-xs font-cinzel">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-[#D4AF37] to-[#996515] inline-block shadow-xs" />
                    <span className="text-[#0F3D32] font-bold">Thursday, September 03, 2026 · Holy Matrimony &amp; Grand Feast</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Interactive Selected Day Schedule & Multi-Calendar Sync */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <ScrollReveal direction="right" delay={150} threshold={0.15}>
              {/* Day Details Card */}
              <div className={`p-6 rounded-2xl border-2 ${dayDetails.bgClass} shadow-md transition-all mb-6`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-cinzel text-xs uppercase tracking-wider font-bold text-[#5E1626]">
                    {dayDetails.badge}
                  </span>
                  <span className="text-xs font-cinzel bg-white px-2.5 py-1 rounded-full border border-gray-300 font-semibold text-[#0F3D32]">
                    {dayDetails.time}
                  </span>
                </div>

                <h4 className="font-decorative text-xl sm:text-2xl text-[#0F3D32] font-bold mb-3">
                  {dayDetails.title}
                </h4>

                <div className="space-y-2 mb-4">
                  {dayDetails.events.map((ev, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[#2A2A2A] font-cormorant leading-relaxed">
                      <span className="text-[#C59B27] mt-1 font-bold">❖</span>
                      <span>{ev}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs font-cinzel text-[#2A2A2A]/80">
                  <span>Dress code: <strong>{dayDetails.dress}</strong></span>
                  {selectedDay === 3 && (
                    <span className="text-[#5E1626] font-bold flex items-center gap-1">
                      <Crown className="w-3 h-3 text-[#C59B27]" /> Main Ceremony
                    </span>
                  )}
                </div>
              </div>

              {/* 1-Click Multi-Calendar Integration Hub */}
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#D4AF37]/60 p-6 shadow-sm">
                <h4 className="font-cinzel text-sm uppercase tracking-wider font-bold text-[#0F3D32] mb-1 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#C59B27]" />
                  Add to Your Calendar &amp; Reminders
                </h4>
                <p className="text-xs text-[#2A2A2A]/70 font-cormorant mb-4">
                  Sync with your personal smartphone or computer calendar so you don't miss a single moment:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Google Calendar */}
                  <a
                    href={getGoogleCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={triggerCelebration}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-white border border-[#D4AF37] text-[#0F3D32] font-cinzel text-xs font-bold hover:bg-[#0F3D32] hover:text-[#FFFDF9] transition-all shadow-sm"
                  >
                    <CalendarIcon className="w-4 h-4 text-[#C59B27]" />
                    <span>Google Calendar</span>
                  </a>

                  {/* Apple & Outlook ICS Download */}
                  <button
                    onClick={handleDownloadIcs}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#2b2205] font-cinzel text-xs font-bold hover:shadow-md transition-all shadow-sm cursor-pointer"
                  >
                    {calendarAdded ? (
                      <>
                        <Check className="w-4 h-4 text-[#0F3D32]" />
                        <span>Downloaded .ics!</span>
                      </>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        <span>Apple / Outlook (.ics)</span>
                      </>
                    )}
                  </button>

                  {/* Outlook Online */}
                  <a
                    href={getOutlookCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-[#2A2A2A] font-cinzel text-xs hover:border-[#D4AF37] transition-all"
                  >
                    <span>Outlook Live</span>
                  </a>

                  {/* Yahoo Calendar */}
                  <a
                    href={getYahooCalendarUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 text-[#2A2A2A] font-cinzel text-xs hover:border-[#D4AF37] transition-all"
                  >
                    <span>Yahoo Calendar</span>
                  </a>
                </div>

                {/* Share & Forward on WhatsApp */}
                <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between">
                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#25D366]/10 text-[#0F3D32] border border-[#25D366]/40 font-cinzel text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Forward Wedding Date on WhatsApp</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
