"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpRight, Scissors } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";

interface HeroProps {
  heroImage: string;
}

// Reusable Magnetic Button for Micro-Interactions
function MagneticElement({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((e.clientX - centerX) * 0.3);
    y.set((e.clientY - centerY) * 0.3);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Hero = ({ heroImage }: HeroProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const centerColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  // Framer Motion Scroll Parallax Setup
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // The center image scrolls slower than the page, creating depth
  const yImageParallax = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  // The outer columns fade and drop slightly as you scroll past
  const ySideParallax = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // 1. Center Archway scales up and reveals
      tl.fromTo(
        centerColRef.current,
        { scale: 0.9, opacity: 0, clipPath: "inset(20% 20% 20% 20% round 100px)" },
        { scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.8 }
      )
      // 2. Left Column Text Reveal (Masked sliding up)
      .fromTo(
        ".hero-text-mask span",
        { yPercent: 120, rotateX: -20 },
        { yPercent: 0, rotateX: 0, stagger: 0.1, duration: 1.2 },
        "-=1.2"
      )
      // 3. Right Column Elements fade in
      .fromTo(
        rightColRef.current?.children || [],
        { x: 20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.1, duration: 1 },
        "-=1"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    try {
      console.log("Lookbook Unlocked ✧", { description: "Your exclusive access is on its way." });
      setEmail("");
    } catch (error) {
      console.error("Connection Error", { description: "Please try again shortly." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      ref={containerRef}
      // Warm Pearl Background from our Quiet Luxury palette
      className="relative w-full bg-[#FDFBF7] overflow-hidden flex items-center py-12 md:py-20 lg:py-24 min-h-[fit-content]"
    >
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* --- LEFT COLUMN --- */}
          <motion.div 
            ref={leftColRef} 
            style={{ y: ySideParallax, opacity: opacityFade }}
            className="lg:col-span-3 flex flex-col justify-center order-1 text-center lg:text-left items-center lg:items-start"
          >
            {/* Magnetic Arrow Badge */}
            <div className="hidden md:block mb-8">
              <MagneticElement>
                <div className="w-14 h-14 rounded-full border border-[#C2B28F]/50 flex items-center justify-center hover:bg-[#1C1B19] hover:border-[#1C1B19] hover:text-[#FDFBF7] text-[#1C1B19] transition-all duration-500 cursor-pointer group">
                  <ArrowUpRight className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" strokeWidth={1.5} />
                </div>
              </MagneticElement>
            </div>

            {/* Masked Headline Reveal */}
            <h1 className="text-5xl sm:text-6xl xl:text-[5rem] font-serif font-medium text-[#1C1B19] leading-[1.05] mb-8 mt-6 tracking-tight">
              <div className="hero-text-mask overflow-hidden pb-2">
                <span className="block">The Art Of</span>
              </div>
              <div className="hero-text-mask overflow-hidden pb-2">
                <span className="block">The Fluid</span>
              </div>
              <div className="hero-text-mask overflow-hidden pb-2">
                <span className="block italic text-[#7A3E3E] font-light">Drape.</span>
              </div>
            </h1>

            {/* Studio Fitting Card */}
            <div className="bg-[#F5F2EB] p-4 rounded-xl shadow-[0_10px_40px_rgba(28,27,25,0.05)] border border-[#C2B28F]/20 w-full max-w-[280px] mb-6 transform hover:-translate-y-2 transition-transform duration-500 hidden sm:block relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-[#1C1B19] flex items-center justify-center text-[#FDFBF7]">
                  <Scissors className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-serif text-[#1C1B19]">Private Fitting</p>
                  <p className="text-xs text-[#1C1B19]/60 font-sans tracking-wide">Axis Mall Studio</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* --- CENTER COLUMN (The Archway Canvas) --- */}
          <div ref={centerColRef} className="lg:col-span-5 relative order-2 h-[450px] sm:h-[600px] lg:h-[750px] flex items-center justify-center my-6 lg:my-0">
            <div className="relative w-full h-full group">
              
              {/* Background Arch Shape */}
              <div className="absolute inset-0 bg-[#1C1B19] rounded-t-full rounded-b-[40px] overflow-hidden transform rotate-0 lg:rotate-[-1.5deg] transition-transform group-hover:rotate-0 duration-1000 shadow-2xl">
                
                {/* Framer Parallax Image Container */}
                <motion.div 
                  style={{ y: yImageParallax }}
                  className="absolute -inset-16" // Negative inset allows room for parallax to scroll without showing edges
                >
                  <img 
                    src={heroImage} 
                    alt="Snigdha Boutique Collection" 
                    className="w-full h-full object-cover opacity-90 mix-blend-normal group-hover:scale-105 group-hover:opacity-100 transition-all duration-[2s] ease-out"
                  />
                </motion.div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1B19]/80 via-transparent to-transparent z-10 pointer-events-none"></div>
              </div>

              {/* Floating "Collection" Info */}
              <div className="absolute bottom-12 -right-8 bg-[#FDFBF7] p-6 rounded-sm shadow-xl max-w-[280px] z-30 hidden lg:block border border-[#C2B28F]/20 hover:-translate-y-2 transition-transform duration-500">
                 <p className="text-[10px] uppercase tracking-widest text-[#7A3E3E] mb-2 font-bold">The Heritage Edit</p>
                 <p className="text-sm font-serif text-[#1C1B19] leading-relaxed">
                    Discover gender-fluid silhouettes and timeless hand-embroidered weaves.
                 </p>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN --- */}
          <motion.div 
            ref={rightColRef}
            style={{ y: ySideParallax, opacity: opacityFade }}
            className="lg:col-span-4 flex flex-col justify-center items-center lg:items-start pl-0 lg:pl-16 order-3 text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif text-[#1C1B19] leading-[1.1] mb-6">
              Where Heritage <br />
              Meets <br />
              <span className="text-[#7A3E3E] italic">Identity.</span>
            </h2>

            {/* Macro Texture Image with Glassmorphism Reveal */}
            <div className="relative mb-8 group cursor-pointer hidden lg:block">
                <div className="absolute -inset-3 bg-[#C2B28F]/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                <div className="relative w-40 h-24 overflow-hidden bg-[#F5F2EB] p-1 border border-[#C2B28F]/40 shadow-sm">
                     <div className="w-full h-full bg-[#1C1B19] flex items-center justify-center overflow-hidden relative">
                         {/* Replace with a macro shot of Zari thread or fabric */}
                         <img 
                            src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?q=80&w=2000&auto=format&fit=crop" 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out opacity-80 group-hover:opacity-100"
                            alt="Zari Silk Texture"
                         />
                         {/* Hover overlay text */}
                         <div className="absolute inset-0 bg-[#1C1B19]/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                            <span className="text-[8px] uppercase tracking-[0.3em] text-[#FDFBF7] font-bold">Zoom Craft</span>
                         </div>
                     </div>
                </div>
            </div>

            <p className="text-[#1C1B19]/70 font-sans text-base mb-8 max-w-sm leading-relaxed">
                Experience weightless luxury. Enter your email to unlock our latest lookbook and secure an invitation to our private studio.
            </p>

            {/* Architectural Email Capture Form */}
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 relative group">
                    <Input 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={email}
                        onChange={(e: any) => setEmail(e.target.value)}
                        required
                        className="bg-[#F5F2EB] border-[#C2B28F]/40 h-14 text-sm shadow-inner focus:border-[#1C1B19] focus:ring-0 rounded-none sm:rounded-l-sm transition-colors"
                    />
                    <Button 
                        type="submit"
                        disabled={isLoading}
                        className="h-14 px-8 bg-[#1C1B19] hover:bg-[#7A3E3E] text-[#FDFBF7] uppercase tracking-widest text-xs font-semibold shadow-xl transition-all duration-500 rounded-none sm:rounded-r-sm w-full sm:w-auto relative overflow-hidden group/btn"
                    >
                        <span className="relative z-10">{isLoading ? "Unlocking..." : "Unlock"}</span>
                        {/* Luxury Sweep Effect on Hover */}
                        <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover/btn:translate-y-[0%] transition-transform duration-500 ease-out z-0" />
                    </Button>
                </form>
                <p className="text-[10px] uppercase tracking-widest text-[#1C1B19]/50 mt-4 lg:ml-1 font-semibold">
                    Join our exclusive clientele.
                </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;