'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';

import { useStore } from '@/context/StoreContext';

// Tiny base64 BlurHash/LQIP placeholder
const BLUR_PLACEHOLDER = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88OjxfwAJ4wPNyY9m4wAAAABJRU5ErkJggg==";

export default function ProductBook({ product, index }: { product: any, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToCart } = useStore();

  useEffect(() => {
    setMounted(true);
    // Lock body scroll when modal is open to prevent background scrolling on mobile
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: '600px 0px 600px 0px', once: false });

  // Use the product's actual price, or fallback to a luxury INR value
  const productPrice = product?.price || "₹14,500";

  return (
    <>
      {/* ---------------- GALLERY CARD STATE ---------------- */}
      <motion.div
        ref={cardRef}
        layoutId={`book-container-${product.id}`}
        onClick={() => setIsOpen(true)}
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        // Responsive card sizing: slightly narrower on mobile to show hint of next card
        className="w-[260px] sm:w-[280px] md:w-[320px] h-[380px] sm:h-[400px] md:h-[450px] bg-[#F5F2EB] rounded-sm cursor-pointer relative group perspective-[1500px] shadow-lg hover:shadow-2xl transition-shadow duration-500 overflow-hidden border border-[#C2B28F]/20"
      >
        {isInView ? (
          <div className="absolute inset-0 bg-[#1C1B19] group-hover:scale-105 transition-transform duration-[1.5s] ease-out origin-bottom overflow-hidden">
               <Image 
                 src={product.image} 
                 alt={product.title}
                 fill
                 sizes="(max-width: 768px) 100vw, 320px"
                 className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-700"
                 placeholder="blur"
                 blurDataURL={BLUR_PLACEHOLDER}
                 loading="lazy"
               />
               
               {/* Elegant Image Overlay Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/80 via-transparent to-transparent pointer-events-none" />

               {/* Hover State Indicator - Hidden on touch devices naturally */}
               <AnimatePresence>
                 {isHovered && (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                     className="absolute bottom-4 right-4 z-20 flex items-center gap-2 bg-[#FDFBF7]/90 backdrop-blur-md px-4 py-1.5 rounded-sm shadow-lg border border-[#C2B28F]/30"
                   >
                     <span className="text-[9px] text-[#1C1B19] font-bold uppercase tracking-[0.3em]">Open Lookbook</span>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
        ) : (
          <div className="absolute inset-0 bg-[#F5F2EB] border border-[#C2B28F]/20" />
        )}

        <div className="absolute inset-0 p-4 md:p-6 flex flex-col justify-between z-10 pointer-events-none">
          <span className="text-[8px] bg-[#1C1B19]/40 backdrop-blur-md w-fit px-3 py-1 rounded-sm uppercase tracking-[0.4em] font-bold text-[#FDFBF7] shadow-sm border border-[#FDFBF7]/10">
             {product.category || "Archive"}
          </span>
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#FDFBF7] drop-shadow-md leading-tight">{product.title}</h3>
        </div>
      </motion.div>

      {/* ---------------- MODAL/LOOKBOOK STATE ---------------- */}
      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-[#1C1B19]/90 backdrop-blur-md cursor-pointer"
              />

              {/* Book Container */}
              <motion.div
                layoutId={`book-container-${product.id}`}
                transition={{ layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                // Fully responsive container: snaps to bottom on mobile, centers on desktop
                className="relative w-full md:w-[85vw] lg:w-[75vw] max-w-6xl h-[90vh] md:h-[85vh] bg-[#FDFBF7] rounded-t-3xl md:rounded-sm z-[210] flex flex-col md:flex-row overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
              >
                
                {/* Left Page (Image Cover) */}
                <div className="w-full h-[40vh] md:h-full md:w-1/2 relative perspective-[2000px] shrink-0 border-b md:border-b-0 md:border-r border-[#C2B28F]/30 bg-[#F5F2EB]">
                  
                  {/* The "Page Turn" Animation - Desktop Only */}
                  <motion.div 
                    initial={{ rotateY: 0 }} animate={{ rotateY: -180 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: "left" }}
                    className="absolute inset-0 bg-[#1C1B19] z-20 shadow-2xl hidden md:block"
                  />
                  
                  <div className="absolute inset-0">
                    <Image src={product.image} alt={product.title} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/40 via-transparent to-transparent md:bg-black/10" />
                  </div>
                </div>

                {/* Right Page (Content) */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                  className="w-full flex-1 md:h-full md:w-1/2 p-6 md:p-12 lg:p-16 flex flex-col justify-start md:justify-center bg-[#FDFBF7] overflow-y-auto hide-scrollbar relative"
                >
                  <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 text-[10px] uppercase tracking-[0.3em] font-bold text-[#1C1B19]/40 hover:text-[#1C1B19] transition-colors flex items-center gap-2 bg-white/50 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-2 md:p-0 rounded-full md:rounded-none z-50">
                     <span className="hidden md:inline">Close</span> 
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-[#7A3E3E] mb-3 md:mb-4 mt-2 md:mt-0 block">
                     Collection Vol. 1
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.05] text-[#1C1B19] tracking-tight">{product.title}</h2>
                  
                  <p className="mt-4 md:mt-6 text-[#1C1B19]/70 text-sm md:text-base leading-relaxed max-w-md font-sans">
                     Discover the pinnacle of Indian artisanal luxury. The {product.title} is meticulously hand-crafted to offer a sensory experience that transcends traditional boundaries, weaving heritage into modern fluidity.
                  </p>
                  
                  <div className="mt-8 md:mt-auto pt-6 md:pt-8 border-t border-[#C2B28F]/20">
                    <span className="text-2xl md:text-3xl font-mono text-[#1C1B19]">{productPrice}</span>
                    
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 md:gap-4">
                      <button 
                        onClick={() => {
                          addToCart({ id: `book-${product.id}`, title: product.title, price: productPrice, image: product.image });
                          setIsOpen(false);
                        }}
                        className="flex-1 py-4 md:py-5 bg-[#1C1B19] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#7A3E3E] transition-colors shadow-lg"
                      >
                          Secure This Piece
                      </button>
                      <button className="px-6 md:px-8 py-4 md:py-5 border border-[#1C1B19]/20 text-[#1C1B19] text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#1C1B19]/5 transition-colors">
                          Details
                      </button>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}