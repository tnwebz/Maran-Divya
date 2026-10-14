import React from 'react';
import {
  AlbumProject,
  AlbumPage,
  AlbumCover,
  PhotoSlot,
  TextElement,
  AlbumElement,
  PageBackground,
  BookStyle,
  BookPaper,
  BookConfig,
  ClientMetadata,
} from '@/lib/album-project';

/**
 * Resolved asset with validated URI and dimensions
 */
export interface RuntimeAsset {
  id: string;
  url: string;
  name: string;
  type: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  mimeType?: string;
  isMissing?: boolean;
}

/**
 * Resolved photo opening ready for runtime rendering
 */
export interface RuntimePhotoSlot extends PhotoSlot {
  resolvedAsset?: RuntimeAsset | null;
}

/**
 * Resolved decorative graphic element ready for runtime rendering
 */
export interface RuntimeElement extends AlbumElement {
  resolvedAsset?: RuntimeAsset | null;
}

/**
 * Visual leaf item prepared for AlbumBook page-flip sequence
 */
export interface RuntimePageItem {
  id: string;
  pageIndex: number;
  isLeft: boolean;
  isBlank?: boolean;
  background: PageBackground;
  photoSlots: RuntimePhotoSlot[];
  textElements: TextElement[];
  elements: RuntimeElement[];
  metadata?: Record<string, unknown>;
}

/**
 * Physical Book appearance mapped from BookConfig
 */
export interface AdaptedBookConfig {
  style: BookStyle;
  color: string;
  colorGradient: string;
  paperColor: string;
  paperTheme: BookPaper;
  spineColor: string;
  spineStyle: string;
  spineText?: string;
  spineWidth: number;
  pageThicknessPx: number;
  shadowIntensity: number;
  shadowBlurPx: number;
  shadowLevel: 'soft' | 'medium' | 'strong';
  soundType: 'off' | 'soft-paper' | 'premium-album';
  soundEnabled: boolean;
  environmentTheme: 'studio-dark' | 'warm-neutral' | 'light-minimal' | 'luxury-dark' | string;
  environmentBg: string;
  environmentGlow: string;
}

/**
 * Comprehensive diagnostic report before preview rendering
 */
export interface RuntimeValidationReport {
  valid: boolean;
  projectName: string;
  projectId: string;
  totalPages: number;
  hasOddPageBalancing: boolean;
  totalAssets: number;
  missingAssets: string[];
  missingReferences: {
    location: string;
    assetId: string;
  }[];
  validationErrors: string[];
}
