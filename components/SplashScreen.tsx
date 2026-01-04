
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  // Set a timer to trigger the exit transition
  useEffect(() => {
    const timer = setTimeout(() => {
      // The parent handles unmounting via AnimatePresence
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#3E332B] overflow-hidden"
      initial={{ y: 0 }}
      exit={{ 
        y: "-100%",
        transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] } 
      }}
      onAnimationComplete={(definition) => {
        // Only call onComplete if the exit animation (y: "-100%") is done
        if ((definition as any).y === "-100%") {
          onComplete();
        }
      }}
    >
      {/* Background Decoration: Subtle Curve Shape */}
      <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-[#4A3D34] rounded-full blur-[100px] opacity-40 pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-[#2C241F] rounded-full blur-[80px] opacity-30 pointer-events-none" />

      <div className="relative flex flex-col items-center text-center z-10">
        {/* Phase A: 2026 Entry */}
        <motion.h1
          className="serif-font text-[120px] md:text-[160px] italic font-light text-[#FDFBF6] leading-none tracking-tighter"
          initial={{ opacity: 0, scale: 0.9, letterSpacing: "-0.05em" }}
          animate={{ opacity: 1, scale: 1, letterSpacing: "-0.02em" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          2026
        </motion.h1>

        {/* Phase A: Subtitle Reveal */}
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2, ease: "easeOut" }}
        >
          <p className="serif-font text-3xl md:text-4xl italic text-[#D4C5B0] mt-4 font-light">
            Start from here
          </p>

          {/* Divider Line */}
          <motion.div 
            className="w-16 h-[0.5px] bg-[#8C7C6D]/40 my-8"
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 1.8, duration: 1 }}
          />

          {/* PLANNER Tag */}
          <motion.p
            className="font-sans text-[11px] uppercase tracking-[0.8em] text-[#8C7C6D] font-bold pl-[0.8em]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.2, duration: 1 }}
          >
            PLANNER
          </motion.p>
        </motion.div>
      </div>

      {/* Aesthetic Detail: Edge Highlight */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5" />
    </motion.div>
  );
};

export default SplashScreen;
