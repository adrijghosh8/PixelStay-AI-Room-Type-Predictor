import { useEffect, useRef } from 'react';

// Tracks pointer position and writes normalized offsets (-1..1) into CSS
// custom properties on the given ref's element, throttled to animation
// frames. Layers in CSS read var(--parallax-x)/var(--parallax-y) to nudge
// their transform. No-ops when the user prefers reduced motion.
export function useParallax() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    let frame = null;
    let latest = { x: 0, y: 0 };

    const apply = () => {
      el.style.setProperty('--parallax-x', latest.x.toFixed(3));
      el.style.setProperty('--parallax-y', latest.y.toFixed(3));
      frame = null;
    };

    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      latest = { x, y };
      if (frame === null) frame = requestAnimationFrame(apply);
    };

    el.addEventListener('mousemove', handleMove);
    return () => {
      el.removeEventListener('mousemove', handleMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return ref;
}
