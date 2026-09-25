import { DraftManifestEntry } from '../types';
import manifestJson from '../../public/drafts/manifest.json';

// Single source of truth: written by tools/build-drafts.mjs
export const MANIFEST: DraftManifestEntry[] = manifestJson as DraftManifestEntry[];

export const WHAT_WORKS_OPTIONS = [
  'Typography',
  'Colour',
  'Layout',
  'Motion',
  '3D can',
  'Imagery',
  'Copy',
] as const;
