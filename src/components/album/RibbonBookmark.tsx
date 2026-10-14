'use client';

import React from 'react';

interface RibbonBookmarkProps {
  text?: string;
  className?: string;
  compact?: boolean;
}

export const RibbonBookmark: React.FC<RibbonBookmarkProps> = ({
  text = 'HEIRLOOM',
  className = '',
  compact = false,
}) => {
  if (compact) {
    // Compact spine bookmark tab (As seen in Image 3) - peeking from top central spine
    return (
      <div
        className={`relative z-30 select-none pointer-events-none ${className}`}
        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.75))' }}
      >
        <div className="relative w-5 sm:w-6 bg-gradient-to-b from-[#6b0f1d] via-[#851627] to-[#4a0812] px-0.5 pt-1.5 pb-2.5 border-l border-r border-[#962134]/60 rounded-t-xs">
          {/* Subtle gold stitch edge */}
          <div className="absolute top-0 bottom-2 left-[1.5px] w-[0.5px] border-l border-dashed border-[#d4af37]/40" />
          <div className="absolute top-0 bottom-2 right-[1.5px] w-[0.5px] border-r border-dashed border-[#d4af37]/40" />

          {/* Gold Debossed Monogram / Short Text */}
          <div className="flex flex-col items-center justify-center space-y-0.5 py-0.5">
            <span className="font-serif-luxury text-[7px] font-bold text-[#e6c987] tracking-widest leading-none">
              H
            </span>
          </div>

          {/* Pennant / Inverted V-cut chevron at the bottom */}
          <div
            className="absolute -bottom-2 left-0 right-0 h-2"
            style={{
              backgroundColor: '#4a0812',
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
            }}
          />
        </div>
      </div>
    );
  }

  // Full hanging ribbon for cover
  return (
    <div
      className={`relative z-30 select-none pointer-events-none ${className}`}
      style={{ filter: 'drop-shadow(2px 5px 8px rgba(0,0,0,0.65))' }}
    >
      <div className="relative w-6 sm:w-7 bg-gradient-to-b from-[#6b0f1d] via-[#851627] to-[#540b16] px-1 pt-3 pb-4 border-l border-r border-[#962134]/60">
        <div className="absolute top-0 bottom-3 left-[2px] w-[0.5px] border-l border-dashed border-[#d4af37]/40" />
        <div className="absolute top-0 bottom-3 right-[2px] w-[0.5px] border-r border-dashed border-[#d4af37]/40" />

        <div className="flex flex-col items-center justify-center space-y-1 py-1">
          {text.split('').map((char, i) => (
            <span
              key={i}
              className="font-serif-luxury text-[8px] sm:text-[9px] font-bold text-[#e6c987] tracking-widest leading-none"
              style={{
                textShadow: '0 1px 1px rgba(0,0,0,0.8), 0 0 2px rgba(212,175,55,0.4)',
              }}
            >
              {char}
            </span>
          ))}
        </div>

        <div
          className="absolute -bottom-2.5 left-0 right-0 h-3"
          style={{
            backgroundColor: '#540b16',
            clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
          }}
        />
      </div>
    </div>
  );
};
