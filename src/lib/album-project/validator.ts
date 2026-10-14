import {
  AlbumProject,
  AlbumPage,
  AlbumCover,
  PhotoSlot,
  TextElement,
  AlbumElement,
  AlbumAsset,
  NormalizedBounds,
} from './types';
import {
  CURRENT_SCHEMA_VERSION,
  isSupportedSchemaVersion,
  isRecord,
  COORDINATE_LIMITS,
} from './schema';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validates a normalized bounding box (x, y, width, height, rotation)
 */
function validateBounds(
  bounds: Partial<NormalizedBounds>,
  path: string,
  errors: ValidationError[]
): void {
  if (typeof bounds.x !== 'number' || isNaN(bounds.x)) {
    errors.push({ path: `${path}.x`, message: 'x coordinate must be a valid number' });
  } else if (bounds.x < COORDINATE_LIMITS.MIN_X || bounds.x > COORDINATE_LIMITS.MAX_X) {
    errors.push({
      path: `${path}.x`,
      message: `x coordinate (${bounds.x}%) is out of sensible range [${COORDINATE_LIMITS.MIN_X}, ${COORDINATE_LIMITS.MAX_X}]`,
    });
  }

  if (typeof bounds.y !== 'number' || isNaN(bounds.y)) {
    errors.push({ path: `${path}.y`, message: 'y coordinate must be a valid number' });
  } else if (bounds.y < COORDINATE_LIMITS.MIN_Y || bounds.y > COORDINATE_LIMITS.MAX_Y) {
    errors.push({
      path: `${path}.y`,
      message: `y coordinate (${bounds.y}%) is out of sensible range [${COORDINATE_LIMITS.MIN_Y}, ${COORDINATE_LIMITS.MAX_Y}]`,
    });
  }

  if (typeof bounds.width !== 'number' || isNaN(bounds.width)) {
    errors.push({ path: `${path}.width`, message: 'width must be a valid number' });
  } else if (bounds.width <= 0) {
    errors.push({
      path: `${path}.width`,
      message: `width must be greater than 0, got ${bounds.width}`,
    });
  } else if (bounds.width > COORDINATE_LIMITS.MAX_WIDTH) {
    errors.push({
      path: `${path}.width`,
      message: `width exceeds maximum percentage limit (${COORDINATE_LIMITS.MAX_WIDTH}%), got ${bounds.width}`,
    });
  }

  if (typeof bounds.height !== 'number' || isNaN(bounds.height)) {
    errors.push({ path: `${path}.height`, message: 'height must be a valid number' });
  } else if (bounds.height <= 0) {
    errors.push({
      path: `${path}.height`,
      message: `height must be greater than 0, got ${bounds.height}`,
    });
  } else if (bounds.height > COORDINATE_LIMITS.MAX_HEIGHT) {
    errors.push({
      path: `${path}.height`,
      message: `height exceeds maximum percentage limit (${COORDINATE_LIMITS.MAX_HEIGHT}%), got ${bounds.height}`,
    });
  }

  if (bounds.rotation !== undefined) {
    if (typeof bounds.rotation !== 'number' || isNaN(bounds.rotation)) {
      errors.push({
        path: `${path}.rotation`,
        message: 'rotation must be a valid number',
      });
    } else if (
      bounds.rotation < COORDINATE_LIMITS.MIN_ROTATION ||
      bounds.rotation > COORDINATE_LIMITS.MAX_ROTATION
    ) {
      errors.push({
        path: `${path}.rotation`,
        message: `rotation (${bounds.rotation}deg) is out of range [${COORDINATE_LIMITS.MIN_ROTATION}, ${COORDINATE_LIMITS.MAX_ROTATION}]`,
      });
    }
  }
}

/**
 * Validates a PhotoSlot and its asset reference
 */
