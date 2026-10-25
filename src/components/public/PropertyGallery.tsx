'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { SafeImage } from '@/components/ui/SafeImage';

interface PropertyGalleryProps {
  images: string[];
  title: string;
}

export default function PropertyGallery({ images, title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const displayImages = images.length > 0 ? images : ['/HomaceLogo.png'];

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % displayImages.length);
  }, [displayImages.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  }, [displayImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  return (
    <div className="space-y-3">
      {/* Primary Displayed Photo */}
      <div className="relative h-80 sm:h-96 md:h-[480px] rounded-2xl overflow-hidden bg-brand-slate-900 border border-brand-slate-200 group">
        <SafeImage
          src={displayImages[selectedIndex]}
          alt={`${title} - Photo ${selectedIndex + 1} of ${displayImages.length}`}
          propertyTitle={title}
          fill
          priority
          className="group-hover:scale-[1.01] transition-transform duration-300"
          sizes="(max-width: 1024px) 100vw, 896px"
        />

        {/* Fullscreen Trigger */}
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-xl backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 text-xs font-semibold z-10"
          aria-label="Open full screen gallery"
        >
          <Maximize2 className="w-4 h-4" />
          <span className="hidden sm:inline">View Gallery</span>
        </button>

        {/* Quick Prev / Next Overlays if multiple images */}
        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-all active:scale-95 z-10"
              aria-label="Previous photograph"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full backdrop-blur-sm transition-all active:scale-95 z-10"
              aria-label="Next photograph"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Photo Counter Pill */}
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-mono z-10">
          {selectedIndex + 1} / {displayImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {displayImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-28 shrink-0 rounded-xl overflow-hidden border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-brand-copper ring-2 ring-brand-copper/30 scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              aria-label={`Select photograph ${idx + 1}`}
            >
              <SafeImage
                src={img}
                alt={`${title} - Thumbnail ${idx + 1}`}
                propertyTitle={title}
                fill
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full screen image viewer"
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-brand-copper p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
            aria-label="Close full screen gallery"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {displayImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-4 sm:left-8 text-white hover:text-brand-copper p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                aria-label="Previous photograph"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-4 sm:right-8 text-white hover:text-brand-copper p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-50"
                aria-label="Next photograph"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Large Image Container */}
          <div className="relative w-full max-w-5xl h-[75vh] flex items-center justify-center">
            <SafeImage
              src={displayImages[selectedIndex]}
              alt={`${title} - Fullscreen View ${selectedIndex + 1}`}
              propertyTitle={title}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          {/* Bottom Caption */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-1.5 rounded-full text-white text-xs font-mono z-50">
            Photo {selectedIndex + 1} of {displayImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
