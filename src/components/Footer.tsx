'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

const REVIEWS = [
  { 
    text: "Snigdha redefined my relationship with heritage textiles. The Baluchari Silk isn't just worn; it's experienced.", 
    author: "Ananya M.", 
    role: "Creative Director" 
  },
  { 
    text: "Uncompromising craftsmanship. The Zari work is architecturally flawless and startlingly lightweight.", 
    author: "Siddharth K.", 
    role: "Architect" 
  },
  { 
    text: "A masterclass in fluid silhouettes. Every seam feels deliberate, purposeful, and timeless.", 
    author: "James T.", 
    role: "Fashion Editor" 
  },
  {
    text: "It's rare to find pieces that feel both fundamentally traditional and entirely avant-garde. Brilliant.",
    author: "Meera S.",
    role: "Bespoke Client"
  },
  {
    text: "The fabrics speak for themselves. The weight, the drape, the texture—it's sensory perfection.",
    author: "Vikram W.",
    role: "Photographer"
  }
];

const FOOTER_LINKS = [
  {
    title: "The Archive",
    links: ["Sarees", "Lehengas", "Kurtas", "Sherwanis", "View All"]
  },
  {
    title: "The Maison",
    links: ["Our Story", "Craftsmanship", "Sustainability", "The Studio", "Press"]
  },
  {
    title: "Client Care",
    links: ["Contact Us", "Shipping & Returns", "Bespoke Fitting", "FAQ", "Track Order"]
  },
];

export default function Footer() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      // Scroll by roughly one card width
      const scrollAmount = direction === 'left' ? -current.offsetWidth / 1.5 : current.offsetWidth / 1.5;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-black text-[#FDFBF7] selection:bg-[#7A3E3E] selection:text-[#FDFBF7] pt-24 md:pt-32 pb-10 px-4 md:px-[5vw] border-t border-[#C2B28F]/20 relative z-10">
      
      {/* 1. Senior UI/UX Detail: Integrated Editorial Reviews */}
      <div className="mb-24 md:mb-40">
        <div className="flex items-center justify-between mb-10 md:mb-16 border-b border-[#C2B28F]/20 pb-6 outline-none">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#C2B28F] rounded-full" />
            <span className="text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] font-bold text-[#C2B28F]">Client Perspectives</span>
          </div>
          <div className="hidden md:flex gap-3">
            <button 
              onClick={() => scroll('left')} 
              className="w-10 h-10 border border-[#C2B28F]/30 rounded-full flex items-center justify-center text-[#C2B28F] hover:bg-[#FDFBF7] hover:text-[#1C1B19] transition-all focus:outline-none"
              aria-label="Scroll left"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => scroll('right')} 
              className="w-10 h-10 border border-[#C2B28F]/30 rounded-full flex items-center justify-center text-[#C2B28F] hover:bg-[#FDFBF7] hover:text-[#1C1B19] transition-all focus:outline-none"
              aria-label="Scroll right"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        
        {/* Horizontal Scroll Area */}
        <div 
          ref={scrollRef} 
          className="flex gap-8 md:gap-12 lg:gap-20 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {REVIEWS.map((review, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="flex flex-col min-w-[85vw] sm:min-w-[60vw] md:min-w-[45vw] lg:min-w-[30vw] snap-start shrink-0"
            >
              {/* Elegant Quote Icon */}
              <svg className="w-5 h-5 md:w-6 md:h-6 text-[#C2B28F]/40 mb-4 md:mb-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-xl md:text-2xl lg:text-3xl font-serif text-[#FDFBF7]/90 leading-snug mb-6 md:mb-8 flex-1">
                "{review.text}"
              </p>
              <div>
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{review.author}</p>
                <p className="text-[9px] md:text-[10px] text-[#C2B28F] font-mono tracking-wider mt-1">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 2. Newsletter & Main Links */}
      <div className="flex flex-col lg:flex-row justify-between gap-16 lg:gap-20 mb-20 md:mb-32">
        {/* Newsletter Call to Action */}
        <div className="lg:w-1/3">
          <h2 className="text-4xl md:text-5xl font-serif tracking-tighter mb-4 text-[#FDFBF7]">Join the Inner Circle</h2>
          <p className="text-[#FDFBF7]/60 text-sm mb-8 leading-relaxed max-w-sm">
            Exclusive access to limited heritage runs, editorial lookbooks, and private studio appointments.
          </p>
          <form className="relative border-b border-[#C2B28F]/40 pb-2 group" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-transparent outline-none text-sm placeholder:text-[#FDFBF7]/30 text-[#FDFBF7] pr-24 focus:border-[#C2B28F] transition-colors"
            />
            <button 
              type="submit" 
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-widest font-bold text-[#C2B28F] hover:text-[#FDFBF7] transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Navigation Columns */}
        <div className="lg:w-1/2 grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-12">
          {FOOTER_LINKS.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#C2B28F] mb-4 md:mb-6">
                {section.title}
              </h3>
              <ul className="space-y-3 md:space-y-4">
                {section.links.map((link, j) => (
                  <li key={j}>
                    <a href="#" className="text-sm text-[#FDFBF7]/60 hover:text-[#FDFBF7] transition-colors relative group w-fit block">
                      <span className="relative z-10">{link}</span>
                      <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-[#C2B28F] transition-all duration-300 group-hover:w-full" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Bottom Bar: Brand, Legal, Social */}
      <div className="pt-8 border-t border-[#C2B28F]/20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        
        {/* Logo */}
        <div className="text-3xl md:text-4xl font-serif tracking-tighter text-[#FDFBF7]">
          Snigdha
          <span className="block text-[8px] uppercase tracking-[0.4em] text-[#C2B28F] mt-1 font-sans text-center md:text-left">Boutique</span>
        </div>

        {/* Legal Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[9px] md:text-[10px] text-[#FDFBF7]/40 uppercase tracking-[0.2em] font-mono">
          <a href="#" className="hover:text-[#FDFBF7] transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-[#FDFBF7] transition-colors">Terms of Service</a>
          <span className="w-full text-center md:w-auto md:text-left mt-2 md:mt-0">&copy; {new Date().getFullYear()} Snigdha Boutique</span>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4">
          {/* Instagram */}
          <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full border border-[#C2B28F]/30 flex items-center justify-center text-[#C2B28F] hover:bg-[#FDFBF7] hover:text-[#1C1B19] hover:border-[#FDFBF7] transition-all">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          {/* Pinterest (Highly relevant for fashion boutiques) */}
          <a href="#" aria-label="Pinterest" className="w-10 h-10 rounded-full border border-[#C2B28F]/30 flex items-center justify-center text-[#C2B28F] hover:bg-[#FDFBF7] hover:text-[#1C1B19] hover:border-[#FDFBF7] transition-all">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/></svg>
          </a>
          {/* X / Twitter */}
          <a href="#" aria-label="X" className="w-10 h-10 rounded-full border border-[#C2B28F]/30 flex items-center justify-center text-[#C2B28F] hover:bg-[#FDFBF7] hover:text-[#1C1B19] hover:border-[#FDFBF7] transition-all">
             <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
          </a>
        </div>
      </div>
      
    </footer>
  );
}