'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';

interface SpreadProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  onPhotoClick?: (photo: PhotoItem) => void;
  pageNumber: number;
}

export const PortraitSpread: React.FC<SpreadProps> = ({
  spread,
  isLeft,
  onPhotoClick,
  pageNumber,
}) => {
  const leftPhoto = spread.leftPhotos?.[0];
  const rightPhotos = spread.rightPhotos || [];

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
            : 'CHAPTER IV: PALACE ATELIER PORTRAITS'}
        </span>
        <span className="text-[#d4af37]/80">
          {isLeft ? `FOLIO ${String(pageNumber).padStart(2, '0')}` : `FOLIO ${String(pageNumber).padStart(2, '0')} of 24`}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="my-auto flex flex-col items-center justify-center w-full py-1">
        {isLeft && leftPhoto && (
          <div
            onClick={() => onPhotoClick?.(leftPhoto)}
            className="group cursor-pointer w-[90%] bg-[#fdfaf5] p-2.5 rounded-xs shadow-md hover:shadow-xl transition-all duration-300 border border-[#d6cbba]"
          >
            <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-zinc-900 rounded-xs">
              <img
                src={leftPhoto.url}
                alt={leftPhoto.caption || 'Portrait'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="eager"
              />
            </div>
            {leftPhoto.caption && (
              <div className="mt-2 text-center">
                <p className="font-editorial italic text-xs text-[#473f34]">{leftPhoto.caption}</p>
                <p className="font-sans-clean text-[8px] uppercase tracking-widest text-[#9e907d] mt-0.5">
                  F/1.4 • 1/500S • 85MM FINE ART PRIME
                </p>
              </div>
            )}
          </div>
        )}

        {!isLeft && (
          <div className="w-full flex flex-col gap-2.5 items-center">
            {rightPhotos.length > 1 ? (
              <div className="grid grid-cols-1 gap-2.5 w-[92%]">
                {rightPhotos.slice(0, 2).map((p, idx) => (
                  <div
                    key={p.id || idx}
                    onClick={() => onPhotoClick?.(p)}
                    className="group cursor-pointer bg-[#fdfaf5] p-2 rounded-xs shadow-sm hover:shadow-md transition-all duration-300 border border-[#d6cbba] flex gap-3 items-center"
                  >
                    <div className="w-1/2 aspect-[4/3] overflow-hidden rounded-xs bg-zinc-900">
                      <img
                        src={p.url}
                        alt={p.caption || 'Detail'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="eager"
                      />
                    </div>
                    <div className="w-1/2 pr-2">
                      <p className="font-editorial italic text-xs text-[#3d362c]">{p.caption}</p>
                      <p className="font-sans-clean text-[8px] uppercase tracking-widest text-[#948775] mt-1">
                        ALPHA ARCHIVE PROOF
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : rightPhotos[0] ? (
              <div
                onClick={() => onPhotoClick?.(rightPhotos[0])}
                className="group cursor-pointer w-[90%] bg-[#fdfaf5] p-2.5 rounded-xs shadow-md hover:shadow-xl transition-all duration-300 border border-[#d6cbba]"
              >
                <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full overflow-hidden bg-zinc-900 rounded-xs">
                  <img
                    src={rightPhotos[0].url}
                    alt={rightPhotos[0].caption || 'Portrait'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                </div>
                {rightPhotos[0].caption && (
                  <div className="mt-2 text-center">
                    <p className="font-editorial italic text-xs text-[#473f34]">
                      {rightPhotos[0].caption}
                    </p>
                    <p className="font-sans-clean text-[8px] uppercase tracking-widest text-[#9e907d] mt-0.5">
                      F/1.8 • 1/320S • 50MM
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Archival Proof Footer */}
      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#8a7c68] pt-2 border-t border-[#ded5c2]/80">
        {isLeft ? (
          <>
            <span>12.19.2024 · THE ROYAL SUITE</span>
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
