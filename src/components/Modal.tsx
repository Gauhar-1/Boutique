'use client';

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // <-- REQUIRED IMPORT

// Ensure this matches your Showcase types
interface Product {
    id: string | number;
    title?: string;
    name?: string;
    price?: string;
    image: string;
    category?: string;
}

interface ModalProps {
    product: Product;
    setIsOpen: (isOpen: any) => void;
    productPrice: string;
    addToCart: (item: { id: string; title: string; price: string; image: string }) => void;
}

export const Modal = ({ product, setIsOpen, productPrice, addToCart }: ModalProps) => {
    const [isFullscreenImage, setIsFullscreenImage] = useState(false);
    
    // Safety state to prevent Next.js Server-Side Rendering (SSR) crashes
    const [mounted, setMounted] = useState(false); 

    useEffect(() => {
        setMounted(true); // Tells React we are now safe in the browser
        
        // Lock background scroll
        document.body.style.overflow = 'hidden'; 
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    // Do NOT render anything on the server. Wait for the browser.
    if (!mounted) return null;

    // Handle name/title fallback depending on where the data came from
    const displayTitle = product.title || product.name || "Masterpiece";

    // IMPORTANT: createPortal function wraps the entire div, and document.body is the second argument
    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
              
              {/* 1. Backdrop Blur */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.3 } }}
                onClick={() => setIsOpen(false)}
                className="absolute inset-0 bg-[#1C1B19]/90 backdrop-blur-md cursor-pointer"
              />

              {/* 2. Main Modal Container */}
              <motion.div
                layoutId={`book-container-${product.id}`}
                transition={{ layout: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
                className="relative w-full md:w-[85vw] lg:w-[75vw] max-w-6xl h-[92dvh] md:h-[85vh] bg-[#FDFBF7] rounded-t-3xl md:rounded-sm z-[210] flex flex-col md:flex-row overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)]"
              >
                
                {/* Left Page (Image Cover) */}
                <div className="w-full min-h-[40dvh] md:min-h-full md:w-1/2 relative perspective-[2000px] shrink-0 border-b md:border-b-0 md:border-r border-[#C2B28F]/30 bg-[#F5F2EB] group">
                  
                  <motion.div 
                    initial={{ rotateY: 0 }} animate={{ rotateY: -180 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    style={{ transformOrigin: "left" }}
                    className="absolute inset-0 bg-[#1C1B19] z-20 shadow-2xl hidden md:block"
                  />
                  
                  <div className="absolute inset-0">
                    <Image src={product.image} alt={displayTitle} fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/40 via-transparent to-transparent md:bg-black/10 pointer-events-none" />
                  </div>

                  {/* Detail View / Fullscreen Trigger Button */}
                  <button 
                    onClick={() => setIsFullscreenImage(true)}
                    className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 z-20 flex items-center gap-2 bg-[#FDFBF7]/90 backdrop-blur-md px-4 py-2 rounded-sm shadow-lg border border-[#C2B28F]/30 text-[#1C1B19] hover:bg-[#1C1B19] hover:text-[#FDFBF7] transition-colors group/btn"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" /></svg>
                    <span className="text-[9px] uppercase tracking-[0.2em] font-bold">Inspect Detail</span>
                  </button>
                </div>

                {/* Right Page (Scrollable Content) */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
                  className="w-full flex-1 md:h-full md:w-1/2 p-6 pb-12 md:p-12 lg:p-16 flex flex-col justify-start md:justify-center bg-[#FDFBF7] overflow-y-auto overscroll-contain hide-scrollbar relative"
                >
                  <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 md:top-8 md:right-8 text-[10px] uppercase tracking-[0.3em] font-bold text-[#1C1B19]/40 hover:text-[#1C1B19] transition-colors flex items-center gap-2 bg-[#FDFBF7]/80 md:bg-transparent backdrop-blur-md md:backdrop-blur-none p-2.5 md:p-0 rounded-full md:rounded-none z-50 shadow-sm md:shadow-none">
                     <span className="hidden md:inline">Close Archive</span> 
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  
                  <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] font-bold text-[#7A3E3E] mb-3 md:mb-4 mt-2 md:mt-0 block">
                     {product.category || 'Curated Masterpiece'}
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif leading-[1.05] text-[#1C1B19] tracking-tight">{displayTitle}</h2>
                  
                  <p className="mt-4 md:mt-6 text-[#1C1B19]/70 text-sm md:text-base leading-relaxed max-w-md font-sans">
                     Discover the pinnacle of Indian artisanal luxury. The {displayTitle} is meticulously hand-crafted to offer a sensory experience that transcends traditional boundaries, weaving heritage into modern fluidity.
                  </p>
                  
                  <div className="mt-8 md:mt-auto pt-6 md:pt-8 border-t border-[#C2B28F]/20">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[#1C1B19]/60 text-[10px] uppercase tracking-widest font-bold">Investment</span>
                        <span className="text-2xl md:text-3xl font-mono text-[#1C1B19] font-medium">{productPrice}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                      <button 
                        onClick={() => {
                          addToCart({ id: String(product.id), title: displayTitle, price: productPrice, image: product.image });
                          setIsOpen(false);
                        }}
                        className="flex-1 py-4 md:py-5 bg-[#1C1B19] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#7A3E3E] transition-colors shadow-lg"
                      >
                          Secure This Piece
                      </button>
                      <button className="px-6 md:px-8 py-4 md:py-5 border border-[#1C1B19]/20 text-[#1C1B19] text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#1C1B19]/5 transition-colors">
                          Detailed Specs
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* 3. Fullscreen Image Lightbox Layer (Z-Index 300) */}
              <AnimatePresence>
                {isFullscreenImage && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[300] bg-[#1C1B19]/95 backdrop-blur-2xl flex items-center justify-center cursor-zoom-out p-2 md:p-8"
                    onClick={() => setIsFullscreenImage(false)}
                  >
                    <button 
                      className="absolute top-6 right-6 md:top-10 md:right-10 z-[310] text-[#FDFBF7]/60 hover:text-[#FDFBF7] transition-colors flex items-center gap-2 uppercase text-[10px] font-bold tracking-[0.3em]"
                    >
                      <span className="hidden md:inline">Return</span>
                      <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>

                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="relative w-full h-full max-w-5xl"
                      onClick={(e) => e.stopPropagation()} // Prevents clicking the image from closing the lightbox
                    >
                       <Image 
                         src={product.image} 
                         alt={`Detailed view of ${displayTitle}`} 
                         fill 
                         sizes="100vw"
                         className="object-contain drop-shadow-2xl" 
                         quality={100} 
                       />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
        </div>,
        document.body // <-- Second argument of createPortal
    );
}