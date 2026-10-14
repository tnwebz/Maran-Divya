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
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';
import albumData from '@/project/album-project.json';
import { AlbumProject } from '@/lib/album-project';
import { albumAudio } from '@/utils/audio';

const AUDIO_PATH = '/album-assets/audio/vizhi_moodi_whistle.mp3';

// Dynamically import ProjectRenderer without SSR for page-flip compatibility
const ProjectRenderer = dynamic(
  () => import('@/components/album/runtime').then((mod) => mod.ProjectRenderer),
  {
    ssr: false,
    loading: () => null,
  }
);

/**
 * Extracts all unique image URLs used throughout the album project
 * to pre-load them ahead of rendering.
 */
function extractAllImageUrls(obj: any, urls = new Set<string>()): string[] {
  if (!obj) return Array.from(urls);
  if (typeof obj === 'string') {
    const clean = obj.trim();
    if (
      clean.startsWith('/') ||
      clean.startsWith('http://') ||
      clean.startsWith('https://')
    ) {
      if (/\.(jpg|jpeg|png|webp|svg|gif)($|\?)/i.test(clean)) {
        urls.add(clean);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item) => extractAllImageUrls(item, urls));
  } else if (typeof obj === 'object') {
    Object.values(obj).forEach((val) => extractAllImageUrls(val, urls));
  }
  return Array.from(urls);
}

