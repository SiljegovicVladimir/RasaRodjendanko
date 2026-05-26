import React, { useState, useEffect, useRef } from 'react';
import { playSound } from '../utils/audio';
import { ArrowLeft, ArrowRight, Trophy, Heart, Volume2, ShieldAlert } from 'lucide-react';

interface MinecartGameProps {
  onGameComplete: () => void;
  onSkipGame: () => void;
}

interface Item {
  id: number;
  x: number; // percentage (0 to 100)
  y: number; // percentage (0 to 100)
  type: 'diamond' | 'emerald' | 'gold' | 'tnt';
  speed: number;
}

export default function MinecartGame({ onGameComplete, onSkipGame }: MinecartGameProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [cartX, setCartX] = useState(50); // percentage (0 to 100)
  const [items, setItems] = useState<Item[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Item[]>([]);
  const scoreGoal = 20;

  // Track buttons for smooth mobile movement
  const [moveLeftActive, setMoveLeftActive] = useState(false);
  const [moveRightActive, setMoveRightActive] = useState(false);

  // Update refs to share across timers/loops
  itemsRef.current = items;

  // Handle keyboard arrow controls
  useEffect(() => {
    if (!isPlaying || gameOver || hasWon) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCartX((prev) => Math.max(8, prev - 7));
        playSound.click();
      } else if (e.key === 'ArrowRight') {
        setCartX((prev) => Math.min(92, prev + 7));
        playSound.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver, hasWon]);

  // Handle smooth on-screen holds for L/R controls
  useEffect(() => {
    if (!isPlaying || gameOver || hasWon) return;

    let interval: any = null;
    if (moveLeftActive || moveRightActive) {
      interval = setInterval(() => {
        if (moveLeftActive) {
          setCartX((prev) => Math.max(8, prev - 4));
        }
        if (moveRightActive) {
          setCartX((prev) => Math.min(92, prev + 4));
        }
      }, 30);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [moveLeftActive, moveRightActive, isPlaying, gameOver, hasWon]);

  // Main game physics loop
  useEffect(() => {
    if (!isPlaying || gameOver || hasWon) return;

    // Item spawning interval
    const spawnTimer = setInterval(() => {
      const types: ('diamond' | 'emerald' | 'gold' | 'tnt')[] = [
        'diamond', 'emerald', 'gold', 'tnt', 'tnt'
      ];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomSpeed = 1.5 + Math.random() * 2.0;

      const newItem: Item = {
        id: Date.now() + Math.random(),
        x: 5 + Math.random() * 90,
        y: 0,
        type: randomType,
        speed: randomSpeed
      };

      setItems((prev) => [...prev, newItem]);
    }, 900);

    // Physics ticks
    const physicsTimer = setInterval(() => {
      setItems((prevItems) => {
        const nextItems: Item[] = [];

        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          // Check if item hit minecart
          // Minecart is located at y = 85 to 95%
          // and cartX is the center (width approx 16%)
          const itemX = item.x;
          const isItemInCartRange = Math.abs(itemX - cartX) < 11;
          const isItemAtCartY = nextY >= 82 && nextY <= 92;

          if (isItemInCartRange && isItemAtCartY) {
            // Collected!
            if (item.type === 'tnt') {
              playSound.explosion();
              setLives((l) => {
                const updated = l - 1;
                if (updated <= 0) {
                  setGameOver(true);
                }
                return updated;
              });
            } else {
              playSound.pop();
              let points = 2;
              if (item.type === 'diamond') points = 5;
              if (item.type === 'emerald') points = 3;

              setScore((prevScore) => {
                const updatedScore = prevScore + points;
                if (updatedScore >= scoreGoal) {
                  setHasWon(true);
                  playSound.victory();
                }
                return updatedScore;
              });
            }
            continue; // don't add to nextItems, gets destroyed
          }

          // If fell off screen
          if (nextY > 100) {
            continue;
          }

          nextItems.push({
            ...item,
            y: nextY
          });
        }

        return nextItems;
      });
    }, 40);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(physicsTimer);
    };
  }, [isPlaying, gameOver, hasWon, cartX]);

  // Reset & Start
  const startGame = () => {
    setScore(0);
    setLives(3);
    setCartX(50);
    setItems([]);
    setGameOver(false);
    setHasWon(false);
    setIsPlaying(true);
    playSound.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#4e3524] border-4 border-[#2c1d14] p-5 rounded-none bento-shadow font-mono text-stone-100 flex flex-col items-center">
      {/* Game Header */}
      <div className="text-center mb-3">
        <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider text-shadow-bento-sm">
          Nivo 1: Rudnik Blaga
        </h2>
        <p className="text-xs text-amber-200 mt-1 font-sans">
          Uhvati dijamante i drago kamenje u vagon, izbegavaj TNT!
        </p>
      </div>

      {/* Main Game Screen Outer */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[4/3] bg-sky-900 border-4 border-black rounded-none bg-cover overflow-hidden select-none bento-shadow-sm"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #1e3a8a, #0f172a)',
          imageRendering: 'pixelated'
        }}
      >
        {/* Minecraft Pixelated Background Grid Accent */}
        <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 11%)',
          backgroundSize: '24px 24px'
        }} />

        {/* Clouds or Sun pixel graphic */}
        <div className="absolute top-4 right-6 w-12 h-12 bg-yellow-400 border-2 border-yellow-600 rounded-none shadow-inner opacity-40 animate-pulse" />
        <div className="absolute top-8 left-10 w-24 h-6 bg-white opacity-20" />

        {/* Gameplay State Overlays */}
        {!isPlaying && !gameOver && !hasWon && (
          <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-xs flex flex-col justify-center items-center p-6 text-center z-10 animate-fade-in">
            <span className="text-5xl mb-3 animate-bounce">💎</span>
            <p className="text-stone-300 font-semibold mb-5 text-sm max-w-xs font-sans">
              Pomeraј vagon levo i desno da sakupiš resurse. Cilj je <span className="text-yellow-400 font-mono font-bold">{scoreGoal} poena</span>!
            </p>
            <div className="space-y-3 w-full max-w-xs">
              <button 
                onClick={startGame}
                className="w-full py-3 bg-[#3c8527] border-4 border-black text-white font-bold font-mono uppercase tracking-wide cursor-pointer hover:translate-y-0.5 active:translate-y-1 hover:shadow-none bento-shadow-sm rounded-none transition-all"
                id="btn_start_minecart"
              >
                Kreni da Kopaš! 🛠️
              </button>
              <button
                onClick={onSkipGame}
                className="w-full py-1 text-xs text-amber-200/80 hover:text-white underline cursor-pointer"
                id="btn_skip_m1"
              >
                Mama/Tata žure? Preskoči igru →
              </button>
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 bg-red-950/95 backdrop-blur-xs flex flex-col justify-center items-center p-6 text-center z-10 animate-fade-in">
            <span className="text-5xl mb-2 animate-pulse">💥</span>
            <h3 className="text-2xl font-black text-red-500 uppercase tracking-widest text-shadow-bento-sm">
              TNT Te je Razneo!
            </h3>
            <p className="text-stone-300 mt-2 text-sm font-sans">Sakupio si {score} poena. Pokušaj ponovo!</p>
            <div className="mt-5 gap-3 flex flex-col sm:flex-row w-full max-w-xs justify-center">
              <button 
                onClick={startGame}
                className="px-4 py-2.5 bg-yellow-600 border-4 border-black text-stone-950 font-bold font-mono text-sm uppercase rounded-none cursor-pointer hover:translate-y-0.5 active:translate-y-1 active:shadow-none bento-shadow-sm transition-all"
                id="btn_retry_m1"
              >
                Probaj Opet 🔄
              </button>
              <button
                onClick={onSkipGame}
                className="px-4 py-2 bg-stone-700 text-stone-200 border-2 border-stone-800 hover:bg-stone-600 text-xs rounded-none cursor-pointer"
                id="btn_skip_m2"
              >
                Preskoči ⏭️
              </button>
            </div>
          </div>
        )}

        {/* Won Level 1 Screen */}
        {hasWon && (
          <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-sm flex flex-col justify-center items-center p-6 text-center z-10 animate-fade-in">
            <div className="w-16 h-16 bg-yellow-400 border-4 border-black flex items-center justify-center animate-bounce mb-3 bento-shadow-sm">
              <Trophy className="w-8 h-8 text-yellow-800" />
            </div>
            <h3 className="text-2xl font-black text-yellow-400 uppercase tracking-widest text-shadow-bento-sm">
              NIVO 1 PREĐEN!
            </h3>
            <p className="text-stone-100 mt-2 text-sm max-w-xs font-semibold font-sans">
              Sjajno! Sakupio si {score} poena i vratio blago u vagon!
            </p>
            <p className="text-amber-300 text-xs mt-1 animate-pulse font-mono">
              Preostaje još šahovski zadatak za ulazak...
            </p>
            <button 
              onClick={() => {
                playSound.click();
                onGameComplete();
              }}
              className="mt-5 px-6 py-3 bg-amber-500 border-4 border-black hover:bg-[#3c8527] text-stone-950 hover:text-white font-extrabold uppercase tracking-wide rounded-none cursor-pointer hover:translate-y-0.5 active:translate-y-1 active:shadow-none bento-shadow-sm transition-all"
              id="btn_to_layer_2"
            >
              Kreni na Šah ♟️
            </button>
          </div>
        )}

        {/* Items Falling */}
        {isPlaying && !gameOver && !hasWon && items.map((item) => {
          let emoji = '💎';
          let bgColor = 'bg-cyan-400';
          let borderCol = 'border-cyan-600';
          if (item.type === 'emerald') {
            emoji = '💚';
            bgColor = 'bg-emerald-500';
            borderCol = 'border-emerald-700';
          } else if (item.type === 'gold') {
            emoji = '🍎'; // Golden Apple
            bgColor = 'bg-amber-400';
            borderCol = 'border-amber-600';
          } else if (item.type === 'tnt') {
            emoji = '💣';
            bgColor = 'bg-red-600';
            borderCol = 'border-red-800';
          }

          return (
            <div
              key={item.id}
              className={`absolute w-8 h-8 rounded-none border-2 ${bgColor} ${borderCol} flex items-center justify-center text-xs shadow-inner select-none pointer-events-none`}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: 'translate(-50%, -50%)',
                imageRendering: 'pixelated',
                transition: 'top 0.04s linear'
              }}
            >
              {item.type === 'tnt' && (
                <div className="absolute -top-1.5 -right-1 z-10 bg-black text-[7px] text-white px-0.5 rounded border border-red-500 uppercase font-mono tracking-tighter animate-ping">
                  TNT
                </div>
              )}
              <span className="scale-125 select-none">{emoji}</span>
            </div>
          );
        })}

        {/* Minecart at the bottom */}
        {isPlaying && !gameOver && !hasWon && (
          <div
            className="absolute transition-all duration-75 select-none pointer-events-none"
            style={{
              left: `${cartX}%`,
              bottom: '4%',
              transform: 'translateX(-50%)',
              width: '20%',
              height: '10%',
            }}
          >
            {/* Styled Minecart container */}
            <div className="w-full h-full bg-stone-600 border-2 border-black flex flex-col justify-between items-center relative bento-shadow-sm">
              <div className="w-[110%] h-3 bg-stone-500 border-2 border-black rounded-none absolute -top-1" />
              {/* Minecart Wheels */}
              <div className="flex justify-between w-4/5 px-2 absolute -bottom-1.5 z-10">
                <div className="w-3.5 h-3.5 bg-stone-950 rounded-none border-2 border-stone-600" />
                <div className="w-3.5 h-3.5 bg-stone-950 rounded-none border-2 border-stone-600" />
              </div>
              {/* Tiny miner sticker inside cart */}
              <div className="text-[9px] mt-1 z-0 select-none text-white tracking-widest">RAŠA</div>
            </div>
          </div>
        )}

        {/* Score & HUD */}
        {isPlaying && !gameOver && !hasWon && (
          <div className="absolute top-2 left-2 right-2 flex justify-between items-center pointer-events-none">
            {/* Score */}
            <div className="bg-stone-950 border-2 border-[#111] px-3 py-1 flex items-center gap-1.5 bento-shadow-sm">
              <span className="text-[10px] text-stone-400">ORE:</span>
              <span className="text-yellow-400 font-bold">{score}/{scoreGoal}</span>
            </div>
            {/* Lives */}
            <div className="bg-stone-950 border-2 border-[#111] px-3 py-1 flex items-center gap-1 bento-shadow-sm">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500 animate-pulse' : 'text-stone-700'}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Manual Joystick on Screen for Mobile */}
      {isPlaying && !gameOver && !hasWon && (
        <div className="w-full mt-4 flex justify-between items-center gap-4">
          <button
            onMouseDown={() => setMoveLeftActive(true)}
            onMouseUp={() => setMoveLeftActive(false)}
            onMouseLeave={() => setMoveLeftActive(false)}
            onTouchStart={(e) => { e.preventDefault(); setMoveLeftActive(true); }}
            onTouchEnd={(e) => { e.preventDefault(); setMoveLeftActive(false); }}
            className="flex-1 py-4 bg-[#707070] text-white border-4 border-black bento-shadow-sm hover:translate-y-0.5 active:translate-y-1 hover:shadow-none active:shadow-none select-none flex items-center justify-center rounded-none cursor-pointer touch-none transition-all"
            id="btn_left_arrow"
          >
            <ArrowLeft className="w-6 h-6" /> <span className="ml-1 font-bold text-xs uppercase text-shadow-bento-sm">LEVO</span>
          </button>
          
          <button
            onMouseDown={() => setMoveRightActive(true)}
            onMouseUp={() => setMoveRightActive(false)}
            onMouseLeave={() => setMoveRightActive(false)}
            onTouchStart={(e) => { e.preventDefault(); setMoveRightActive(true); }}
            onTouchEnd={(e) => { e.preventDefault(); setMoveRightActive(false); }}
            className="flex-1 py-4 bg-[#707070] text-white border-4 border-black bento-shadow-sm hover:translate-y-0.5 active:translate-y-1 hover:shadow-none active:shadow-none select-none flex items-center justify-center rounded-none cursor-pointer touch-none transition-all"
            id="btn_right_arrow"
          >
            <span className="mr-1 font-bold text-xs uppercase text-shadow-bento-sm">DESNO</span> <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Legends info */}
      {isPlaying && !gameOver && !hasWon && (
        <div className="mt-3 w-full bg-black/40 p-2 text-[11px] grid grid-cols-4 gap-1 text-center font-bold border-2 border-[#2c1d14]">
          <div className="text-cyan-400">💎 ORE: +5</div>
          <div className="text-emerald-400">💚 SMGD: +3</div>
          <div className="text-amber-400">🍎 APPL: +2</div>
          <div className="text-red-500">💣 TNT: -1 HP</div>
        </div>
      )}

      {/* Skip/Reset options at the bottom */}
      <div className="w-full mt-4 border-t border-[#2c1d14] pt-3 flex justify-between items-center text-xs">
        <button
          onClick={onSkipGame}
          className="text-amber-200/80 hover:text-white underline cursor-pointer"
          id="btn_skip_bottom"
        >
          Preskoči igru i otvori pozivnicu
        </button>
        {isPlaying && (
          <button
            onClick={startGame}
            className="text-amber-200/80 hover:text-white underline cursor-pointer"
            id="btn_restart_game"
          >
            Restartuj nivo 🔄
          </button>
        )}
      </div>
    </div>
  );
}
