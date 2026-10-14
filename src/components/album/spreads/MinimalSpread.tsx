'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';

interface SpreadProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  onPhotoClick?: (photo: PhotoItem) => void;
  pageNumber: number;
}

export const MinimalSpread: React.FC<SpreadProps> = ({
  spread,
  isLeft,
  onPhotoClick,
  pageNumber,
}) => {
  const photo = isLeft ? spread.leftPhotos?.[0] : spread.rightPhotos?.[0];

  return (
    <div
      className={`relative w-full h-full p-6 sm:p-8 flex flex-col justify-between select-none ${
        isLeft ? 'spine-gutter-left' : 'spine-gutter-right'
      }`}
    >
      {/* Archival Folio Header */}
      <div className="flex justify-between items-center text-[#d4af37] text-[8px] sm:text-[9px] font-sans-clean tracking-[0.22em] uppercase pb-2 border-b border-[#d4af37]/40">
        <span>
          {isLeft
            ? 'ALPHA STORIES ARCHIVAL SPREAD - UDAIPUR'
            : 'CHAPTER V: THE ROYAL PORTRAIT STUDY'}
        </span>
        <span className="text-[#d4af37]/80">
          {isLeft ? `FOLIO ${String(pageNumber).padStart(2, '0')}` : `FOLIO ${String(pageNumber).padStart(2, '0')} of 24`}
        </span>
      </div>

      {/* Main Content */}
      <div className="my-auto flex flex-col items-center justify-center w-full py-1">
        {isLeft && photo ? (
          <div
            onClick={() => onPhotoClick?.(photo)}
            className="group cursor-pointer w-[90%] bg-[#fdfaf5] p-2.5 rounded-xs shadow-md hover:shadow-xl transition-all duration-300 border border-[#d6cbba]"
          >
            <div className="aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-zinc-900 rounded-xs">
              <img
                src={photo.url}
                alt={photo.caption || 'Minimal Portrait'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
            </div>
            {photo.caption && (
              <div className="mt-2 text-center">
                <p className="font-editorial italic text-xs text-[#473f34]">
                  {photo.caption}
                </p>
                <p className="font-sans-clean text-[8px] uppercase tracking-widest text-[#9e907d] mt-0.5">
                  F/1.8 • 1/400S • 85MM FINE ART PRIME
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="w-[88%] text-center space-y-4 flex flex-col items-center py-4">
            <span className="font-sans-clean text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#9e907d]">
              SACRED PROMISE
            </span>
            <div className="w-10 h-[1px] bg-[#d4af37]" />
            <p className="font-editorial italic text-xl sm:text-2xl md:text-3xl text-[#26221d] leading-relaxed font-light">
              "{spread.quote || 'You are my today and all of my tomorrows.'}"
            </p>
            {spread.quoteAuthor && (
              <p className="font-script text-2xl sm:text-3xl text-[#8c7438]">
                — {spread.quoteAuthor}
              </p>
            )}
            <div className="w-10 h-[1px] bg-[#d4af37]" />
            <p className="font-sans-clean text-[9px] uppercase tracking-widest text-[#7a6f5d] max-w-xs leading-5">
              Hand-finished fine art print on archival warm cotton rag paper
            </p>
          </div>
        )}
      </div>

      {/* Archival Proof Footer */}
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#8a7c68] pt-2 border-t border-[#ded5c2]/80">
        {isLeft ? (
          <>
            <span>12.19.2024 · THE INNER ATELIER</span>
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
