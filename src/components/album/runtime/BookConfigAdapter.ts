import {
  AlbumProject,
  BookConfig,
  BookPaper,
  BookStyle,
} from '@/lib/album-project';
import { AlbumConfig } from '@/types/album';
import { AdaptedBookConfig } from './runtimeTypes';

/**
 * Maps HEX color into shaded 3D shell gradients
 */
function createCoverGradient(hexColor: string): string {
  const cleanHex = hexColor.replace('#', '');
  if (cleanHex.length !== 6) {
    return 'linear-gradient(160deg, #4a1520 0%, #3f1118 38%, #2a0b10 100%)';
  }

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const light = `rgb(${Math.min(255, Math.round(r * 1.25))}, ${Math.min(255, Math.round(g * 1.25))}, ${Math.min(255, Math.round(b * 1.25))})`;
  const base = `rgb(${r}, ${g}, ${b})`;
  const dark = `rgb(${Math.max(0, Math.round(r * 0.65))}, ${Math.max(0, Math.round(g * 0.65))}, ${Math.max(0, Math.round(b * 0.65))})`;

  return `linear-gradient(160deg, ${light} 0%, ${base} 38%, ${dark} 100%)`;
}

/**
 * Resolves paper color hex
 */
function resolvePaperColor(paper: BookPaper): string {
  switch (paper) {
    case 'ivory':
      return '#fbf8f2';
    case 'white':
      return '#ffffff';
    case 'warm-cream':
      return '#f8f3e8';
    case 'dark':
      return '#1c1a17';
    default:
      if (typeof paper === 'string' && paper.startsWith('#')) return paper;
      return '#fbf8f2';
  }
}

/**
 * Resolves viewing environment background and atmospheric glow
 */
function resolveEnvironment(theme?: string): { bg: string; glow: string } {
  switch (theme) {
    case 'light-minimal':
      return {
        bg: '#f5f3ee',
        glow: 'radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, rgba(240,237,230,0.98) 75%)',
      };
    case 'luxury-dark':
      return {
        bg: '#060a08',
        glow: 'radial-gradient(ellipse at center, rgba(14,56,43,0.18) 0%, rgba(6,10,8,0.98) 75%)',
      };
    case 'studio-dark':
      return {
        bg: '#0a0908',
        glow: 'radial-gradient(ellipse at center, rgba(255,255,255,0.04) 0%, rgba(10,9,8,0.98) 75%)',
      };
    case 'warm-neutral':
    default:
      return {
        bg: '#0d0c0a',
        glow: 'radial-gradient(ellipse at center, rgba(212,175,55,0.05) 0%, rgba(13,12,10,0.98) 75%)',
      };
  }
}

/**
 * Translates an AlbumProject BookConfig into runtime parameters for AlbumBook
 */
export class BookConfigAdapter {
  public static adapt(book: BookConfig): AdaptedBookConfig {
    const color = book.color || '#4a1521';
    const paper = book.paper || 'ivory';
    const paperColor = resolvePaperColor(paper);
    const colorGradient = createCoverGradient(color);

    // Thickness mapping
    let pageThicknessPx = 14;
    if (book.thickness === 'thin') pageThicknessPx = 8;
    else if (book.thickness === 'thick') pageThicknessPx = 22;
    else if (typeof book.thickness === 'number') pageThicknessPx = book.thickness;

    // Shadow mapping
    let shadowIntensity = 0.5;
    let shadowBlurPx = 48;
    let shadowLevel: 'soft' | 'medium' | 'strong' = 'medium';

    if (book.shadows?.level === 'soft') {
      shadowIntensity = 0.3;
      shadowBlurPx = 32;
      shadowLevel = 'soft';
    } else if (book.shadows?.level === 'strong') {
      shadowIntensity = 0.85;
      shadowBlurPx = 64;
      shadowLevel = 'strong';
    } else if (typeof book.shadows?.intensity === 'number') {
      shadowIntensity = book.shadows.intensity / 100;
      shadowBlurPx = Math.round(24 + shadowIntensity * 40);
    }

    // Sound mapping
    const soundType = (book.sounds?.soundType || 'soft-paper') as
      | 'off'
      | 'soft-paper'
      | 'premium-album';
    const soundEnabled = soundType !== 'off';

    // Environment mapping
    const env = resolveEnvironment(book.environment?.theme);

    return {
      style: book.style || 'hardcover',
      color,
      colorGradient,
      paperColor,
      paperTheme: paper,
      spineColor: book.spine?.color || color,
      spineStyle: book.spine?.style || 'classic',
      spineText: book.spine?.text,
      spineWidth: book.spine?.width || 28,
      pageThicknessPx,
      shadowIntensity,
      shadowBlurPx,
      shadowLevel,
      soundType,
      soundEnabled,
      environmentTheme: book.environment?.theme || 'warm-neutral',
      environmentBg: env.bg,
      environmentGlow: env.glow,
    };
  }

  /**
   * Generates a backwards-compatible AlbumConfig structure for legacy runtime utilities
   */
  public static toAlbumConfig(project: AlbumProject): AlbumConfig {
    const names = (project.client.coupleNames || project.name || 'Rahul & Priya').split('&');
    const partner1 = names[0]?.trim() || 'Rahul';
    const partner2 = names[1]?.trim() || 'Priya';

    return {
      slug: project.projectId,
      couple: {
        partner1,
        partner2,
        fullName: project.client.coupleNames || project.name,
        weddingDate: project.client.date || 'December 18, 2026',
        venue: project.client.location || 'The Grand Palace',
        city: project.client.location || 'Udaipur',
        state: 'Rajasthan',
      },
      studio: {
        name: project.client.studioName || 'TNWebz Studio Albums',
        tagline: 'Luxury Wedding Stories',
        logoUrl: undefined,
        website: undefined,
        instagram: undefined,
      },
      design: {
        theme: 'royal-burgundy',
        coverMaterial: project.book.style === 'leather' ? 'maroon-leather' : 'navy-linen',
        accentColor: project.book.color || '#4a1521',
        paperTone: project.book.paper || 'ivory',
        foilColor: 'gold',
      },
      spreads: [],
    };
  }
}
