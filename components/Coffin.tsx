import React from 'react';
import { motion } from 'framer-motion';

interface CoffinProps {
  isOpen: boolean;
  isShaking?: boolean;
}

export const Coffin: React.FC<CoffinProps> = ({ isOpen, isShaking }) => {
  return (
    <div className="relative w-64 h-96 mx-auto perspective-1000">
      <motion.div 
        className="relative w-full h-full bg-stone-900 border-4 border-stone-800 shadow-2xl flex items-center justify-center overflow-hidden"
        style={{ 
          clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 85% 100%, 15% 100%, 0% 20%)',
          boxShadow: '0 0 50px rgba(0,0,0,0.9) inset'
        }}
        animate={isShaking ? {
          x: [-5, 5, -5, 5, 0],
          rotate: [-1, 1, -1, 1, 0]
        } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Interior */}
        <div className="absolute inset-0 bg-red-950 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent" />
        
        {/* Coffin Lid */}
        <motion.div
          className="absolute inset-0 bg-stone-900 border-b-4 border-stone-700 z-20 flex flex-col items-center justify-center"
          initial={false}
          animate={{ 
            x: isOpen ? 250 : 0,
            opacity: isOpen ? 0.8 : 1,
            rotateY: isOpen ? -60 : 0
          }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          style={{ transformOrigin: 'left' }}
        >
          <div className="w-full h-full border-4 border-stone-800 flex items-center justify-center">
            <span className="text-6xl text-stone-700 opacity-30 font-horror">†</span>
          </div>
          {/* Wood Texture Detail - CSS pattern instead of external image */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, rgba(139,69,19,0.1) 0px, transparent 2px, transparent 4px)',
            backgroundSize: '4px 4px'
          }}></div>
        </motion.div>
      </motion.div>
    </div>
  );
};