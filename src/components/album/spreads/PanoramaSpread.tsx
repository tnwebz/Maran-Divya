'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';

interface SpreadProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  onPhotoClick?: (photo: PhotoItem) => void;
  pageNumber: number;
}

export const PanoramaSpread: React.FC<SpreadProps> = ({
  spread,
  isLeft,
  onPhotoClick,
  pageNumber,
}) => {
  const photo = spread.panoramaPhoto || spread.leftPhotos?.[0] || spread.rightPhotos?.[0];

  return (
    <div
      className={`relative w-full h-full p-6 sm:p-8 flex flex-col justify-between select-none ${
        isLeft ? 'spine-gutter-left' : 'spine-gutter-right'
      }`}
    >
      {/* Archival Folio Header */}
      <div className="flex justify-between items-center text-[#d4af37] text-[8px] sm:text-[9px] font-sans-clean tracking-[0.22em] uppercase pb-2 border-b border-[#d4af37]/40 z-10">
        <span>
          {isLeft
            ? 'ALPHA STORIES ARCHIVAL SPREAD - UDAIPUR'
            : 'CHAPTER II: THE GRAND MANDAP PANORAMA'}
        </span>
        <span className="text-[#d4af37]/80">
          {isLeft ? `FOLIO ${String(pageNumber).padStart(2, '0')}` : `FOLIO ${String(pageNumber).padStart(2, '0')} of 24`}
        </span>
      </div>

      {/* Panorama Dual-Page Container */}
      <div className="my-auto w-full flex items-center justify-center py-2 z-10">
        {photo && (
          <div
            onClick={() => onPhotoClick?.(photo)}
            className="group cursor-pointer relative w-full h-[58vh] max-h-[580px] bg-[#fdfaf5] p-2.5 rounded-xs shadow-xl border border-[#d6cbba] overflow-hidden"
          >
            {/* The half-image container spanning across the two pages */}
            <div className="relative w-full h-full overflow-hidden rounded-xs bg-zinc-900">
              <div
                className="absolute top-0 bottom-0 h-full transition-transform duration-700 ease-out group-hover:scale-[1.015]"
                style={{
                  width: '200%',
                  left: isLeft ? '0%' : '-100%',
                }}
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Panoramic Wedding'}
                  className="w-full h-full object-cover object-center"
                  loading="eager"
                />
              </div>

              {/* Natural Spine Gutter Crease Lighting Overlay */}
              <div
                className={`absolute inset-0 pointer-events-none ${
                  isLeft
                    ? 'bg-gradient-to-r from-transparent via-transparent to-black/35'
                    : 'bg-gradient-to-l from-transparent via-transparent to-black/35'
                }`}
              />

              {/* Metadata overlay on right page corner */}
              {!isLeft && (
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm px-3.5 py-2 rounded-xs text-right border border-white/15">
                  <p className="font-serif-luxury text-xs text-white tracking-wider">
                    {spread.title || 'The Royal Mandap Vows'}
                  </p>
                  <p className="font-sans-clean text-[8px] uppercase tracking-widest text-[#d4af37] mt-0.5">
                    PANORAMIC FINE ART CAPTURE • 24MM
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Archival Proof Footer */}
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#8a7c68] pt-2 border-t border-[#ded5c2]/80 z-10">
        {isLeft ? (
          <>
            <span>12.19.2024 · THE MANDAP COURTYARD</span>
            <span className="flex items-center gap-1 text-[#a39062]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              ARCHIVAL PROOF
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1 text-[#a39062]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              R & P · ROYAL INSIGNIA
            </span>
            <span>CURATED BY ALPHA ATELIER</span>
          </>
        )}
      </div>
    </div>
  );
};
