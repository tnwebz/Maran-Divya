/**
 * TNWebz Digital Album / Album Studio
 * Phase 1: Core Album Project Data Model (Schema v1)
 *
 * Single Source of Truth for:
 * - Future Album Editor UI
 * - 3D Preview Engine
 * - Save / Load / LocalStorage / Cloud Persistence
 * - Project Export & Standalone Client Packages
 *
 * ALL spatial geometry uses normalized percentage-based coordinates (0-100%).
 * NO DOM, canvas, or React element dependencies in this model.
 */

export type SchemaVersion = 1;

/**
 * Normalized 2D Coordinate Box (0-100% of parent container / page leaf)
 */
export interface NormalizedBounds {
  /** X position in percentage from left edge (0 to 100) */
  x: number;
  /** Y position in percentage from top edge (0 to 100) */
  y: number;
  /** Width in percentage of container width (0 to 100) */
  width: number;
  /** Height in percentage of container height (0 to 100) */
  height: number;
  /** Optional rotation in degrees (-360 to 360, default 0) */
  rotation?: number;
}

/**
 * Shape types supported for photo slots and masks
 */
export type SlotShapeType =
  | 'rect'
  | 'roundedRect'
  | 'circle'
  | 'ellipse'
  | 'polygon'
  | 'heart'
  | 'arch'
  | 'custom';

/**
 * Photo slot fitting model
 */
export interface PhotoSlot extends NormalizedBounds {
  /** Unique identifier for the slot */
  id: string;
  /** Slot geometric shape */
  shape?: SlotShapeType;
  /** Corner radius in pixels (for roundedRect) or percentage */
  borderRadius?: number;
  /** Optional custom SVG or CSS clip-path mask string */
  mask?: string;
  /** Image object-fit strategy */
  objectFit?: 'cover' | 'contain';
  /** Focal alignment position (e.g., 'center center', 'top center') */
  objectPosition?: string;
  /** Slot-level zoom scale multiplier (1 = 100%) */
  zoom?: number;
  /** ID of referenced AlbumAsset (type: 'photo') */
  assetId?: string;
  /** Stacking order within the page */
  zIndex?: number;
  /** Metadata / labels (e.g., orientation hint, slot name) */
  metadata?: Record<string, unknown>;
}

/**
 * Text element alignment
 */
export type TextAlign = 'left' | 'center' | 'right' | 'justify';

/**
 * Serializable typography data model
 */
export interface TextElement extends NormalizedBounds {
  /** Unique identifier for the text element */
  id: string;
  /** Text content */
  text: string;
  /** Font family token or name */
  fontFamily?: string;
  /** Approximate responsive font size in pt / em / % */
  fontSize?: number;
  /** Font weight */
  fontWeight?: string | number;
  /** Text color (hex / rgb / hsl / var) */
  color?: string;
  /** Horizontal alignment */
  align?: TextAlign;
  /** Line height multiplier (e.g. 1.2, 1.5) */
  lineHeight?: number;
  /** Letter spacing in em or px */
  letterSpacing?: number | string;
  /** Stacking order */
  zIndex?: number;
  /** Whether element is locked against edits */
  locked?: boolean;
  /** Semantic role (e.g. 'coupleNames', 'date', 'quote', 'folio') */
  role?: string;
  /** Custom metadata */
  metadata?: Record<string, unknown>;
}

/**
 * General extensible canvas element types
 */
export type AlbumElementType =
  | 'photo'
  | 'text'
  | 'image'
  | 'shape'
  | 'decoration'
  | 'tape'
  | 'stamp'
  | 'pin'
  | 'sticker';

/**
 * Base element model for freeform decorative / graphic layers
 */
export interface AlbumElement extends NormalizedBounds {
  /** Unique identifier */
  id: string;
  /** Element category */
  type: AlbumElementType;
  /** Stacking index */
  zIndex?: number;
  /** Whether element is locked against selection/drag */
  locked?: boolean;
  /** Visibility toggle */
  visible?: boolean;
  /** Referenced asset if element is an image/decoration */
  assetId?: string;
  /** Opacity (0.0 to 1.0) */
  opacity?: number;
  /** Element-specific styling or parameters */
  metadata?: Record<string, unknown>;
}

/**
 * Page background type
 */
export type BackgroundType = 'solid' | 'image' | 'texture' | 'none';

/**
 * Serializable page background definition
 */
export interface PageBackground {
  type: BackgroundType;
  /** Solid background color or CSS gradient */
  color?: string;
  /** Referenced asset ID (e.g. texture, paper pattern, Canva artwork) */
  assetId?: string;
  /** Background opacity (0 to 1) */
  opacity?: number;
  /** Background image sizing mode */
  fit?: 'cover' | 'contain' | 'tile';
  /** Additional texture or pattern parameters */
  metadata?: Record<string, unknown>;
}

/**
 * Data-driven Album Page (interior leaf)
 */
