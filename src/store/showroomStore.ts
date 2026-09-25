import { useSyncExternalStore, useCallback, useMemo } from 'react';
import { ShowroomState, HeatVerdict } from '../types';
import { MANIFEST } from '../data/manifest';

const STORAGE_KEY = 'gravity-showroom.v1';

const DEFAULT_VERDICT: HeatVerdict = {
  score: null,
  verdict: null,
  likes: [],
  note: '',
  updatedAt: '',
};

function readStorage(): ShowroomState {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {};
    }
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (!item) return {};
    const parsed = JSON.parse(item);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (err) {
    console.warn('Failed to read showroom store from localStorage:', err);
    return {};
  }
}

function writeStorage(state: ShowroomState): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (err) {
    console.warn('Failed to write showroom store to localStorage:', err);
  }
}

let currentState: ShowroomState = readStorage();
const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      currentState = readStorage();
      emitChange();
    }
  });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): ShowroomState {
  return currentState;
}

export function updateHeatVerdict(slug: string, updates: Partial<HeatVerdict>): void {
  const prevVerdict = currentState[slug] || DEFAULT_VERDICT;
  const nextVerdict: HeatVerdict = {
    ...prevVerdict,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  currentState = {
    ...currentState,
    [slug]: nextVerdict,
  };

  writeStorage(currentState);
  emitChange();
}

export function clearAllVerdicts(): void {
  currentState = {};
  writeStorage(currentState);
  emitChange();
}

const EMPTY_STATE: ShowroomState = {};

export function useShowroomStore() {
  const state = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_STATE);

  const getVerdict = useCallback(
    (slug: string): HeatVerdict => {
      const entry = state[slug];
      if (!entry) return { ...DEFAULT_VERDICT };
      return {
        score: entry.score ?? null,
        verdict: entry.verdict ?? null,
        likes: Array.isArray(entry.likes) ? entry.likes : [],
        note: typeof entry.note === 'string' ? entry.note : '',
        updatedAt: entry.updatedAt || '',
      };
    },
    [state]
  );

  const scoredCount = useMemo(() => {
    return MANIFEST.filter((m) => {
      const v = state[m.slug];
      return v && (v.score !== null || v.verdict !== null);
    }).length;
  }, [state]);

  const firstUnscoredSlug = useMemo(() => {
    const unscored = MANIFEST.find((m) => {
      const v = state[m.slug];
      return !v || (v.score === null && v.verdict === null);
    });
    return unscored ? unscored.slug : MANIFEST[0].slug;
  }, [state]);

  return {
    state,
    getVerdict,
    updateVerdict: updateHeatVerdict,
    clearAllVerdicts,
    scoredCount,
    firstUnscoredSlug,
  };
}
