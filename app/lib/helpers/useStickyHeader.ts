import { useEffect, useState } from 'react';

export default function useStickyHeader(
  offSet: number = 0,
  sentinelId = 'sticky-marker'
) {
  const [showCompact, setShowCompact] = useState(false);
  const [extraOffset, setExtraOffset] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return null;

    const banner = document.getElementById('environment-banner');
    setExtraOffset(banner?.offsetHeight ?? 0);

    const el = document.getElementById(sentinelId);
    if (!el) return null;

    const io = new IntersectionObserver(
      ([entry]) => setShowCompact(!entry.isIntersecting),
      {
        root: null,
        rootMargin: `-${offSet + (banner?.offsetHeight ?? 0)}px 0px 0px 0px`,
        threshold: 0,
      }
    );

    io.observe(el);
    return () => {
      io.disconnect();
    };
  }, [sentinelId, offSet, extraOffset]);

  return { showCompact, extraOffset };
}
