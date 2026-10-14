'use client';

import React from 'react';
import { BaseSpreadConfig, PhotoItem } from '@/types/album';
import { HeroSpread } from './spreads/HeroSpread';
import { PortraitSpread } from './spreads/PortraitSpread';
import { EditorialSpread } from './spreads/EditorialSpread';
import { PanoramaSpread } from './spreads/PanoramaSpread';
import { MinimalSpread } from './spreads/MinimalSpread';
import { CollageSpread } from './spreads/CollageSpread';
import { SectionSpread } from './spreads/SectionSpread';
import { FinalSpread } from './spreads/FinalSpread';

interface AlbumPageRendererProps {
  spread: BaseSpreadConfig;
  isLeft: boolean;
  pageNumber: number;
  onPhotoClick?: (photo: PhotoItem) => void;
}

export const AlbumPageRenderer: React.FC<AlbumPageRendererProps> = ({
  spread,
  isLeft,
  pageNumber,
  onPhotoClick,
}) => {
  switch (spread.type) {
    case 'hero':
      return (
        <HeroSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    case 'portrait':
      return (
        <PortraitSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    case 'editorial':
      return (
        <EditorialSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    case 'panorama':
      return (
        <PanoramaSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    case 'minimal':
      return (
        <MinimalSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    case 'collage':
      return (
        <CollageSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    case 'section':
      return (
        <SectionSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    case 'final':
      return (
        <FinalSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
    default:
      return (
        <HeroSpread
          spread={spread}
          isLeft={isLeft}
          pageNumber={pageNumber}
          onPhotoClick={onPhotoClick}
        />
      );
  }
};
