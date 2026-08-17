import React, { useState } from 'react';
import { Heart, MessageSquare, Send, Sparkles, User, ThumbsUp } from 'lucide-react';
import { initialBlessings } from '../data/weddingData';
import { BlessingNote } from '../types';
import { ScrollReveal } from './ScrollReveal';

export const BlessingsWall: React.FC = () => {
  const [blessings, setBlessings] = useState<BlessingNote[]>(() => {
    const saved = localStorage.getItem('moshe_priya_blessings');
    return saved ? JSON.parse(saved) : initialBlessings;
  });

  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const quickWishes = [
    "God bless your sacred union with endless peace & joy! ✨",
    "Hearty congratulations Moshe Dora & Priya! Wishing you a blessed home. 💍",
    "May the Almighty guide your steps together always! 🌸",
    "Ecclesiastes 4:12 — A cord of three strands is never broken! 🕊️"
  ];

  const handleLike = (id: string) => {
    const updated = blessings.map(b => b.id === id ? { ...b, likes: b.likes + 1 } : b);
    setBlessings(updated);
    localStorage.setItem('moshe_priya_blessings', JSON.stringify(updated));
  };

  const handleAddBlessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    const newNote: BlessingNote = {
      id: `blessing-${Date.now()}`,
      name: newName.trim(),
      city: newCity.trim() || undefined,
      message: newMessage.trim(),
      timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      likes: 1,
      isUserAdded: true
    };

    const updated = [newNote, ...blessings];
    setBlessings(updated);
    localStorage.setItem('moshe_priya_blessings', JSON.stringify(updated));

    setNewName('');
    setNewCity('');
    setNewMessage('');
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#F4F8F5] border-b border-[#D4AF37]/30 overflow-hidden" id="blessings">
      {/* Background Jungle Plant & Animal Shadows */}
      <div className="absolute top-8 right-6 text-7xl opacity-15 pointer-events-none hidden md:block select-none">🌺</div>
      <div className="absolute bottom-8 left-6 text-7xl opacity-15 pointer-events-none hidden md:block select-none">🦋</div>
      <div className="absolute top-1/2 left-4 text-6xl opacity-15 pointer-events-none hidden md:block select-none">🌿</div>
      <div className="absolute bottom-1/3 right-4 text-6xl opacity-15 pointer-events-none hidden md:block select-none">🌴</div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header (Pure Wedding Titles with Jungle Accents) */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>Wedding Guestbook &amp; Prayerful Wishes</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              Guest Blessings &amp; Prayers
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-xl mx-auto mt-2">
              Read heartfelt prayers from loved ones and write your personal wedding blessings for Moshe Dora &amp; Priya.
            </p>
          </div>
        </ScrollReveal>

        {/* Write a Blessing Form */}
        <ScrollReveal direction="up" delay={100} threshold={0.15}>
          <div className="bg-[#FBF6EC] rounded-2xl border-2 border-[#D4AF37]/70 p-6 sm:p-8 mb-12 shadow-md">
            <form onSubmit={handleAddBlessing} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase text-[#0F3D32] font-bold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Uncle Samuel"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-cormorant focus:outline-none focus:border-[#0F3D32]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase text-[#0F3D32] font-bold mb-1">
                    Your City / Relation (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Kakinada / Friend"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-cormorant focus:outline-none focus:border-[#0F3D32]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-cinzel uppercase text-[#0F3D32] font-bold mb-1">
                  Your Wedding Blessing / Prayer *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Write your prayers and congratulatory wishes..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-xl text-sm font-cormorant focus:outline-none focus:border-[#0F3D32]"
                />
              </div>

              {/* Quick Wishes Chips */}
              <div>
                <div className="text-[11px] font-cinzel text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">
                  Quick wishes (click to insert):
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {quickWishes.map((w, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setNewMessage(w)}
                      className="text-xs font-cormorant bg-white border border-[#D4AF37]/50 px-3 py-1 rounded-full text-[#2A2A2A] hover:bg-[#0F3D32] hover:text-[#F1DFA6] transition-all text-left cursor-pointer"
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0F3D32] hover:bg-[#1B5A48] text-[#F1DFA6] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Wedding Blessing</span>
                </button>
              </div>
            </form>
          </div>
        </ScrollReveal>

        {/* Blessings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blessings.map((b, idx) => (
            <ScrollReveal key={b.id} direction="up" delay={50 + (idx % 4) * 80} threshold={0.1}>
              <div
                className="bg-[#FFFDF9] rounded-2xl border-2 border-[#D4AF37]/50 p-6 shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-all h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#0F3D32]/10 text-[#0F3D32] flex items-center justify-center font-cinzel font-bold text-xs">
                        {b.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-cinzel text-sm font-bold text-[#0F3D32]">
                          {b.name}
                        </div>
                        {b.city && (
                          <div className="text-[11px] text-gray-500 font-cinzel">
                            {b.city}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[11px] text-gray-400 font-cinzel">
                      {b.timestamp}
                    </span>
                  </div>

                  <p className="font-cormorant text-base text-[#2A2A2A] italic leading-relaxed">
                    "{b.message}"
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-[#996515] font-cinzel font-medium">
                    May God Bless This Union
                  </span>
                  <button
                    onClick={() => handleLike(b.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FBF6EC] hover:bg-[#5E1626] text-[#5E1626] hover:text-white text-xs font-cinzel font-semibold transition-all border border-[#D4AF37]/30 cursor-pointer shadow-xs"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{b.likes}</span>
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
