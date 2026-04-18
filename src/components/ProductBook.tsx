'use client';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Image from 'next/image';

import { useStore } from '@/context/StoreContext';
import { Modal } from './Modal';

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
            <Modal product={product} setIsOpen={setIsOpen} productPrice={productPrice} addToCart={addToCart}/>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}