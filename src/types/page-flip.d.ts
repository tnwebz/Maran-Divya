declare module 'page-flip' {
  export interface PageFlipSettings {
    startPage?: number;
    size?: 'fixed' | 'stretch';
    width: number;
    height: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    swipeDistance?: number;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    showPageCorners?: boolean;
    disableFlipByClick?: boolean;
  }

  export interface FlipEvent {
    data: number;
    object: PageFlip;
  }

  export interface StateChangeEvent {
    data: 'read' | 'user_fold' | 'fold_corner' | 'flipping';
    object: PageFlip;
  }

  export interface OrientationChangeEvent {
    data: 'portrait' | 'landscape';
    object: PageFlip;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting: PageFlipSettings);
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    loadFromImages(imagesPaths: string[]): void;
    turnToPrevPage(): void;
    turnToNextPage(): void;
    turnToPage(pageNum: number): void;
    flipNext(corner?: 'top' | 'bottom'): void;
    flipPrev(corner?: 'top' | 'bottom'): void;
    flip(pageNum: number, corner?: 'top' | 'bottom'): void;
    destroy(): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): 'portrait' | 'landscape';
    getState(): string;
    update(): void;
    on(event: 'flip', app: (e: FlipEvent) => void): void;
    on(event: 'changeState', app: (e: StateChangeEvent) => void): void;
    on(event: 'changeOrientation', app: (e: OrientationChangeEvent) => void): void;
    on(event: 'init', app: (e: { data: number; object: PageFlip }) => void): void;
    off(event: string): void;
  }
}
