'use client';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';

const PRODUCT_IMAGES = [
  '/saree1.jpeg',
  '/saree2.jpeg',
  '/kurti1.jpg',
  '/kurti2.jpg',
  '/kurti3.jpg',
  '/kurta1.jpg',
  '/kurta2.jpg',
  '/lehenga1.jpg',
  '/lehenga2.jpg',
  '/lehenga3.jpg',
];

interface SelectedProduct {
  id: string;
  title: string;
  price: string;
  image: string;
  category: string;
}

function buildCubies() {
  const arr: { x: number; y: number; z: number; images: string[] }[] = [];
  let imgIdx = 0;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;
        const images = Array.from({ length: 6 }, (_, i) =>
          PRODUCT_IMAGES[(imgIdx + i) % PRODUCT_IMAGES.length]
        );
        imgIdx = (imgIdx + 3) % PRODUCT_IMAGES.length;
        arr.push({ x, y, z, images });
      }
    }
  }
  return arr;
}

const STABLE_CUBIES = buildCubies();

function Cubie({ x, y, z, size, gap, images, onOpenModal }: { x: number; y: number; z: number; size: number; gap: number; images: string[], onOpenModal: (item: SelectedProduct) => void }) {
  const offset = size + gap;
  const translateX = x * offset;
  const translateY = y * offset;
  const translateZ = z * offset;

  const faces = [
    { dir: 'front',  show: z === 1,  rotate: 'rotateY(0deg)',   img: images[0] },
    { dir: 'back',   show: z === -1, rotate: 'rotateY(180deg)', img: images[1] },
    { dir: 'right',  show: x === 1,  rotate: 'rotateY(90deg)',  img: images[2] },
    { dir: 'left',   show: x === -1, rotate: 'rotateY(-90deg)', img: images[3] },
    { dir: 'top',    show: y === -1, rotate: 'rotateX(90deg)',  img: images[4] },
    { dir: 'bottom', show: y === 1,  rotate: 'rotateX(-90deg)', img: images[5] },
  ];

  return (
    <div 
      className="absolute"
      style={{ 
        width: size, 
        height: size, 
        transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px)`,
        transformStyle: 'preserve-3d'
      }}
    >
      {faces.map((f, i) => f.show && (
        <div 
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            // Open the modal instead of directly adding to cart
            onOpenModal({ 
                id: `mosaic-${x}-${y}-${z}-${f.dir}`, 
                title: 'Heritage Edit Piece', 
                category: 'Tactile Archive',
                price: '₹14,500', 
                image: f.img 
            });
          }}
          className="absolute inset-0 bg-zinc-900 border-[1px] border-black/50 overflow-hidden cursor-pointer"
          style={{ 
            transform: `${f.rotate} translateZ(${size/2}px)`,
            backfaceVisibility: 'hidden'
          }}
        >
          {f.img && (
            <div className="relative w-full h-full opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-500 group">
               <Image src={f.img} alt="Product" fill className="object-cover" sizes="150px" />
               <div className="absolute inset-x-0 bottom-0 bg-white/20 backdrop-blur-md h-0 group-hover:h-8 transition-all duration-300 flex items-center justify-center">
                  <span className="text-[8px] font-black tracking-widest text-black">+ VIEW</span>
               </div>
               <div className="absolute inset-0 border-[4px] border-black/20 pointer-events-none" />
            </div>
          )}
        </div>
      ))}
      <div className="absolute inset-0 bg-black/40" style={{ transform: 'translateZ(-1px)' }} />
    </div>
  );
}

export default function ProductMosaicCube() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const { addToCart } = useStore();

  // Modal State
  const [selectedItem, setSelectedItem] = useState<SelectedProduct | null>(null);

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.92, 1, 1, 0.92]);
  const yTranslate = useTransform(scrollYProgress, [0, 0.2], [60, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-180, 180]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [180, -180]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || selectedItem) return; // Disable rotation when modal is open
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedItem) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [selectedItem]);

  return (
    <>
      <motion.section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { mouseX.set(0); mouseY.set(0); }}
        style={{ opacity, scale, y: yTranslate, perspective: '1500px' }}
        className="h-[75vh] w-full bg-black relative flex flex-col items-center justify-center overflow-hidden pt-4 pb-8 origin-center"
      >
        <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
          <span className="text-[10px] uppercase tracking-[0.6em] text-[#C2B28F] font-bold mb-4 block">Snigdha Gallery</span>
          <h2 className="text-5xl font-serif text-[#FDFBF7] tracking-tighter">Tactile Archive</h2>
          <p className="mt-4 text-[#FDFBF7]/40 text-[10px] uppercase tracking-widest">Slide to rotate | Click face to explore</p>
        </div>

        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.05}
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="w-[300px] h-[300px] relative cursor-grab active:cursor-grabbing flex items-center justify-center"
        >
          <div className="relative" style={{ transformStyle: 'preserve-3d' }}>
            {STABLE_CUBIES.map((c, i) => (
              <Cubie key={i} x={c.x} y={c.y} z={c.z} size={100} gap={4} images={c.images} onOpenModal={setSelectedItem} />
            ))}
          </div>
        </motion.div>

        <div className="absolute bottom-6 right-[5vw] text-right">
          <p className="text-[10px] text-[#C2B28F]/60 uppercase tracking-widest font-black">Ref. 3x3x3_ARCHIVE_01</p>
        </div>
      </motion.section>

      {/* State-of-the-Art Responsive Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[999] flex items-end md:items-center justify-center p-0 md:p-6 lg:p-12">
            
            {/* Backdrop Blur Layer */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-[#1C1B19]/80 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Container */}
            <motion.div 
              // Slides up from the bottom on mobile, pops in the center on desktop
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 30, stiffness: 250 }}
              className="relative w-full md:max-w-5xl h-[85vh] md:h-[80vh] bg-[#FDFBF7] flex flex-col md:flex-row overflow-hidden rounded-t-3xl md:rounded-2xl shadow-2xl"
            >
              
              {/* Close Button - Responsive Positioning */}
              <button 
                onClick={() => setSelectedItem(null)} 
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 text-[#1C1B19]/50 hover:text-[#1C1B19] transition-colors uppercase text-[10px] font-bold tracking-widest flex items-center gap-2 bg-white/70 md:bg-transparent backdrop-blur-md md:backdrop-blur-none px-4 py-2 md:p-0 rounded-full md:rounded-none shadow-sm md:shadow-none"
              >
                 <span className="hidden md:inline">Close Archive</span>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              {/* Image Hero Section - Top on Mobile, Left on Desktop */}
              <div className="w-full h-[45%] md:w-1/2 md:h-full relative bg-[#F5F2EB] shrink-0">
                  <Image src={selectedItem.image} alt={selectedItem.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:hidden" />
                  <div className="absolute bottom-4 left-6 md:hidden">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-white drop-shadow-md">Aura Archive 0x{selectedItem.id.split('-')[1]}</span>
                  </div>
              </div>

              {/* Content Section */}
              <div className="w-full h-[55%] md:w-1/2 md:h-full p-6 md:p-12 lg:p-16 flex flex-col justify-start md:justify-center overflow-y-auto hide-scrollbar">
                  <span className="text-[10px] uppercase text-[#7A3E3E] tracking-[0.4em] mb-3 md:mb-4 font-bold">{selectedItem.category}</span>
                  
                  {/* Fluid Typography: scales nicely between mobile and desktop */}
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#1C1B19] mb-4 md:mb-8 tracking-tighter leading-none">
                    {selectedItem.title}
                  </h2>
                  
                  <p className="text-[#1C1B19]/70 text-sm md:text-base leading-relaxed max-w-md mb-8 md:mb-12 font-sans">
                     A profound exploration of texture and form. Drawn from the physical mosaic interface, this garment represents the intersection of digital discovery and centuries-old handloom weaving.
                  </p>
                  
                  {/* Action Area pushed to the bottom on mobile */}
                  <div className="space-y-6 md:space-y-8 mt-auto md:mt-0">
                     <div className="flex justify-between items-center py-4 border-y border-[#1C1B19]/10">
                        <span className="text-[#1C1B19]/50 text-[10px] uppercase tracking-widest font-bold">Pricing</span>
                        <span className="text-xl md:text-2xl font-mono text-[#1C1B19]">{selectedItem.price}</span>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <button 
                          onClick={() => { 
                            addToCart({ id: selectedItem.id, title: selectedItem.title, price: selectedItem.price, image: selectedItem.image }); 
                            setSelectedItem(null); 
                          }}
                          className="flex-1 py-4 md:py-5 bg-[#1C1B19] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#7A3E3E] transition-colors duration-500 shadow-xl"
                        >
                           Add to Wardrobe
                        </button>
                        <button className="px-6 md:px-8 py-4 md:py-5 border border-[#1C1B19]/20 text-[#1C1B19] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1C1B19]/5 transition-colors">
                           View Details
                        </button>
                     </div>
                  </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}