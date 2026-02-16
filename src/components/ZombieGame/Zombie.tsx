import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ZombieProps {
  id: string;
  x: number;
  y: number;
  onHit: (id: string) => void;
  onMiss: (id: string) => void;
}

export const Zombie: React.FC<ZombieProps> = ({ id, x, y, onHit, onMiss }) => {
  const [isHit, setIsHit] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isHit) {
        onMiss(id);
      }
    }, 2000 + Math.random() * 1000); // Random duration between 2-3s

    return () => clearTimeout(timer);
  }, [id, isHit, onMiss]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); // Prevent clicking through to background
    if (!isHit) {
      setIsHit(true);
      onHit(id);
    }
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: isHit ? 1.2 : 1, opacity: isHit ? 0 : 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        cursor: 'none', // We use custom cursor
        zIndex: 10,
        touchAction: 'none'
      }}
      onClick={handleClick}
      onTouchStart={handleClick}
    >
      <img
        src="https://public.youware.com/users-website-assets/prod/95a4aea9-a033-4349-acd3-29ccdf89f787/da10e2579e7f4c76a3a8d4c76da2d30c.png"
        alt="Zombie"
        className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl filter hover:brightness-110"
        draggable={false}
      />
      {isHit && (
        <motion.div
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 1.5, opacity: 0 }}
          className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none"
        >
          <span className="text-4xl font-bold text-red-600 drop-shadow-lg">SMACK!</span>
        </motion.div>
      )}
    </motion.div>
  );
};
