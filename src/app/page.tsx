'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import albumData from '@/project/album-project.json';
import { AlbumProject } from '@/lib/album-project';

// Dynamically import ProjectRenderer without SSR for page-flip compatibility
const ProjectRenderer = dynamic(
  () => import('@/components/album/runtime').then((mod) => mod.ProjectRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex flex-col items-center justify-center bg-[#0d0b09] text-stone-300">
        <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mb-3" />
        <span className="text-sm font-serif tracking-wider text-[#d4af37]">Maran & Divya</span>
        <span className="text-xs text-stone-500 mt-1">Opening your digital album...</span>
      </div>
    ),
  }
);

export default function ClientAlbumPage() {
  const project = albumData as unknown as AlbumProject;
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const bookRef = useRef<{
    flipNext: () => void;
    flipPrev: () => void;
    turnToSpread: (spreadIdx: number) => void;
    turnToCover: () => void;
  } | null>(null);

  const totalLeaves = (project.pages?.length || 0) + 2; // Covers + leaves

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (hasError) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0d0b09] text-stone-200 p-6 text-center">
        <AlertCircle className="w-12 h-12 text-[#d4af37] mb-3" />
        <h1 className="text-lg font-serif text-white mb-1">This album could not be loaded</h1>
        <p className="text-xs text-stone-400 max-w-sm">
          Please check your connection or contact the album curator.
        </p>
      </div>
    );
  }

  return (
    <main className="relative h-screen w-screen flex flex-col bg-[#0d0b09] overflow-hidden">
      {/* 1. Subtle Client Header HUD */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span className="text-sm font-serif tracking-widest text-[#fcfaf2]">
            {project.client?.coupleNames || project.name}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-stone-300 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 2. 3D Project Renderer Viewport */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <ProjectRenderer
          project={project}
          bookRef={bookRef}
          onCurrentPageChange={(idx) => setCurrentPage(idx)}
        />
      </div>

      {/* 3. Floating Bottom Navigation Controls */}
      <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        <button
          onClick={() => bookRef.current?.flipPrev()}
          className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-xs font-mono text-stone-300 min-w-24 text-center">
          {currentPage === 0
            ? 'Cover'
            : currentPage >= totalLeaves - 1
            ? 'Back Cover'
            : `Page ${currentPage} / ${project.pages?.length || 0}`}
        </span>

        <button
          onClick={() => bookRef.current?.flipNext()}
          className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </main>
  );
}
