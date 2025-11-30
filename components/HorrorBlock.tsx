import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';
import { LearningQuest } from './LearningQuest';

interface HorrorBlockProps {
  siteName: string;
  onUnblock: () => void;
  onGiveUp: () => void;
}

export const HorrorBlock: React.FC<HorrorBlockProps> = ({ siteName, onUnblock, onGiveUp }) => {
  const [view, setView] = useState<'block' | 'quest'>('block');

  useEffect(() => {
    // Force full screen
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, []);

  if (view === 'quest') {
    return (
      <LearningQuest
        siteName={siteName}
        onComplete={() => {
          onUnblock();
          setView('block');
        }}
      />
    );
  }

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        backgroundColor: '#000',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {/* Animated background */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(139, 0, 0, 0.3) 0%, rgba(0, 0, 0, 1) 70%)',
          zIndex: 1
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Blood drips */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100px', zIndex: 2, pointerEvents: 'none' }}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 7}%`,
              width: '2px',
              backgroundColor: '#8B0000',
              top: 0
            }}
            animate={{
              height: [0, Math.random() * 150 + 50, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Floating skulls */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 2) * 30}%`,
            opacity: 0.15,
            zIndex: 2
          }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
        >
          <Skull size={80} color="#666" />
        </motion.div>
      ))}

      {/* Main content container */}
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '90%' }}>
        {/* Site name at top */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '60px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '15px' }}>
            <Skull size={40} color="#DC2626" />
            <h2 style={{
              fontSize: '48px',
              color: '#DC2626',
              fontFamily: 'Creepster, cursive',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              margin: 0,
              textShadow: '0 0 30px rgba(220, 38, 38, 0.8)'
            }}>
              {siteName} IS SEALED
            </h2>
            <Skull size={40} color="#DC2626" />
          </div>
          <p style={{
            fontSize: '18px',
            color: '#9CA3AF',
            fontFamily: 'monospace',
            margin: 0
          }}>
            The digital coffin is <span style={{ color: '#DC2626', fontWeight: 'bold' }}>LOCKED</span>
          </p>
        </motion.div>

        {/* Challenge quote */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            marginBottom: '40px',
            fontSize: '28px',
            color: '#EF4444',
            fontFamily: 'monospace',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadow: '0 0 20px rgba(239, 68, 68, 0.8)',
            letterSpacing: '0.05em'
          }}
        >
          LEARN TO ESCAPE... OR REMAIN TRAPPED FOREVER
        </motion.div>

        {/* Giant NOT. YET. text */}
        <motion.div
          animate={{
            x: [-3, 3, -2, 2, 0],
            y: [-2, 2, -1, 1, 0]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          style={{ marginBottom: '40px' }}
        >
          <h1 style={{
            fontSize: '180px',
            color: '#DC2626',
            fontFamily: 'Creepster, cursive',
            margin: 0,
            lineHeight: 1,
            textShadow: '8px 8px 0 rgba(0,0,0,0.8), -8px -8px 0 rgba(255,0,0,0.3), 0 0 60px rgba(220,38,38,0.9)',
            WebkitTextStroke: '3px rgba(0,0,0,0.8)'
          }}>
            NOT. YET.
          </h1>
        </motion.div>
        
        {/* START button below text */}
        <motion.button
          onClick={() => {
            console.log('LEARN TO ESCAPE button clicked!');
            setView('quest');
          }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 60px rgba(220, 38, 38, 1)' }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            scale: [1, 1.05, 1],
            boxShadow: [
              '0 0 40px rgba(220, 38, 38, 0.8)',
              '0 0 60px rgba(220, 38, 38, 1)',
              '0 0 40px rgba(220, 38, 38, 0.8)'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{
            padding: '25px 80px',
            fontSize: '48px',
            fontWeight: 'bold',
            fontFamily: 'Creepster, cursive',
            color: '#FFF',
            backgroundColor: '#DC2626',
            border: '6px solid #000',
            borderRadius: '15px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            boxShadow: '0 0 40px rgba(220, 38, 38, 0.8), inset 0 0 30px rgba(0,0,0,0.5)',
            textShadow: '3px 3px 0 #000, -2px -2px 0 #000'
          }}
        >
          LEARN TO ESCAPE
        </motion.button>
      </div>

      {/* Give Up button at bottom-right */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '40px',
          right: '40px',
          zIndex: 20
        }}
      >
        <motion.button
          onClick={onGiveUp}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            padding: '16px 24px',
            backgroundColor: 'rgba(28, 25, 23, 0.95)',
            color: '#D6D3D1',
            border: '2px solid #57534E',
            fontFamily: 'monospace',
            fontSize: '16px',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s'
          }}
        >
          <Skull size={24} />
          <span>I Remain Strong</span>
        </motion.button>
      </motion.div>

      {/* Flickering effect */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFF',
          pointerEvents: 'none',
          zIndex: 30
        }}
        animate={{ opacity: [0, 0.1, 0] }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: Math.random() * 4 + 2
        }}
      />
    </div>
  );
};
