'use client';
import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

export default function EclipseTransition({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Lock curtain open permanently once fully swept
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (p >= 0.95 && !isRevealed) setIsRevealed(true);
  });

  // ─────────────────────────────────────────────────────────
  // PHASE 1 (progress 0 → 0.3): "Step into the light" appears
  //   — curtain FULLY DRAWN, children pinned at top underneath
  // PHASE 2 (progress 0.3 → 1.0): text fades, curtain sweeps away
  //   — children stay pinned at top, curtain peels back over them
  // AFTER: isRevealed=true → curtain gone, children scroll freely
  // ─────────────────────────────────────────────────────────

  // Primary curtain clip (dark, sweeps left→right in phase 2)
  const curtainClip = useTransform(scrollYProgress, (p: number) => {
    if (isRevealed) return 'polygon(200% 0%, 201% 0%, 201% 100%, 200% 100%)';
    if (p < 0.3) return 'polygon(-1% 0%, 101% 0%, 101% 100%, -1% 100%)';
    const phase2 = (p - 0.3) / 0.7;
    const sweep = phase2 * 140;
    const lead = sweep;
    const trail = Math.max(sweep - 15, 0);
    if (sweep >= 130) return 'polygon(200% 0%, 201% 0%, 201% 100%, 200% 100%)';
    return `polygon(${trail}% 0%, 101% 0%, 101% 100%, ${lead}% 100%)`;
  });

  // Secondary depth layer (grey, trails slightly behind)
  const curtainClip2 = useTransform(scrollYProgress, (p: number) => {
    if (isRevealed) return 'polygon(200% 0%, 201% 0%, 201% 100%, 200% 100%)';
    if (p < 0.33) return 'polygon(-1% 0%, 101% 0%, 101% 100%, -1% 100%)';
    const phase2 = (p - 0.33) / 0.67;
    const sweep = phase2 * 140;
    const lead = sweep - 3;
    const trail = Math.max(sweep - 22, 0);
    if (sweep >= 135) return 'polygon(200% 0%, 201% 0%, 201% 100%, 200% 100%)';
    return `polygon(${trail}% 0%, 101% 0%, 101% 100%, ${lead}% 100%)`;
  });

  // Text — fades in during phase 1, fades out entering phase 2
  const textOpacity = useTransform(scrollYProgress, [0.03, 0.14, 0.24, 0.38], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.03, 0.14, 0.24, 0.38], [50, 0, 0, -30]);
  const subtitleOpacity = useTransform(scrollYProgress, [0.06, 0.18, 0.22, 0.35], [0, 1, 1, 0]);

  // Razor edge line during phase 2
  const lineX = useTransform(scrollYProgress, [0.3, 0.95], ['-5%', '110%']);
  const lineOpacity = useTransform(scrollYProgress, [0.3, 0.38, 0.85, 0.95], [0, 0.9, 0.9, 0]);

  return (
    // Tall scroll container — gives scroll room for both phases
    <div ref={containerRef} className="relative" style={{ height: '300vh' }}>

      {/* ── LAYER 1: Children (FashionSection) — sticky, sits at top beneath curtain ── */}
      <div
        className="sticky top-0 w-full overflow-y-hidden"
        style={{
          height: '100vh',
          // Once revealed, let it flow naturally (height auto)
          ...(isRevealed ? { position: 'relative', height: 'auto', overflow: 'visible' } : {}),
        }}
      >
        {children}
      </div>

      {/* ── LAYER 2: Curtain — also sticky, sits on top of children ── */}
      {!isRevealed && (
        <div className="sticky top-0 w-full h-screen pointer-events-none" style={{ marginTop: '-100vh', zIndex: 40 }}>
          {/* Grey depth layer */}
          <motion.div
            className="absolute inset-0 bg-zinc-800"
            style={{ clipPath: curtainClip2 }}
          />

          {/* Primary dark curtain */}
          <motion.div
            className="absolute inset-0 bg-gray-900"
            style={{ clipPath: curtainClip }}
          >
            {/* Phase 1: "Step into the light" text */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center select-none"
              style={{ opacity: textOpacity, y: textY }}
            >
              <motion.span
                className="text-[11px] uppercase tracking-[0.5em] text-white/40 block mb-8 font-bold"
                style={{ opacity: subtitleOpacity }}
              >
                Curated for you
              </motion.span>
              <h2 className="text-7xl md:text-9xl font-serif text-white/60 tracking-tighter leading-[0.85] text-center">
                Step into<br />
                <span className="italic">the light</span>
              </h2>
            </motion.div>

            {/* Phase 2: Leading razor line */}
            <motion.div
              className="absolute top-0 h-full w-[1px] pointer-events-none"
              style={{
                left: lineX,
                opacity: lineOpacity,
                background: 'linear-gradient(to bottom, transparent 5%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.3) 70%, transparent 95%)',
              }}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