function validatePhotoSlot(
  slot: unknown,
  path: string,
  knownAssetIds: Set<string>,
  seenIds: Set<string>,
  errors: ValidationError[]
): void {
  if (!isRecord(slot)) {
    errors.push({ path, message: 'PhotoSlot must be an object' });
    return;
  }

  if (typeof slot.id !== 'string' || !slot.id.trim()) {
    errors.push({ path: `${path}.id`, message: 'PhotoSlot id must be a non-empty string' });
  } else {
    if (seenIds.has(slot.id)) {
      errors.push({ path: `${path}.id`, message: `Duplicate slot ID found: '${slot.id}'` });
    }
    seenIds.add(slot.id);
  }

  validateBounds(slot as Partial<NormalizedBounds>, path, errors);

  if (typeof slot.assetId === 'string' && slot.assetId.trim()) {
    if (!knownAssetIds.has(slot.assetId)) {
      errors.push({
        path: `${path}.assetId`,
        message: `Referenced assetId '${slot.assetId}' does not exist in project assets`,
      });
    }
  }
}

/**
 * Validates a TextElement
 */
function validateTextElement(
  textEl: unknown,
  path: string,
  seenIds: Set<string>,
  errors: ValidationError[]
): void {
  if (!isRecord(textEl)) {
    errors.push({ path, message: 'TextElement must be an object' });
    return;
  }

  if (typeof textEl.id !== 'string' || !textEl.id.trim()) {
    errors.push({ path: `${path}.id`, message: 'TextElement id must be a non-empty string' });
  } else {
    if (seenIds.has(textEl.id)) {
      errors.push({ path: `${path}.id`, message: `Duplicate text element ID: '${textEl.id}'` });
    }
    seenIds.add(textEl.id);
  }

  if (typeof textEl.text !== 'string') {
    errors.push({ path: `${path}.text`, message: 'TextElement text must be a string' });
  }

  validateBounds(textEl as Partial<NormalizedBounds>, path, errors);
}

/**
 * Validates a general AlbumElement
 */
function validateAlbumElement(
  element: unknown,
  path: string,
  knownAssetIds: Set<string>,
  seenIds: Set<string>,
  errors: ValidationError[]
): void {
  if (!isRecord(element)) {
    errors.push({ path, message: 'AlbumElement must be an object' });
    return;
  }

  if (typeof element.id !== 'string' || !element.id.trim()) {
    errors.push({ path: `${path}.id`, message: 'AlbumElement id must be a non-empty string' });
  } else {
    if (seenIds.has(element.id)) {
      errors.push({ path: `${path}.id`, message: `Duplicate element ID: '${element.id}'` });
    }
    seenIds.add(element.id);
  }

  if (typeof element.type !== 'string' || !element.type.trim()) {
    errors.push({ path: `${path}.type`, message: 'AlbumElement type must be a non-empty string' });
  }

  validateBounds(element as Partial<NormalizedBounds>, path, errors);

  if (typeof element.assetId === 'string' && element.assetId.trim()) {
    if (!knownAssetIds.has(element.assetId)) {
      errors.push({
        path: `${path}.assetId`,
        message: `Referenced assetId '${element.assetId}' does not exist in project assets`,
      });
    }
  }
}

/**
 * Validates a PageBackground
 */
function validateBackground(
  bg: unknown,
  path: string,
  knownAssetIds: Set<string>,
  errors: ValidationError[]
): void {
  if (!isRecord(bg)) {
    errors.push({ path, message: 'background must be an object' });
    return;
  }

  if (typeof bg.type !== 'string') {
    errors.push({ path: `${path}.type`, message: 'background type must be a string' });
  }

  if (typeof bg.assetId === 'string' && bg.assetId.trim()) {
    if (!knownAssetIds.has(bg.assetId)) {
      errors.push({
        path: `${path}.assetId`,
        message: `Background referenced assetId '${bg.assetId}' does not exist in project assets`,
      });
    }
  }
}

