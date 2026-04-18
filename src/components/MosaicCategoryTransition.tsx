'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import ProductMosaic from './ProductMosaic';
import CategoryShowcase from './CategoryShowcase';

export default function MosaicCategoryTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start sliding when the top of the container hits the top of the viewport
    // End sliding when the bottom of the container hits the bottom of the viewport
    offset: ["start start", "end end"]
  });

  // Slide left: Panel 1 (Mosaic) moves out to the left, Panel 2 (Category Grid) comes in from right
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", "-100vw"]);

  return (
    <section ref={containerRef} className="h-[200vh] w-full bg-black relative">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div 
          className="flex w-[200vw] h-full"
          style={{ x }}
        >
          {/* Panel 1: Product Mosaic (Cube) */}
          <div className="w-screen h-screen flex flex-col items-center justify-center relative bg-black">
             <ProductMosaic />
          </div>

          {/* Panel 2: Full Collection Grid */}
          <div className="w-screen h-screen">
             <CategoryShowcase />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
