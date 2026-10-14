'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Loader2,
  BookOpen,
  AlertCircle,
  RotateCw,
} from 'lucide-react';
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
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [dismissRotate, setDismissRotate] = useState(false);

  const bookRef = useRef<{
    flipNext: () => void;
    flipPrev: () => void;
    turnToSpread: (spreadIdx: number) => void;
    turnToCover: () => void;
  } | null>(null);

  const totalLeaves = (project.pages?.length || 0) + 2; // Covers + leaves

  // Monitor device orientation & mobile portrait state
  const checkOrientation = useCallback(() => {
    if (typeof window === 'undefined') return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isPortrait = h > w;
    const isMobile = w < 768 || ('ontouchstart' in window && w < 1024);
    setIsMobilePortrait(isMobile && isPortrait);
  }, []);

  useEffect(() => {
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, [checkOrientation]);

  // Sync fullscreen state with native browser events
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      const docEl = document.documentElement as any;
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen toggle caught:', err);
    }
  };

  // Automatically request landscape orientation and fullscreen on mobile
  const handleRotateToLandscape = async () => {
    try {
      const docEl = document.documentElement as any;
      if (!document.fullscreenElement) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        }
      }

      // Lock to landscape orientation
      const screenAny = screen as any;
      if (screenAny.orientation && 'lock' in screenAny.orientation) {
        await screenAny.orientation.lock('landscape').catch(() => {});
      } else if (screenAny.lockOrientation) {
        screenAny.lockOrientation('landscape');
      }
    } catch (err) {
      console.warn('Landscape orientation lock caught:', err);
    }

    setDismissRotate(true);
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
    <main className="relative h-screen w-screen flex flex-col bg-[#0d0b09] overflow-hidden select-none">
      {/* 1. Mobile Portrait Orientation Modal — Luxury Editorial Monochrome */}
      {isMobilePortrait && !dismissRotate && (
        <aside
          aria-label="Rotate device prompt"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-6 text-center animate-fade-in"
        >
          <div className="max-w-xs w-full flex flex-col items-center bg-[#111111] border border-white/10 rounded-2xl p-7 shadow-2xl">
            {/* Minimalist monochrome rotating device graphic */}
            <div className="relative w-16 h-16 flex items-center justify-center mb-5">
              <svg
                className="w-11 h-11 text-stone-300 animate-pulse"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
              <svg
                className="absolute -right-1 -top-1 w-6 h-6 text-stone-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </div>

            <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 mb-1.5">
              Panoramic Editorial View
            </span>
            <h2 className="text-base font-serif tracking-wide text-white mb-2">
              Please Rotate Your Screen
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed font-light mb-6">
              This digital luxury album is crafted as an open physical two-page spread. For the intended
              reading experience, view in horizontal landscape.
            </p>

            {/* High-contrast black-and-white action button */}
            <button
              onClick={handleRotateToLandscape}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-stone-200 active:scale-[0.98] font-semibold text-xs tracking-wider uppercase rounded-full shadow-2xl transition-all"
            >
              <RotateCw className="w-3.5 h-3.5 text-black" />
              <span>Rotate to Horizontal Screen</span>
            </button>

            {/* Discreet fallback for locked orientation */}
            <button
              onClick={() => setDismissRotate(true)}
              className="mt-4 text-[11px] text-stone-400 hover:text-white transition-colors underline underline-offset-4 tracking-wide font-light"
            >
              Continue in portrait view
            </button>
          </div>
        </aside>
      )}

      {/* 2. Subtle Client Header HUD */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs sm:text-sm font-serif tracking-widest text-[#fcfaf2]">
            {project.client?.coupleNames || project.name}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-stone-300 hover:text-white transition-colors touch-manipulation"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 3. 3D Project Renderer Viewport */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <ProjectRenderer
          project={project}
          bookRef={bookRef}
          onCurrentPageChange={(idx) => setCurrentPage(idx)}
        />
      </div>

      {/* 4. Floating Bottom Navigation Controls */}
      <nav className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full shadow-2xl">
        <button
          onClick={() => bookRef.current?.flipPrev()}
          className="p-2 sm:p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white active:scale-95 transition-all touch-manipulation"
          title="Previous Page"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-[11px] sm:text-xs font-mono text-stone-300 min-w-20 sm:min-w-24 text-center select-none">
          {currentPage === 0
            ? 'Cover'
            : currentPage >= totalLeaves - 1
            ? 'Back Cover'
            : `Page ${currentPage} / ${project.pages?.length || 0}`}
        </span>

        <button
          onClick={() => bookRef.current?.flipNext()}
          className="p-2 sm:p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white active:scale-95 transition-all touch-manipulation"
          title="Next Page"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </nav>
    </main>
  );
}
