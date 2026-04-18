'use client';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import ProductBook from './ProductBook';

export interface Product {
  id: number | string;
  title: string;
  image: string;
}

interface ShowcaseProps {
  marqueeText?: string;
  products?: Product[];
  direction?: 'left' | 'right';
  duration?: number;
  textPositionClass?: string;
  className?: string;
}

export default function Showcase({
  marqueeText = "Trending Collection",
  products = [
    { id: 1, title: 'Saree 01', image: '/saree1.jpeg' },
    { id: 2, title: 'Saree 02', image: '/saree2.jpeg' },
    { id: 3, title: 'Saree 03', image: '/saree3.jpeg' },
  ],
  direction = 'right',
  duration = 15, // Defaulted to a much faster train effect
  textPositionClass = "top-10",
  className = "py-32",
}: ShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' }); // 300px card + 40px gap
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  // Infinite Marquee animation params based on direction
  const xStart = direction === 'right' ? "-50%" : "0%";
  const xEnd   = direction === 'right' ? "0%" : "-100%";

  return (
    <section className={`w-full bg-black flex items-center justify-center overflow-hidden snap-start relative ${className}`}>

      {/* Infinite Marquee Background Text */}
      <div className={`absolute ${textPositionClass} w-full overflow-hidden pointer-events-none`}>
        <motion.div
          className="flex whitespace-nowrap w-max"
          initial={{ x: xStart }}
          animate={{ x: xEnd }}
          transition={{ ease: "linear", duration: duration, repeat: Infinity, repeatType: "loop" }}
        >
          {Array(4).fill(marqueeText).map((text, i) => (
            <h2 key={i} className="text-white/10 text-[8vw] font-black uppercase mr-16">
              {text}
            </h2>
          ))}
        </motion.div>
      </div>

      {/* Interactive Navigation Button (Left Side) */}
      <button 
        onClick={scrollLeft}
        className="absolute left-8 md:left-16 z-50 w-16 h-16 bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-2xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      {/* Interactive Navigation Button (Right Side) */}
      <button 
        onClick={scrollRight}
        className="absolute right-8 md:right-16 z-50 w-16 h-16 bg-white/10 hover:bg-white/20 hover:scale-110 active:scale-95 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all border border-white/20 shadow-2xl"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* The Gallery Track */}
      <div 
        ref={scrollRef}
        className="relative z-10 flex gap-10 w-full overflow-x-auto snap-x snap-mandatory px-[10vw] pb-10 pt-4 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, i) => (
          <div key={product.id} className="snap-center shrink-0">
            <ProductBook product={product} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
