'use client';

import React from 'react';
import { AlbumConfig } from '@/types/album';

interface InnerBackCoverProps {
  config: AlbumConfig;
  isLeft: boolean;
}

/** Soft endpaper pages that appear before the physical back cover closes. */
export const InnerBackCover: React.FC<InnerBackCoverProps> = ({ config, isLeft }) => {
  return (
    <div
      className={`relative w-full h-full p-8 sm:p-10 flex flex-col justify-between select-none paper-sheet ${
        isLeft ? 'spine-gutter-left' : 'spine-gutter-right'
      }`}
    >
      <div className="flex justify-between items-center text-[#d4af37] text-[8px] sm:text-[9px] font-sans-clean tracking-[0.22em] uppercase pb-2 border-b border-[#d4af37]/35">
        <span>{isLeft ? 'ALPHA STORIES · ENDPAPER' : 'ARCHIVAL COLOPHON'}</span>
        <span>{isLeft ? 'INNER BACK' : 'CLOSING LEAF'}</span>
      </div>

      <div className="my-auto flex flex-col items-center text-center space-y-4 px-4">
        {isLeft ? (
          <>
            <div className="w-10 h-[1px] bg-[#d4af37]/60" />
            <p className="font-sans-clean text-[9px] sm:text-[10px] uppercase tracking-[0.35em] text-[#d4af37]">
              With Gratitude
            </p>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-[#1e1a16] tracking-wide">
              End of Memories
            </h2>
            <p className="font-editorial italic text-sm sm:text-base text-[#6b5e4a] leading-relaxed max-w-xs">
              Every page turns, yet the love held within remains — pressed like flowers between
              these leaves, forever.
            </p>
            <div className="w-10 h-[1px] bg-[#d4af37]/60" />
          </>
        ) : (
          <>
            <div className="w-9 h-9 border border-[#d4af37]/50 flex items-center justify-center">
              <span className="font-serif-luxury text-xs text-[#d4af37]">
                {config.couple.partner1[0]}&{config.couple.partner2[0]}
              </span>
            </div>
            <h3 className="font-serif-luxury text-xl sm:text-2xl text-[#1e1a16] tracking-wide">
              {config.couple.fullName}
            </h3>
            <p className="font-editorial italic text-sm text-[#6b5e4a]">
              {config.couple.weddingDate}
              <br />
              {config.couple.venue}
              <br />
              {config.couple.city}
            </p>
            <p className="font-sans-clean text-[8px] sm:text-[9px] uppercase tracking-[0.28em] text-[#d4af37]/80 pt-2">
              Curated by {config.studio.name}
            </p>
          </>
        )}
      </div>

      <div className="flex justify-between items-center text-[8px] sm:text-[9px] font-sans-clean tracking-[0.2em] uppercase text-[#8a7c68] pt-2 border-t border-[#d4af37]/25">
        <span className="flex items-center gap-1.5 text-[#d4af37]/80">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
          Archival Proof
        </span>
        <span>Turn to close</span>
      </div>
    </div>
  );
};
