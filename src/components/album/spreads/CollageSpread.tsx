'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';

interface SpreadProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  onPhotoClick?: (photo: PhotoItem) => void;
  pageNumber: number;
}

export const CollageSpread: React.FC<SpreadProps> = ({
  spread,
  isLeft,
  onPhotoClick,
  pageNumber,
}) => {
  const photos = isLeft ? spread.leftPhotos || [] : spread.rightPhotos || [];

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
            : 'CHAPTER VI: SACRED RITUALS & CUSTOMS'}
        </span>
        <span className="text-[#d4af37]/80">
          {isLeft ? `FOLIO ${String(pageNumber).padStart(2, '0')}` : `FOLIO ${String(pageNumber).padStart(2, '0')} of 24`}
        </span>
      </div>

      {/* Grid of photos */}
      <div className="my-auto grid grid-cols-1 gap-2.5 w-full py-1">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => onPhotoClick?.(photo)}
            className="group cursor-pointer bg-[#fdfaf5] p-2 rounded-xs shadow-sm hover:shadow-md transition-all duration-300 border border-[#d6cbba] flex gap-3 items-center"
          >
            <div className="aspect-square w-2/5 overflow-hidden rounded-xs bg-zinc-900">
              <img
                src={photo.url}
                alt={photo.caption || 'Ritual'}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
            </div>
            <div className="w-3/5 pr-2">
              <span className="font-sans-clean text-[7px] sm:text-[8px] uppercase tracking-widest text-[#998972]">
                ARCHIVAL DETAIL 0{isLeft ? idx + 1 : idx + 3}
              </span>
              <p className="font-editorial italic text-xs sm:text-sm text-[#383127] mt-0.5">
                {photo.caption || 'Sacred blessing'}
              </p>
              <p className="font-sans-clean text-[7px] sm:text-[8px] tracking-wider text-[#998972] mt-1 font-mono">
                F/2.8 • 1/200S • 50MM
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Archival Proof Footer */}
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#8a7c68] pt-2 border-t border-[#ded5c2]/80">
        {isLeft ? (
          <>
            <span>12.19.2024 · THE MANDAP CANOPY</span>
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
