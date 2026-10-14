'use client';

import React from 'react';
import { AlbumConfig } from '@/types/album';
import { BookOpen } from 'lucide-react';

interface FrontCoverPageProps {
  config: AlbumConfig;
}

export const FrontCoverPage: React.FC<FrontCoverPageProps> = ({ config }) => {
  return (
    <div className="relative w-full h-full overflow-hidden leather-maroon-cover select-none">
      {/* Micro leather grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#d4af37 0.6px, transparent 0.6px)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Spine shadow (left edge of closed cover) */}
      <div className="absolute top-0 bottom-0 left-0 w-10 sm:w-14 bg-gradient-to-r from-black/55 via-black/20 to-transparent pointer-events-none" />

      {/* Gold double-line frame */}
      <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#d4af37]/45 pointer-events-none">
        <div className="absolute inset-1.5 border border-[#d4af37]/20" />
        <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
        <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
        <div className="w-full flex justify-between items-center text-[#d4af37]/85 text-[8px] sm:text-[10px] font-sans-clean tracking-[0.28em] uppercase">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
            Grand Heirloom Edition
          </span>
          <span>Archival Folio</span>
        </div>

        <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4 my-auto">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border border-[#d4af37]/55 flex items-center justify-center bg-[#2a0b10]/70">
            <BookOpen className="w-5 h-5 text-[#d4af37]" />
          </div>

          <span className="font-sans-clean text-[9px] sm:text-[11px] uppercase tracking-[0.38em] text-[#d4af37]/90">
            The Royal Nuptials
          </span>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl tracking-[0.12em] gold-foil-text font-normal px-2">
            {config.couple.fullName.toUpperCase()}
          </h1>

          <p className="font-sans-clean text-[9px] sm:text-[11px] uppercase tracking-[0.32em] text-[#e6ca65]/80 font-light">
            Our Wedding Chronicle
          </p>

          <p className="font-editorial italic text-sm sm:text-base text-[#e6ca65]/75 tracking-wider">
            {config.couple.weddingDate} · {config.couple.city}
          </p>

          <p className="pt-3 font-sans-clean text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#d4af37]/60">
            Turn page to open
          </p>
        </div>

        <div className="w-full flex justify-between items-center text-[#d4af37]/65 text-[7px] sm:text-[9px] font-sans-clean tracking-[0.22em] uppercase">
          <span>Handcrafted Archival Monograph</span>
          <span>{config.couple.venue}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </div>
  );
};
