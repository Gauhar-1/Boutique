'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function StepIntoLight() {
  const containerRef = useRef<HTMLDivElement>(null);

  // We manually split the paragraph into array items so we can animate them line-by-line
  // without needing a paid GSAP plugin like SplitText.
  const paragraphLines = [
    "HERITAGE HANDLOOMS DESIGNED",
    "TO MOVE WITH EVERY BODY.",
    "WE CELEBRATE LOVE, IDENTITY,",
    "AND THE UNAPOLOGETIC POWER",
    "OF DRESSING AUTHENTICALLY."
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 55%', // Starts when container is 75% down the viewport
          end: 'bottom 60%', // Extended scrub distance for a smoother, longer animation
          scrub: 1.5, // 1.5 seconds of smoothing for that buttery "premium" feel
        },
      });

      // 1. Reveal the Badge
      tl.fromTo(
        '.brutal-badge',
        { opacity: 0, scale: 0.8, rotate: -10 },
        { opacity: 1, scale: 1, rotate: -6, duration: 1, ease: 'power3.out' }
      );

      // 2. Reveal the Main Headlines (Sliding up from masked containers)
      tl.fromTo(
        '.brutal-heading-text',
        { yPercent: 110 }, // Start pushed down out of the hidden overflow box
        { yPercent: 0, stagger: 0.15, duration: 1.2, ease: 'expo.out' },
        "-=0.8" // Overlap with previous animation
      );

      // 3. Expand the Grid Divider
      tl.fromTo(
        '.brutal-divider',
        { scaleX: 0 },
        { scaleX: 1, stagger: 0.1, duration: 1, ease: 'power4.out', transformOrigin: 'left center' },
        "-=1"
      );

      // 4. Line-by-Line Paragraph Reveal
      tl.fromTo(
        '.brutal-p-line',
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, stagger: 0.1, duration: 1.2, ease: 'expo.out' },
        "-=0.8"
      );

      // 5. Final punchy tag
      tl.fromTo(
        '.brutal-tag',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1, ease: 'power2.out' },
        "-=0.5"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] w-full bg-black flex flex-col items-center justify-center py-32 px-4 md:px-10 overflow-hidden border-t-[8px] border-b-[8px] border-white selection:bg-white selection:text-black"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Brutalist Badge */}
        <div className="brutal-badge inline-block border-4 border-white px-8 py-3 mb-16 bg-white text-black transform -skew-x-6 hover:bg-[#ff2a2a] hover:text-white transition-colors duration-300 cursor-default">
          <p className="text-xs md:text-sm uppercase font-mono font-black tracking-[0.3em]">
            Fabric Has No Gender.
          </p>
        </div>

        {/* Massive Typography with Overflow Masking */}
        <h2 className="w-full flex flex-col items-center font-sans uppercase leading-[0.8] tracking-tighter mb-16">
          <div className="overflow-hidden w-full pb-2">
            <span className="brutal-heading-text block text-[14vw] md:text-[10vw] font-black text-white mix-blend-difference">
              FLUIDITY IN
            </span>
          </div>
          <div className="overflow-hidden w-full pb-4">
            <span className="brutal-heading-text block text-[14vw] md:text-[10vw] font-black text-transparent [-webkit-text-stroke:2px_white] md:[-webkit-text-stroke:4px_white] hover:text-[#2a2aff] transition-colors duration-500 cursor-default">
              FORM & IDENTITY
            </span>
          </div>
        </h2>

        {/* Harsh Grid Divider */}
        <div className="w-full max-w-5xl grid grid-cols-3 gap-6 mb-16">
          <div className="brutal-divider h-[6px] bg-white w-full origin-left"></div>
          <div className="brutal-divider h-[6px] bg-white w-full origin-left"></div>
          <div className="brutal-divider h-[6px] bg-white w-full origin-left"></div>
        </div>

        {/* Paragraph: Line-by-Line Reveal Setup */}
        <div className="flex flex-col items-start md:items-center text-left md:text-center max-w-3xl border-l-4 border-white md:border-none pl-6 md:pl-0">
          {paragraphLines.map((line, index) => (
            // The overflow-hidden wrapper creates the "mask"
            <div key={index} className="overflow-hidden w-full">
              <p className="brutal-p-line text-lg md:text-2xl lg:text-3xl text-white font-sans font-bold uppercase tracking-tight leading-[1.1] mb-1">
                {line}
              </p>
            </div>
          ))}
          
          <div className="mt-8 overflow-hidden">
            <span className="brutal-tag inline-block bg-white text-black px-4 py-2 font-mono font-black text-sm md:text-base tracking-widest hover:bg-green-700 hover:text-white transition-colors duration-300 cursor-default m-4 transform skew-x-3 shadow-[8px_8px_0px_0px_rgba(255,42,42,1)]">
              NO BOUNDARIES. NO RULES.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}