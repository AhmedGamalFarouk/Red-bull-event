import { useState, useEffect, useCallback } from 'react';
import { AppRoute } from '../types';

export function parseHash(hash: string): AppRoute {
  // Normalize hash: remove leading # and whitespace
  const clean = hash.replace(/^#\/?/, '').trim();

  if (!clean || clean === '/') {
    return { name: 'intro' };
  }

  const parts = clean.split('/').filter(Boolean);

  if (parts[0] === 'lineup') {
    return { name: 'lineup' };
  }

  if (parts[0] === 'heat' && parts[1]) {
    return { name: 'heat', slug: parts[1] };
  }

  if (parts[0] === 'results') {
    return { name: 'results' };
  }

  if (parts[0] === 'compare' && parts[1] && parts[2]) {
    return { name: 'compare', a: parts[1], b: parts[2] };
  }

  return { name: 'intro' };
}

export function navigate(path: string): void {
  const targetHash = path.startsWith('#') ? path : `#/${path.replace(/^\//, '')}`;
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  }
}

export function useHashRoute(): { route: AppRoute; navigate: (path: string) => void } {
  const [route, setRoute] = useState<AppRoute>(() => {
    if (typeof window === 'undefined') return { name: 'intro' };
    return parseHash(window.location.hash);
  });

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseHash(window.location.hash));
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return {
    route,
    navigate,
  };
}
