'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Modal } from './Modal';

interface FashionProduct {
  id: string | number;
  title: string;
  category: string;
  price: string;
  image: string;
  link: string;
}

// Snigdha Boutique Curated Data
const fashionProducts: FashionProduct[] = [
  { id: 'sb-1', title: 'Royal Baluchari Silk', category: 'Handloom Saree', price: '₹12,500', image: '/saree1.jpeg', link: '#' },
  { id: 'sb-2', title: 'Onyx Asymmetric Drape', category: 'Modern Kurta', price: '₹8,200', image: '/kurta1.jpg', link: '#' },
  { id: 'sb-3', title: 'Ivory Chikankari', category: 'Fluid Tunic', price: '₹7,200', image: '/kurti1.jpg', link: '#' },
  { id: 'sb-4', title: 'Emerald Velvet Lehenga', category: 'Bridal Archive', price: '₹65,000', image: '/lehenga1.jpg', link: '#' },
];

function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.6, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="inline-block whitespace-pre"
        >
          {char}
        </motion.span>
      ))}
    </span>
  );
}

function MagneticButton({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.4);
    y.set((clientY - centerY) * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.button>
  );
}

function SpotlightCard({ product, delay, priority = false }: { product: FashionProduct; delay: number; priority?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useStore();
  
  // Strict Scroll Locking specifically for this modal
  useEffect(() => {
    if (isQuickViewOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset'; 
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isQuickViewOpen]);

  // Motion values for raw mouse coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth springs for the spotlight movement
  const springX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Calculate mouse position relative to the container's top-left
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <>
      <motion.div 
        className="min-w-[260px] md:min-w-[300px] lg:min-w-[340px] snap-start group cursor-pointer"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
        onClick={() => setIsQuickViewOpen(true)}
      >
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="aspect-[4/5] relative overflow-hidden bg-[#F5F2EB] mb-4 border border-[#C2B28F]/20 rounded-sm"
        >
          {/* Base Layer: Grayscale Image */}
          <div className="absolute inset-0 grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-[2s]">
            <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" {...(priority ? { priority: true } : {})} />
          </div>

          {/* Reveal Layer: Colored Image with dynamic clipPath */}
          {/* We must use a template literal function within useTransform for complex strings in Framer Motion */}
          <motion.div 
            className="absolute inset-0 z-10 pointer-events-none group-hover:scale-105 transition-transform duration-[2s]" 
            style={{ 
              clipPath: useTransform(
                [springX, springY], 
                ([x, y]) => isHovered ? `circle(120px at ${x}px ${y}px)` : `circle(0px at 50% 50%)`
              ) 
            }}
          >
            <Image src={product.image} alt={`${product.title} color`} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" {...(priority ? { priority: true } : {})} />
          </motion.div>
          
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-[#1C1B19]/90 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-30 text-center hidden lg:block">
              <span className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#FDFBF7]">Inspect Detail</span>
          </div>
        </div>
        
        <div className="flex justify-between items-start">
           <div>
              <h3 className="text-lg md:text-xl font-serif text-[#1C1B19] mb-1 tracking-tight">{product.title}</h3>
              <p className="text-[10px] md:text-xs font-mono text-[#7A3E3E] font-medium">{product.price}</p>
           </div>
           <div className="lg:hidden text-[#1C1B19]/30 mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" /></svg>
           </div>
        </div>
      </motion.div>

      {/* MODAL - Sits on top of EVERYTHING */}
      <AnimatePresence>
        {isQuickViewOpen && (
          <Modal setIsOpen={setIsQuickViewOpen} product={product} productPrice={product.price} addToCart={addToCart}/>
        )}
      </AnimatePresence>
    </>
  );
}

export default function FashionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const clipPath = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], ["inset(20% 0% 20% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(20% 0% 20% 0%)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -350 : 350, behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      ref={containerRef} style={{ clipPath, opacity }}
      className="bg-[#FDFBF7] text-[#1C1B19] pt-24 pb-20 px-4 md:px-[5vw] overflow-hidden origin-center relative"
    >
      <div className="flex flex-col lg:flex-row items-start relative pb-12">
        <div className="w-full lg:w-1/4 pt-4 lg:pt-12 lg:sticky top-40 z-10 mb-8 lg:mb-0">
          <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-[0.9] tracking-tighter">
            <SplitText text="Artisan" /><br />
            <span className="italic relative inline-block text-[#7A3E3E] mt-2 lg:mt-0">
                <SplitText text="details" />
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 1 }} className="absolute -bottom-2 left-0 w-full h-[1px] bg-[#C2B28F] origin-left" />
            </span>
          </h2>
          <p className="text-[#1C1B19]/60 text-base md:text-lg mb-8 max-w-[280px] leading-relaxed">
            A curated study of <span className="text-[#1C1B19] font-medium">uncompromising</span> craftsmanship.
          </p>
        </div>

        <div className="w-full lg:w-3/4 relative group/carousel">
          <div ref={scrollRef} className="flex gap-6 md:gap-12 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {fashionProducts.map((product, i) => (
              <SpotlightCard key={product.id} product={product} delay={i * 0.1} priority={i < 2} />
            ))}
          </div>
          {/* Custom Nav Buttons - Desktop only */}
          <MagneticButton onClick={() => scroll('left')} className="hidden lg:flex absolute -left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#C2B28F]/30 items-center justify-center rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#1C1B19] hover:text-[#FDFBF7] z-20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg>
          </MagneticButton>
          <MagneticButton onClick={() => scroll('right')} className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-[#FDFBF7]/90 backdrop-blur-sm border border-[#C2B28F]/30 items-center justify-center rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 hover:bg-[#1C1B19] hover:text-[#FDFBF7] z-20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg>
          </MagneticButton>
        </div>
      </div>

      <div className="relative w-full flex flex-col lg:flex-row items-center justify-center group/feature mt-12 lg:mt-16">
        <motion.div className="relative w-full lg:w-[60%] h-[400px] sm:h-[500px] lg:h-[650px] grayscale-0 contrast-[1.1] brightness-[0.9] hover:grayscale-0 overflow-hidden rounded-sm" initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 1.5 }}>
          <motion.div className="relative w-full h-full transition-transform duration-[3s] group-hover/feature:scale-105">
             <Image src="/lehengas.jpg" alt="Bridal Feature" fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-cover" />
          </motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="relative z-10 bg-[#F5F2EB] w-[90%] lg:w-full max-w-[480px] p-8 md:p-14 flex flex-col items-start text-left shadow-[0_20px_50px_rgba(28,27,25,0.08)] -mt-20 lg:mt-0 lg:-ml-[10%] border border-[#C2B28F]/20">
          <div className="mb-6 flex items-center gap-4 text-[#C2B28F]"><div className="w-8 h-[1px] bg-[#C2B28F]" /><span className="text-[9px] uppercase tracking-[0.4em] font-bold">Bridal Archive</span></div>
          <motion.h2 className="text-5xl md:text-7xl font-light mb-6 leading-[1.05] tracking-tight text-[#1C1B19]">The Zari<br /><span className="font-serif italic font-normal text-[#7A3E3E]">touch</span></motion.h2>
          <motion.p className="text-[#1C1B19]/70 text-sm md:text-base mb-10 leading-relaxed">Woven with pure gold threads. Engineering the iconic six-yard silhouette for the modern, fluid identity.</motion.p>
          <button onClick={() => document.getElementById('full-collection')?.scrollIntoView({ behavior: 'smooth' })} className="text-[#1C1B19] text-[10px] uppercase tracking-[0.3em] font-bold border-b border-[#1C1B19]/30 pb-1 hover:text-[#7A3E3E] transition-all">
            Explore Masterpieces
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}