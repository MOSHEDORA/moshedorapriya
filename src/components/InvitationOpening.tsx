import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Crown, Church, Volume2, VolumeX, ArrowRight, Calendar, MapPin, CheckCircle2, Trees, Flower2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingInfo } from '../data/weddingData';

interface InvitationOpeningProps {
  isOpen: boolean;
  onOpen: () => void;
}

export const InvitationOpening: React.FC<InvitationOpeningProps> = ({ isOpen, onOpen }) => {
  const [isOpeningDoors, setIsOpeningDoors] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [floatingPetals, setFloatingPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; rotation: number; emoji: string }>>([]);

  // Generate floating Garden petals & gold specks
  useEffect(() => {
    const emojis = ['🌸', '🍃', '🌹', '✨', '🌿', '🕊️'];
    const petals = Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 4,
      duration: 7 + Math.random() * 6,
      size: 10 + Math.random() * 14,
      rotation: Math.random() * 360,
      emoji: emojis[i % emojis.length]
    }));
    setFloatingPetals(petals);
  }, []);

  // Garden Harmonic Chimes (Synthesized with Web Audio API)
  const playEdenGardenChimes = () => {
    if (audioMuted) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      // Sacred Wedding Chimes (F# - A# - C# - F - G# - C#)
      const notes = [
        { f: 369.99, time: 0.0, dur: 1.2 },
        { f: 466.16, time: 0.15, dur: 1.2 },
        { f: 554.37, time: 0.30, dur: 1.4 },
        { f: 698.46, time: 0.45, dur: 1.5 },
        { f: 830.61, time: 0.60, dur: 1.8 },
        { f: 1108.73, time: 0.78, dur: 2.4 }
      ];

      notes.forEach(({ f, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + time);
        
        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.18, now + time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + time + dur);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + time);
        osc.stop(now + time + dur + 0.1);
      });
    } catch {
      // Audio fallback
    }
  };

  const handleOpenEdenDoors = () => {
    if (isOpeningDoors) return;
    setIsOpeningDoors(true);
    playEdenGardenChimes();

    // Burst of Garden & Gold Confetti
    const end = Date.now() + 1800;
    const colors = ['#0F3D32', '#2D7A62', '#D4AF37', '#FFFDF9', '#E8A5B3', '#8BA888'];

    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 65,
        origin: { x: 0.05, y: 0.65 },
        colors: colors
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 65,
        origin: { x: 0.95, y: 0.65 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    // Center Gold & Botanical Burst
    confetti({
      particleCount: 100,
      spread: 110,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#FFF2C4', '#2D7A62', '#E8A5B3']
    });

    // Enter directly to website without second page
    setTimeout(() => {
      onOpen();
    }, 1300);
  };

  if (isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="eden-garden-doors-invitation"
        initial={{ opacity: 1 }}
        exit={{ 
          opacity: 0, 
          scale: 1.08,
          filter: 'blur(12px)',
          transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } 
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden bg-gradient-to-b from-[#061C16] via-[#0B2C23] to-[#041410]"
      >
        {/* Floating Garden Petals & Sunbeam Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingPetals.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ 
                y: -30, 
                x: `${petal.left}vw`, 
                opacity: 0, 
                rotate: petal.rotation 
              }}
              animate={{ 
                y: '110vh', 
                x: `${petal.left + (petal.id % 2 === 0 ? 5 : -5)}vw`,
                opacity: [0, 0.8, 0.8, 0],
                rotate: petal.rotation + 360 
              }}
              transition={{ 
                duration: petal.duration, 
                repeat: Infinity, 
                delay: petal.delay,
                ease: 'linear' 
              }}
              className="absolute pointer-events-none select-none text-lg sm:text-2xl filter drop-shadow"
            >
              {petal.emoji}
            </motion.div>
          ))}
        </div>

        {/* Ambient Top Light Beam Effect */}
        <div className="absolute -top-32 inset-x-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.35)_0%,rgba(15,61,50,0.15)_45%,transparent_75%)] pointer-events-none" />

        {/* Rainforest Trees & Wildlife Flanking Backdrop (Visible on Left & Right) */}
        <div className="absolute inset-y-0 left-0 w-36 sm:w-64 pointer-events-none hidden md:flex flex-col justify-between p-4 opacity-85 z-10 select-none">
          {/* Top Left Rainforest Banyan/Palm Tree */}
          <div className="flex flex-col items-start space-y-1">
            <div className="text-4xl sm:text-5xl filter drop-shadow-md animate-pulse">🌴</div>
            <div className="text-2xl sm:text-3xl text-emerald-300">🌿 🦜</div>
            <div className="text-xs font-cinzel text-[#8EB69B] tracking-widest uppercase bg-[#0B2C23]/80 px-2 py-0.5 rounded border border-[#D4AF37]/30">
              Tropical Birds
            </div>
          </div>
          {/* Bottom Left Gentle Deer & Ferns */}
          <div className="flex flex-col items-start space-y-1 mt-auto">
            <div className="text-xs font-cinzel text-[#F1DFA6] tracking-wider uppercase bg-[#0F3D32]/90 px-2.5 py-1 rounded-full border border-[#D4AF37]/40">
              🦌 Gentle Flora &amp; Fauna
            </div>
            <div className="text-4xl sm:text-5xl filter drop-shadow-lg">🦌 🌱 🌸</div>
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 w-36 sm:w-64 pointer-events-none hidden md:flex flex-col justify-between p-4 items-end opacity-85 z-10 select-none">
          {/* Top Right Rainforest Canopy & White Doves */}
          <div className="flex flex-col items-end space-y-1">
            <div className="text-4xl sm:text-5xl filter drop-shadow-md animate-pulse">🌴</div>
            <div className="text-2xl sm:text-3xl text-emerald-300">🕊️ 🌺 🌿</div>
            <div className="text-xs font-cinzel text-[#8EB69B] tracking-widest uppercase bg-[#0B2C23]/80 px-2 py-0.5 rounded border border-[#D4AF37]/30">
              Peaceful Doves
            </div>
          </div>
          {/* Bottom Right Royal Peacock among Hibiscus */}
          <div className="flex flex-col items-end space-y-1 mt-auto">
            <div className="text-xs font-cinzel text-[#F1DFA6] tracking-wider uppercase bg-[#0F3D32]/90 px-2.5 py-1 rounded-full border border-[#D4AF37]/40">
              🦚 Royal Peacock
            </div>
            <div className="text-4xl sm:text-5xl filter drop-shadow-lg">🦚 🌺 🍃</div>
          </div>
        </div>

        {/* Audio Toggle & Subtitle Top Bar */}
        <div className="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F3D32]/80 border border-[#D4AF37]/50 text-[#F1DFA6] text-xs font-cinzel tracking-widest backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Holy Matrimony Invitation</span>
          </div>

          <button
            type="button"
            onClick={() => setAudioMuted(!audioMuted)}
            className="p-2 rounded-full bg-[#0F3D32]/80 border border-[#D4AF37]/50 text-[#F1DFA6] hover:bg-[#1B5A48] transition-all cursor-pointer shadow-md backdrop-blur-xs"
            title={audioMuted ? "Unmute Holy Chimes" : "Mute Sound"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Archway & Double Doors */}
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center [perspective:1400px]">
          
          {/* Garden Arch Top Header */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] font-cinzel text-xs uppercase tracking-[0.3em] font-semibold mb-1">
              <span>🌿</span>
              <span>Song of Solomon 6:3</span>
              <span>🌿</span>
            </div>
            <h1 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#FFF8EB] font-bold tracking-wide drop-shadow-md">
              Moshe Dora &amp; Priya
            </h1>
            <p className="font-cormorant text-base sm:text-lg text-[#D2E3D8] italic max-w-md mx-auto mt-1">
              &ldquo;I am my beloved&apos;s, and my beloved is mine; he grazes among the lilies.&rdquo;
            </p>
          </div>

          {/* THE 3D CEREMONIAL DOUBLE DOORS */}
          <div className="relative w-full max-w-lg aspect-[4/5] sm:aspect-[1/1] max-h-[500px] rounded-t-full border-4 border-[#D4AF37] shadow-[0_20px_60px_rgba(0,0,0,0.85)] bg-gradient-to-b from-[#0E382D] to-[#061813] overflow-hidden p-1 flex relative">
            
            {/* Background Altar Glow (Visible as Doors Open) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,242,196,0.95)_0%,rgba(212,175,55,0.7)_40%,rgba(15,61,50,0.95)_100%)] flex flex-col items-center justify-center p-6 text-center z-0">
              <Sparkles className="w-10 h-10 text-[#5E1626] animate-spin mb-2" />
              <h2 className="font-vibes text-4xl text-[#3B0A13] font-bold">Welcome to Our Celebration</h2>
              <p className="font-cinzel text-xs text-[#5E1626] tracking-widest uppercase mt-1 font-semibold">Entering Holy Matrimony...</p>
            </div>

            {/* Botanical Foliage Around The Outer Arch */}
            <div className="absolute -top-3 left-4 text-2xl z-30 pointer-events-none filter drop-shadow">🍃</div>
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl z-30 pointer-events-none filter drop-shadow">👑</div>
            <div className="absolute -top-3 right-4 text-2xl z-30 pointer-events-none filter drop-shadow">🍃</div>

            {/* LEFT DOOR */}
            <motion.div
              animate={isOpeningDoors ? { rotateY: -115, x: -10 } : { rotateY: 0, x: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: 'left center', transformStyle: 'preserve-3d' }}
              className="w-1/2 h-full bg-gradient-to-br from-[#12483A] via-[#0D382D] to-[#07221B] border-r-2 border-[#D4AF37] rounded-tl-full relative flex flex-col justify-between p-4 sm:p-6 shadow-2xl z-10 select-none overflow-hidden"
            >
              {/* Wood / Conservatory Glass Paneling Details */}
              <div className="absolute inset-2 sm:inset-3 rounded-tl-full border border-[#D4AF37]/50 pointer-events-none" />
              <div className="absolute inset-4 sm:inset-6 rounded-tl-full border border-dashed border-[#D4AF37]/30 pointer-events-none" />

              {/* Botanical Leaves Pattern Decor */}
              <div className="text-left opacity-30 text-2xl mt-4">🌿</div>
              <div className="text-center">
                <div className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  Groom
                </div>
                <div className="font-vibes text-2xl sm:text-3xl text-[#FFF8EB]">
                  Moshe Dora
                </div>
                <div className="w-8 h-[1px] bg-[#D4AF37]/60 mx-auto my-1" />
                <div className="font-cormorant text-[11px] text-[#A3C4B5] italic">
                  Velnati Heritage
                </div>
              </div>

              {/* Left Door Brass Handle */}
              <div className="self-end my-auto -mr-2 sm:-mr-4 flex items-center">
                <div className="w-6 sm:w-8 h-16 sm:h-20 rounded-full bg-gradient-to-b from-[#FFF2C4] via-[#D4AF37] to-[#8C6212] border-2 border-[#FFFDF9] shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center">
                  <div className="w-1.5 h-8 bg-[#5E1626] rounded-full" />
                </div>
              </div>

              <div className="text-left text-xs opacity-40">🌸</div>
            </motion.div>

            {/* RIGHT DOOR */}
            <motion.div
              animate={isOpeningDoors ? { rotateY: 115, x: 10 } : { rotateY: 0, x: 0 }}
              transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              style={{ transformOrigin: 'right center', transformStyle: 'preserve-3d' }}
              className="w-1/2 h-full bg-gradient-to-bl from-[#12483A] via-[#0D382D] to-[#07221B] border-l-2 border-[#D4AF37] rounded-tr-full relative flex flex-col justify-between p-4 sm:p-6 shadow-2xl z-10 select-none overflow-hidden"
            >
              {/* Wood / Conservatory Glass Paneling Details */}
              <div className="absolute inset-2 sm:inset-3 rounded-tr-full border border-[#D4AF37]/50 pointer-events-none" />
              <div className="absolute inset-4 sm:inset-6 rounded-tr-full border border-dashed border-[#D4AF37]/30 pointer-events-none" />

              {/* Botanical Leaves Pattern Decor */}
              <div className="text-right opacity-30 text-2xl mt-4">🌿</div>
              <div className="text-center">
                <div className="font-cinzel text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-bold">
                  Bride
                </div>
                <div className="font-vibes text-2xl sm:text-3xl text-[#FFF8EB]">
                  Nelluri Priya
                </div>
                <div className="w-8 h-[1px] bg-[#D4AF37]/60 mx-auto my-1" />
                <div className="font-cormorant text-[11px] text-[#A3C4B5] italic">
                  Nelluri Heritage
                </div>
              </div>

              {/* Right Door Brass Handle */}
              <div className="self-start my-auto -ml-2 sm:-ml-4 flex items-center">
                <div className="w-6 sm:w-8 h-16 sm:h-20 rounded-full bg-gradient-to-b from-[#FFF2C4] via-[#D4AF37] to-[#8C6212] border-2 border-[#FFFDF9] shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center">
                  <div className="w-1.5 h-8 bg-[#5E1626] rounded-full" />
                </div>
              </div>

              <div className="text-right text-xs opacity-40">🌸</div>
            </motion.div>

            {/* Central Crest / Medallion across both doors */}
            {!isOpeningDoors && (
              <div 
                onClick={handleOpenEdenDoors}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#FFE082] via-[#D4AF37] to-[#8C6212] p-1 shadow-[0_0_30px_rgba(212,175,55,0.7)] group-hover:scale-110 transition-transform flex items-center justify-center border-2 border-[#FFFDF9]">
                  <div className="w-full h-full rounded-full bg-[#0F3D32] flex flex-col items-center justify-center text-[#F1DFA6] border border-[#D4AF37]">
                    <span className="font-cinzel text-xs font-bold tracking-wider">M &bull; P</span>
                    <span className="text-[9px] font-cinzel tracking-widest text-[#D4AF37]">2026</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Single Opening Call to Action Button */}
          <div className="mt-6 sm:mt-8 text-center">
            <motion.button
              type="button"
              onClick={handleOpenEdenDoors}
              disabled={isOpeningDoors}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              className="px-8 sm:px-12 py-4 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59B27] hover:from-[#F3E5AB] hover:to-[#D4AF37] text-[#0A261F] font-cinzel text-sm sm:text-base font-extrabold uppercase tracking-[0.22em] border-2 border-[#FFFDF9] shadow-[0_0_35px_rgba(212,175,55,0.6)] flex items-center justify-center gap-3 cursor-pointer transition-all mx-auto animate-pulse"
            >
              <Trees className="w-4 h-4 text-[#0A261F]" />
              <span>{isOpeningDoors ? "Opening Ceremonial Gates..." : "Open Wedding Gates"}</span>
              <ArrowRight className="w-4 h-4 text-[#0A261F]" />
            </motion.button>
            <p className="font-cormorant text-xs sm:text-sm text-[#A3C4B5] italic mt-2.5">
              Tap above to swing open the ceremonial gates and enter the wedding celebration
            </p>
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
