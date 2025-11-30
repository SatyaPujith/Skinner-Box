import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skull, Heart, DoorOpen } from 'lucide-react';

interface HorrorChaseProps {
  onComplete: () => void;
}

interface Ghost {
  id: number;
  hp: number;
  x: number; // Position on screen (0-100%)
  y: number; // Position on screen (0-100%)
}

interface Player {
  x: number;
  y: number;
  attacking: boolean;
}

export const HorrorChase: React.FC<HorrorChaseProps> = ({ onComplete }) => {
  const DURATION = 3600; // 1 hour
  const MAX_HP = 100;
  
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [playerHP, setPlayerHP] = useState(MAX_HP);
  const [currentGhost, setCurrentGhost] = useState<Ghost | null>(null);
  const [killCount, setKillCount] = useState(0);
  const [showDoor, setShowDoor] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [player, setPlayer] = useState<Player>({ x: 50, y: 50, attacking: false });

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0 && !gameOver) {
      setShowDoor(true);
      return;
    }

    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  // Check if player died
  useEffect(() => {
    if (playerHP <= 0 && !gameOver) {
      setGameOver(true);
    }
  }, [playerHP, gameOver]);

  // Spawn new ghost at random position
  useEffect(() => {
    if (!currentGhost && !gameOver && !showDoor) {
      const newGhost: Ghost = {
        id: Date.now(),
        hp: 5,
        x: Math.random() * 80 + 10, // 10-90% of screen
        y: Math.random() * 80 + 10
      };
      setCurrentGhost(newGhost);
    }
  }, [currentGhost, gameOver, showDoor]);

  // Player moves towards ghost and attacks
  useEffect(() => {
    if (!currentGhost || gameOver) return;

    const moveInterval = setInterval(() => {
      setPlayer(prev => {
        const dx = currentGhost.x - prev.x;
        const dy = currentGhost.y - prev.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // If close enough, attack
        if (distance < 8) {
          setPlayer(p => ({ ...p, attacking: true }));
          
          // Damage ghost
          setCurrentGhost(ghost => {
            if (!ghost) return null;
            const newHP = ghost.hp - 1;
            
            if (newHP <= 0) {
              setKillCount(k => k + 1);
              setTimeout(() => {
                setCurrentGhost(null);
                setPlayer(p => ({ ...p, attacking: false }));
              }, 300);
              return null;
            }
            
            return { ...ghost, hp: newHP };
          });
          
          setTimeout(() => setPlayer(p => ({ ...p, attacking: false })), 200);
          return prev;
        }

        // Move towards ghost
        const speed = 2;
        const moveX = (dx / distance) * speed;
        const moveY = (dy / distance) * speed;

        return {
          ...prev,
          x: prev.x + moveX,
          y: prev.y + moveY
        };
      });
    }, 100);

    return () => clearInterval(moveInterval);
  }, [currentGhost, gameOver]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((DURATION - timeLeft) / DURATION) * 100;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      margin: 0,
      padding: 0,
      backgroundColor: '#0a0e27',
      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 0, 0, 0.2) 0%, #0a0e27 100%)',
      overflow: 'hidden'
    }}>
      {/* HUD - Timer */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        textAlign: 'center'
      }}>
        <div style={{
          fontSize: '48px',
          fontFamily: 'monospace',
          color: '#DC2626',
          fontWeight: 'bold',
          textShadow: '0 0 20px rgba(220, 38, 38, 0.8)'
        }}>
          {formatTime(timeLeft)}
        </div>
        <div style={{
          width: '400px',
          height: '8px',
          backgroundColor: '#1F2937',
          borderRadius: '4px',
          marginTop: '10px',
          overflow: 'hidden',
          border: '2px solid #374151',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <motion.div
            style={{
              height: '100%',
              backgroundColor: '#DC2626'
            }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* HP Bar - Top Left */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Heart size={28} color="#EF4444" fill={playerHP > 30 ? '#EF4444' : 'none'} />
          <span style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: playerHP > 30 ? '#EF4444' : '#DC2626',
            fontFamily: 'monospace'
          }}>
            {playerHP}
          </span>
        </div>
        <div style={{
          width: '250px',
          height: '16px',
          backgroundColor: '#1F2937',
          borderRadius: '8px',
          overflow: 'hidden',
          border: '2px solid #374151'
        }}>
          <motion.div
            style={{
              height: '100%',
              backgroundColor: playerHP > 50 ? '#22C55E' : playerHP > 30 ? '#F59E0B' : '#DC2626'
            }}
            animate={{ width: `${(playerHP / MAX_HP) * 100}%` }}
          />
        </div>
      </div>

      {/* Kill Count - Top Right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: 100,
        fontSize: '28px',
        fontFamily: 'monospace',
        color: '#9CA3AF',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <Skull size={32} color="#DC2626" />
        <span>Kills: {killCount}</span>
      </div>

      {/* Ghost - Positioned on screen */}
      <AnimatePresence>
        {currentGhost && (
          <motion.div
            key={currentGhost.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1,
              opacity: 1
            }}
            exit={{ scale: 0, opacity: 0, rotate: 360 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              left: `${currentGhost.x}%`,
              top: `${currentGhost.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 50
            }}
          >
            {/* Ghost HP Bar */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '8px',
              backgroundColor: '#1F2937',
              borderRadius: '4px',
              overflow: 'hidden',
              border: '2px solid #DC2626'
            }}>
              <motion.div
                style={{
                  height: '100%',
                  backgroundColor: '#DC2626',
                  boxShadow: '0 0 10px rgba(220, 38, 38, 0.8)'
                }}
                animate={{ width: `${(currentGhost.hp / 5) * 100}%` }}
              />
            </div>

            {/* Ghost */}
            <svg width="120" height="140" viewBox="0 0 120 140">
              {/* Ghost body */}
              <path
                d="M 60 20 Q 30 20 30 70 L 30 120 Q 40 110 50 120 Q 60 130 70 120 Q 80 110 90 120 L 90 70 Q 90 20 60 20 Z"
                fill="#8B0000"
                opacity="0.9"
                stroke="#000"
                strokeWidth="2"
              />
              
              {/* Eyes */}
              <ellipse cx="45" cy="55" rx="8" ry="12" fill="#000" />
              <ellipse cx="75" cy="55" rx="8" ry="12" fill="#000" />
              <circle cx="45" cy="55" r="3" fill="#DC2626" />
              <circle cx="75" cy="55" r="3" fill="#DC2626" />
              
              {/* Mouth */}
              <motion.ellipse
                cx="60"
                cy="85"
                rx="15"
                ry="20"
                fill="#000"
                animate={{ ry: [20, 25, 20] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Player Character - Moves around screen */}
      <motion.div
        animate={{
          left: `${player.x}%`,
          top: `${player.y}%`
        }}
        transition={{ duration: 0.1, ease: 'linear' }}
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          zIndex: 60
        }}
      >
        {/* Player Character */}
        <svg width="100" height="120" viewBox="0 0 100 120">
          {/* Body */}
          <rect x="35" y="40" width="30" height="50" fill="#2563EB" stroke="#000" strokeWidth="2" rx="5" />
          
          {/* Head */}
          <circle cx="50" cy="25" r="18" fill="#FFA07A" stroke="#000" strokeWidth="2" />
          
          {/* Eyes */}
          <circle cx="44" cy="22" r="3" fill="#000" />
          <circle cx="56" cy="22" r="3" fill="#000" />
          
          {/* Mouth */}
          <path d="M 44 30 Q 50 33 56 30" stroke="#000" strokeWidth="2" fill="none" />
          
          {/* Left Arm */}
          <rect 
            x="20" 
            y="45" 
            width="15" 
            height="35" 
            fill="#2563EB" 
            stroke="#000" 
            strokeWidth="2" 
            rx="5"
            style={{
              transform: player.attacking ? 'rotate(-45deg)' : 'rotate(0deg)',
              transformOrigin: '27px 45px',
              transition: 'transform 0.2s'
            }}
          />
          
          {/* Right Arm */}
          <rect 
            x="65" 
            y="45" 
            width="15" 
            height="35" 
            fill="#2563EB" 
            stroke="#000" 
            strokeWidth="2" 
            rx="5"
            style={{
              transform: player.attacking ? 'rotate(45deg)' : 'rotate(0deg)',
              transformOrigin: '72px 45px',
              transition: 'transform 0.2s'
            }}
          />
          
          {/* Legs */}
          <rect x="38" y="90" width="10" height="25" fill="#1E40AF" stroke="#000" strokeWidth="2" rx="3" />
          <rect x="52" y="90" width="10" height="25" fill="#1E40AF" stroke="#000" strokeWidth="2" rx="3" />
          
          {/* Feet */}
          <ellipse cx="43" cy="115" rx="8" ry="4" fill="#000" />
          <ellipse cx="57" cy="115" rx="8" ry="4" fill="#000" />
        </svg>

        {/* Attack effect */}
        {player.attacking && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none'
            }}
          >
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: '4px solid #FBBF24',
              boxShadow: '0 0 20px #FBBF24'
            }} />
          </motion.div>
        )}
      </motion.div>

      {/* Game Over */}
      {gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Skull size={120} color="#DC2626" />
            <h1 style={{
              fontSize: '72px',
              color: '#DC2626',
              fontFamily: 'Creepster, cursive',
              marginTop: '20px'
            }}>
              YOU DIED
            </h1>
            <p style={{ fontSize: '24px', color: '#9CA3AF', marginTop: '20px' }}>
              Killed {killCount} ghosts
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: '40px',
                padding: '16px 32px',
                fontSize: '24px',
                fontWeight: 'bold',
                backgroundColor: '#DC2626',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}

      {/* Victory Door */}
      {showDoor && !gameOver && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200
          }}
        >
          <motion.button
            onClick={onComplete}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: [
                '0 0 30px rgba(34, 197, 94, 0.5)',
                '0 0 60px rgba(34, 197, 94, 1)',
                '0 0 30px rgba(34, 197, 94, 0.5)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              padding: '40px 80px',
              fontSize: '48px',
              fontWeight: 'bold',
              fontFamily: 'Creepster, cursive',
              color: '#FFF',
              backgroundColor: '#22C55E',
              border: '6px solid #000',
              borderRadius: '15px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <DoorOpen size={56} />
            <span>ESCAPE!</span>
          </motion.button>
        </motion.div>
      )}

      {/* Instructions */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        color: '#6B7280',
        fontSize: '14px',
        fontFamily: 'monospace',
        textAlign: 'center'
      }}>
        Watch the hero chase and fight ghosts automatically for 1 hour!
      </div>
    </div>
  );
};
