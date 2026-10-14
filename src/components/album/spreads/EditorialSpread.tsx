'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';

interface SpreadProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  onPhotoClick?: (photo: PhotoItem) => void;
  pageNumber: number;
}

export const EditorialSpread: React.FC<SpreadProps> = ({
  spread,
  isLeft,
  onPhotoClick,
  pageNumber,
}) => {
  const leftPhotos = spread.leftPhotos || [];
  const rightPhotos = spread.rightPhotos || [];

  const mainLeft = leftPhotos[0];
  const heroRight = rightPhotos[0];
  const detail1 = rightPhotos[1] || leftPhotos[1];
  const detail2 = rightPhotos[2] || leftPhotos[0];

  return (
    <div
      className={`relative w-full h-full p-6 sm:p-8 flex flex-col justify-between select-none ${
        isLeft ? 'spine-gutter-left' : 'spine-gutter-right'
      }`}
    >
      {/* Top Header Bar */}
      <div className="flex justify-between items-center text-[#d4af37] text-[8px] sm:text-[9px] font-sans-clean tracking-[0.22em] uppercase pb-2 border-b border-[#d4af37]/40">
        <span>
          {isLeft
            ? 'ALPHA STORIES ARCHIVAL SPREAD - UDAIPUR'
            : 'CHAPTER III: THE ROYAL SANGEET'}
        </span>
        <span className="text-[#d4af37]/80">
          {isLeft
            ? `FOLIO ${String(pageNumber).padStart(2, '0')}`
            : `FOLIO ${String(pageNumber).padStart(2, '0')} of 24`}
        </span>
      </div>

      {/* Main Page Body */}
      {isLeft ? (
        <div className="my-auto flex flex-col justify-between space-y-3 py-1">
          {/* Main Top Photo with Archival Double-Mat Frame */}
          {mainLeft && (
            <div
              onClick={() => onPhotoClick?.(mainLeft)}
              className="group cursor-pointer bg-[#fbf8f2] p-2 shadow-[0_2px_8px_rgba(40,30,15,0.12)] hover:shadow-md transition-all duration-300 border border-[#e8dfd0]"
            >
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#1a1512] relative border border-[#d4af37]/25">
                <img
                  src={mainLeft.url}
                  alt={mainLeft.caption || 'Island Courtyard'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
              </div>

              {/* Photo Metadata Caption Bar */}
              <div className="flex justify-between items-center mt-1.5 px-1 text-[8px] sm:text-[9px] text-[#d4af37] font-sans-clean uppercase tracking-wider">
                <span>{mainLeft.caption || 'THE ILLUMINATED ISLAND COURTYARD'}</span>
                <span className="text-[#d4af37]/75">F/1.8 · 1/120S · 35MM</span>
              </div>
            </div>
          )}

          {/* Editorial Headline & Story Section */}
          <div className="px-1 space-y-1.5 pt-1">
            <div className="flex items-center gap-1.5 text-[8px] sm:text-[9px] uppercase tracking-[0.25em] text-[#d4af37] font-sans-clean">
              <span className="w-3 h-[1px] bg-[#d4af37]" />
              <span>CHAPTER III : THE CELEBRATION</span>
            </div>

            <h2 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl text-[#1e1a16] tracking-wide font-normal">
              {spread.title || 'The Night of a Thousand Stars'}
            </h2>

            <p className="font-editorial italic text-xs sm:text-sm text-[#d4af37]/90 leading-relaxed">
              &ldquo;
              {spread.quote ||
                'Swirling lehengas, the reverberation of the dhol beneath starlit arches, and laughter that carried across the mirrored waters of Lake Pichola.'}
              &rdquo;
            </p>
          </div>
        </div>
      ) : (
        <div className="my-auto flex flex-col justify-between space-y-3 py-1">
          {/* Hero Top Photograph */}
          {heroRight && (
            <div
              onClick={() => onPhotoClick?.(heroRight)}
              className="group cursor-pointer bg-[#fbf8f2] p-2 shadow-[0_2px_8px_rgba(40,30,15,0.12)] hover:shadow-md transition-all duration-300 border border-[#e8dfd0]"
            >
              <div className="aspect-[16/9] sm:aspect-[16/8.5] w-full overflow-hidden bg-[#1a1512] border border-[#d4af37]/25">
                <img
                  src={heroRight.url}
                  alt={heroRight.caption || 'First Dance'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
              </div>
              <p className="font-editorial italic text-center text-xs text-[#d4af37] mt-1.5">
                {heroRight.caption || 'The First Dance under the Chandeliered Pavilion'}
              </p>
            </div>
          )}

          {/* Two Side-by-Side Detailed Archival Photographs */}
          <div className="grid grid-cols-2 gap-2.5">
            {detail1 && (
              <div
                onClick={() => onPhotoClick?.(detail1)}
                className="group cursor-pointer bg-[#fbf8f2] p-1.5 shadow-sm hover:shadow-md transition-all duration-300 border border-[#e8dfd0]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#1a1512] border border-[#d4af37]/20">
                  <img
                    src={detail1.url}
                    alt={detail1.caption || 'Detail 1'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                </div>
                <p className="font-sans-clean text-[7px] sm:text-[8px] uppercase tracking-wider text-center text-[#d4af37] mt-1 truncate">
                  {detail1.caption || 'POLKI BANGLES & HENNA'}
                </p>
              </div>
            )}

            {detail2 && (
              <div
                onClick={() => onPhotoClick?.(detail2)}
                className="group cursor-pointer bg-[#fbf8f2] p-1.5 shadow-sm hover:shadow-md transition-all duration-300 border border-[#e8dfd0]"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#1a1512] border border-[#d4af37]/20">
                  <img
                    src={detail2.url}
                    alt={detail2.caption || 'Detail 2'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                </div>
                <p className="font-sans-clean text-[7px] sm:text-[8px] uppercase tracking-wider text-center text-[#d4af37] mt-1 truncate">
                  {detail2.caption || 'TOAST ACROSS PICHOLA'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Archival Proof Footer */}
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#d4af37]/85 pt-2 border-t border-[#d4af37]/35">
        {isLeft ? (
          <>
            <span>12.19.2024 · THE JAGMANDIR ISLAND PALACE</span>
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
