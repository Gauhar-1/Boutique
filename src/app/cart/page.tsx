'use client';

import { useStore } from '@/context/StoreContext';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useStore();
  
  // Updated for Indian context
  const shipping = cartTotal > 0 ? 500.00 : 0; // Flat ₹500 shipping if cart is not empty
  const tax = cartTotal * 0.12; // 12% GST simulation for high-end apparel
  const grandTotal = cartTotal + shipping + tax;

  // Helper function to format INR cleanly
  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    // Applied Quiet Luxury background and text colors
    <main className="min-h-screen bg-[#FDFBF7] text-[#1C1B19] selection:bg-[#7A3E3E] selection:text-[#FDFBF7]">
      <Navbar />
      
      <section className="pt-28 md:pt-36 pb-20 px-4 md:px-[5vw] max-w-7xl mx-auto min-h-[80vh]">
        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4 mb-10 md:mb-16 border-b border-[#C2B28F]/30 pb-6">
           <h1 className="text-4xl md:text-6xl font-serif tracking-tighter text-[#1C1B19]">The Archive</h1>
           <span className="text-xs md:text-sm font-mono text-[#7A3E3E] md:mb-2 tracking-widest uppercase font-semibold">[{cart.length} Pieces]</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* ---------------- PRODUCT LIST ---------------- */}
          <div className="flex-1 space-y-8 md:space-y-12">
            <AnimatePresence mode='popLayout'>
              {cart.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="py-16 md:py-20 text-center bg-[#F5F2EB] rounded-sm border border-[#C2B28F]/20"
                >
                  <p className="text-[#1C1B19]/50 font-bold text-sm md:text-base mb-8 uppercase tracking-[0.3em]">Your archive is currently empty.</p>
                  <Link href="/#full-collection" className="inline-block px-8 py-4 bg-[#1C1B19] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#7A3E3E] transition-colors shadow-lg rounded-sm">
                    Continue Exploration
                  </Link>
                </motion.div>
              ) : (
                cart.map((item: any) => (
                  <motion.div 
                    layout
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    className="flex flex-col sm:flex-row gap-6 md:gap-8 pb-8 md:pb-12 border-b border-[#C2B28F]/20 group"
                  >
                    {/* Item Image */}
                    <div className="w-full sm:w-40 md:w-48 aspect-[3/4] relative bg-[#F5F2EB] overflow-hidden shrink-0 rounded-sm border border-[#C2B28F]/20">
                       <Image src={item.image} alt={item.title} fill className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105" />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 flex flex-col py-1 md:py-2">
                       <div className="flex justify-between items-start mb-2 md:mb-4">
                          <div>
                             <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-[#C2B28F] font-bold block mb-1 md:mb-2">Item Ref. 0x{item.id.replace('book-', '').replace('showcase-', '')}</span>
                             <h3 className="text-2xl md:text-3xl font-serif tracking-tight text-[#1C1B19] pr-4">{item.title}</h3>
                          </div>
                          {/* Remove Button */}
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#1C1B19]/30 hover:text-[#7A3E3E] transition-colors p-2 -mr-2 md:p-0 md:mr-0"
                            aria-label="Remove item"
                          >
                             <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                       </div>
                       
                       <p className="text-[#1C1B19]/60 max-w-sm text-xs md:text-sm leading-relaxed mb-6 md:mb-8 font-sans hidden sm:block">
                          Handcrafted with precision. This archival piece features premium Indian textiles and the signature Snigdha Boutique silhouette.
                       </p>

                       {/* Quantity & Price Controls */}
                       <div className="mt-auto flex flex-wrap items-end sm:items-center justify-between gap-4 md:gap-6">
                          <div className="flex items-center border border-[#1C1B19]/20 rounded-sm bg-[#FDFBF7]">
                             <button onClick={() => updateQuantity(item.id, -1)} className="px-4 py-2 md:px-5 md:py-2.5 text-[#1C1B19]/50 hover:text-[#1C1B19] hover:bg-[#1C1B19]/5 transition-colors">-</button>
                             <span className="px-3 md:px-4 py-2 md:py-2.5 text-xs font-mono font-medium border-x border-[#1C1B19]/10">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, 1)} className="px-4 py-2 md:px-5 md:py-2.5 text-[#1C1B19]/50 hover:text-[#1C1B19] hover:bg-[#1C1B19]/5 transition-colors">+</button>
                          </div>
                          
                          {/* Ensure we extract the numerical value if price is passed as a string with '₹' or '€' */}
                          <span className="text-xl md:text-2xl font-mono text-[#1C1B19] font-medium">
                            {/* Assuming item.price is passed from context. If it's a string like "₹14,500", just render it. If it needs formatting, format it. */}
                            {typeof item.price === 'string' ? item.price.replace('€', '₹') : formatINR(item.price)}
                          </span>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* ---------------- DETAILED BILL SUMMARY ---------------- */}
          {cart.length > 0 && (
            <div className="w-full lg:w-[420px] shrink-0">
               <div className="bg-[#F5F2EB] p-6 md:p-10 sticky top-32 rounded-sm border border-[#C2B28F]/30 shadow-[0_20px_40px_rgba(28,27,25,0.05)]">
                  <h2 className="text-[10px] uppercase font-bold tracking-[0.4em] text-[#1C1B19] mb-8 border-b border-[#C2B28F]/30 pb-4">Detailed Bill Recap</h2>
                  
                  <div className="space-y-4 md:space-y-6 mb-10">
                     <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-[#1C1B19]/60 uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-bold">Subtotal</span>
                        <span className="font-mono text-[#1C1B19] font-medium">{formatINR(cartTotal)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-[#1C1B19]/60 uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-bold">Shipping (Expedited)</span>
                        <span className="font-mono text-[#1C1B19] font-medium">{formatINR(shipping)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs md:text-sm">
                        <span className="text-[#1C1B19]/60 uppercase tracking-[0.2em] text-[9px] md:text-[10px] font-bold">GST (Estimated 12%)</span>
                        <span className="font-mono text-[#1C1B19] font-medium">{formatINR(tax)}</span>
                     </div>
                     <div className="pt-6 border-t border-[#C2B28F]/30 flex justify-between items-end md:items-center">
                        <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-black text-[#1C1B19]">Total Amount</span>
                        <span className="text-2xl md:text-3xl font-mono text-[#7A3E3E] font-medium">{formatINR(grandTotal)}</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <button className="w-full py-4 md:py-5 bg-[#1C1B19] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#7A3E3E] transition-all shadow-lg rounded-sm">
                        Proceed to Payment
                     </button>
                     <button className="w-full py-4 md:py-5 border border-[#1C1B19]/20 text-[#1C1B19] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-[#1C1B19]/5 transition-all rounded-sm flex items-center justify-center gap-2">
                        {/* Placeholder for UPI icon in Indian context */}
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"/><path d="M3 10h18"/><path d="M7 15h.01"/><path d="M11 15h2"/></svg>
                        Pay with UPI / Cards
                     </button>
                  </div>

                  <p className="mt-8 text-[8px] md:text-[9px] text-[#1C1B19]/50 leading-relaxed uppercase tracking-[0.2em] text-center font-bold">
                     Free returns within 7 days of receipt. All items are delivered with a Snigdha authenticity certificate.
                  </p>
               </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}