'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/context/StoreContext';

const NAV_LINKS = [
  { name: 'Bridal Archive', href: '#bridal' },
  { name: 'The Heritage Edit', href: '#heritage' },
  { name: 'Menswear', href: '#mens' },
  { name: 'Studio', href: '#studio' },
  { name: 'Collections', href: '#full-collection' }, // Added for direct access
];

const SEARCH_CATEGORIES = ['All', 'Lehengas', 'Sarees', 'Kurtas', 'Sherwanis', 'Accessories'];
const SORT_OPTIONS = ['Newest Arrivals', 'Price: Ascending', 'Price: Descending', 'Curator\'s Pick'];

export default function Navbar() {
  const router = useRouter();
  
  // UI States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isHidden, setIsHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  const { user, login, logout, cart, removeFromCart, updateQuantity, cartTotal } = useStore();

  // Scroll detection for Frosted Glass effect & Hiding nav
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setIsHidden(true);
      setIsProfileOpen(false); 
    } else {
      setIsHidden(false);
    }
    setIsScrolled(latest > 50);
  });

  const cartCount = cart.reduce((a: number, b: any) => a + b.quantity, 0);
  const shipping = 500.00;
  const total = cartTotal + shipping;

  const handleLoginSim = () => {
    login({ name: 'Snigdha Client', email: 'client@snigdha.com' });
    setIsProfileOpen(false);
  };

  // Master Navigation Handler: Closes all overlays and routes smoothly
  const handleNavigation = (href: string) => {
    setIsSearchOpen(false);
    setIsMobileMenuOpen(false);
    setIsCartOpen(false);
    setIsProfileOpen(false);
    router.push(href);
  };

  return (
    <>
      {/* Top Hover Trigger Zone */}
      <div 
        onMouseEnter={() => setIsHidden(false)}
        className="fixed top-0 left-0 w-full h-8 z-[110] pointer-events-auto"
      />

      <motion.nav
        variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
        animate={isHidden ? 'hidden' : 'visible'}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} 
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-700 ${
          isScrolled || isSearchOpen || isCartOpen || isProfileOpen || isMobileMenuOpen
            ? 'bg-[#FDFBF7]/90 backdrop-blur-xl border-b border-[#C2B28F]/20 shadow-[0_4px_30px_rgba(28,27,25,0.05)] py-2' 
            : 'bg-transparent py-4 md:py-6'
        }`}
      >
        <div className="px-[5vw] h-14 md:h-16 flex items-center justify-between">
          
          {/* LEFT: Desktop Links & Mobile Hamburger */}
          <div className="flex-1 flex items-center justify-start">
            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
              {NAV_LINKS.slice(0, 4).map((link) => (
                <button 
                  key={link.name} 
                  onClick={() => handleNavigation(link.href)}
                  className="group relative text-[10px] uppercase tracking-[0.3em] font-bold text-[#1C1B19]/70 hover:text-[#1C1B19] transition-colors py-2"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 w-0 h-[1px] bg-[#7A3E3E] group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out" />
                </button>
              ))}
            </div>

            {/* Mobile Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden group flex flex-col gap-1.5 p-2 -ml-2"
            >
              <span className="w-6 h-[1.5px] bg-[#1C1B19]/80 transition-all group-hover:bg-[#1C1B19]" />
              <span className="w-4 h-[1.5px] bg-[#1C1B19]/80 transition-all group-hover:w-6 group-hover:bg-[#1C1B19]" />
            </button>
          </div>

          {/* CENTER: Logo */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center relative z-[105]">
            <button onClick={() => handleNavigation('/')} className="text-2xl md:text-3xl font-serif tracking-tight text-[#1C1B19]">
              Snigdha
            </button>
            {isScrolled && (
                <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="text-[7px] md:text-[8px] uppercase tracking-[0.4em] text-[#C2B28F] mt-0.5 hidden md:block"
                >
                    Boutique
                </motion.span>
            )}
          </div>

          {/* RIGHT: Actions */}
          <div className="flex-1 flex items-center justify-end gap-4 md:gap-6 lg:gap-8">
            <button onClick={() => setIsSearchOpen(true)} className="group flex items-center gap-2 md:gap-3">
              <span className="hidden lg:block text-[9px] uppercase tracking-[0.2em] font-bold text-[#1C1B19]/50 group-hover:text-[#1C1B19] transition-colors">Search</span>
              <svg className="w-4 h-4 md:w-5 md:h-5 text-[#1C1B19]/80 group-hover:text-[#1C1B19] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Profile Portal (Hidden on smallest mobile, moved to menu) */}
            <div className="relative hidden sm:block">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-[#1C1B19]/15 flex items-center justify-center hover:bg-[#1C1B19]/5 hover:border-[#1C1B19]/40 group transition-all"
              >
                <svg className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${user ? 'text-[#7A3E3E]' : 'text-[#1C1B19]/80 group-hover:text-[#1C1B19]'}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-64 bg-[#FDFBF7] border border-[#C2B28F]/30 rounded-sm p-6 shadow-[0_20px_40px_rgba(28,27,25,0.1)]"
                  >
                    {user ? (
                      <div className="space-y-4">
                        <div className="pb-4 border-b border-[#1C1B19]/10">
                          <p className="text-xs font-serif text-[#1C1B19]">{user.name}</p>
                          <p className="text-[10px] text-[#1C1B19]/50 font-mono mt-1">{user.email}</p>
                        </div>
                        <ul className="space-y-3">
                          <li><button className="text-[10px] uppercase tracking-widest text-[#1C1B19]/70 hover:text-[#7A3E3E] transition-colors block w-full text-left">Orders</button></li>
                          <li><button className="text-[10px] uppercase tracking-widest text-[#1C1B19]/70 hover:text-[#7A3E3E] transition-colors block w-full text-left">Wishlist</button></li>
                        </ul>
                        <button onClick={logout} className="w-full pt-4 border-t border-[#1C1B19]/10 text-[10px] uppercase tracking-[0.3em] font-bold text-[#7A3E3E] hover:text-[#1C1B19] transition-colors text-left">
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4 text-center">
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#C2B28F] mb-4">Snigdha Client</p>
                        <button onClick={handleLoginSim} className="w-full py-3 bg-[#1C1B19] text-[#FDFBF7] text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#7A3E3E] transition-colors shadow-lg">
                          Sign In
                        </button>
                        <button className="w-full py-3 border border-[#1C1B19]/20 text-[#1C1B19] text-[10px] font-bold uppercase tracking-[0.3em] rounded-sm hover:bg-[#1C1B19]/5 transition-all">
                          Register
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart Portal */}
            <button onClick={() => setIsCartOpen(true)} className="relative group p-1">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-[#1C1B19]/80 group-hover:text-[#1C1B19] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 rounded-full bg-[#7A3E3E] text-[#FDFBF7] text-[7px] md:text-[8px] font-black flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ---------------- MOBILE MENU OVERLAY ---------------- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[120] bg-[#FDFBF7] flex flex-col px-[5vw] pt-24 pb-8 overflow-y-auto lg:hidden"
          >
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-6 right-[5vw] p-2 text-[#1C1B19]/60 hover:text-[#1C1B19]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex flex-col gap-6 mt-8">
              {NAV_LINKS.map((link, i) => (
                <motion.button 
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.1 }}
                  onClick={() => handleNavigation(link.href)}
                  className="text-3xl font-serif text-[#1C1B19] text-left hover:text-[#7A3E3E] transition-colors"
                >
                  {link.name}
                </motion.button>
              ))}
            </div>

            <div className="mt-auto pt-12 border-t border-[#1C1B19]/10">
              <div className="flex items-center gap-4 text-[#1C1B19]/60">
                 {!user ? (
                   <button onClick={handleLoginSim} className="text-[10px] uppercase tracking-widest font-bold">Client Sign In</button>
                 ) : (
                   <button onClick={logout} className="text-[10px] uppercase tracking-widest font-bold text-[#7A3E3E]">Sign Out</button>
                 )}
                 <span className="w-1 h-1 rounded-full bg-[#1C1B19]/20" />
                 <button className="text-[10px] uppercase tracking-widest font-bold">Customer Care</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------- CART DRAWER ---------------- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-[130] bg-[#1C1B19]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed top-0 right-0 z-[140] w-full max-w-md h-full bg-[#FDFBF7] shadow-[-20px_0_50px_rgba(28,27,25,0.1)] flex flex-col p-6 md:p-8"
            >
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#C2B28F]/30">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-[#1C1B19] tracking-tight">The Archive</h2>
                  <span className="text-[9px] font-bold bg-[#1C1B19] text-[#FDFBF7] px-2 py-0.5 uppercase tracking-widest rounded-sm">{cartCount} items</span>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="group flex items-center gap-2 text-[#1C1B19]/50 hover:text-[#1C1B19] transition-colors p-1">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-6 md:space-y-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-[#1C1B19]/30">
                    <svg className="w-12 h-12 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                    <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-center">Your Archive is empty</p>
                  </div>
                ) : (
                  cart.map((item: any) => (
                    <div key={item.id} className="flex gap-4 md:gap-6 group">
                      <div className="w-20 h-28 md:w-24 md:h-32 relative bg-[#F5F2EB] overflow-hidden rounded-sm shrink-0 border border-[#C2B28F]/20">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 flex flex-col pt-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xs md:text-sm font-serif text-[#1C1B19] leading-tight pr-2">{item.title}</h3>
                          <button onClick={() => removeFromCart(item.id)} className="text-[#1C1B19]/40 hover:text-[#7A3E3E] transition-colors p-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                        </div>
                        <p className="text-[10px] md:text-[11px] text-[#7A3E3E] font-mono font-medium mb-3 md:mb-4">{item.price}</p>
                        <div className="mt-auto flex items-center border border-[#1C1B19]/20 w-fit rounded-sm overflow-hidden bg-white">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1.5 text-[#1C1B19]/50 hover:text-[#1C1B19] hover:bg-[#1C1B19]/5">-</button>
                          <span className="px-3 py-1.5 text-[10px] md:text-[11px] text-[#1C1B19] font-mono font-medium">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1.5 text-[#1C1B19]/50 hover:text-[#1C1B19] hover:bg-[#1C1B19]/5">+</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-[#C2B28F]/30 space-y-4">
                  <div className="space-y-2 md:space-y-3">
                    <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest text-[#1C1B19]/60 font-bold">
                      <span>Subtotal</span>
                      <span className="font-mono text-[#1C1B19]">₹{cartTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase tracking-widest text-[#1C1B19]/60 font-bold">
                      <span>Shipping (Estimated)</span>
                      <span className="font-mono text-[#1C1B19]">₹{shipping.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#1C1B19]/10">
                      <span className="text-xs uppercase tracking-[0.4em] font-black text-[#1C1B19]">Total</span>
                      <span className="text-xl md:text-2xl font-mono text-[#7A3E3E]">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleNavigation('/cart')}
                    className="w-full py-4 md:py-5 bg-[#1C1B19] text-[#FDFBF7] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#7A3E3E] transition-colors mt-4 md:mt-6 text-center shadow-lg rounded-sm"
                  >
                    Secure Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---------------- SEARCH OVERLAY ---------------- */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} 
            className="fixed inset-0 z-[130] bg-[#FDFBF7]/95 backdrop-blur-2xl overflow-y-auto"
          >
            <div className="relative min-h-full flex flex-col px-[5vw] pt-20 md:pt-24 lg:pt-32 pb-16 max-w-7xl mx-auto">
              
              <button onClick={() => setIsSearchOpen(false)} className="absolute top-6 right-[5vw] group flex items-center gap-2 md:gap-3 text-[#1C1B19]/50 hover:text-[#1C1B19] transition-colors">
                <span className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-bold">Close</span>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#1C1B19]/20 flex items-center justify-center group-hover:border-[#1C1B19]">
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
              </button>

              <motion.div 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.4 }}
                className="mb-10 md:mb-16 mt-8 md:mt-0"
              >
                <input 
                   autoFocus 
                   type="text" 
                   placeholder="Discover the collection..." 
                   onKeyDown={(e) => e.key === 'Enter' && handleNavigation('/#full-collection')}
                   className="w-full bg-transparent border-b-2 border-[#C2B28F]/30 pb-4 md:pb-6 text-3xl md:text-5xl lg:text-7xl font-serif text-[#1C1B19] outline-none placeholder:text-[#1C1B19]/20 focus:border-[#7A3E3E] transition-colors" 
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 lg:gap-24 flex-1">
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                  <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#C2B28F] font-bold mb-4 md:mb-6">Explore By Category</h3>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {SEARCH_CATEGORIES.map((cat) => (
                      <button 
                        key={cat} 
                        onClick={() => handleNavigation('/#full-collection')}
                        className="px-4 md:px-5 py-2 md:py-3 rounded-full border border-[#1C1B19]/10 text-[10px] md:text-xs font-medium text-[#1C1B19]/70 hover:text-[#FDFBF7] hover:bg-[#1C1B19] hover:border-[#1C1B19] transition-all shadow-sm"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#C2B28F] font-bold mb-4 md:mb-6">Sort Archive</h3>
                  <ul className="space-y-3 md:space-y-4">
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt}>
                         <button 
                           onClick={() => handleNavigation('/#full-collection')}
                           className="text-xs md:text-sm font-medium text-[#1C1B19]/60 hover:text-[#7A3E3E] transition-colors flex items-center gap-2 group"
                         >
                            <span className="w-0 h-[1px] bg-[#7A3E3E] transition-all duration-300 group-hover:w-4" />
                            {opt}
                         </button>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                  <h3 className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] text-[#C2B28F] font-bold mb-4 md:mb-6">Trending Curations</h3>
                  <div className="flex flex-col gap-3 md:gap-4">
                    <button onClick={() => handleNavigation('/#full-collection')} className="text-left text-base md:text-lg font-serif italic text-[#1C1B19] hover:text-[#7A3E3E] transition-colors">The Zari Touch</button>
                    <button onClick={() => handleNavigation('/#full-collection')} className="text-left text-base md:text-lg font-serif italic text-[#1C1B19] hover:text-[#7A3E3E] transition-colors">Ivory Organza Couture</button>
                    <button onClick={() => handleNavigation('/#full-collection')} className="text-left text-base md:text-lg font-serif italic text-[#1C1B19] hover:text-[#7A3E3E] transition-colors">Asymmetric Kurtas</button>
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-12 md:mt-auto pt-8 border-t border-[#1C1B19]/10 text-center">
                 <p className="text-[#1C1B19]/40 text-[9px] md:text-[10px] uppercase tracking-widest font-bold">Press 'Enter' to view all results</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}