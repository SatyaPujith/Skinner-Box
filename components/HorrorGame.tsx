import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface HorrorGameProps {
  onGameOver: () => void;
  requiredScore: number;
}

export const HorrorGame: React.FC<HorrorGameProps> = ({ onGameOver, requiredScore }) => {
  const [playerY, setPlayerY] = useState(2); // 0=top, 1=middle, 2=bottom (3 lanes)
  const [score, setScore] = useState(0);
  const [gameSpeed, setGameSpeed] = useState(5);
  const [obstacles, setObstacles] = useState<Array<{ id: number; lane: number; x: number }>>([]);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Handle keyboard input
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    if (e.key === 'ArrowUp' && playerY > 0) {
      setPlayerY(prev => prev - 1);
    } else if (e.key === 'ArrowDown' && playerY < 2) {
      setPlayerY(prev => prev + 1);
    } else if (e.key === ' ') {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  }, [playerY, gameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Spawn obstacles
  useEffect(() => {
    if (gameOver) return;
    
    const spawnInterval = setInterval(() => {
      const newObstacle = {
        id: Date.now(),
        lane: Math.floor(Math.random() * 3),
        x: 100
      };
      setObstacles(prev => [...prev, newObstacle]);
    }, 2000 / gameSpeed);

    return () => clearInterval(spawnInterval);
  }, [gameSpeed, gameOver]);

  // Move obstacles and check collision
  useEffect(() => {
    if (gameOver) return;

    const moveInterval = setInterval(() => {
      setObstacles(prev => {
        const updated = prev.map(obs => ({ ...obs, x: obs.x - 2 }))
          .filter(obs => obs.x > -10);

        // Check collision
        updated.forEach(obs => {
          if (obs.x < 15 && obs.x > 5 && obs.lane === playerY && !isJumping) {
            setGameOver(true);
          }
        });

        return updated;
      });

      setScore(prev => prev + 1);
      
      // Increase speed over time
      if (score % 100 === 0 && score > 0) {
        setGameSpeed(prev => Math.min(prev + 0.5, 10));
      }
    }, 50);

    return () => clearInterval(moveInterval);
  }, [playerY, isJumping, gameOver, score]);

  // Check if player reached required score
  useEffect(() => {
    if (score >= requiredScore) {
      onGameOver();
    }
  }, [score, requiredScore, onGameOver]);

  const lanes = [20, 50, 80]; // Y positions for 3 lanes

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
        background: 'linear-gradient(to bottom, #1F2937, #000000, #1F2937)',
        overflow: 'hidden'
      }}
    >
      {/* Game Over Screen */}
      {gameOver && (
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{
              fontSize: '72px',
              fontFamily: 'Creepster, cursive',
              color: '#DC2626',
              marginBottom: '20px'
            }}>
              GAME OVER
            </h1>
            <p style={{ fontSize: '32px', color: '#9CA3AF', marginBottom: '10px' }}>
              Score: {score}
            </p>
            <p style={{ fontSize: '24px', color: '#6B7280' }}>
              Required: {requiredScore}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '40px',
                padding: '16px 32px',
                backgroundColor: '#7F1D1D',
                color: '#FFF',
                fontWeight: 'bold',
                fontSize: '24px',
                border: 'none',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Score Display */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 10
      }}>
        <div style={{
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#FFF',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
        }}>
          Score: {score} / {requiredScore}
        </div>
        <div style={{
          fontSize: '14px',
          color: '#9CA3AF',
          marginTop: '8px'
        }}>
          ↑↓ to move lanes | SPACE to jump
        </div>
      </div>

      {/* Speed indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 10,
        color: '#FFF',
        fontSize: '20px'
      }}>
        Speed: {gameSpeed.toFixed(1)}x
      </div>

      {/* Ground lanes */}
      {lanes.map((y, i) => (
        <div
          key={i}
          className="absolute left-0 right-0 h-1 bg-stone-700 opacity-30"
          style={{ top: `${y}%` }}
        />
      ))}

      {/* Player (running character) */}
      <motion.div
        className="absolute left-[10%] z-20"
        animate={{
          top: `${lanes[playerY]}%`,
          y: isJumping ? -50 : 0
        }}
        transition={{ duration: 0.2 }}
        style={{ transform: 'translateY(-50%)' }}
      >
        {/* Simple stick figure runner */}
        <svg width="60" height="80" viewBox="0 0 60 80">
          {/* Head */}
          <circle cx="30" cy="15" r="12" fill="#fff" />
          {/* Body */}
          <line x1="30" y1="27" x2="30" y2="50" stroke="#fff" strokeWidth="4" />
          {/* Running legs - static for now */}
          <line x1="30" y1="50" x2="20" y2="70" stroke="#fff" strokeWidth="4" />
          <line x1="30" y1="50" x2="40" y2="70" stroke="#fff" strokeWidth="4" />
          {/* Running arms - static for now */}
          <line x1="30" y1="35" x2="15" y2="45" stroke="#fff" strokeWidth="3" />
          <line x1="30" y1="35" x2="45" y2="45" stroke="#fff" strokeWidth="3" />
        </svg>
      </motion.div>

      {/* Obstacles (ghosts) */}
      {obstacles.map(obs => (
        <motion.div
          key={obs.id}
          className="absolute z-10"
          style={{
            left: `${obs.x}%`,
            top: `${lanes[obs.lane]}%`,
            transform: 'translateY(-50%)'
          }}
        >
          {/* Ghost obstacle */}
          <svg width="50" height="60" viewBox="0 0 50 60">
            <path
              d="M 25 10 Q 10 10 10 30 L 10 55 Q 15 50 20 55 Q 25 60 30 55 Q 35 50 40 55 L 40 30 Q 40 10 25 10 Z"
              fill="#ff0000"
              opacity="0.8"
            />
            <circle cx="18" cy="25" r="4" fill="#000" />
            <circle cx="32" cy="25" r="4" fill="#000" />
          </svg>
        </motion.div>
      ))}

      {/* Moving background effect */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #fff 0px, #fff 2px, transparent 2px, transparent 50px)',
          backgroundSize: '50px 100%'
        }}
      />
    </div>
  );
};
