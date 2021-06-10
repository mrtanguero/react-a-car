import { useEffect } from 'react';

export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 0.1,
  rootMargin = '0px',
  enabled = true,
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          entry.isIntersecting && onIntersect();
        }),
      {
        root: root && root.current,
        rootMargin,
        threshold,
      }
    );

    if (!target) {
      return;
    }

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [target, enabled, root, rootMargin, threshold, onIntersect]);
}
