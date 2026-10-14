'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip, FlipEvent, StateChangeEvent } from 'page-flip';
import { AlbumConfig, PhotoItem } from '@/types/album';
import { AlbumPageRenderer } from './AlbumPageRenderer';
import { FrontCoverPage } from './FrontCoverPage';
import { BackCoverPage } from './BackCoverPage';
import { InnerBackCover } from './InnerBackCover';
import { RibbonBookmark } from './RibbonBookmark';
import { albumAudio } from '@/utils/audio';

interface AlbumBookProps {
  pages?: React.ReactNode[];
  frontCover?: React.ReactNode;
  innerBackCoverLeft?: React.ReactNode;
  innerBackCoverRight?: React.ReactNode;
  backCover?: React.ReactNode;
  config?: AlbumConfig;
  onCurrentPageChange?: (pageIndex: number) => void;
  onPhotoClick?: (photo: PhotoItem) => void;
  bookRef?: React.MutableRefObject<{
    flipNext: () => void;
    flipPrev: () => void;
    turnToSpread: (spreadIndex: number) => void;
    turnToCover: () => void;
  } | null>;
}

/**
 * Compute page dimensions proportionally to ensure the book fits cleanly within the screen
 * on all devices (mobile landscape, tablets, standard scaled laptops, 1080p, 4K).
 * Leaves ample room for top header, bottom navigation bar, and aesthetic luxury margins.
 */
function computePageSize() {
  if (typeof window === 'undefined') {
    return { pageWidth: 500, pageHeight: 600, coverBorder: 8 };
  }

  const sw = window.innerWidth;
  const sh = window.innerHeight;

  const isMobile = sw < 640 || sh < 480;
  const isTablet = sw < 1024 && !isMobile;

  // Slim hardcover border peeking around pages
  const coverBorder = isMobile ? 4 : isTablet ? 7 : 10;

  // Reserved vertical space for top header (56px) + bottom navigation (60px) + luxury breathing room
  const verticalChrome = isMobile ? 64 : isTablet ? 110 : 136;
  const horizontalPaddingFactor = isMobile ? 0.98 : isTablet ? 0.94 : 0.90;

  // Maximum dimensions available for the entire outer book shell
  const maxShellW = Math.min(Math.floor(sw * horizontalPaddingFactor), 1600);
  const maxShellH = Math.max(200, Math.floor(sh - verticalChrome));

  // Space available for the 2 interior page leaves combined
  const maxAvailableLeavesW = maxShellW - coverBorder * 2;
  const maxAvailableLeafH = maxShellH - coverBorder * 2;

  const maxLeafW = Math.floor(maxAvailableLeavesW / 2);
  const maxLeafH = Math.floor(maxAvailableLeafH);

  // Target aspect ratio of each page leaf (width / height)
  // 0.82 ratio gives a spread ratio of ~1.64:1 (close to 16:10 / 16:9, matching real photo albums)
  const targetRatio = 0.82;

  let pageWidth = maxLeafW;
  let pageHeight = Math.floor(pageWidth / targetRatio);

  if (pageHeight > maxLeafH) {
    pageHeight = maxLeafH;
    pageWidth = Math.floor(pageHeight * targetRatio);
  }

  // Safety floor to guarantee valid rendering
  pageWidth = Math.max(120, pageWidth);
  pageHeight = Math.max(150, pageHeight);

  return { pageWidth, pageHeight, coverBorder };
}

