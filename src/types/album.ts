export type SpreadType =
  | 'cover'
  | 'hero'
  | 'portrait'
  | 'editorial'
  | 'panorama'
  | 'minimal'
  | 'collage'
  | 'section'
  | 'final';

export interface PhotoItem {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  location?: string;
  photographer?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
  objectPosition?: string;
}

export interface BaseSpreadConfig {
  id: string;
  spreadNumber: number;
  type: SpreadType;
  title?: string;
  subtitle?: string;
  date?: string;
  quote?: string;
  quoteAuthor?: string;
  sectionName?: string;
  storyText?: string;
  leftPhotos?: PhotoItem[];
  rightPhotos?: PhotoItem[];
  panoramaPhoto?: PhotoItem;
  theme?: 'warm-ivory' | 'royal-dark' | 'linen' | 'gold-accent';
}

export interface StudioConfig {
  name: string;
  tagline: string;
  logoUrl?: string;
  website?: string;
  instagram?: string;
}

export interface CoupleConfig {
  partner1: string;
  partner2: string;
  fullName: string;
  weddingDate: string;
  venue: string;
  city: string;
  state: string;
}

export interface DesignConfig {
  theme: 'royal-burgundy' | 'emerald-estate' | 'midnight-gold' | 'ivory-pearl';
  coverMaterial: 'maroon-leather' | 'navy-linen' | 'forest-leather' | 'black-velvet';
  accentColor: string;
  paperTone: string;
  foilColor: 'gold' | 'rose-gold' | 'silver' | 'copper';
}

export interface AlbumConfig {
  slug: string;
  couple: CoupleConfig;
  studio: StudioConfig;
  design: DesignConfig;
  bgMusicUrl?: string;
  spreads: BaseSpreadConfig[];
}
