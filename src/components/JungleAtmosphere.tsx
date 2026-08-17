import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingLeaf {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  rotation: number;
  iconType: 'leaf' | 'monstera' | 'fern' | 'flower' | 'butterfly';
}

export const JungleAtmosphere: React.FC = () => {
  const [elements, setElements] = useState<FloatingLeaf[]>([]);

  useEffect(() => {
    // Generate gentle floating rainforest leaves & butterflies
    const initialElements: FloatingLeaf[] = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: -10 - Math.random() * 40,
      size: 18 + Math.random() * 22,
      duration: 16 + Math.random() * 14,
      delay: Math.random() * 10,
      rotation: Math.random() * 360,
      iconType: (['leaf', 'monstera', 'fern', 'flower', 'butterfly'] as const)[i % 5]
    }));
    setElements(initialElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Top Canopy Hanging Vines & Foliage Border */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-20 flex justify-between items-start opacity-75 overflow-hidden">
        {/* Left Vine Clump */}
        <div className="flex items-start -space-x-4">
          <svg className="w-24 sm:w-36 h-20 text-[#163832] fill-current transform -scale-x-100" viewBox="0 0 100 80">
            <path d="M0,0 Q30,10 40,45 Q45,65 35,80 Q25,65 30,45 Q35,20 0,0 Z" />
            <path d="M20,0 Q50,15 65,40 Q75,60 60,75 Q50,55 45,35 Q40,15 20,0 Z" opacity="0.8" />
            <path d="M10,0 Q35,25 50,50 Q55,60 45,70 Q40,50 30,30 Q20,10 10,0 Z" opacity="0.6" />
          </svg>
          <div className="hidden sm:block text-2xl animate-pulse">🌿</div>
          <div className="text-xl">🍃</div>
          <div className="text-sm">🌸</div>
        </div>

        {/* Center Canopy Garlands */}
        <div className="flex items-center gap-6 sm:gap-12 mt-1">
          <span className="text-xs sm:text-sm text-[#235347] opacity-60">🌿 🌺 🦜 🍃 🌸 🌿</span>
        </div>

        {/* Right Vine Clump */}
        <div className="flex items-start -space-x-4">
          <div className="text-sm">🌺</div>
          <div className="text-xl">🍃</div>
          <div className="hidden sm:block text-2xl animate-pulse">🌿</div>
          <svg className="w-24 sm:w-36 h-20 text-[#163832] fill-current" viewBox="0 0 100 80">
            <path d="M0,0 Q30,10 40,45 Q45,65 35,80 Q25,65 30,45 Q35,20 0,0 Z" />
            <path d="M20,0 Q50,15 65,40 Q75,60 60,75 Q50,55 45,35 Q40,15 20,0 Z" opacity="0.8" />
            <path d="M10,0 Q35,25 50,50 Q55,60 45,70 Q40,50 30,30 Q20,10 10,0 Z" opacity="0.6" />
          </svg>
        </div>
      </div>

      {/* Floating Leaves and Butterflies Animation */}
      {elements.map((elem) => (
        <motion.div
          key={elem.id}
          className="absolute"
          initial={{
            top: `${elem.y}%`,
            left: `${elem.x}%`,
            opacity: 0,
            rotate: elem.rotation,
            scale: 0.8
          }}
          animate={{
            top: '105%',
            left: `${(elem.x + (Math.sin(elem.id) * 15) + 100) % 100}%`,
            opacity: [0, 0.75, 0.85, 0],
            rotate: elem.rotation + 360,
            scale: [0.8, 1.1, 0.9]
          }}
          transition={{
            duration: elem.duration,
            repeat: Infinity,
            delay: elem.delay,
            ease: 'linear'
          }}
          style={{ width: elem.size, height: elem.size }}
        >
          {elem.iconType === 'leaf' && (
            <span className="text-emerald-700 opacity-60 drop-shadow-xs text-lg sm:text-xl">🍃</span>
          )}
          {elem.iconType === 'monstera' && (
            <span className="text-teal-800 opacity-60 drop-shadow-xs text-lg sm:text-xl">🌿</span>
          )}
          {elem.iconType === 'fern' && (
            <span className="text-green-800 opacity-60 drop-shadow-xs text-base sm:text-lg">🌱</span>
          )}
          {elem.iconType === 'flower' && (
            <span className="text-rose-400 opacity-65 drop-shadow-xs text-sm sm:text-base">🌸</span>
          )}
          {elem.iconType === 'butterfly' && (
            <span className="text-amber-500 opacity-70 drop-shadow-xs text-base sm:text-lg inline-block animate-bounce">🦋</span>
          )}
        </motion.div>
      ))}
    </div>
  );
};