/**
 * Validates an AlbumCover
 */
function validateCover(
  cover: unknown,
  path: string,
  expectedType: 'front' | 'back',
  knownAssetIds: Set<string>,
  errors: ValidationError[]
): void {
  if (!isRecord(cover)) {
    errors.push({ path, message: `${path} must be an object` });
    return;
  }

  if (typeof cover.id !== 'string' || !cover.id.trim()) {
    errors.push({ path: `${path}.id`, message: `${path} id must be a non-empty string` });
  }

  if (cover.type !== expectedType) {
    errors.push({
      path: `${path}.type`,
      message: `${path} type must be '${expectedType}', got '${String(cover.type)}'`,
    });
  }

  validateBackground(cover.background, `${path}.background`, knownAssetIds, errors);

  const localIds = new Set<string>();

  if (Array.isArray(cover.elements)) {
    cover.elements.forEach((el, idx) => {
      validateAlbumElement(el, `${path}.elements[${idx}]`, knownAssetIds, localIds, errors);
    });
  }

  if (Array.isArray(cover.photoSlots)) {
    cover.photoSlots.forEach((slot, idx) => {
      validatePhotoSlot(slot, `${path}.photoSlots[${idx}]`, knownAssetIds, localIds, errors);
    });
  }

  if (Array.isArray(cover.textElements)) {
    cover.textElements.forEach((txt, idx) => {
      validateTextElement(txt, `${path}.textElements[${idx}]`, localIds, errors);
    });
  }
}

/**
 * Validates an interior AlbumPage
 */
function validatePage(
  page: unknown,
  index: number,
  knownAssetIds: Set<string>,
  seenPageIds: Set<string>,
  errors: ValidationError[]
): void {
  const path = `pages[${index}]`;

  if (!isRecord(page)) {
    errors.push({ path, message: 'Page must be an object' });
    return;
  }

  if (typeof page.id !== 'string' || !page.id.trim()) {
    errors.push({ path: `${path}.id`, message: 'Page id must be a non-empty string' });
  } else {
    if (seenPageIds.has(page.id)) {
      errors.push({ path: `${path}.id`, message: `Duplicate page id '${page.id}'` });
    }
    seenPageIds.add(page.id);
  }

  if (typeof page.pageIndex !== 'number' || page.pageIndex < 0 || isNaN(page.pageIndex)) {
    errors.push({
      path: `${path}.pageIndex`,
      message: 'pageIndex must be a non-negative number',
    });
  }

  validateBackground(page.background, `${path}.background`, knownAssetIds, errors);

  const localPageItemIds = new Set<string>();

  if (!Array.isArray(page.elements)) {
    errors.push({ path: `${path}.elements`, message: 'elements must be an array' });
  } else {
    page.elements.forEach((el, idx) => {
      validateAlbumElement(el, `${path}.elements[${idx}]`, knownAssetIds, localPageItemIds, errors);
    });
  }

  if (!Array.isArray(page.photoSlots)) {
    errors.push({ path: `${path}.photoSlots`, message: 'photoSlots must be an array' });
  } else {
    page.photoSlots.forEach((slot, idx) => {
      validatePhotoSlot(slot, `${path}.photoSlots[${idx}]`, knownAssetIds, localPageItemIds, errors);
    });
  }

  if (!Array.isArray(page.textElements)) {
    errors.push({ path: `${path}.textElements`, message: 'textElements must be an array' });
  } else {
    page.textElements.forEach((txt, idx) => {
      validateTextElement(txt, `${path}.textElements[${idx}]`, localPageItemIds, errors);
    });
  }
}

/**
 * Master Album Project Validator
 *
 * Checks schema integrity, versioning, identifier uniqueness, normalized bounds,
 * asset referential integrity, and required structure.
 */
