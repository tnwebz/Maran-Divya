'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';

interface SpreadProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  onPhotoClick?: (photo: PhotoItem) => void;
  pageNumber: number;
}

export const HeroSpread: React.FC<SpreadProps> = ({
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
      {/* Archival Folio Header Bar */}
      <div className="flex justify-between items-center text-[#d4af37] text-[8px] sm:text-[9px] font-sans-clean tracking-[0.22em] uppercase pb-2 border-b border-[#d4af37]/40">
        <span>
          {isLeft
            ? 'ALPHA STORIES ARCHIVAL SPREAD - UDAIPUR'
            : 'CHAPTER I: THE ROYAL PROCESSION'}
        </span>
        <span className="text-[#d4af37]/80">
          {isLeft
            ? `FOLIO ${String(pageNumber).padStart(2, '0')}`
            : `FOLIO ${String(pageNumber).padStart(2, '0')} of 24`}
        </span>
      </div>

      {/* Main Page Body */}
      <div className="my-auto flex flex-col items-center justify-between space-y-3 py-1">
        {photo && (
          <div
            onClick={() => onPhotoClick?.(photo)}
            className="group cursor-pointer bg-[#fbf8f2] p-2.5 shadow-[0_2px_8px_rgba(40,30,15,0.12)] hover:shadow-xl transition-all duration-300 border border-[#e8dfd0] w-[94%]"
          >
            <div className="aspect-[4/3] sm:aspect-[16/10] w-full overflow-hidden bg-[#1a1512] relative border border-[#d4af37]/25">
              <img
                src={photo.url}
                alt={photo.caption || 'Royal Wedding'}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
            </div>

            {/* Photo Metadata Caption Bar */}
            <div className="flex justify-between items-center mt-2 px-1 text-[8px] sm:text-[9px] text-[#d4af37] font-sans-clean uppercase tracking-wider">
              <span>{photo.caption || 'THE ROYAL CEREMONY'}</span>
              <span className="text-[#d4af37]/75">F/2.0 · 1/250S · 50MM</span>
            </div>
          </div>
        )}

        {/* Editorial Headline & Story Section */}
        <div className="text-center px-4 space-y-1 pt-1 max-w-md">
          {isLeft ? (
            <>
              <div className="flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-sans-clean">
                <span className="w-3 h-[1px] bg-[#d4af37]" />
                <span>VOLUME I : THE SACRED UNION</span>
                <span className="w-3 h-[1px] bg-[#d4af37]" />
              </div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl text-[#1e1a16] tracking-wide font-normal">
                {spread.title || 'Rahul & Priya'}
              </h2>
              <p className="font-editorial italic text-xs sm:text-sm text-[#d4af37]/90 leading-relaxed">
                &ldquo;{spread.quote || 'In all the world, there is no heart for me like yours.'}&rdquo;
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-sans-clean">
                <span className="w-3 h-[1px] bg-[#d4af37]" />
                <span>PALACE OF UDAIPUR</span>
                <span className="w-3 h-[1px] bg-[#d4af37]" />
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1e1a16] tracking-wide font-normal">
                {spread.subtitle || 'Two Souls, One Timeless Destiny'}
              </h3>
              <p className="font-editorial italic text-xs sm:text-sm text-[#d4af37]/90 leading-relaxed">
                &ldquo;Where royal heritage meets an eternal promise whispered by the waters of Lake Pichola.&rdquo;
              </p>
            </>
          )}
        </div>
      </div>

      {/* Archival Proof Footer */}
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#d4af37]/85 pt-2 border-t border-[#d4af37]/35">
        {isLeft ? (
          <>
            <span>12.19.2024 · THE LEELA PALACE</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
              ARCHIVAL PROOF
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1">
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
