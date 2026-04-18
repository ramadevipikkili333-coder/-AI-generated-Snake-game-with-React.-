import { useSnakeGame, GRID_SIZE } from '../hooks/useSnakeGame';
import { useState, useEffect } from 'react';

export function SnakeBoard() {
  const {
    snake,
    food,
    gameOver,
    score,
    highScore,
    isPaused,
    hasStarted,
    startGame,
    resetGame,
  } = useSnakeGame();

  // Matrix effect state purely for aesthetic
  const [tickToggle, setTickToggle] = useState(false);
  
  useEffect(() => {
    if(hasStarted && !isPaused && !gameOver) {
        const interval = setInterval(() => setTickToggle(prev => !prev), 100);
        return () => clearInterval(interval);
    }
  }, [hasStarted, isPaused, gameOver]);

  // Create grid cells
  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
    const x = i % GRID_SIZE;
    const y = Math.floor(i / GRID_SIZE);
    
    const isHead = snake[0].x === x && snake[0].y === y;
    const isBody = snake.some((s, idx) => idx !== 0 && s.x === x && s.y === y);
    const isFood = food.x === x && food.y === y;

    return (
      <div
        key={i}
        className={`w-full h-full relative
          ${isHead ? 'bg-[#f0f] z-10' : ''}
          ${isBody ? 'bg-[#0ff] border-[1px] border-[#0ff]' : ''}
          ${isFood ? 'bg-[#f0f] border-2 border-black animate-pulse scale-75' : ''}
          ${!isHead && !isBody && !isFood ? 'border-[1px] border-[#0ff]/10' : ''}
        `}
      >
         {(isHead || isBody) && tickToggle && <div className="absolute inset-0 bg-white/20 mix-blend-difference" />}
      </div>
    );
  });

  return (
    <div className="flex flex-col w-full relative z-10 p-2 uppercase">
      
      {/* Score Header */}
      <div className="flex items-center justify-between w-full mb-4 px-2 border-b-4 border-[#0ff] pb-2 font-display text-[10px] md:text-[14px]">
        <div className="flex flex-col gap-1">
          <span className="text-[#f0f] border-2 border-[#f0f] px-1 self-start">DATA_YIELD</span>
          <span className="text-[#0ff] text-base md:text-xl">{score.toString().padStart(6, '0')}</span>
        </div>
        
        <div className="flex flex-col gap-1 items-end">
          <span className="text-[#f0f] border-2 border-[#f0f] px-1 self-end">MAX_CAPACITY</span>
          <span className="text-[#0ff] text-base md:text-xl">{highScore.toString().padStart(6, '0')}</span>
        </div>
      </div>

      {/* Game Board Container */}
      <div className="relative w-full aspect-square bg-[#000] border-4 border-[#0ff] overflow-hidden">
        
        <div 
          className="absolute inset-0"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            gap: '0'
          }}
        >
          {gridCells}
        </div>

        {/* Overlays */}
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-20 border-8 border-[#f0f] m-4">
            <div className="animate-pulse bg-[#f0f] text-black font-display p-2 mb-6">AWAITING_INPUT</div>
            <p className="text-[#0ff] font-sans text-2xl leading-relaxed">
              INJECT MOTION VECTOR<br/>[W A S D]<br />
              TO BREACH FIREWALL.
            </p>
          </div>
        )}

        {isPaused && hasStarted && !gameOver && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20 border-y-[16px] border-[#f0f] screen-tear">
            <h2 className="text-2xl md:text-3xl font-display text-[#f0f] text-center bg-black px-4 py-2 border-2 border-[#f0f] glitch-text" data-text="PROCESS_SUSPENDED">PROCESS_SUSPENDED</h2>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-30 border-[16px] border-[#f0f] p-4 screen-tear">
            <h2 className="text-xl md:text-3xl font-display text-white bg-[#f0f] px-4 py-2 mb-8 text-center uppercase border-4 border-white">CRITICAL_FAIL</h2>
            
            <div className="font-sans text-3xl text-[#0ff] mb-10 border-4 border-[#0ff] p-4 w-full max-w-[300px] text-center relative pointer-events-none">
                <p className="text-[#f0f] mb-2 font-display text-sm">FINAL_YIELD</p>
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-[#f0f]"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-[#f0f]"></div>
                <p>{score.toString().padStart(6, '0')}</p>
            </div>
            
            <button
              onClick={resetGame}
              className="px-8 py-4 bg-black border-4 border-[#0ff] text-[#0ff] font-display hover:bg-[#0ff] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#f0f] transition-none uppercase"
            >
              REBOOT_SEQUENCE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
