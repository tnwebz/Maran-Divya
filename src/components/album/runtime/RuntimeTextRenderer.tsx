'use client';

import React from 'react';
import { TextElement } from '@/lib/album-project';

interface RuntimeTextRendererProps {
  element: TextElement;
}

/**
 * Resolves font family with high-end editorial fallbacks
 */
function resolveFontFamily(family?: string): string {
  if (!family) return 'var(--font-playfair), "Playfair Display", Georgia, serif';
  switch (family.toLowerCase()) {
    case 'cinzel':
      return 'var(--font-cinzel), "Cinzel", "Times New Roman", serif';
    case 'cormorant garamond':
    case 'cormorant':
      return '"Cormorant Garamond", Garamond, Georgia, serif';
    case 'inter':
    case 'sans-serif':
    case 'modern':
      return 'var(--font-inter), "Inter", -apple-system, sans-serif';
    case 'great vibes':
    case 'script':
      return '"Great Vibes", "Brush Script MT", cursive';
    case 'playfair display':
    case 'playfair':
    case 'serif':
    default:
      return 'var(--font-playfair), "Playfair Display", Georgia, serif';
  }
}

export const RuntimeTextRenderer: React.FC<RuntimeTextRendererProps> = ({ element }) => {
  // Hide untransformed default placeholder text
  if (
    element.text === 'Subheading Text' &&
    element.metadata?.manualOverride === false
  ) {
    return null;
  }

  const isGoldFoil =
    element.color?.toLowerCase() === '#d4af37' ||
    element.color?.toLowerCase() === '#e6ca65' ||
    element.color?.toLowerCase() === '#f8d525' ||
    element.color?.toLowerCase() === '#e1cc41' ||
    element.color?.toLowerCase() === '#e6c628' ||
    element.role === 'monogram' ||
    element.role === 'coverTitle';

  const fontFamily = resolveFontFamily(element.fontFamily);

  // Studio reference canvas width is 750px.
  // Using container query width (cqw), text scales 1:1 with the album leaf
  // so text never collapses, wraps awkwardly, or overflows on mobile devices.
  const baseFontSize = element.fontSize || 18;
  const scaledFontSize = `clamp(8.5px, ${(baseFontSize / 7.5).toFixed(3)}cqw, ${baseFontSize}px)`;

  const hasMultipleLines = element.text.includes('\n');

  return (
    <div
      className="absolute overflow-visible select-none flex items-center justify-center pointer-events-none"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        justifyContent:
          element.align === 'left'
            ? 'flex-start'
            : element.align === 'right'
            ? 'flex-end'
            : 'center',
        zIndex: element.zIndex || 5,
        opacity: element.metadata?.opacity !== undefined ? Number(element.metadata.opacity) : 1,
      }}
      data-text-id={element.id}
      data-text-role={element.role}
    >
      <div
        className={`${isGoldFoil ? 'gold-foil-text' : ''}`}
        style={{
          fontFamily,
          fontSize: scaledFontSize,
          fontWeight: element.fontWeight || 500,
          color: element.color || '#1a1816',
          textAlign: element.align || 'center',
          lineHeight: element.lineHeight || 1.3,
          letterSpacing:
            typeof element.letterSpacing === 'number'
              ? `clamp(0.2px, ${(element.letterSpacing / 7.5).toFixed(2)}cqw, ${element.letterSpacing}px)`
              : element.letterSpacing || '0.05em',
          textShadow: isGoldFoil ? '0 1px 2px rgba(0,0,0,0.35)' : undefined,
          whiteSpace: hasMultipleLines ? 'pre-wrap' : 'nowrap',
          wordBreak: 'normal',
          flexShrink: 0,
        }}
      >
        {element.text}
      </div>
    </div>
  );
};
