import {
  AlbumProject,
  SchemaVersion,
  SlotShapeType,
  AlbumElementType,
  BackgroundType,
  CoverType,
  BookStyle,
  BookPaper,
  AssetType,
} from './types';

/**
 * Current project schema version
 */
export const CURRENT_SCHEMA_VERSION: SchemaVersion = 1;

/**
 * All schema versions supported by this codebase
 */
export const SUPPORTED_SCHEMA_VERSIONS = [1] as const;

/**
 * Allowed Slot Shape Types
 */
export const ALLOWED_SLOT_SHAPES: readonly SlotShapeType[] = [
  'rect',
  'roundedRect',
  'circle',
  'ellipse',
  'polygon',
  'heart',
  'custom',
] as const;

/**
 * Allowed Element Types
 */
export const ALLOWED_ELEMENT_TYPES: readonly AlbumElementType[] = [
  'photo',
  'text',
  'image',
  'shape',
  'decoration',
  'tape',
  'stamp',
  'pin',
  'sticker',
] as const;

/**
 * Allowed Background Types
 */
export const ALLOWED_BACKGROUND_TYPES: readonly BackgroundType[] = [
  'solid',
  'image',
  'texture',
  'none',
] as const;

/**
 * Allowed Cover Types
 */
export const ALLOWED_COVER_TYPES: readonly CoverType[] = [
  'front',
  'back',
  'innerFront',
  'innerBack',
] as const;

/**
 * Allowed Book Styles
 */
export const ALLOWED_BOOK_STYLES: readonly BookStyle[] = [
  'hardcover',
  'leather',
  'minimal',
  'luxury',
] as const;

/**
 * Allowed Book Papers
 */
export const ALLOWED_BOOK_PAPERS: readonly BookPaper[] = [
  'ivory',
  'white',
  'warm-cream',
  'dark',
  'custom',
] as const;

/**
 * Allowed Asset Types
 */
export const ALLOWED_ASSET_TYPES: readonly AssetType[] = [
  'photo',
  'template',
  'decoration',
  'cover',
  'background',
  'logo',
] as const;

/**
 * Coordinate Constraints for Normalized Geometry (0-100%)
 */
export const COORDINATE_LIMITS = {
  MIN_X: -50, // allow small off-canvas bleed
  MAX_X: 150,
  MIN_Y: -50,
  MAX_Y: 150,
  MIN_WIDTH: 0.1,
  MAX_WIDTH: 200,
  MIN_HEIGHT: 0.1,
  MAX_HEIGHT: 200,
  MIN_ROTATION: -360,
  MAX_ROTATION: 360,
} as const;

/**
 * Checks if a version number is supported by the parser
 */
export function isSupportedSchemaVersion(version: unknown): version is SchemaVersion {
  return (
    typeof version === 'number' &&
    (SUPPORTED_SCHEMA_VERSIONS as readonly number[]).includes(version)
  );
}

/**
 * Basic type guard for non-null objects
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
