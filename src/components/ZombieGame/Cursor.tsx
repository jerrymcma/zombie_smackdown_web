import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const Cursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <motion.div
      className="fixed pointer-events-none z-50"
      animate={{
        x: mousePosition.x - 50, // Center the fist roughly
        y: mousePosition.y - 50,
        scale: isClicking ? 0.8 : 1,
        rotate: isClicking ? -15 : 0,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    >
      <img
        src="https://public.youware.com/users-website-assets/prod/95a4aea9-a033-4349-acd3-29ccdf89f787/c0ffcdb831924402809e0eefd7a8244f.png"
        alt="Fist Cursor"
        className="w-32 h-32 object-contain drop-shadow-xl"
      />
    </motion.div>
  );
};
