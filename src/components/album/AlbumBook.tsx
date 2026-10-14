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

/** Compute page size so the open spread fills ~80–88vw × 75–85vh on desktop. */
function computePageSize() {
  const sw = window.innerWidth;
  const sh = window.innerHeight;

  // Slim hardcover border peeking around ivory pages
  const coverBorder = sw >= 1400 ? 11 : sw >= 900 ? 9 : 6;

  // Open-book footprint (reference ~1550–1680 × 850–900 on 1920×1080)
  const targetBookW = Math.min(sw * 0.86, 1680);
  const targetBookH = Math.min(sh * 0.82, 900);

  let pageWidth = Math.floor((targetBookW - coverBorder * 2) / 2);
  let pageHeight = Math.floor(targetBookH - coverBorder * 2);

  // Keep pages near-square / lightly portrait so the open spread reads landscape
  // like the Stitch reference (each leaf ~800×860 → spread ~1600×860)
  const maxRatio = 1.02; // width/height
  const minRatio = 0.78;
  const ratio = pageWidth / pageHeight;
  if (ratio > maxRatio) {
    pageWidth = Math.floor(pageHeight * maxRatio);
  } else if (ratio < minRatio) {
    pageHeight = Math.floor(pageWidth / minRatio);
  }

  // Desktop floor so we never collapse into a postcard
  if (sw >= 1400) {
    pageWidth = Math.max(720, Math.min(pageWidth, 860));
    pageHeight = Math.max(780, Math.min(pageHeight, 920));
  } else if (sw >= 900) {
    pageWidth = Math.max(420, Math.min(pageWidth, 720));
    pageHeight = Math.max(480, Math.min(pageHeight, 820));
  } else {
    pageWidth = Math.max(280, Math.min(pageWidth, 420));
    pageHeight = Math.max(340, Math.min(pageHeight, 560));
  }

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
  const [coverBorder, setCoverBorder] = useState(11);
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

  const initBook = useCallback(() => {
    if (!containerRef.current) return;

    if (pageFlipInstance.current) {
      try {
        pageFlipInstance.current.destroy();
      } catch {
        // ignore
      }
      pageFlipInstance.current = null;
    }

    const { pageWidth, pageHeight, coverBorder: border } = computePageSize();
    setCoverBorder(border);

    const pageFlip = new PageFlip(containerRef.current, {
      width: pageWidth,
      height: pageHeight,
      size: 'fixed',
      minWidth: pageWidth,
      maxWidth: pageWidth,
      minHeight: pageHeight,
      maxHeight: pageHeight,
      maxShadowOpacity: 0.7,
      showCover: true, // Front & back covers are hard pages in the same flip sequence
      mobileScrollSupport: false,
      usePortrait: false,
      startPage: 0,
      drawShadow: true,
      flippingTime: 900,
      useMouseEvents: true,
      swipeDistance: 20,
      showPageCorners: true,
      disableFlipByClick: false,
      autoSize: true,
    });

    const pageElements = containerRef.current.querySelectorAll('.page-sheet-item');
    if (pageElements.length > 0) {
      pageFlip.loadFromHTML(pageElements as unknown as NodeListOf<HTMLElement>);
    }

    pageFlip.on('flip', (e: FlipEvent) => {
      const pageIdx = typeof e.data === 'number' ? e.data : 0;
      setCurrentPage(pageIdx);
      onCurrentPageChangeRef.current?.(pageIdx);

      const isCoverFlip = pageIdx === 0 || pageIdx >= lastPageIndex;
      albumAudio.playPageFlipSound(isCoverFlip ? 'cover' : 'turn');

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
  }, [contentPageCount, lastPageIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      initBook();
    }, 120);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => initBook(), 180);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch {
          // ignore
        }
      }
    };
  }, [initBook]);

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
      className="relative w-full h-full flex items-center justify-center select-none overflow-hidden"
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
          ref={containerRef}
          className="relative z-10"
          style={{ opacity: isLoaded ? 1 : 0 }}
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
