'use client';

import React from 'react';
import { Camera, ImageOff } from 'lucide-react';
import { RuntimePhotoSlot } from './runtimeTypes';

interface RuntimePhotoRendererProps {
  slot: RuntimePhotoSlot;
  onPhotoClick?: (assetId: string) => void;
}

export const RuntimePhotoRenderer: React.FC<RuntimePhotoRendererProps> = ({
  slot,
  onPhotoClick,
}) => {
  const asset = slot.resolvedAsset;
  const isMissing = asset?.isMissing || (!asset && !!slot.assetId);
  const isEmpty = !slot.assetId;

  // Resolve shape clipping style
  let borderRadiusStyle = '0px';
  if (slot.shape === 'circle') {
    borderRadiusStyle = '50%';
  } else if (slot.shape === 'roundedRect') {
    borderRadiusStyle = `${slot.borderRadius || 12}px`;
  } else if (slot.shape === 'ellipse') {
    borderRadiusStyle = '50% / 35%';
  }

  // Exact crop mathematical reproduction:
  // Using transform scale with matching transform-origin ensures 1:1 parity with Konva editor canvas
  const zoomScale = slot.zoom || 1;
  const objectPosition = slot.objectPosition || '50% 50%';
  const objectFit = slot.objectFit || 'cover';

  return (
    <div
      className="absolute overflow-hidden group select-none cursor-pointer"
      style={{
        left: `${slot.x}%`,
        top: `${slot.y}%`,
        width: `${slot.width}%`,
        height: `${slot.height}%`,
        transform: slot.rotation ? `rotate(${slot.rotation}deg)` : undefined,
        borderRadius: borderRadiusStyle,
        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      }}
      onClick={() => {
        if (slot.assetId && onPhotoClick) {
          onPhotoClick(slot.assetId);
        }
      }}
      data-slot-id={slot.id}
      data-asset-id={slot.assetId}
    >
      {asset && !isMissing ? (
        <img
          src={asset.url}
          alt={asset.name || 'Album photo'}
          className="w-full h-full pointer-events-none transition-transform duration-300"
          style={{
            objectFit,
            objectPosition,
            transform: zoomScale > 1 ? `scale(${zoomScale})` : undefined,
            transformOrigin: objectPosition,
          }}
          loading="lazy"
          draggable={false}
        />
      ) : isMissing ? (
        <div className="w-full h-full bg-[#201815] border border-amber-500/40 flex flex-col items-center justify-center p-2 text-center text-amber-200">
          <ImageOff className="w-5 h-5 text-amber-400 mb-1" />
          <span className="text-[9px] font-mono leading-tight">Missing Asset</span>
          <span className="text-[8px] font-mono text-stone-400 truncate max-w-full">
            {slot.assetId}
          </span>
        </div>
      ) : (
        <div className="w-full h-full bg-[#f4ede2]/60 border border-stone-300/60 border-dashed flex flex-col items-center justify-center p-2 text-stone-400">
          <Camera className="w-5 h-5 mb-1 opacity-60" />
          <span className="text-[9px] font-sans-clean uppercase tracking-wider opacity-70">
            Photo Aperture
          </span>
        </div>
      )}
    </div>
  );
};
