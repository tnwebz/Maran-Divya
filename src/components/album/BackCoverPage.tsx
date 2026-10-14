'use client';

import React from 'react';
import { AlbumConfig } from '@/types/album';

interface BackCoverPageProps {
  config: AlbumConfig;
}

export const BackCoverPage: React.FC<BackCoverPageProps> = ({ config }) => {
  return (
    <div className="relative w-full h-full overflow-hidden leather-maroon-cover select-none">
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: 'radial-gradient(#d4af37 0.6px, transparent 0.6px)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Spine shadow on right when closed from the back */}
      <div className="absolute top-0 bottom-0 right-0 w-10 sm:w-14 bg-gradient-to-l from-black/55 via-black/20 to-transparent pointer-events-none" />

      <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#d4af37]/45 pointer-events-none">
        <div className="absolute inset-1.5 border border-[#d4af37]/20" />
        <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
        <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-10 md:p-12">
        <div className="w-full flex justify-between items-center text-[#d4af37]/75 text-[8px] sm:text-[10px] font-sans-clean tracking-[0.28em] uppercase">
          <span>{config.studio.name}</span>
          <span>Fine Art Edition</span>
        </div>

        <div className="flex flex-col items-center text-center space-y-4 sm:space-y-5 my-auto">
          <div className="w-12 h-[1px] bg-[#d4af37]/50" />

          <h2 className="font-serif-luxury text-2xl sm:text-4xl md:text-5xl tracking-[0.18em] gold-foil-text leading-tight">
            MEMORIES
            <br />
            THAT LAST
            <br />
            FOREVER
          </h2>

          <div className="w-12 h-[1px] bg-[#d4af37]/50" />

          <p className="font-editorial italic text-sm sm:text-base text-[#e6ca65]/70 tracking-wider">
            {config.couple.fullName}
          </p>
        </div>

        <div className="w-full flex justify-between items-center text-[#d4af37]/60 text-[7px] sm:text-[9px] font-sans-clean tracking-[0.22em] uppercase">
          <span>End of Memories</span>
          <span>{config.couple.city}</span>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-white/[0.03] to-transparent pointer-events-none" />
    </div>
  );
};