export default function ClientAlbumPage() {
  const project = albumData as unknown as AlbumProject;
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isMobilePortrait, setIsMobilePortrait] = useState(false);
  const [dismissRotate, setDismissRotate] = useState(false);

  // Preloading state: only when complete can the user view the album
  const [isPreloading, setIsPreloading] = useState(true);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const bookRef = useRef<{
    flipNext: () => void;
    flipPrev: () => void;
    turnToSpread: (spreadIdx: number) => void;
    turnToCover: () => void;
  } | null>(null);

  const totalLeaves = (project.pages?.length || 0) + 2; // Covers + leaves

  // 1. Comprehensive Asset Preloader
  useEffect(() => {
    let isCancelled = false;

    async function preloadAssets() {
      try {
        const imageUrls = extractAllImageUrls(project);
        const total = imageUrls.length;

        if (total === 0) {
          setIsPreloading(false);
          return;
        }

        let loadedCount = 0;
        const updateProgress = () => {
          if (isCancelled) return;
          loadedCount++;
          const pct = Math.min(100, Math.round((loadedCount / total) * 100));
          setPreloadProgress(pct);
        };

        const loadPromises = imageUrls.map((url) => {
          return new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => {
              updateProgress();
              resolve();
            };
            img.onerror = () => {
              // Gracefully handle any missing or 404 asset
              updateProgress();
              resolve();
            };
            img.src = url;
          });
        });

        // Ensure user is never stuck; max wait 8 seconds
        await Promise.race([
          Promise.all(loadPromises),
          new Promise((resolve) => setTimeout(resolve, 8000)),
        ]);

        if (!isCancelled) {
          setPreloadProgress(100);
          // Brief pause for luxury transition
          setTimeout(() => {
            setIsPreloading(false);
          }, 350);
        }
      } catch (err) {
        console.warn('Preload caught:', err);
        if (!isCancelled) {
          setIsPreloading(false);
        }
      }
    }

    preloadAssets();

    return () => {
      isCancelled = true;
    };
  }, [project]);

  // 2. Background Audio Management (Looping Vizhi Moodi Whistle)
  useEffect(() => {
    albumAudio.initBackgroundMusic(AUDIO_PATH);

    const tryAutoStartMusic = () => {
      albumAudio.playMusic().then((playing) => {
        if (playing) {
          setIsMusicPlaying(true);
          cleanupListeners();
        }
      });
    };

    const cleanupListeners = () => {
      window.removeEventListener('click', tryAutoStartMusic);
      window.removeEventListener('touchstart', tryAutoStartMusic);
      window.removeEventListener('keydown', tryAutoStartMusic);
    };

    // Attempt immediately
    tryAutoStartMusic();

    // Browser policy: start on user's first click or touch if blocked initially
    window.addEventListener('click', tryAutoStartMusic, { passive: true });
    window.addEventListener('touchstart', tryAutoStartMusic, { passive: true });
    window.addEventListener('keydown', tryAutoStartMusic, { passive: true });

    return () => {
      cleanupListeners();
    };
  }, []);

  const handleToggleMusic = () => {
    const playing = albumAudio.toggleMusic();
    setIsMusicPlaying(playing);
  };

  // 3. Monitor device orientation & mobile portrait state
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

  // 4. Sync fullscreen state with native browser events
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

      // Start background music seamlessly on user gesture
      albumAudio.playMusic().then((playing) => {
        if (playing) setIsMusicPlaying(true);
      });
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
      {/* 1. Complete Preload Gate Screen — Album only views once completely loaded */}
      {isPreloading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] text-stone-200 select-none">
          <div className="relative flex flex-col items-center max-w-sm w-full px-6 text-center">
            {/* Elegant Monogram / Emblem */}
            <div className="w-16 h-16 rounded-full border border-[#d4af37]/30 flex items-center justify-center mb-6 shadow-[0_0_35px_rgba(212,175,55,0.18)] animate-pulse">
              <Sparkles className="w-7 h-7 text-[#d4af37]" />
            </div>

            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-[#d4af37] mb-2">
              Wedding Album
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif tracking-wider text-white mb-2">
              {project.client?.coupleNames || project.name}
            </h1>
            <p className="text-xs text-stone-400 font-light mb-8 max-w-xs leading-relaxed">
              Curating high-resolution photographs & spreads. Please wait a moment...
            </p>

            {/* Luxury Progress Bar */}
            <div className="w-full bg-stone-900 border border-white/10 rounded-full h-2 overflow-hidden mb-3 relative">
              <div
                className="h-full bg-gradient-to-r from-[#8a6d2b] via-[#d4af37] to-[#f9e79f] transition-all duration-300 ease-out rounded-full shadow-[0_0_12px_rgba(212,175,55,0.6)]"
                style={{ width: `${preloadProgress}%` }}
              />
            </div>

            {/* Percentage & Status indicator */}
            <div className="flex items-center justify-between w-full text-[11px] font-mono text-stone-400">
              <span>{preloadProgress < 100 ? 'Loading memories...' : 'Ready'}</span>
              <span className="text-[#d4af37] font-semibold">{preloadProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Mobile Portrait Orientation Modal — Luxury Editorial Monochrome */}
      {isMobilePortrait && !dismissRotate && !isPreloading && (
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

      {/* 3. Subtle Client Header HUD */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <BookOpen className="w-4 h-4 text-[#d4af37]" />
          <span className="text-xs sm:text-sm font-serif tracking-widest text-[#fcfaf2]">
            {project.client?.coupleNames || project.name}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Looping Background Music Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full border text-xs tracking-wider transition-all duration-300 touch-manipulation ${
              isMusicPlaying
                ? 'bg-[#d4af37]/20 border-[#d4af37]/60 text-[#fcfaf2] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                : 'bg-black/50 border-white/10 text-stone-400 hover:text-white'
            }`}
            title={isMusicPlaying ? 'Mute Background Music' : 'Play Background Music'}
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-4 h-4 text-[#d4af37] animate-pulse" />
                <span className="text-[10px] font-mono text-[#d4af37] hidden sm:inline">MUSIC ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">MUSIC OFF</span>
              </>
            )}
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 text-stone-300 hover:text-white transition-colors touch-manipulation"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* 4. 3D Project Renderer Viewport */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        {!isPreloading && (
          <ProjectRenderer
            project={project}
            bookRef={bookRef}
            onCurrentPageChange={(idx) => setCurrentPage(idx)}
          />
        )}
      </div>

      {/* 5. Floating Bottom Navigation Controls */}
      {!isPreloading && (
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
      )}
    </main>
  );
}
