'use client';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';

interface FashionProduct {
  id: string | number;
  title: string;
  category: string;
  price: string;
  image: string;
  link: string;
}

const fashionProducts: FashionProduct[] = [
  { id: 'fp-1', title: 'Elevated stilettos', category: 'Kurta', price: '₹3200', image: '/kurta1.jpg', link: '#' },
  { id: 'fp-2', title: 'Understated jewelry', category: 'Kuti', price: '₹2500', image: '/kurti2.jpg', link: '#' },
  { id: 'fp-4', title: 'Classic outerwear', category: 'Lehenga', price: '₹3700', image: '/Lehenga1.jpg', link: '#' },
  { id: 'fp-5', title: 'Statement belts', category: 'Saree', price: '₹5200', image: '/saree1.jpeg', link: '#' },
];

function SplitText({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.5,
            delay: i * 0.03,
            ease: [0.215, 0.61, 0.355, 1],
          }}
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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart } = useStore();
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });
  
  const trailX = useSpring(mouseX, { stiffness: 300, damping: 60 });
  const trailY = useSpring(mouseY, { stiffness: 300, damping: 60 });

  const stretchX = useTransform([springX, trailX], ([s, t]: number[]) => (s - t) * 0.5);
  const stretchY = useTransform([springY, trailY], ([s, t]: number[]) => (s - t) * 0.5);
  
  const rotateSpotlight = useTransform([stretchX, stretchY], ([sx, sy]: number[]) => {
    return Math.atan2(sy, sx) * (180 / Math.PI);
  });

  const ringWidth = useTransform(stretchX, (v: number) => 140 + Math.abs(v) * 2);
  const ringHeight = useTransform(stretchY, (v: number) => 140 + Math.abs(v) * 2);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const clipPath = useTransform(
    [springX, springY, stretchX, stretchY],
    ([x, y, sx, sy]: number[]) => {
        if (!isHovered) return 'circle(0px at 50% 50%)';
        const rx = 70 + Math.abs(sx);
        const ry = 70 + Math.abs(sy);
        return `ellipse(${rx}px ${ry}px at ${x}px ${y}px)`;
    }
  );

  return (
    <>
      <motion.div 
        className="min-w-[280px] lg:min-w-[340px] snap-start group"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.8 }}
      >
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => addToCart({ id: product.id, title: product.title, price: product.price, image: product.image })}
          className="aspect-[4/5] relative overflow-hidden bg-zinc-100 mb-4 cursor-pointer perspective-[2000px] group/card"
        >
          <AnimatePresence>
            {!imageLoaded && (
              <motion.div className="absolute inset-0 z-30 bg-zinc-200" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-0 grayscale contrast-125 brightness-75">
            <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" onLoad={() => setImageLoaded(true)} {...(priority ? { priority: true } : {})} />
          </div>

          <motion.div className="absolute inset-0 z-10 pointer-events-none" style={{ clipPath, filter: "contrast(1.1) saturate(1.1)" }}>
            <Image src={product.image} alt={`${product.title} color`} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" {...(priority ? { priority: true } : {})} />
          </motion.div>

          {isHovered && (
            <motion.div 
              className="absolute z-20 pointer-events-none mix-blend-overlay border border-white/50"
              style={{ left: springX, top: springY, width: ringWidth, height: ringHeight, x: "-50%", y: "-50%", rotate: rotateSpotlight }}
              animate={{ borderRadius: ["45% 55% 50% 50% / 50% 50% 45% 55%", "55% 45% 55% 45% / 45% 55% 45% 55%", "45% 55% 50% 50% / 50% 50% 45% 55%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          )}
          
          <div className="absolute bottom-0 left-0 w-full p-6 bg-white translate-y-full group-hover/card:translate-y-0 transition-transform duration-500 z-30 text-center">
              <span className="text-[10px] uppercase font-black tracking-[0.4em] text-black">+ Add to Bag</span>
          </div>
        </div>
        
        <motion.div animate={{ x: isHovered ? 10 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <h3 className="text-xl font-medium mb-1 tracking-tight">{product.title}</h3>
          <p className="text-xs font-mono text-zinc-400 mb-4">{product.price}</p>
          <button 
            onClick={(e) => { e.stopPropagation(); setIsQuickViewOpen(true); }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest border-b border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all group-hover:gap-6"
          >
            Explore Detail
            <svg className="w-5 h-5 transition-transform group-hover:scale-x-150 origin-left" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
          </button>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isQuickViewOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6 lg:p-12"
          >
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setIsQuickViewOpen(false)}
               className="absolute inset-0 bg-black/90 backdrop-blur-xl"
             />
             
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 30 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.9, opacity: 0, y: 30 }}
               className="relative w-full max-w-6xl h-[80vh] bg-white flex flex-col lg:flex-row overflow-hidden rounded-lg shadow-2xl"
             >
                <button onClick={() => setIsQuickViewOpen(false)} className="absolute top-8 right-8 z-50 text-black/40 hover:text-black transition-colors uppercase text-[10px] font-black tracking-widest flex items-center gap-2">
                   Close Archive <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>

                <div className="w-full lg:w-1/2 h-1/2 lg:h-full relative bg-zinc-100">
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                    <div className="absolute inset-x-8 top-8 flex items-center justify-between">
                       <span className="text-[10px] uppercase font-black tracking-widest text-white drop-shadow-lg">Aura Archive 0x{product.id}</span>
                    </div>
                </div>

                <div className="w-full lg:w-1/2 p-12 lg:p-20 flex flex-col justify-center">
                    <span className="text-[10px] uppercase text-zinc-400 tracking-[0.4em] mb-4 font-bold">{product.category}</span>
                    <h2 className="text-5xl lg:text-7xl font-serif text-black mb-10 tracking-tighter leading-none">{product.title}</h2>
                    <p className="text-zinc-500 text-lg lg:text-xl leading-relaxed max-w-md mb-12">
                       A profound exploration of texture and form. This piece from the {product.category} collection represents the brand's dedication to architectural silhouettes and sustainable material sourcing.
                    </p>
                    
                    <div className="space-y-8">
                       <div className="flex justify-between items-center py-4 border-y border-zinc-100">
                          <span className="text-zinc-400 text-[10px] uppercase tracking-widest">Pricing</span>
                          <span className="text-2xl font-mono text-black">{product.price}</span>
                       </div>
                       
                       <div className="flex gap-4">
                          <button 
                            onClick={() => { addToCart({ id: product.id, title: product.title, price: product.price, image: product.image }); setIsQuickViewOpen(false); }}
                            className="flex-1 py-5 bg-black text-white text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-800 transition-colors"
                          >
                             Secure This Piece
                          </button>
                          <button className="px-8 py-5 border border-zinc-200 text-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-zinc-50 transition-colors">
                             Specs
                          </button>
                       </div>
                    </div>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function FashionSection() {
  const containerRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });

  const clipPath = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["inset(45% 0% 45% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(45% 0% 45% 0%)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const z = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [-200, 0, 0, -200]);
  const blur = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], ["blur(20px)", "blur(0px)", "blur(0px)", "blur(20px)"]);

  const { scrollXProgress } = useScroll({ container: scrollRef });
  const scaleX = useSpring(scrollXProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === 'left' ? -400 : 400, behavior: 'smooth' });
    }
  };

  return (
    <motion.section 
      ref={containerRef} style={{ clipPath, opacity, z, filter: blur }}
      className="bg-white text-zinc-900 pt-16 pb-12 px-[5vw] overflow-hidden origin-center relative"
    >
      <div className="flex flex-col lg:flex-row gap-16 items-start relative pb-12">
        <div className="w-full lg:w-1/4 pt-12 sticky top-40">
          <h2 className="text-7xl font-serif mb-8 leading-[0.9] tracking-tighter">
            <SplitText text="Parisian" /><br />
            <span className="italic relative inline-block">
                <SplitText text="details" />
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ delay: 0.8, duration: 1 }} className="absolute -bottom-2 left-0 w-full h-1 bg-zinc-100 origin-left" />
            </span>
          </h2>
          <motion.p initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="text-zinc-400 text-xl mb-12 max-w-[280px] leading-[1.6]">
            A curated study of <span className="text-zinc-900 font-medium">uncompromising</span> craftsmanship.
          </motion.p>
          <div className="hidden lg:flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-300 font-bold">Catalogue Volume 01</span>
            <div className="w-32 h-[1px] bg-zinc-100 overflow-hidden"><motion.div className="h-full bg-zinc-900 origin-left" style={{ scaleX }} /></div>
          </div>
        </div>
        <div className="w-full lg:w-3/4 relative group/carousel">
          <div ref={scrollRef} className="flex gap-16 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 pt-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {fashionProducts.map((product, i) => (
              <SpotlightCard key={product.id} product={product} delay={i * 0.15} priority={i < 2} />
            ))}
          </div>
          <MagneticButton onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-zinc-200 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 -translate-x-1/2 hover:bg-black hover:text-white hover:border-black z-20"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19l-7-7 7-7" /></svg></MagneticButton>
          <MagneticButton onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm border border-zinc-200 flex items-center justify-center rounded-full shadow-lg opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 translate-x-1/2 hover:bg-black hover:text-white hover:border-black z-20"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5l7 7-7 7" /></svg></MagneticButton>
        </div>
      </div>
      <div className="relative w-full flex items-center justify-center group/feature mt-0 lg:mt-8">
        <motion.div className="relative w-[80%] lg:w-[55%] h-[500px] lg:h-[550px] grayscale contrast-[1.1] brightness-[0.85] hover:grayscale-0 overflow-hidden" initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ duration: 1.5 }}>
          <motion.div className="relative w-full h-full transition-transform duration-[3s] group-hover/feature:scale-105"><Image src="/lehengas.jpg" alt="Trench Coat Feature" fill sizes="(max-width: 1024px) 80vw, 55vw" className="object-cover" /></motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="relative z-10 bg-[#f8f6f3] w-[85%] lg:w-full max-w-[420px] p-12 lg:p-14 flex flex-col items-start text-left shadow-2xl -mt-20 lg:mt-0 lg:-ml-[15%]">
          <div className="mb-8 flex items-center gap-4 text-zinc-400"><div className="w-8 h-[1px] bg-zinc-300" /><span className="text-[9px] uppercase tracking-[0.4em] font-medium">Collection 01</span></div>
          <motion.h2 className="text-6xl lg:text-7xl font-light mb-8 leading-[1.1] tracking-tight text-zinc-900">Trench<br /><span className="font-serif italic font-normal">touch</span></motion.h2>
          <motion.p className="text-zinc-600 text-base lg:text-lg mb-12 leading-relaxed max-w-xs">Your storm-ready staple, from classic to edgy. Engineering the iconic silhouette for a new era.</motion.p>
          <button 
            onClick={() => document.getElementById('full-collection')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-zinc-900 text-xs uppercase tracking-[0.3em] font-bold border-b-[1px] border-zinc-900 pb-1 hover:text-zinc-500 hover:border-zinc-500 transition-all"
          >
            Shop Collection
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
}
