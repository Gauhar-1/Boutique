'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';
import { Modal } from './Modal';

export const CATEGORIES = [
  {
    title: 'Kurtas',
    accent: '#c9a96e',
    products: [
      { id: 'ku-1', name: 'Midnight Silk Kurta', price: '₹6,500', image: '/kurta1.jpg' },
      { id: 'ku-2', name: 'Ivory Chikankari Overlay', price: '₹7,200', image: '/kurta2.jpg' },
      { id: 'ku-3', name: 'Onyx Asymmetric Drape', price: '₹8,200', image: '/kurta3.jpg' },
      { id: 'ku-4', name: 'Nawab Angrakha Wrap', price: '₹11,500', image: '/kurta4.jpg' },
      { id: 'ku-5', name: 'Bengal Loom Short Kurta', price: '₹4,800', image: '/kurta5.jpg' },
      { id: 'ku-6', name: 'Mustard Linen Tunic', price: '₹5,100', image: '/kurta6.jpg' },
      { id: 'ku-7', name: 'Emerald Pathani Suit', price: '₹9,600', image: '/kurta7.jpg' },
      { id: 'ku-8', name: 'Maroon Velvet Kurta', price: '₹12,000', image: '/kurta8.jpg' },
      { id: 'ku-9', name: 'Pastel Zardozi Drape', price: '₹14,500', image: '/kurta9.jpg' },
      { id: 'ku-10', name: 'Charcoal Pleated Kurta', price: '₹7,800', image: '/kurta1.jpg' },
    ],
  },
  {
    title: 'Sarees',
    accent: '#a8b5a0',
    products: [
      { id: 'sa-1', name: 'Royal Baluchari Silk', price: '₹12,500', image: '/saree1.jpeg' },
      { id: 'sa-2', name: 'Midnight Dhakai Jamdani', price: '₹8,900', image: '/saree2.jpeg' },
      { id: 'sa-3', name: 'Heritage Kantha Stitch', price: '₹15,000', image: '/saree3.jpeg' },
      { id: 'sa-4', name: 'Ivory Organza Couture', price: '₹18,500', image: '/saree4.jpeg' },
      { id: 'sa-5', name: 'Golden Muga Heritage', price: '₹22,000', image: '/saree5.jpeg' },
      { id: 'sa-6', name: 'Crimson Tussar Georgette', price: '₹14,500', image: '/saree6.jpeg' },
      { id: 'sa-7', name: 'Banarasi Zari Brocade', price: '₹28,000', image: '/saree7.jpeg' },
      { id: 'sa-8', name: 'Kanjeevaram Temple Border', price: '₹35,000', image: '/saree8.jpeg' },
      { id: 'sa-9', name: 'Chanderi Pastel Drape', price: '₹9,200', image: '/saree1.jpeg' },
      { id: 'sa-10', name: 'Emerald Mysore Silk', price: '₹16,800', image: '/saree2.jpeg' },
    ],
  },
  {
    title: 'Lehengas',
    accent: '#8a7b6b',
    products: [
      { id: 'la-1', name: 'Crimson Bridal Lehenga', price: '₹85,000', image: '/lehenga1.jpg' },
      { id: 'la-2', name: 'Ivory Floral Organza', price: '₹42,000', image: '/lehenga2.jpg' },
      { id: 'la-3', name: 'Midnight Velvet Lehenga', price: '₹65,000', image: '/lehenga3.jpg' },
      { id: 'la-4', name: 'Pastel Mint Net Drape', price: '₹38,000', image: '/lehenga4.jpg' },
      { id: 'la-5', name: 'Rose Gold Sequin Set', price: '₹55,000', image: '/lehenga5.jpg' },
      { id: 'la-6', name: 'Mustard Haldi Lehenga', price: '₹28,500', image: '/lehenga6.jpg' },
      { id: 'la-7', name: 'Emerald Green Silk', price: '₹48,000', image: '/lehenga7.jpg' },
      { id: 'la-8', name: 'Blossom Chikankari', price: '₹52,000', image: '/lehenga8.jpg' },
      { id: 'la-9', name: 'Rusty Orange Handloom', price: '₹34,000', image: '/lehenga1.jpg' },
      { id: 'la-10', name: 'Champagne Zardozi Set', price: '₹95,000', image: '/lehenga2.jpg' },
    ],
  },
  {
    title: 'Kurtis',
    accent: '#b8a9c9',
    products: [
      { id: 'sh-1', name: 'Ivory Pearl Sherwani', price: '₹45,000', image: '/kurti1.jpg' },
      { id: 'sh-2', name: 'Royal Navy Velvet', price: '₹58,000', image: '/kurti2.jpg' },
      { id: 'sh-3', name: 'Gold Brocade Achkan', price: '₹62,000', image: '/kurti3.jpg' },
      { id: 'sh-4', name: 'Emerald Groom Sherwani', price: '₹75,000', image: '/kurti4.jpg' },
      { id: 'sh-5', name: 'Pastel Pink Floral', price: '₹48,000', image: '/kurti5.jpg' },
      { id: 'sh-6', name: 'Classic Black Jodhpuri', price: '₹38,000', image: '/kurti6.jpg' },
      { id: 'sh-7', name: 'Maroon Zardozi Classic', price: '₹82,000', image: '/kurti7.jpg' },
      { id: 'sh-8', name: 'Off-White Lucknowi', price: '₹54,000', image: '/kurti8.jpg' },
      { id: 'sh-9', name: 'Charcoal Indo-Western', price: '₹42,000', image: '/kurti1.jpg' },
      { id: 'sh-10', name: 'Mint Green Silk Drape', price: '₹56,000', image: '/kurti2.jpg' },
    ],
  },
];

