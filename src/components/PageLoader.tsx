'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress based on document readyState
    const updateProgress = () => {
      if (document.readyState === 'loading') {
        setProgress(30);
      } else if (document.readyState === 'interactive') {
        setProgress(70);
      } else if (document.readyState === 'complete') {
        setProgress(100);
      }
    };

    updateProgress();
    document.addEventListener('readystatechange', updateProgress);

    // Smooth progress interpolation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100;
        // Slow asymptotic crawl toward 90 if not yet complete
        if (document.readyState !== 'complete') {
          return prev + (90 - prev) * 0.05;
        }
        return Math.min(prev + 8, 100);
      });
    }, 50);

    // Once complete, hold for a beat then dismiss
    const handleComplete = () => {
      setTimeout(() => {
        setProgress(100);
        setTimeout(() => setIsLoading(false), 600);
      }, 200);
    };

    if (document.readyState === 'complete') {
      handleComplete();
    } else {
      window.addEventListener('load', handleComplete);
    }

    return () => {
      document.removeEventListener('readystatechange', updateProgress);
      window.removeEventListener('load', handleComplete);
      clearInterval(interval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Brand Mark */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="text-4xl font-serif tracking-tighter text-white/90 mb-2">
              Aura
            </h1>
            <p className="text-[9px] uppercase tracking-[0.6em] text-white/20 font-bold">
              Premium Collection
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden rounded-full">
            <motion.div
              className="absolute left-0 top-0 h-full bg-white/60"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </div>

          {/* Percentage */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-[10px] text-white/20 font-mono tracking-widest"
          >
            {Math.round(progress)}%
          </motion.p>

          {/* Ambient pulse ring */}
          <motion.div
            className="absolute w-[300px] h-[300px] border border-white/[0.03] rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0, 0.05] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
