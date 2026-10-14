import { AlbumAsset, AlbumProject } from '@/lib/album-project';
import { RuntimeAsset } from './runtimeTypes';

/**
 * Centralized Asset Resolver for Runtime Preview
 * Maps asset IDs into valid, browser-ready URIs without duplicating image binaries.
 */
export class AssetResolver {
  private assetMap: Map<string, AlbumAsset>;

  constructor(assets: AlbumAsset[] = []) {
    this.assetMap = new Map();
    assets.forEach((a) => {
      if (a.id) {
        this.assetMap.set(a.id, a);
      }
    });
  }

  /**
   * Resolves an asset ID to a RuntimeAsset object
   */
  public resolveAsset(assetId?: string): RuntimeAsset | null {
    if (!assetId) return null;
    const raw = this.assetMap.get(assetId);
    if (!raw) {
      return {
        id: assetId,
        url: '',
        name: 'Missing Asset',
        type: 'photo',
        isMissing: true,
      };
    }

    return {
      id: raw.id,
      url: raw.src,
      name: raw.name || raw.id,
      type: raw.type,
      width: raw.width,
      height: raw.height,
      aspectRatio: raw.aspectRatio,
      mimeType: raw.mimeType,
      isMissing: false,
    };
  }

  /**
   * Direct URL resolution with fallback support
   */
  public resolveSrc(assetId?: string, fallbackSrc = ''): string {
    if (!assetId) return fallbackSrc;
    const asset = this.assetMap.get(assetId);
    return asset?.src || fallbackSrc;
  }

  /**
   * Scans an entire AlbumProject and identifies any dangling or missing asset references
   */
  public findMissingReferences(project: AlbumProject): { assetId: string; location: string }[] {
    const missing: { assetId: string; location: string }[] = [];

    const check = (assetId?: string, location?: string) => {
      if (!assetId) return;
      if (!this.assetMap.has(assetId)) {
        missing.push({
          assetId,
          location: location || 'Project item',
        });
      }
    };

    // 1. Front Cover
    if (project.frontCover) {
      if (project.frontCover.background?.assetId) {
        check(project.frontCover.background.assetId, 'Front Cover Background');
      }
      project.frontCover.photoSlots?.forEach((slot, idx) => {
        check(slot.assetId, `Front Cover / Photo Slot ${idx + 1}`);
      });
      project.frontCover.elements?.forEach((el, idx) => {
        check(el.assetId, `Front Cover / Element ${idx + 1}`);
      });
    }

    // 2. Interior Pages
    project.pages?.forEach((page, pIdx) => {
      const pageLabel = `Page ${pIdx + 1}`;
      if (page.background?.assetId) {
        check(page.background.assetId, `${pageLabel} Background`);
      }
      page.photoSlots?.forEach((slot, sIdx) => {
        check(slot.assetId, `${pageLabel} / Slot ${sIdx + 1}`);
      });
      page.elements?.forEach((el, eIdx) => {
        check(el.assetId, `${pageLabel} / Element ${eIdx + 1}`);
      });
    });

    // 3. Back Cover
    if (project.backCover) {
      if (project.backCover.background?.assetId) {
        check(project.backCover.background.assetId, 'Back Cover Background');
      }
      project.backCover.photoSlots?.forEach((slot, idx) => {
        check(slot.assetId, `Back Cover / Photo Slot ${idx + 1}`);
      });
      project.backCover.elements?.forEach((el, idx) => {
        check(el.assetId, `Back Cover / Element ${idx + 1}`);
      });
    }

    return missing;
  }
}
