import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music, Play, Pause, Sparkles } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Royalty-free celebratory instrumental wedding audio
    const audio = new Audio('https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8e70c3f3e.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay policy fallback
      });
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      {/* Floating Audio Controller */}
      <div 
        className="relative group flex items-center"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Tooltip */}
        <div className={`absolute bottom-full right-0 mb-3 px-3.5 py-1.5 rounded-xl bg-[#08221B] text-[#F1DFA6] text-xs font-cinzel whitespace-nowrap border border-[#D4AF37]/60 shadow-xl pointer-events-none transition-all duration-300 ${
          showTooltip || isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          {isPlaying ? '🌿 Playing: Wedding Celebration Harmony' : '🦜 Click to Play Wedding Celebration Music'}
        </div>

        <button
          onClick={togglePlay}
          aria-label="Toggle wedding music"
          className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-[#FFFDF9] shadow-[0_4px_20px_rgba(212,175,55,0.5)] transition-all duration-500 cursor-pointer ${
            isPlaying 
              ? 'bg-gradient-to-tr from-[#996515] via-[#D4AF37] to-[#FFF2C4] text-[#2b2205] scale-105 animate-[spin_8s_linear_infinite]' 
              : 'bg-gradient-to-tr from-[#0F3D32] to-[#1B5A48] text-[#F1DFA6] hover:scale-105'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Music className="w-5 h-5 animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
};
