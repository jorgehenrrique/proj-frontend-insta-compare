import { useEffect, useRef, useState } from 'react';

interface SlideshowProps {
  slides: { key: string; content: React.ReactNode }[];
  intervalMs?: number;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(query.matches);
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener('change', listener);
    return () => query.removeEventListener('change', listener);
  }, []);

  return reduced;
}

export function Slideshow({ slides, intervalMs = 2800 }: SlideshowProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(!prefersReducedMotion);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [playing, intervalMs, slides.length]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={containerRef}
        onMouseEnter={() => setPlaying(false)}
        onMouseLeave={() => setPlaying(!prefersReducedMotion)}
        className="relative shrink-0"
      >
        {slides.map((slide, i) => (
          <div
            key={slide.key}
            aria-hidden={i !== index}
            className={`transition-opacity duration-500 ${
              i === index ? 'relative opacity-100' : 'pointer-events-none absolute inset-0 opacity-0'
            }`}
          >
            {slide.content}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-xs text-ink-muted hover:text-ink"
          aria-label={playing ? 'Pausar demonstração' : 'Reproduzir demonstração'}
        >
          {playing ? '⏸' : '▶'}
        </button>

        <div className="flex items-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ir para o passo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-4 bg-brand-mid' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
