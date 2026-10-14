'use client';

import React from 'react';
import { AlbumPage } from '@/lib/album-project';
import { AssetResolver } from './AssetResolver';
import { AdaptedBookConfig, RuntimePhotoSlot, RuntimeElement } from './runtimeTypes';
import { RuntimePhotoRenderer } from './RuntimePhotoRenderer';
import { RuntimeTextRenderer } from './RuntimeTextRenderer';
import { RuntimeElementRenderer } from './RuntimeElementRenderer';

interface RuntimePageRendererProps {
  page: AlbumPage;
  pageNumber: number;
  isLeft: boolean;
  isBlank?: boolean;
  bookConfig: AdaptedBookConfig;
  assetResolver: AssetResolver;
  onPhotoClick?: (assetId: string) => void;
}

export const RuntimePageRenderer: React.FC<RuntimePageRendererProps> = ({
  page,
  pageNumber,
  isLeft,
  isBlank = false,
  bookConfig,
  assetResolver,
  onPhotoClick,
}) => {
  // If blank balancing page, render pure archival paper sheet
  if (isBlank) {
    return (
      <div
        className="relative w-full h-full overflow-hidden select-none paper-sheet"
        style={{ backgroundColor: bookConfig.paperColor }}
      >
        {/* Subtle inner spine gutter gradient */}
        <div
          className={`absolute top-0 bottom-0 pointer-events-none z-10 w-8 sm:w-12 ${
            isLeft
              ? 'right-0 bg-gradient-to-l from-black/15 via-black/5 to-transparent'
              : 'left-0 bg-gradient-to-r from-black/15 via-black/5 to-transparent'
          }`}
        />
      </div>
    );
  }

  // Resolve background & foreground overlay
  const bgType = page.background?.type || 'solid';
  const bgColor = page.background?.color || bookConfig.paperColor;
  const bgAsset = page.background?.assetId
    ? assetResolver.resolveAsset(page.background.assetId)
    : null;
  const bgUrl = bgAsset?.url || (page.background?.metadata?.src as string) || (page.background as any)?.src || '';
  const overlayUrl = (page.background?.metadata?.overlaySrc as string) || '';

  // Resolve slots & elements
  const photoSlots: RuntimePhotoSlot[] = (page.photoSlots || []).map((slot) => ({
    ...slot,
    resolvedAsset: assetResolver.resolveAsset(slot.assetId),
  }));

  const elements: RuntimeElement[] = (page.elements || []).map((el) => ({
    ...el,
    resolvedAsset: assetResolver.resolveAsset(el.assetId),
  }));

  const textElements = page.textElements || [];
  const folioLabel = (page.metadata?.folioLabel as string) || `Folio ${String(pageNumber).padStart(2, '0')}`;

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none paper-sheet"
      style={{
        containerType: 'inline-size',
        backgroundColor: bgColor,
      }}
      data-page-index={page.pageIndex}
    >
      {/* 1. Base Paper Print Grain Texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(rgba(0,0,0,0.12) 0.5px, transparent 0.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* 2. Template Background Artwork (Canva / Custom) */}
      {bgType === 'image' && bgUrl && (
        <img
          src={bgUrl}
          alt="Page background artwork"
          className={`absolute inset-0 w-full h-full pointer-events-none ${
            page.background?.fit === 'contain' ? 'object-contain' : 'object-cover'
          }`}
          style={{ opacity: page.background?.opacity ?? 1 }}
          loading="lazy"
        />
      )}

      {/* 3. Physical Spine Fold Gutter Shadow */}
      <div
        className={`absolute top-0 bottom-0 pointer-events-none z-20 w-8 sm:w-12 ${
          isLeft
            ? 'right-0 bg-gradient-to-l from-black/20 via-black/5 to-transparent'
            : 'left-0 bg-gradient-to-r from-black/20 via-black/5 to-transparent'
        }`}
      />

      {/* 4. Photo Openings */}
      {photoSlots.map((slot) => (
        <RuntimePhotoRenderer
          key={slot.id}
          slot={slot}
          onPhotoClick={onPhotoClick}
        />
      ))}

      {/* 4.5. Foreground Frame Cutout Overlay (keeps polaroid cards & borders on top of slotted photos) */}
      {overlayUrl && (
        <img
          src={overlayUrl}
          alt="Frame overlay artwork"
          className="absolute inset-0 w-full h-full pointer-events-none object-cover z-10"
          style={{ opacity: page.background?.opacity ?? 1 }}
          loading="lazy"
        />
      )}

      {/* 5. Decorative Graphic Layers */}
      {elements.map((el) => (
        <RuntimeElementRenderer key={el.id} element={el} />
      ))}

      {/* 6. Typography Elements */}
      {textElements.map((txt) => (
        <RuntimeTextRenderer key={txt.id} element={txt} />
      ))}

      {/* 7. Luxury Archival Folio Number */}
      <div
        className={`absolute bottom-2.5 z-20 text-[8px] sm:text-[9px] font-mono tracking-widest uppercase pointer-events-none text-stone-400/80 ${
          isLeft ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
        }`}
      >
        <span>{folioLabel}</span>
      </div>
    </div>
  );
};
