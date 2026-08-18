import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  Volume2, 
  VolumeX, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useLanguage } from '../context/LanguageContext';

interface SectionQuickTip {
  id: string;
  quickTalk: string;
  actionText?: string;
  actionTarget?: string;
}

const SECTION_TIPS_EN: Record<string, SectionQuickTip> = {
  hero: {
    id: 'hero',
    quickTalk: 'Welcome to Moshe Dora & Priya’s Holy Wedding! ✨',
    actionText: 'Save Date 📅',
    actionTarget: 'calendar'
  },
  calendar: {
    id: 'calendar',
    quickTalk: 'Thursday, Sep 03, 2026 at 10 AM! Save to calendar 📅',
    actionText: 'Sync Calendar 📅',
    actionTarget: 'calendar'
  },
  venue: {
    id: 'venue',
    quickTalk: 'Vedika Function Hall, Yeleswaram! Route map below 📍',
    actionText: 'Open Map 📍',
    actionTarget: 'venue'
  },
  couple: {
    id: 'couple',
    quickTalk: 'Velnati Moshe Dora & Nelluri Priya! United in Christ 👑',
    actionText: 'Play Game 🎮',
    actionTarget: 'game'
  },
  game: {
    id: 'game',
    quickTalk: 'Team Moshe vs Team Priya! Catch pearls & score points 🎮',
    actionText: 'Play Game 🎮',
    actionTarget: 'game'
  },
  blessings: {
    id: 'blessings',
    quickTalk: 'Leave your prayer & blessings in the guestbook! ✍️❤️',
    actionText: 'Write Blessing ✍️',
    actionTarget: 'blessings'
  },
  gallery: {
    id: 'gallery',
    quickTalk: 'Tap photos to view in full HD gallery album! 📸',
    actionText: 'View Album 📸',
    actionTarget: 'gallery'
  },
  video: {
    id: 'video',
    quickTalk: 'Watch their engagement ceremony livestream on YouTube! 🎬',
    actionText: 'Watch Video 🎬',
    actionTarget: 'video'
  }
};

const SECTION_TIPS_TE: Record<string, SectionQuickTip> = {
  hero: {
    id: 'hero',
    quickTalk: 'మోషే దొర & ప్రియల పరిశుద్ధ వివాహ మహోత్సవానికి స్వాగతం! ✨',
    actionText: 'ముహూర్తం 📅',
    actionTarget: 'calendar'
  },
  calendar: {
    id: 'calendar',
    quickTalk: 'గురువారం, సెప్టెంబర్ 03, 2026 ఉదయం 10:00 గంటలకు! 📅',
    actionText: 'క్యాలెండర్ 📅',
    actionTarget: 'calendar'
  },
  venue: {
    id: 'venue',
    quickTalk: 'వేదిక ఫంక్షన్ హాల్, ఏలేశ్వరం! కింద గూగుల్ రూట్ మ్యాప్ ఉంది 📍',
    actionText: 'మ్యాప్ చూడండి 📍',
    actionTarget: 'venue'
  },
  couple: {
    id: 'couple',
    quickTalk: 'వేల్నాటి మోషే దొర & నెల్లూరి ప్రియ! దైవ ప్రేమలో ఏకమయ్యారు 👑',
    actionText: 'గేమ్ ఆడండి 🎮',
    actionTarget: 'game'
  },
  game: {
    id: 'game',
    quickTalk: 'టీమ్ మోషే vs టీమ్ ప్రియ! ముత్యాలు పట్టుకుని పాయింట్లు గెలవండి 🎮',
    actionText: 'గేమ్ ఆడండి 🎮',
    actionTarget: 'game'
  },
  blessings: {
    id: 'blessings',
    quickTalk: 'వధూవరుల కొరకు మీ ప్రార్థనలు & శుభాకాంక్షలు తెలియజేయండి! ✍️❤️',
    actionText: 'ఆశీర్వదించండి ✍️',
    actionTarget: 'blessings'
  },
  gallery: {
    id: 'gallery',
    quickTalk: 'ఫోటోలపై క్లిక్ చేసి ఫుల్ స్క్రీన్‌లో వీక్షించండి! 📸',
    actionText: 'ఆల్బమ్ 📸',
    actionTarget: 'gallery'
  },
  video: {
    id: 'video',
    quickTalk: 'నిశ్చితార్థ వేడుక లైవ్ రికార్డింగ్ వీడియోని చూడండి! 🎬',
    actionText: 'వీడియో చూడండి 🎬',
    actionTarget: 'video'
  }
};

