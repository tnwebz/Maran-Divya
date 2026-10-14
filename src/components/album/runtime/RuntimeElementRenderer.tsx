'use client';

import React from 'react';
import { RuntimeElement } from './runtimeTypes';

interface RuntimeElementRendererProps {
  element: RuntimeElement;
}

export const RuntimeElementRenderer: React.FC<RuntimeElementRendererProps> = ({ element }) => {
  const asset = element.resolvedAsset;
  if (!asset?.url) return null;

  return (
    <div
      className="absolute overflow-hidden pointer-events-none select-none"
      style={{
        left: `${element.x}%`,
        top: `${element.y}%`,
        width: `${element.width}%`,
        height: `${element.height}%`,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
        opacity: element.opacity !== undefined ? element.opacity : 1,
        zIndex: element.zIndex || 2,
      }}
      data-element-id={element.id}
    >
      <img
        src={asset.url}
        alt={asset.name || 'Decorative element'}
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </div>
  );
};
