import React, { useState } from 'react';
import { playSound } from '../utils/audio';
import { Trophy, HelpCircle, Eye } from 'lucide-react';

interface ChessGameProps {
  onGameComplete: () => void;
  onSkipGame: () => void;
}

interface PiecePosition {
  row: number;
  col: number;
}

export default function ChessGame({ onGameComplete, onSkipGame }: ChessGameProps) {
  // 5x5 board is optimal for mobile screens
  const boardSize = 5;

  // Knight starts at center (row 2, col 2)
  const [knightPos, setKnightPos] = useState<PiecePosition>({ row: 2, col: 2 });

  // Cupcakes to collect
  const [cupcakes, setCupcakes] = useState<PiecePosition[]>([
    { row: 0, col: 1 },
    { row: 4, col: 3 },
    { row: 1, col: 4 }
  ]);

  const [score, setScore] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [movesCount, setMovesCount] = useState(0);

  // Helper to check if two positions are equal
  const isPosEqual = (p1: PiecePosition, p2: PiecePosition) => {
    return p1.row === p2.row && p1.col === p2.col;
  };

  // Check if target is a valid knight move from source
  const isValidKnightMove = (src: PiecePosition, dest: PiecePosition) => {
    const rDiff = Math.abs(src.row - dest.row);
    const cDiff = Math.abs(src.col - dest.col);
    return (rDiff === 1 && cDiff === 2) || (rDiff === 2 && cDiff === 1);
  };

  // Get all valid moves from current position
  const getValidMoves = (pos: PiecePosition) => {
    const valid: PiecePosition[] = [];
    const moves = [
      { r: -2, c: -1 }, { r: -2, c: 1 },
      { r: -1, c: -2 }, { r: -1, c: 2 },
      { r: 1, c: -2 }, { r: 1, c: 2 },
      { r: 2, c: -1 }, { r: 2, c: 1 }
    ];

    moves.forEach((m) => {
      const nr = pos.row + m.r;
      const nc = pos.col + m.c;
      if (nr >= 0 && nr < boardSize && nc >= 0 && nc < boardSize) {
        valid.push({ row: nr, col: nc });
      }
    });

    return valid;
  };

  const validMoves = getValidMoves(knightPos);

  const handleCellClick = (row: number, col: number) => {
    if (hasWon) return;

    const clickedPos = { row, col };

    if (isValidKnightMove(knightPos, clickedPos)) {
      // Valid move!
      setKnightPos(clickedPos);
      setMovesCount((prev) => prev + 1);
      
      // Check if there is a cupcake at this spot
      const cupcakeIndex = cupcakes.findIndex((c) => isPosEqual(c, clickedPos));

      if (cupcakeIndex !== -1) {
        // Ate a cupcake!
        playSound.pop();
        const nextCupcakes = cupcakes.filter((_, idx) => idx !== cupcakeIndex);
        setCupcakes(nextCupcakes);
        
        if (nextCupcakes.length === 0) {
          setHasWon(true);
          playSound.victory();
        }
      } else {
        // Standard chess click movement sound
        playSound.chessMove();
      }
    }
  };

  const resetGame = () => {
    setKnightPos({ row: 2, col: 2 });
    setCupcakes([
      { row: 0, col: 1 },
      { row: 4, col: 3 },
      { row: 1, col: 4 }
    ]);
    setHasWon(false);
    setMovesCount(0);
    playSound.click();
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-[#707070] border-4 border-[#4b4b4b] p-5 rounded-none bento-shadow font-mono text-stone-100 flex flex-col items-center animate-fade-in">
      
      {/* Game Header */}
      <div className="text-center mb-3">
        <h2 className="text-2xl font-black text-yellow-400 uppercase tracking-wider text-shadow-bento-sm">
          Nivo 2: Šahovski Skakač
        </h2>
        <p className="text-xs text-stone-200 mt-1 max-w-xs mx-auto font-sans">
          Pomeraj belog skakača u obliku <span className="font-bold underline text-yellow-300">slova 'L'</span> da pojedeš preostale rođendanske kolačiće!
        </p>
      </div>

      {/* Level stats */}
      <div className="flex justify-between items-center w-full max-w-xs mb-3 font-mono text-xs text-stone-200 border-2 border-black bg-stone-900/90 p-2 rounded-none bento-shadow-sm">
        <div>
          KOLAČIĆI: <span className="text-pink-400 font-bold text-sm">{cupcakes.length} 🔥</span>
        </div>
        <div>
          POTEZI: <span className="text-green-400 font-bold text-sm">{movesCount}</span>
        </div>
      </div>

      {/* Play Board Screen Wrapper */}
      <div className="relative w-full aspect-square max-w-[320px] bg-stone-950 border-4 border-black rounded-none overflow-hidden p-1 bento-shadow-sm select-none">
        
        {/* Win Screen Overlay */}
        {hasWon && (
          <div className="absolute inset-0 bg-emerald-950/95 backdrop-blur-xs flex flex-col justify-center items-center p-6 text-center z-10 animate-fade-in">
            <div className="w-14 h-14 bg-yellow-400 border-4 border-black flex items-center justify-center animate-bounce mb-3 bento-shadow-sm">
              <Trophy className="w-7 h-7 text-yellow-800" />
            </div>
            <h3 className="text-xl font-black text-yellow-400 uppercase tracking-wider text-shadow-bento-sm">
              ČESTITAMO! 🎉
            </h3>
            <p className="text-stone-100 mt-2 text-xs max-w-xs font-semibold font-sans">
              Uspešno su rešene sve zagonetke za Rasin 7. rođendan! Vagon i šah su otključali kovčeg.
            </p>
            <p className="text-amber-300 text-xs mt-1">
              Sada prelazimo na samu rođendansku pozivnicu!
            </p>
            <button 
              onClick={() => {
                playSound.click();
                onGameComplete();
              }}
              className="mt-4 px-6 py-2.5 bg-[#3c8527] border-4 border-black hover:bg-green-600 text-white font-extrabold uppercase text-sm tracking-widest rounded-none cursor-pointer hover:translate-y-0.5 active:translate-y-1 active:shadow-none bento-shadow-sm transition-all"
              id="btn_reveal_invite"
            >
              OTVORI POZIVNICU ✉️
            </button>
          </div>
        )}

        {/* 5x5 Board Grid */}
        <div className="grid grid-cols-5 grid-rows-5 w-full h-full gap-0.5 bg-black">
          {Array.from({ length: boardSize }).map((_, row) => {
            return Array.from({ length: boardSize }).map((_, col) => {
              const currentCellPos = { row, col };
              
              const isKnightHere = isPosEqual(knightPos, currentCellPos);
              const hasCupcakeHere = cupcakes.some((c) => isPosEqual(c, currentCellPos));
              const isHighlighted = validMoves.some((m) => isPosEqual(m, currentCellPos));
              const isDarkCell = (row + col) % 2 === 1;

              // Chessboard cell background colors - Oak and Spruce wood themed (Minecraft feel)
              let cellBg = isDarkCell ? 'bg-[#4e3524] border border-[#2c1d14]' : 'bg-orange-100/90 border border-orange-200/40';
              
              if (isKnightHere) {
                cellBg = isDarkCell ? 'bg-emerald-950/90' : 'bg-emerald-100/95';
              }

              return (
                <div
                  key={`${row}-${col}`}
                  onClick={() => handleCellClick(row, col)}
                  className={`relative flex items-center justify-center cursor-pointer transition-all duration-150 rounded-none ${cellBg} hover:opacity-90 active:scale-95`}
                >
                  {/* Coordinates label (Minecrafty) */}
                  <span className={`absolute bottom-0.5 right-0.5 text-[8px] font-mono leading-none ${isDarkCell ? 'text-[#3c8527]/55' : 'text-amber-800/45'} pointer-events-none select-none`}>
                    {String.fromCharCode(97 + col)}{5 - row}
                  </span>

                  {/* Highlights legal move locations */}
                  {isHighlighted && !hasWon && (
                    <div className="absolute inset-1.5 bg-green-500/35 border-2 border-green-500 rounded-none flex items-center justify-center pointer-events-none select-none animate-pulse">
                      <div className="w-2 h-2 bg-green-500" />
                    </div>
                  )}

                  {/* Render Chess Knight (White piece, cute pixel look) */}
                  {isKnightHere && (
                    <div className="z-10 text-3xl select-none pointer-events-none animate-bounce flex flex-col items-center">
                      🐴
                      <span className="text-[7px] font-bold bg-white text-stone-950 px-0.5 rounded-none uppercase font-mono tracking-tighter shadow-md">
                        Skakač
                      </span>
                    </div>
                  )}

                  {/* Render Cupcake */}
                  {hasCupcakeHere && !isKnightHere && (
                    <div className="z-10 text-3xl select-none pointer-events-none animate-pulse flex flex-col items-center">
                      🧁
                      <span className="text-[6.5px] uppercase font-bold bg-pink-500 text-white px-0.5 rounded-none font-mono shadow-md">
                        Njam
                      </span>
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>
      </div>

      {/* Game tips info */}
      <p className="mt-3 text-[10px] text-stone-200 font-mono text-center flex items-center gap-1.5 bg-black/30 p-2 border border-[#4b4b4b]">
        <HelpCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
        Skakač ide 2 polja napred, pa 1 levo/desno (L). Tvoj konj je na zelenom polju.
      </p>

      {/* Level action list */}
      <div className="w-full mt-4 border-t border-[#4b4b4b] pt-3 flex justify-between items-center text-xs">
        <button
          onClick={onSkipGame}
          className="text-amber-200/80 hover:text-white underline cursor-pointer"
          id="btn_chess_skip_bottom"
        >
          Preskoči igru i otvori pozivnicu
        </button>
        <button
          onClick={resetGame}
          className="text-amber-200/80 hover:text-white underline cursor-pointer"
          id="btn_chess_reset_game"
        >
          Restartuj 🔄
        </button>
      </div>
    </div>
  );
}