export const AlbumBook: React.FC<AlbumBookProps> = ({
  pages,
  frontCover,
  innerBackCoverLeft,
  innerBackCoverRight,
  backCover,
  config,
  onCurrentPageChange,
  onPhotoClick,
  bookRef,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pageFlipInstance = useRef<PageFlip | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [stackLeftWidth, setStackLeftWidth] = useState(2);
  const [stackRightWidth, setStackRightWidth] = useState(16);
  const [coverBorder, setCoverBorder] = useState(10);
  const [remountKey, setRemountKey] = useState(0);
  const savedPageIndexRef = useRef(0);
  const dimensionsRef = useRef<{ pageWidth: number; pageHeight: number }>({ pageWidth: 0, pageHeight: 0 });
  const wheelLockRef = useRef(false);

  const spreads = config?.spreads;
  // Pages: front cover + content (2 per spread if using config) + inner back (2) + back cover
  const contentPageCount = pages ? pages.length : spreads ? spreads.length * 2 : 0;
  const totalFlipPages = contentPageCount + 4; // +front, +2 inner back, +back
  const lastPageIndex = totalFlipPages - 1;

  const isCoverClosed = currentPage === 0 || currentPage >= lastPageIndex;
  const isFrontClosed = currentPage === 0;
  const isBackClosed = currentPage >= lastPageIndex;

  const onCurrentPageChangeRef = useRef(onCurrentPageChange);
  useEffect(() => {
    onCurrentPageChangeRef.current = onCurrentPageChange;
  }, [onCurrentPageChange]);

  // Window resize & orientation change listener
  // Uses debounced measurement and increments remountKey so React cleans up and
  // mounts a fresh DOM tree, preventing the book from vanishing on resize/fullscreen.
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const { pageWidth, pageHeight } = computePageSize();
        // Only remount if dimensions changed by more than 4px
        if (
          Math.abs(pageWidth - dimensionsRef.current.pageWidth) > 4 ||
          Math.abs(pageHeight - dimensionsRef.current.pageHeight) > 4
        ) {
          setRemountKey((k) => k + 1);
        }
      }, 140);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // Main book initialization effect tied to remountKey
  useEffect(() => {
    if (!containerRef.current) return;

    const { pageWidth, pageHeight, coverBorder: border } = computePageSize();
    dimensionsRef.current = { pageWidth, pageHeight };
    setCoverBorder(border);

    // Clean up any existing PageFlip instance before initializing
    if (pageFlipInstance.current) {
      try {
        pageFlipInstance.current.destroy();
      } catch {
        // ignore
      }
      pageFlipInstance.current = null;
    }

    const pageElements = containerRef.current.querySelectorAll('.page-sheet-item');
    if (pageElements.length === 0) return;

    const pageFlip = new PageFlip(containerRef.current, {
      width: pageWidth,
      height: pageHeight,
      size: 'fixed',
      minWidth: pageWidth,
      maxWidth: pageWidth,
      minHeight: pageHeight,
      maxHeight: pageHeight,
      maxShadowOpacity: 0.6,
      showCover: true, // Front & back covers are hard pages in the same flip sequence
      mobileScrollSupport: false,
      usePortrait: false,
      startPage: savedPageIndexRef.current,
      drawShadow: true,
      flippingTime: 650, // Responsive, buttery-smooth page turns
      useMouseEvents: true,
      swipeDistance: 15, // Responsive touch-swipe threshold for mobile
      showPageCorners: true,
      disableFlipByClick: false,
      autoSize: true,
    });

    pageFlip.loadFromHTML(pageElements as unknown as NodeListOf<HTMLElement>);

    pageFlip.on('flip', (e: FlipEvent) => {
      const pageIdx = typeof e.data === 'number' ? e.data : 0;
      savedPageIndexRef.current = pageIdx;
      setCurrentPage(pageIdx);
      onCurrentPageChangeRef.current?.(pageIdx);

      const progress =
        lastPageIndex > 0 ? Math.min(1, Math.max(0, pageIdx / lastPageIndex)) : 0;
      setStackLeftWidth(Math.max(2, Math.round(progress * 16)));
      setStackRightWidth(Math.max(2, Math.round((1 - progress) * 16)));
    });

    pageFlip.on('changeState', (_e: StateChangeEvent) => {
      // Page curl / flipping state
    });

    pageFlipInstance.current = pageFlip;
    setIsLoaded(true);

    return () => {
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch {
          // ignore
        }
        pageFlipInstance.current = null;
      }
    };
  }, [remountKey, contentPageCount, lastPageIndex]);

  useEffect(() => {
    if (!bookRef) return;
    bookRef.current = {
      flipNext: () => {
        const pf = pageFlipInstance.current;
        if (!pf) return;
        try {
          const cur = pf.getCurrentPageIndex();
          const total = pf.getPageCount();
          if (cur < total - 1) {
            pf.flipNext('bottom');
          }
        } catch (err) {
          console.warn('flipNext safely caught:', err);
        }
      },
      flipPrev: () => {
        const pf = pageFlipInstance.current;
        if (!pf) return;
        try {
          const cur = pf.getCurrentPageIndex();
          if (cur > 0) {
            pf.flipPrev('bottom');
          }
        } catch (err) {
          console.warn('flipPrev safely caught:', err);
        }
      },
      turnToSpread: (spreadIdx: number) => {
        const pf = pageFlipInstance.current;
        if (!pf) return;
        try {
          // Content starts at page 1 (after front cover)
          const targetPage = spreadIdx * 2 + 1;
          pf.turnToPage(Math.min(targetPage, pf.getPageCount() - 2));
        } catch (err) {
          console.warn('turnToSpread safely caught:', err);
        }
      },
      turnToCover: () => {
        const pf = pageFlipInstance.current;
        if (!pf) return;
        try {
          pf.flip(0, 'bottom');
        } catch {
          try {
            pf.turnToPage(0);
          } catch (err) {
            console.warn('turnToCover safely caught:', err);
          }
        }
      },
    };
  }, [bookRef]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (wheelLockRef.current) return;
    if (Math.abs(e.deltaY) < 25) return;

    wheelLockRef.current = true;
    const pf = pageFlipInstance.current;
    if (pf) {
      try {
        const cur = pf.getCurrentPageIndex();
        const total = pf.getPageCount();
        if (e.deltaY > 0 && cur < total - 1) {
          pf.flipNext('bottom');
        } else if (e.deltaY < 0 && cur > 0) {
          pf.flipPrev('bottom');
        }
      } catch (err) {
        console.warn('wheel flip safely caught:', err);
      }
    }

    setTimeout(() => {
      wheelLockRef.current = false;
    }, 900);
  }, []);

  return (
    <div
      onWheel={handleWheel}
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden touch-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.035)_0%,rgba(12,10,9,0.98)_75%)] pointer-events-none" />

      {/* ONE physical book — showCover keeps covers in the same flip sequence */}
      <div
        className={`relative flex items-center justify-center rounded-sm transition-[padding,box-shadow,background] duration-500 ease-out ${
          isCoverClosed ? 'hardcover-shell-closed' : 'hardcover-shell-open'
        }`}
        style={{
          padding: isCoverClosed ? 0 : coverBorder,
          background: isCoverClosed
            ? 'transparent'
            : 'linear-gradient(160deg, #4a1520 0%, #3f1118 38%, #2a0b10 100%)',
          boxShadow: isCoverClosed
            ? 'none'
            : '0 28px 80px rgba(0,0,0,0.92), 0 0 0 1px rgba(74,21,32,0.95), inset 0 0 28px rgba(0,0,0,0.4)',
        }}
      >
        {/* Contact shadow */}
        <div
          className={`absolute -bottom-8 left-1/2 -translate-x-1/2 h-12 sm:h-14 bg-black/80 blur-2xl rounded-full pointer-events-none transition-all duration-500 ${
            isCoverClosed ? 'w-[55%]' : 'w-[94%]'
          }`}
          style={
            isFrontClosed
              ? { marginLeft: '25%' }
              : isBackClosed
                ? { marginLeft: '-25%' }
                : undefined
          }
        />

        {/* Page stack thickness — open book only */}
        {!isCoverClosed && (
          <>
            <div
              className="absolute top-[8px] bottom-[8px] left-0 page-edge-left hidden sm:block transition-all duration-500 z-0"
              style={{ width: `${stackLeftWidth}px`, transform: 'translateX(-100%)' }}
            />
            <div
              className="absolute top-[8px] bottom-[8px] right-0 page-edge-right hidden sm:block transition-all duration-500 z-0"
              style={{ width: `${stackRightWidth}px`, transform: 'translateX(100%)' }}
            />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-5 sm:w-7 bg-gradient-to-r from-[#1a060a] via-[#3f1118] to-[#1a060a] z-0 pointer-events-none hidden sm:block" />
            {!isBackClosed && (
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-30 hidden sm:block">
                <RibbonBookmark compact />
              </div>
            )}
          </>
        )}

        {/* Page-flip engine — covers + sheets are one continuous flip object */}
        <div
          key={remountKey}
          ref={containerRef}
          className="relative z-10"
          style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 0.25s ease-in' }}
        >
          {/* 0 — Front cover (hard) */}
          <div className="page-sheet-item overflow-hidden select-none" data-density="hard">
            {frontCover || (config && <FrontCoverPage config={config} />)}
          </div>

          {/* Content pages */}
          {pages
            ? pages.map((page, idx) => (
                <div
                  key={`page-${idx}`}
                  className="page-sheet-item paper-sheet overflow-hidden select-none"
                  data-density="soft"
                >
                  {page}
                </div>
              ))
            : spreads?.map((spread, spreadIdx) => {
                const leftPageNumber = spreadIdx * 2 + 1;
                const rightPageNumber = spreadIdx * 2 + 2;

                return (
                  <React.Fragment key={spread.id || spreadIdx}>
                    <div
                      className="page-sheet-item paper-sheet overflow-hidden select-none"
                      data-density="soft"
                    >
                      <AlbumPageRenderer
                        spread={spread}
                        isLeft={true}
                        pageNumber={leftPageNumber}
                        onPhotoClick={onPhotoClick}
                      />
                    </div>
                    <div
                      className="page-sheet-item paper-sheet overflow-hidden select-none"
                      data-density="soft"
                    >
                      <AlbumPageRenderer
                        spread={spread}
                        isLeft={false}
                        pageNumber={rightPageNumber}
                        onPhotoClick={onPhotoClick}
                      />
                    </div>
                  </React.Fragment>
                );
              })}

          {/* Inner back cover (soft endpapers) */}
          <div className="page-sheet-item paper-sheet overflow-hidden select-none" data-density="soft">
            {innerBackCoverLeft || (config && <InnerBackCover config={config} isLeft={true} />)}
          </div>
          <div className="page-sheet-item paper-sheet overflow-hidden select-none" data-density="soft">
            {innerBackCoverRight || (config && <InnerBackCover config={config} isLeft={false} />)}
          </div>

          {/* Back cover (hard) — closes the book */}
          <div className="page-sheet-item overflow-hidden select-none" data-density="hard">
            {backCover || (config && <BackCoverPage config={config} />)}
          </div>
        </div>
      </div>
    </div>
  );
};
