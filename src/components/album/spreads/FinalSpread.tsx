'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';

interface SpreadProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  onPhotoClick?: (photo: PhotoItem) => void;
  pageNumber: number;
}

export const FinalSpread: React.FC<SpreadProps> = ({
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
            : 'EPILOGUE: ETERNAL BENEDICTION'}
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
                alt={photo.caption || 'Closing Photo'}
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
                  FINAL ARCHIVAL COMMEMORATION
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center text-center space-y-4 max-w-sm px-4">
            <div className="w-12 h-12 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#fdfaf4] shadow-sm">
              <span className="font-script text-2xl text-[#9c7e2f]">R&P</span>
            </div>

            <div>
              <h2 className="font-serif-luxury text-xl sm:text-2xl text-[#1e1c19] tracking-wider">
                {spread.title || 'Forever Begins Now'}
              </h2>
              <p className="font-editorial italic text-xs sm:text-sm text-[#574d3e] mt-1">
                {spread.subtitle || 'With gratitude for sharing our sacred day'}
              </p>
            </div>

            <div className="w-14 h-[1px] bg-[#d4af37]" />

            <div className="space-y-2">
              <p className="font-editorial italic text-sm sm:text-base text-[#3d362c]">
                "{spread.quote || 'And so together, they built a life they loved.'}"
              </p>
              <p className="font-script text-2xl sm:text-3xl text-[#8f7535]">
                Rahul & Priya
              </p>
            </div>

            <div className="pt-2 border-t border-[#e3d8c4] w-full">
              <p className="font-sans-clean text-[8px] sm:text-[9px] uppercase tracking-widest text-[#948775]">
                ALPHA STORIES STUDIO • MASTER HERITAGE EDITION
              </p>
              <p className="font-sans-clean text-[7px] sm:text-[8px] tracking-wider text-[#ad9f8a] mt-0.5">
                Archival Fine Art Print • Udaipur, India
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Archival Proof Footer */}
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#8a7c68] pt-2 border-t border-[#ded5c2]/80">
        {isLeft ? (
          <>
            <span>12.19.2024 · THE FINAL EPILOGUE</span>
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
