import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Zombie } from './Zombie';
import { Cursor } from './Cursor';

interface ZombieData {
  id: string;
  x: number;
  y: number;
}

export const Game: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zombies, setZombies] = useState<ZombieData[]>([]);
  const [gameOver, setGameOver] = useState(false);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const spawnInterval = setInterval(() => {
      const newZombie: ZombieData = {
        id: Math.random().toString(36).substr(2, 9),
        x: 10 + Math.random() * 80, // 10% to 90% width
        y: 20 + Math.random() * 60, // 20% to 80% height (keep away from top HUD)
      };
      setZombies((prev) => [...prev, newZombie]);
    }, 800); // Spawn every 800ms

    return () => {
      clearInterval(timerInterval);
      clearInterval(spawnInterval);
    };
  }, [isPlaying]);

  const handleStart = () => {
    setScore(0);
    setTimeLeft(60);
    setZombies([]);
    setGameOver(false);
    setIsPlaying(true);
  };

  const handleHit = useCallback((id: string) => {
    setScore((prev) => prev + 10);
    // Remove zombie after a short delay to allow animation to play in Zombie component
    setTimeout(() => {
      setZombies((prev) => prev.filter((z) => z.id !== id));
    }, 300);
  }, []);

  const handleMiss = useCallback((id: string) => {
    setZombies((prev) => prev.filter((z) => z.id !== id));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden cursor-none select-none font-sans">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{
          backgroundImage: `url('https://public.youware.com/users-website-assets/prod/95a4aea9-a033-4349-acd3-29ccdf89f787/fd33f7989a51442f96e4677cc70959d5.jpg')`,
          filter: 'brightness(0.6)'
        }}
      />

      {/* Custom Cursor */}
      <div className="hidden md:block">
        <Cursor />
      </div>

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-20 pointer-events-none">
        <div className="bg-black/70 text-white px-6 py-3 rounded-xl border-2 border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]">
          <p className="text-sm text-gray-300 uppercase tracking-widest">Score</p>
          <p className="text-4xl font-black text-red-500">{score}</p>
        </div>
        
        <div className="bg-black/70 text-white px-6 py-3 rounded-xl border-2 border-yellow-600 shadow-[0_0_15px_rgba(202,138,4,0.5)]">
          <p className="text-sm text-gray-300 uppercase tracking-widest">Time</p>
          <p className={`text-4xl font-black ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
            {timeLeft}s
          </p>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative w-full h-full z-10">
        <AnimatePresence>
          {zombies.map((zombie) => (
            <Zombie
              key={zombie.id}
              id={zombie.id}
              x={zombie.x}
              y={zombie.y}
              onHit={handleHit}
              onMiss={handleMiss}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Start / Game Over Screen */}
      {(!isPlaying) && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-sm cursor-auto">
          <div className="text-center p-10 bg-gray-900/90 border-4 border-red-800 rounded-3xl shadow-2xl max-w-md w-full mx-4">
            <h1 className="text-6xl font-black text-red-600 mb-2 tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)]">
              {gameOver ? 'GAME OVER' : 'Zombie Smackdown'}
            </h1>
            
            {gameOver && (
              <div className="mb-8">
                <p className="text-gray-400 text-xl mb-2">Final Score</p>
                <p className="text-5xl font-bold text-white">{score}</p>
              </div>
            )}

            {!gameOver && (
              <p className="text-gray-400 mb-8 text-lg">
                Smash as many zombies as you can before time runs out!
              </p>
            )}

            <button
              onClick={handleStart}
              onTouchStart={handleStart}
              className="group relative px-8 py-4 bg-red-700 hover:bg-red-600 text-white text-2xl font-bold rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(220,38,38,0.6)] overflow-hidden"
            >
              <span className="relative z-10">{gameOver ? 'PLAY AGAIN' : 'START RAMPAGE'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