export interface AlbumPage {
  /** Unique page identifier */
  id: string;
  /** 0-indexed page sequence number */
  pageIndex: number;
  /** Optional linked template ID (e.g., 'canva-01-polaroid-scrapbook') */
  templateId?: string;
  /** Page background configuration */
  background: PageBackground;
  /** Decorative and graphic overlay elements */
  elements: AlbumElement[];
  /** Calibrated photo openings */
  photoSlots: PhotoSlot[];
  /** Dynamic or static text elements */
  textElements: TextElement[];
  /** Page metadata (e.g. folio title, chapter, layout category) */
  metadata?: Record<string, unknown>;
}

/**
 * Cover type distinction
 */
export type CoverType = 'front' | 'back' | 'innerFront' | 'innerBack';

/**
 * Data-driven Album Cover definition
 */
export interface AlbumCover {
  id: string;
  type: CoverType;
  /** Optional template ID for cover layout */
  templateId?: string;
  /** Cover background */
  background: PageBackground;
  /** Freeform decorative or layout elements */
  elements: AlbumElement[];
  /** Photo openings on the cover */
  photoSlots?: PhotoSlot[];
  /** Cover titles, dates, monograms */
  textElements?: TextElement[];
  /** Cover metadata (e.g. foil debossing, leather texture, ribbon) */
  metadata?: Record<string, unknown>;
}

/**
 * Physical Book Styling Options
 */
export type BookStyle = 'hardcover' | 'leather' | 'minimal' | 'luxury' | string;
export type BookPaper = 'ivory' | 'white' | 'warm-cream' | 'dark' | 'custom' | string;

export interface BookSpineConfig {
  type?: 'classic' | 'modern' | 'seamless';
  style?: string;
  width?: number;
  color?: string;
  text?: string;
  foilTitle?: string;
  foilColor?: string;
}

export interface BookShadowsConfig {
  intensity?: number;
  level?: 'soft' | 'medium' | 'strong';
  ambient?: boolean;
}

export interface BookSoundsConfig {
  soundType?: 'off' | 'soft-paper' | 'premium-album' | string;
  pageFlip?: boolean;
  coverOpen?: boolean;
  volume?: number;
}

export interface BookEnvironmentConfig {
  theme?: 'studio-dark' | 'warm-neutral' | 'light-minimal' | 'luxury-dark' | 'custom' | string;
  lighting?: 'warm' | 'studio' | 'dramatic';
  background?: string;
  woodTexture?: boolean;
}

/**
 * Physical 3D Book Configuration Settings
 */
export interface BookConfig {
  style: BookStyle;
  color: string;
  paper: BookPaper;
  thickness?: 'thin' | 'standard' | 'thick' | number;
  spine?: BookSpineConfig;
  shadows?: BookShadowsConfig;
  sounds?: BookSoundsConfig;
  environment?: BookEnvironmentConfig;
  metadata?: Record<string, unknown>;
}

/**
 * Client & Event Metadata
 */
export interface ClientMetadata {
  coupleNames?: string;
  date?: string;
  location?: string;
  title?: string;
  subtitle?: string;
  photographer?: string;
  studioName?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Registered Asset in Project Library
 */
export type AssetType =
  | 'photo'
  | 'template'
  | 'decoration'
  | 'cover'
  | 'background'
  | 'logo';

export interface AlbumAsset {
  /** Unique asset ID referenced by slots and elements */
  id: string;
  /** Asset kind */
  type: AssetType;
  /** Human readable asset name */
  name: string;
  /** URI, public path, or base64 data URI */
  src: string;
  /** Intrinsic pixel width if known */
  width?: number;
  /** Intrinsic pixel height if known */
  height?: number;
  /** Width / Height ratio */
  aspectRatio?: number;
  /** MIME type (e.g., 'image/jpeg', 'image/png', 'image/webp') */
  mimeType?: string;
  /** Categorization tag (e.g., 'ceremony', 'reception', 'vintage-frame') */
  category?: string;
  /** Additional asset metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Project-Level Preferences & Editor Settings
 */
export interface ProjectSettings {
  autoSave?: boolean;
  pageTransitionSound?: boolean;
  showPageNumbers?: boolean;
  defaultTheme?: string;
  allowZoom?: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Central Album Project Model (Root JSON Entity)
 */
export interface AlbumProject {
  /** Schema specification version (1 for Phase 1) */
  version: SchemaVersion;
  /** Unique project UUID / slug */
  projectId: string;
  /** Project display name */
  name: string;
  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** ISO 8601 last update timestamp */
  updatedAt: string;
  /** Client and event information */
  client: ClientMetadata;
  /** Physical book visual options */
  book: BookConfig;
  /** Front cover specification */
  frontCover: AlbumCover;
  /** Interior album pages in sequence */
  pages: AlbumPage[];
  /** Back cover specification */
  backCover: AlbumCover;
  /** Asset library registry */
  assets: AlbumAsset[];
  /** Project runtime and editor settings */
  settings: ProjectSettings;
  /** Extensible top-level project metadata */
  metadata?: Record<string, unknown>;
}
