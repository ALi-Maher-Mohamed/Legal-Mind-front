'use client';

import { useEffect, useRef, useState } from 'react';

/** Keeps a splash visible until `ready` and at least `minMs` have elapsed. */
export function useSplashGate(ready: boolean, minMs = 1800) {
  const [showSplash, setShowSplash] = useState(true);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (!ready) {
      setShowSplash(true);
      return;
    }

    const elapsed = Date.now() - startedAt.current;
    const wait = Math.max(0, minMs - elapsed);
    const id = window.setTimeout(() => setShowSplash(false), wait);
    return () => window.clearTimeout(id);
  }, [ready, minMs]);

  return showSplash;
}
