import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Bell, Check, Share2, Sparkles, Crown, Gift, MapPin } from 'lucide-react';
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
        {/* Section Header */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>Wedding Date &amp; Calendar · Sep 03, 2026</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              Date &amp; Calendar
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-xl mx-auto mt-2">
              Mark your calendar for Thursday, September 03, 2026. Join us as we count down to the Holy Matrimony!
            </p>
          </div>
        </ScrollReveal>

        {/* Date and Calendar Side by Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Date, Countdown Timer & Quick Sync */}
          <div className="lg:col-span-6 flex flex-col">
            <ScrollReveal direction="left" delay={100} threshold={0.15} className="h-full">
              <div className="bg-gradient-to-br from-[#0F3D32] via-[#164e40] to-[#0c332a] text-white rounded-2xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle_at_100%_0%,rgba(212,175,55,0.25),transparent_70%)] pointer-events-none" />
                <div className="absolute -bottom-6 -left-6 text-7xl opacity-15 pointer-events-none select-none">🌴</div>

                <div className="relative z-10">
                  {/* Wedding Date Title */}
                  <div className="flex items-center gap-2 text-xs font-cinzel uppercase tracking-[0.25em] text-[#F1DFA6] font-bold mb-2">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Wedding Date &amp; Time</span>
                  </div>
                  <h3 className="font-decorative text-2xl sm:text-3xl font-bold text-white mb-1">
                    Thursday, September 03, 2026
                  </h3>
                  <div className="inline-flex items-center gap-2 text-xs font-cinzel text-[#F1DFA6] bg-white/10 px-3.5 py-1.5 rounded-full border border-[#D4AF37]/30 mb-6">
                    <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>10:00 AM IST · Holy Matrimony &amp; Grand Feast</span>
                  </div>

                  {/* Live Countdown Timer Grid */}
                  <div className="mb-6">
                    <div className="text-[11px] font-cinzel uppercase tracking-widest text-[#F1DFA6]/80 mb-2">
                      Live Countdown to Holy Matrimony
                    </div>
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 border border-[#D4AF37]/40 text-center">
                        <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F1DFA6]">
                          {String(timeLeft.days).padStart(2, '0')}
                        </div>
                        <div className="font-cinzel text-[9px] sm:text-[10px] uppercase tracking-wider text-[#FFFDF9]/80 mt-0.5">
                          Days
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 border border-[#D4AF37]/40 text-center">
                        <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F1DFA6]">
                          {String(timeLeft.hours).padStart(2, '0')}
                        </div>
                        <div className="font-cinzel text-[9px] sm:text-[10px] uppercase tracking-wider text-[#FFFDF9]/80 mt-0.5">
                          Hours
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 border border-[#D4AF37]/40 text-center">
                        <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F1DFA6]">
                          {String(timeLeft.minutes).padStart(2, '0')}
                        </div>
                        <div className="font-cinzel text-[9px] sm:text-[10px] uppercase tracking-wider text-[#FFFDF9]/80 mt-0.5">
                          Mins
                        </div>
                      </div>

                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-2.5 sm:p-3.5 border border-[#D4AF37]/40 text-center">
                        <div className="font-cinzel text-2xl sm:text-3xl font-bold text-[#F1DFA6] animate-pulse">
                          {String(timeLeft.seconds).padStart(2, '0')}
                        </div>
                        <div className="font-cinzel text-[9px] sm:text-[10px] uppercase tracking-wider text-[#FFFDF9]/80 mt-0.5">
                          Secs
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1-Click Calendar Sync & WhatsApp Share Buttons */}
                <div className="relative z-10 pt-4 border-t border-[#D4AF37]/30 space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Google Calendar */}
                    <a
                      href={getGoogleCalendarUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={triggerCelebration}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white text-[#0F3D32] font-cinzel text-xs font-bold hover:bg-[#F1DFA6] transition-all shadow-sm text-center"
                    >
                      <CalendarIcon className="w-3.5 h-3.5 text-[#C59B27]" />
                      <span>Google Calendar</span>
                    </a>

                    {/* Apple & Outlook ICS Download */}
                    <button
                      onClick={handleDownloadIcs}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C59B27] text-[#2b2205] font-cinzel text-xs font-bold hover:shadow-md transition-all shadow-sm cursor-pointer text-center"
                    >
                      {calendarAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#0F3D32]" />
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Gift className="w-3.5 h-3.5" />
                          <span>Apple / Outlook</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#25D366]/20 text-[#FFFDF9] border border-[#25D366]/50 font-cinzel text-xs font-semibold hover:bg-[#25D366] hover:text-white transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Forward Wedding Date on WhatsApp</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Month Calendar Grid */}
          <div className="lg:col-span-6 flex flex-col">
            <ScrollReveal direction="right" delay={100} threshold={0.15} className="h-full">
              <div className="bg-[#FFFDF9] rounded-2xl border-2 border-[#D4AF37] p-6 sm:p-8 gold-box-shadow shadow-xl flex flex-col justify-between h-full">
                <div>
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
                          Holy Matrimony Month
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
                          className={`h-11 sm:h-13 rounded-xl flex flex-col items-center justify-center relative transition-all duration-200 cursor-pointer font-cinzel text-xs sm:text-sm font-semibold
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
                            <span className="text-[8px] uppercase font-bold tracking-tighter text-[#2b2205] leading-none">
                              Wedding
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Legend */}
                <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 text-xs font-cinzel flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-gradient-to-br from-[#D4AF37] to-[#996515] inline-block shadow-xs flex-shrink-0" />
                    <span className="text-[#0F3D32] font-bold">Sep 03, 2026 · Holy Matrimony</span>
                  </div>
                  <div className="text-[#996515] font-semibold">
                    📍 Vedika Function Hall
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
