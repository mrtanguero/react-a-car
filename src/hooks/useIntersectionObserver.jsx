import { useEffect } from 'react';

export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = '0px',
  enabled = true,
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    const el = target && target.current;

    if (!el) {
      console.log('No element yet');
      return;
    }

    console.log('Prošlo!');
    observer.observe(el);

    return () => {
      observer.unobserve(el);
    };
  }, [enabled, root, rootMargin, threshold, target, onIntersect]);
}
