export interface DraftManifestEntry {
  slug: string;
  ref: string;
  name: string;
  thesis: string;
  path: string;
  poster: string;
  commit: string;
  builtAt: string;
}

export type VerdictType = 'keep' | 'maybe' | 'cut';

export interface HeatVerdict {
  score: number | null;
  verdict: VerdictType | null;
  likes: string[];
  note: string;
  updatedAt: string;
}

export type ShowroomState = Record<string, HeatVerdict>;

export type AppRoute =
  | { name: 'intro' }
  | { name: 'lineup' }
  | { name: 'heat'; slug: string }
  | { name: 'results' }
  | { name: 'compare'; a: string; b: string };
