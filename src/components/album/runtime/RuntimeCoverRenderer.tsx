'use client';

import React from 'react';
import { AlbumCover } from '@/lib/album-project';
import { AssetResolver } from './AssetResolver';
import { AdaptedBookConfig, RuntimePhotoSlot, RuntimeElement } from './runtimeTypes';
import { RuntimePhotoRenderer } from './RuntimePhotoRenderer';
import { RuntimeTextRenderer } from './RuntimeTextRenderer';
import { RuntimeElementRenderer } from './RuntimeElementRenderer';

interface RuntimeCoverRendererProps {
  cover: AlbumCover;
  isFront: boolean;
  bookConfig: AdaptedBookConfig;
  assetResolver: AssetResolver;
  onPhotoClick?: (assetId: string) => void;
}

export const RuntimeCoverRenderer: React.FC<RuntimeCoverRendererProps> = ({
  cover,
  isFront,
  bookConfig,
  assetResolver,
  onPhotoClick,
}) => {
  // Resolve background
  const bgType = cover.background?.type || 'solid';
  const bgColor = cover.background?.color || bookConfig.color;
  const bgAsset = cover.background?.assetId
    ? assetResolver.resolveAsset(cover.background.assetId)
    : null;
  const bgUrl = bgAsset?.url || (cover.background?.metadata?.src as string) || (cover.background as any)?.src || '';

  // Resolve photo slots with asset data
  const photoSlots: RuntimePhotoSlot[] = (cover.photoSlots || []).map((slot) => ({
    ...slot,
    resolvedAsset: assetResolver.resolveAsset(slot.assetId),
  }));

  // Resolve decorative elements with asset data
  const elements: RuntimeElement[] = (cover.elements || []).map((el) => ({
    ...el,
    resolvedAsset: assetResolver.resolveAsset(el.assetId),
  }));

  const textElements = cover.textElements || [];

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{
        backgroundColor: bgColor,
        background:
          bgType === 'solid'
            ? bookConfig.colorGradient
            : undefined,
      }}
      data-cover-type={isFront ? 'front' : 'back'}
    >
      {/* 1. Background Image Artwork (if using image background or template) */}
      {bgType === 'image' && bgUrl && (
        <img
          src={bgUrl}
          alt="Cover background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ opacity: cover.background.opacity ?? 1 }}
        />
      )}

      {/* 2. Micro Leather Grain Texture for tactile realism */}
      {bookConfig.style === 'leather' && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(#d4af37 0.6px, transparent 0.6px)',
            backgroundSize: '14px 14px',
          }}
        />
      )}

      {/* 3. Physical Spine Shadow Edge */}
      {isFront ? (
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-black/60 via-black/25 to-transparent pointer-events-none z-10" />
      ) : (
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-black/60 via-black/25 to-transparent pointer-events-none z-10" />
      )}

      {/* 4. Elegant Outer Gold Border Trim for Hardcover / Luxury styles */}
      {(bookConfig.style === 'hardcover' || bookConfig.style === 'luxury') && (
        <div className="absolute inset-4 sm:inset-6 md:inset-8 border border-[#d4af37]/35 pointer-events-none z-10">
          <div className="absolute inset-1.5 border border-[#d4af37]/15" />
          <div className="absolute -top-0.5 -left-0.5 w-3 h-3 border-t-2 border-l-2 border-[#d4af37]" />
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 border-t-2 border-r-2 border-[#d4af37]" />
          <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 border-b-2 border-l-2 border-[#d4af37]" />
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b-2 border-r-2 border-[#d4af37]" />
        </div>
      )}

      {/* 5. Rendered Photo Openings */}
      {photoSlots.map((slot) => (
        <RuntimePhotoRenderer
          key={slot.id}
          slot={slot}
          onPhotoClick={onPhotoClick}
        />
      ))}

      {/* 6. Rendered Decorative Graphics & Logos */}
      {elements.map((el) => (
        <RuntimeElementRenderer key={el.id} element={el} />
      ))}

      {/* 7. Rendered Dynamic Typography, Titles, and Monograms */}
      {textElements.map((txt) => (
        <RuntimeTextRenderer key={txt.id} element={txt} />
      ))}
    </div>
  );
};