export const AnimatedWeddingAssistant: React.FC = () => {
  const { language } = useLanguage();
  const [activeSectionId, setActiveSectionId] = useState<string>('hero');
  const [isBubbleVisible, setIsBubbleVisible] = useState(true);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  
  // Real-time flight coordinates (moving continuously left to right & right to left)
  const [posX, setPosX] = useState(50);
  const [posY, setPosY] = useState(130);
  const flightSpeed = useRef(1.8);
  const animFrameRef = useRef<number | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  const currentSectionTips = language === 'te' ? SECTION_TIPS_TE : SECTION_TIPS_EN;
  const activeTip = currentSectionTips[activeSectionId] || currentSectionTips['hero'];

  // Setup TTS
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Continuous Left-to-Right and Right-to-Left Flight Loop
  useEffect(() => {
    let currentX = 50;
    let movingRight = true;
    let time = 0;

    const animateFlight = () => {
      const screenW = window.innerWidth;
      const minX = 20;
      const maxX = Math.max(minX + 50, screenW - 240);

      // Move horizontally left <-> right
      if (movingRight) {
        currentX += flightSpeed.current;
        if (currentX >= maxX) {
          currentX = maxX;
          movingRight = false;
          setDirection('left');
        }
      } else {
        currentX -= flightSpeed.current;
        if (currentX <= minX) {
          currentX = minX;
          movingRight = true;
          setDirection('right');
        }
      }

      time += 0.05;
      setPosX(currentX);

      animFrameRef.current = requestAnimationFrame(animateFlight);
    };

    animFrameRef.current = requestAnimationFrame(animateFlight);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Adjust bird base height when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportH = window.innerHeight;
      const scrollPercent = scrollY / (document.documentElement.scrollHeight - viewportH || 1);
      const targetScreenY = 110 + scrollPercent * (viewportH - 260);
      setPosY(targetScreenY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect which section is currently in view
  useEffect(() => {
    const sectionIds = ['hero', 'calendar', 'venue', 'couple', 'game', 'blessings', 'gallery', 'video'];
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
            const id = entry.target.id;
            if (id && currentSectionTips[id]) {
              setActiveSectionId(id);
              setIsBubbleVisible(true);
            }
          }
        });
      },
      { threshold: [0.25, 0.5], rootMargin: '-10% 0px -20% 0px' }
    );

    elements.forEach(el => observer.observe(el));
    return () => elements.forEach(el => observer.unobserve(el));
  }, [language]);

  // Voice narration when visible section changes
  useEffect(() => {
    if (isVoiceEnabled && synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(activeTip.quickTalk);
      utterance.rate = 1.1;
      utterance.pitch = 1.15;

      const voices = synthRef.current.getVoices();
      if (language === 'te') {
        const teVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('hi') || v.lang.includes('IN'));
        if (teVoice) utterance.voice = teVoice;
      } else {
        const voice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('en-GB') || v.name.includes('Natural'));
        if (voice) utterance.voice = voice;
      }

      synthRef.current.speak(utterance);
    }
  }, [activeSectionId, isVoiceEnabled, language]);

  const handleActionClick = (targetId?: string) => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBirdClick = () => {
    confetti({ particleCount: 40, spread: 60 });
    setIsBubbleVisible(!isBubbleVisible);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none">
      
      {/* ============================================================== */}
      {/* CONTINUOUS LEFT-TO-RIGHT & RIGHT-TO-LEFT REALISTIC FLYING BIRD */}
      {/* ============================================================== */}
      <div
        className="absolute pointer-events-auto flex flex-col items-center cursor-pointer transition-transform duration-75"
        style={{
          transform: `translate3d(${posX}px, ${posY}px, 0)`,
          width: '230px'
        }}
      >
        
        {/* ============================================================== */}
        {/* QUICK 1-LINER TALK BUBBLE (Short, punchy main point) */}
        {/* ============================================================== */}
        <AnimatePresence>
          {isBubbleVisible && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 4 }}
              className="relative w-full mb-1 bg-[#FFFDF9]/95 backdrop-blur-md border border-[#D4AF37] shadow-xl rounded-xl p-2.5 text-[#2A2A2A]"
              style={{
                boxShadow: '0 8px 20px -3px rgba(15, 61, 50, 0.22), 0 0 12px rgba(212, 175, 55, 0.3)'
              }}
            >
              {/* Quick Talk Line */}
              <p className="font-cormorant text-sm font-bold text-[#0F3D32] leading-snug text-center">
                "{activeTip.quickTalk}"
              </p>

              {/* Action Button & Voice Toggle */}
              <div className="flex items-center justify-between gap-1.5 mt-2 pt-1 border-t border-[#D4AF37]/30">
                {activeTip.actionText && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleActionClick(activeTip.actionTarget);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-[#0F3D32] hover:bg-[#1B5A48] text-[#F1DFA6] font-cinzel text-[10px] font-bold uppercase tracking-wider text-center cursor-pointer border border-[#D4AF37]/60 shadow-xs transition-transform hover:scale-[1.02]"
                  >
                    {activeTip.actionText}
                  </button>
                )}

                {/* Voice Narration Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsVoiceEnabled(!isVoiceEnabled);
                  }}
                  className={`p-1 px-1.5 rounded text-[10px] border cursor-pointer ${
                    isVoiceEnabled ? 'bg-[#0F3D32] text-[#F1DFA6] border-[#D4AF37]' : 'bg-gray-100 text-gray-500'
                  }`}
                  title={isVoiceEnabled ? (language === 'te' ? 'వాయిస్ ఆఫ్' : 'Mute') : (language === 'te' ? 'వాయిస్ ఆన్' : 'Voice')}
                >
                  {isVoiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                </button>

                {/* Hide Bubble Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsBubbleVisible(false);
                  }}
                  className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                  title="Hide"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Speech Bubble Arrow */}
              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#FFFDF9] border-r border-b border-[#D4AF37] rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================== */}
        {/* REALISTIC FLYING BIRD (Flaps Wings, Turns Left/Right) */}
        {/* ============================================================== */}
        <motion.div
          animate={{
            scaleX: direction === 'right' ? 1 : -1,
            rotate: direction === 'right' ? [0, 4, -2, 0] : [0, -4, 2, 0]
          }}
          transition={{
            scaleX: { duration: 0.25 },
            rotate: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' }
          }}
          onClick={handleBirdClick}
          className="relative cursor-pointer select-none filter drop-shadow-[0_8px_14px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform"
          title="Flying Bird Mascot — Click to interact!"
        >
          {/* Custom SVG Realistic Bird Sprite */}
          <svg
            width="78"
            height="58"
            viewBox="0 0 100 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
          >
            {/* Top Flapping Wing */}
            <motion.path
              d="M38 35 C32 10, 55 0, 75 8 C60 16, 50 25, 42 38 Z"
              fill="url(#flightWingGrad)"
              stroke="#D4AF37"
              strokeWidth="1.5"
              animate={{
                d: [
                  "M38 35 C32 6, 55 -4, 76 6 C60 14, 50 24, 42 38 Z",
                  "M38 35 C35 48, 60 52, 72 45 C58 40, 48 38, 42 38 Z",
                  "M38 35 C32 6, 55 -4, 76 6 C60 14, 50 24, 42 38 Z"
                ]
              }}
              transition={{ repeat: Infinity, duration: 0.32, ease: 'easeInOut' }}
            />

            {/* Tail Plumage Feathers */}
            <path
              d="M18 42 C8 48, 0 54, 2 62 C12 56, 20 48, 26 44 Z"
              fill="#0F3D32"
              stroke="#D4AF37"
              strokeWidth="1"
            />
            <path
              d="M20 44 C12 52, 4 60, 8 68 C16 60, 24 50, 28 45 Z"
              fill="#5E1626"
              stroke="#D4AF37"
              strokeWidth="1"
            />

            {/* Main Body */}
            <path
              d="M22 42 C22 30, 36 24, 52 26 C68 28, 78 38, 72 50 C66 60, 42 62, 28 54 C24 50, 22 46, 22 42 Z"
              fill="url(#flightBodyGrad)"
              stroke="#D4AF37"
              strokeWidth="1.5"
            />

            {/* Breast / Feather Tone */}
            <path
              d="M38 36 C46 34, 58 38, 62 48 C56 56, 44 56, 36 50 Z"
              fill="#F1DFA6"
              opacity="0.9"
            />

            {/* Bird Head */}
            <circle cx="68" cy="30" r="13" fill="#0F3D32" stroke="#D4AF37" strokeWidth="1.5" />

            {/* Sparkling Eye */}
            <circle cx="72" cy="27" r="3.5" fill="#FFFDF9" />
            <circle cx="73" cy="27" r="2" fill="#1A1A1A" />
            <circle cx="74" cy="26" r="0.8" fill="#FFFFFF" />

            {/* Beak */}
            <path d="M78 28 L95 33 L78 37 Z" fill="#E67E22" stroke="#D4AF37" strokeWidth="1" />

            {/* Royal Gold Crown */}
            <path
              d="M62 18 L65 11 L69 16 L73 10 L77 16 L80 11 L83 18 Z"
              fill="#D4AF37"
              stroke="#FFF"
              strokeWidth="0.8"
            />
            <circle cx="65" cy="11" r="1.2" fill="#E74C3C" />
            <circle cx="73" cy="10" r="1.2" fill="#3498DB" />
            <circle cx="80" cy="11" r="1.2" fill="#E74C3C" />

            {/* Bottom Flapping Wing */}
            <motion.path
              d="M40 46 C48 60, 65 65, 75 58 C62 55, 52 48, 44 44 Z"
              fill="#2D7A62"
              stroke="#D4AF37"
              strokeWidth="1"
              animate={{
                d: [
                  "M40 46 C48 62, 65 68, 76 60 C62 56, 52 48, 44 44 Z",
                  "M40 46 C44 38, 60 35, 70 42 C58 45, 50 46, 44 44 Z",
                  "M40 46 C48 62, 65 68, 76 60 C62 56, 52 48, 44 44 Z"
                ]
              }}
              transition={{ repeat: Infinity, duration: 0.32, ease: 'easeInOut' }}
            />

            {/* Color Gradients */}
            <defs>
              <linearGradient id="flightBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F3D32" />
                <stop offset="65%" stopColor="#2D7A62" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
              <linearGradient id="flightWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#2D7A62" />
                <stop offset="100%" stopColor="#0F3D32" />
              </linearGradient>
            </defs>
          </svg>

          {/* Sparkle particles trailing behind bird */}
          <div className="absolute -left-1 top-3 flex gap-1 pointer-events-none">
            <span className="text-[10px] animate-ping text-[#D4AF37]">✨</span>
            <span className="text-[8px] animate-pulse text-[#2D7A62]">🍃</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