export default function CategoryShowcase() {
  const { addToCart } = useStore();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

 // Safe Scroll Lock for Framer Motion Timeline Containers
  useEffect(() => {
    if (selectedProduct) {
      // Just hide the overflow. We cannot use position: fixed here 
      // because it breaks the parent's useScroll() math and causes the panel to slide away.
      document.body.style.overflow = 'hidden';
      // Fallback for iOS Safari which sometimes ignores overflow: hidden on the body
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    
    return () => { 
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [selectedProduct]);

  return (
    // FIX 1: Removed lg:h-screen and replaced with lg:h-screen for desktop only. 
    // For mobile (default), we let the height be 'auto' so it naturally flows down the page.
    <div id="full-collection" className="w-full min-h-screen lg:h-screen pt-20 lg:pt-28 pb-16 px-4 md:px-[5vw] flex flex-col bg-[#FDFBF7] text-[#1C1B19]">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mb-6 md:mb-12 text-center shrink-0"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C1B19] tracking-tighter">The Complete Archive</h2>
          <p className="text-[#1C1B19]/50 text-xs tracking-[0.3em] font-bold uppercase mt-4 hidden md:block">Curated Masterpieces</p>
        </motion.div>

        {/* ---------------- MOBILE & TABLET TABS ---------------- */}
        <div className="lg:hidden w-full overflow-x-auto scrollbar-hide mb-6 md:mb-8 sticky top-[60px] md:top-16 z-40 bg-[#FDFBF7]/95 backdrop-blur-md py-4 border-b border-[#C2B28F]/20">
           <div className="flex gap-6 md:gap-10 px-2 min-w-max justify-start sm:justify-center">
              {CATEGORIES.map((cat, i) => (
                 <button 
                   key={i}
                   onClick={() => setActiveCategoryIndex(i)}
                   className={`text-xs md:text-sm font-bold tracking-widest uppercase transition-all relative pb-2 ${activeCategoryIndex === i ? 'text-[#1C1B19]' : 'text-[#1C1B19]/40 hover:text-[#1C1B19]/70'}`}
                 >
                    {cat.title}
                    {activeCategoryIndex === i && (
                       <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 w-full h-[2px]" style={{ backgroundColor: cat.accent }} />
                    )}
                 </button>
              ))}
           </div>
        </div>

        {/* ---------------- MOBILE & TABLET PRODUCT GRID ---------------- */}
        {/* FIX 2: Removed 'overflow-y-auto' and 'flex-1' so the grid dictates its own height. 
            This forces the entire page to scroll naturally, rather than having a trapped scroll box. */}
        <div className="lg:hidden">
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeCategoryIndex}
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: -20 }}
               transition={{ duration: 0.3 }}
               className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 pb-12"
             >
                {CATEGORIES[activeCategoryIndex].products.map((prod, j) => (
                   <div 
                     key={j} 
                     onClick={() => setSelectedProduct({...prod, category: CATEGORIES[activeCategoryIndex].title, isDesktop: false})}
                     className="group relative cursor-pointer"
                   >
                      <div className="aspect-[3/4] relative bg-[#F5F2EB] overflow-hidden rounded-sm mb-3 border border-[#C2B28F]/20">
                         <motion.div layoutId={`product-image-${prod.id}`} className="absolute inset-0">
                            <Image 
                              src={prod.image} 
                              alt={prod.name} 
                              fill 
                              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" 
                              className="object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                         </motion.div>
                         <div className="absolute inset-0 bg-[#1C1B19]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="flex justify-between items-start">
                         <div>
                            <h4 className="text-sm md:text-base text-[#1C1B19] font-serif leading-tight pr-1">{prod.name}</h4>
                            <p className="text-[10px] md:text-xs text-[#1C1B19]/60 font-mono font-medium mt-1 md:mt-1.5">{prod.price}</p>
                         </div>
                         <div className="text-[#1C1B19]/30 mt-0.5 md:hidden">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                         </div>
                      </div>
                   </div>
                ))}
             </motion.div>
           </AnimatePresence>
        </div>


        {/* ---------------- DESKTOP 4-COLUMN GRID (Visible only on lg >= screens) ---------------- */}
        <div className="hidden lg:grid flex-1 lg:grid-cols-4 gap-8 xl:gap-12 min-h-0">
          {CATEGORIES.map((cat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex flex-col h-full overflow-hidden"
            >
               <div className="flex items-center gap-3 mb-6 shrink-0 border-b border-[#C2B28F]/20 pb-4">
                  <div className="w-6 h-[2px]" style={{ backgroundColor: cat.accent }} />
                  <h3 className="text-sm font-bold tracking-widest uppercase text-[#1C1B19]">{cat.title}</h3>
               </div>
               
               <div 
                 className="flex flex-col overflow-y-auto pr-2 gap-8 pb-12"
                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
               >
                  {cat.products.map((prod, j) => (
                     <div key={j} className="group relative shrink-0 w-full cursor-default">
                        <div className="aspect-[3/4] relative bg-[#F5F2EB] overflow-hidden rounded-sm mb-4 border border-[#C2B28F]/20">
                           <motion.div layoutId={`product-image-${prod.id}-desktop`} className="absolute inset-0">
                              <Image 
                                src={prod.image} alt={prod.name} fill sizes="25vw" 
                                className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                              />
                           </motion.div>
                           
                           <div className="absolute inset-0 bg-[#1C1B19]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                           
                           <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 bg-[#FDFBF7]/95 backdrop-blur-md flex-col gap-2 z-20 flex border-t border-[#C2B28F]/30">
                              <button 
                                onClick={(e) => { e.stopPropagation(); addToCart({ id: prod.id, title: prod.name, price: prod.price, image: prod.image }); }}
                                className="w-full py-3.5 bg-[#1C1B19] text-[#FDFBF7] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#7A3E3E] transition-colors shadow-sm"
                              >
                                 + Add to Bag
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedProduct({...prod, category: cat.title, isDesktop: true}); }}
                                className="w-full py-3.5 border border-[#1C1B19]/20 text-[#1C1B19] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-[#1C1B19]/5 transition-colors"
                              >
                                 Explore Detail
                              </button>
                           </div>
                        </div>

                        <div className="block">
                           <h4 className="text-base lg:text-lg text-[#1C1B19] font-serif leading-tight group-hover:text-[#7A3E3E] transition-colors pr-2">{prod.name}</h4>
                           <p className="text-xs text-[#1C1B19]/60 font-mono font-medium mt-1.5">{prod.price}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </motion.div>
          ))}
        </div>

        {/* ---------------- STATE-OF-THE-ART QUICK VIEW MODAL ---------------- */}
        <AnimatePresence>
          {selectedProduct && (
            <Modal addToCart={addToCart} product={selectedProduct} setIsOpen={setSelectedProduct} productPrice={selectedProduct.price}/>
          )}
        </AnimatePresence>
    </div>
  );
}