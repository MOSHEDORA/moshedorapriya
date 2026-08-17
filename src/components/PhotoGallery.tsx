import React, { useState } from 'react';
import { 
  Heart, 
  Sparkles, 
  Camera, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Image as ImageIcon,
  Users,
  Smile
} from 'lucide-react';
import { PhotoItem } from '../types';
import { ScrollReveal } from './ScrollReveal';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  selectedPhoto: PhotoItem | null;
  onSelectPhoto: (photo: PhotoItem | null) => void;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  selectedPhoto,
  onSelectPhoto,
}) => {
  const [filter, setFilter] = useState<'all' | 'couple' | 'portrait' | 'moments'>('all');

  const [photoLikes, setPhotoLikes] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('moshe_priya_photo_likes_clean');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoLikes(prev => {
      const next = {
        ...prev,
        [id]: (prev[id] || 0) + 1
      };
      try {
        localStorage.setItem('moshe_priya_photo_likes_clean', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const filteredPhotos = filter === 'all' 
    ? photos 
    : photos.filter(p => p.category === filter);

  const currentIndex = selectedPhoto 
    ? filteredPhotos.findIndex(p => p.id === selectedPhoto.id)
    : -1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      onSelectPhoto(filteredPhotos[currentIndex - 1]);
    } else {
      onSelectPhoto(filteredPhotos[filteredPhotos.length - 1]);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < filteredPhotos.length - 1) {
      onSelectPhoto(filteredPhotos[currentIndex + 1]);
    } else {
      onSelectPhoto(filteredPhotos[0]);
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 bg-[#FBF6EC] border-b border-[#D4AF37]/30 overflow-hidden" id="gallery">
      {/* Visual Botanical Jungle Atmosphere */}
      <div className="absolute top-4 left-4 text-7xl opacity-15 pointer-events-none select-none">🌴</div>
      <div className="absolute top-1/2 -left-6 text-7xl opacity-15 pointer-events-none select-none">🌿</div>
      <div className="absolute bottom-4 right-4 text-7xl opacity-15 pointer-events-none select-none">🌴</div>
      <div className="absolute top-12 right-12 text-5xl opacity-15 pointer-events-none select-none">🦋</div>
      <div className="absolute bottom-12 left-12 text-6xl opacity-15 pointer-events-none select-none">🦚</div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <ScrollReveal direction="up" threshold={0.15}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 font-cinzel text-xs uppercase tracking-[0.3em] text-[#0F3D32] font-semibold mb-2 bg-white/90 px-5 py-2 rounded-full border border-[#D4AF37]/60 shadow-sm">
              <span className="text-sm">🌿</span>
              <span>Precious Memories &amp; Wedding Album</span>
              <span className="text-sm">🌿</span>
            </div>
            <h2 className="font-decorative text-3xl sm:text-4xl md:text-5xl text-[#0F3D32] font-bold">
              Wedding Photo Gallery
            </h2>
            <p className="font-cormorant text-lg sm:text-xl text-[#2A2A2A]/85 italic max-w-xl mx-auto mt-2">
              A curated collection of cherished moments, portraits, and celebrations honoring Moshe Dora &amp; Priya.
            </p>

            <div className="flex items-center justify-center gap-3 mt-4">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
          </div>
        </ScrollReveal>

        {/* Filter Tabs Centered with Botanical Border */}
        <ScrollReveal direction="up" delay={100} threshold={0.15}>
          <div className="flex items-center justify-center gap-2 mb-10 bg-white/90 p-2 sm:p-2.5 rounded-full border border-[#D4AF37]/60 shadow-sm max-w-md mx-auto">
            {[
              { key: 'all', label: 'All Photos', icon: ImageIcon },
              { key: 'couple', label: 'Couple', icon: Heart },
              { key: 'portrait', label: 'Portraits', icon: Users },
              { key: 'moments', label: 'Celebration', icon: Smile }
            ].map(cat => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.key}
                  onClick={() => setFilter(cat.key as any)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-cinzel text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    filter === cat.key
                      ? 'bg-[#0F3D32] text-[#F1DFA6] shadow-sm'
                      : 'text-[#2A2A2A] hover:bg-[#FBF6EC] hover:text-[#0F3D32]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollReveal>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredPhotos.map((photo, index) => {
            const likes = photoLikes[photo.id] || 0;

            return (
              <ScrollReveal key={photo.id} direction="up" delay={50 + (index % 6) * 60} threshold={0.1}>
                <div
                  onClick={() => onSelectPhoto(photo)}
                  className="group relative bg-[#FFFDF9] rounded-2xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-md hover:shadow-2xl hover:border-[#D4AF37] transition-all duration-300 cursor-pointer flex flex-col h-full"
                >
                  {/* Photo Image Aspect */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/20 opacity-60 group-hover:opacity-85 transition-opacity" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-[#0F3D32]/90 backdrop-blur-xs text-[#F1DFA6] text-[10px] font-cinzel font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#D4AF37]/40 shadow-xs">
                        {photo.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleLike(photo.id, e)}
                        className="w-8 h-8 rounded-full bg-white/85 backdrop-blur-xs text-[#5E1626] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow cursor-pointer"
                        title="Send Love"
                      >
                        <Heart className="w-4 h-4 fill-[#5E1626]" />
                      </button>
                    </div>

                    <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-xs">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Photo Description Card */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-decorative text-lg text-[#0F3D32] font-bold">
                        {photo.title}
                      </h3>
                      <p className="font-cormorant text-sm text-[#2A2A2A]/85 italic mt-1 line-clamp-2 leading-relaxed">
                        "{photo.caption}"
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#D4AF37]/25 flex items-center justify-between text-xs font-cinzel text-[#996515]">
                      <span>Wedding Album</span>
                      <span className="flex items-center gap-1 text-[#5E1626] font-semibold">
                        <Heart className={`w-3 h-3 ${likes > 0 ? 'fill-[#5E1626]' : ''}`} /> {likes > 0 ? `${likes} ${likes === 1 ? 'love' : 'loves'}` : 'Send Love'}
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Fullscreen Lightbox Modal */}
        {selectedPhoto && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => onSelectPhoto(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => onSelectPhoto(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 transition-colors z-10 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev & Next Arrows */}
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-10 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <div 
              className="relative max-w-4xl max-h-[90vh] bg-[#FFFDF9] rounded-2xl overflow-hidden border-2 border-[#D4AF37] shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPhoto.imageUrl}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-6 bg-[#FFFDF9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="font-cinzel text-xs uppercase tracking-widest text-[#996515] font-bold">
                    {selectedPhoto.category}
                  </div>
                  <h3 className="font-decorative text-2xl text-[#0F3D32] font-bold">
                    {selectedPhoto.title}
                  </h3>
                  <p className="font-cormorant text-base text-[#2A2A2A] italic mt-1">
                    "{selectedPhoto.caption}"
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => handleLike(selectedPhoto.id, e)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#5E1626] text-white font-cinzel text-xs font-semibold hover:bg-[#7e1e33] transition-colors cursor-pointer shadow-sm"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>{photoLikes[selectedPhoto.id] || 0} Loves</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