export function validateAlbumProject(project: unknown): ValidationResult {
  const errors: ValidationError[] = [];

  if (!isRecord(project)) {
    return {
      valid: false,
      errors: [{ path: '', message: 'Project root must be a non-null object' }],
    };
  }

  // 1. Version Check
  if (project.version === undefined) {
    errors.push({ path: 'version', message: 'Schema version is missing' });
  } else if (!isSupportedSchemaVersion(project.version)) {
    errors.push({
      path: 'version',
      message: `Unsupported schema version: ${String(project.version)}. Current supported version is ${CURRENT_SCHEMA_VERSION}`,
    });
  }

  // 2. Identity Check
  if (typeof project.projectId !== 'string' || !project.projectId.trim()) {
    errors.push({ path: 'projectId', message: 'projectId must be a non-empty string' });
  }

  if (typeof project.name !== 'string' || !project.name.trim()) {
    errors.push({ path: 'name', message: 'name must be a non-empty string' });
  }

  if (typeof project.createdAt !== 'string' || !project.createdAt.trim()) {
    errors.push({ path: 'createdAt', message: 'createdAt must be a valid ISO timestamp' });
  }

  if (typeof project.updatedAt !== 'string' || !project.updatedAt.trim()) {
    errors.push({ path: 'updatedAt', message: 'updatedAt must be a valid ISO timestamp' });
  }

  // 3. Client Metadata
  if (!isRecord(project.client)) {
    errors.push({ path: 'client', message: 'client must be an object' });
  }

  // 4. Book Configuration
  if (!isRecord(project.book)) {
    errors.push({ path: 'book', message: 'book must be an object' });
  } else {
    if (typeof project.book.style !== 'string' || !project.book.style.trim()) {
      errors.push({ path: 'book.style', message: 'book.style must be a non-empty string' });
    }
    if (typeof project.book.color !== 'string' || !project.book.color.trim()) {
      errors.push({ path: 'book.color', message: 'book.color must be a non-empty string' });
    }
    if (typeof project.book.paper !== 'string' || !project.book.paper.trim()) {
      errors.push({ path: 'book.paper', message: 'book.paper must be a non-empty string' });
    }
  }

  // 5. Assets Registry & Referential Map
  const knownAssetIds = new Set<string>();
  if (!Array.isArray(project.assets)) {
    errors.push({ path: 'assets', message: 'assets must be an array' });
  } else {
    project.assets.forEach((asset, idx) => {
      const p = `assets[${idx}]`;
      if (!isRecord(asset)) {
        errors.push({ path: p, message: 'Asset must be an object' });
        return;
      }
      if (typeof asset.id !== 'string' || !asset.id.trim()) {
        errors.push({ path: `${p}.id`, message: 'Asset id must be a non-empty string' });
      } else {
        if (knownAssetIds.has(asset.id)) {
          errors.push({ path: `${p}.id`, message: `Duplicate asset ID: '${asset.id}'` });
        }
        knownAssetIds.add(asset.id);
      }
      if (typeof asset.src !== 'string' || !asset.src.trim()) {
        errors.push({ path: `${p}.src`, message: 'Asset src must be a non-empty URI string' });
      }
      if (typeof asset.type !== 'string' || !asset.type.trim()) {
        errors.push({ path: `${p}.type`, message: 'Asset type must be a non-empty string' });
      }
    });
  }

  // 6. Covers
  validateCover(project.frontCover, 'frontCover', 'front', knownAssetIds, errors);
  validateCover(project.backCover, 'backCover', 'back', knownAssetIds, errors);

  // 7. Pages
  if (!Array.isArray(project.pages)) {
    errors.push({ path: 'pages', message: 'pages must be an array' });
  } else {
    const seenPageIds = new Set<string>();
    project.pages.forEach((page, idx) => {
      validatePage(page, idx, knownAssetIds, seenPageIds, errors);
    });
  }

  // 8. Settings
  if (!isRecord(project.settings)) {
    errors.push({ path: 'settings', message: 'settings must be an object' });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
