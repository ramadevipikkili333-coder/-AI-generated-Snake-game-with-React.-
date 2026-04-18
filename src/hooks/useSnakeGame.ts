import { useState, useEffect, useRef, useCallback } from 'react';

export type Point = { x: number; y: number };

export const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2; // Milliseconds to subtract per food eaten
const MIN_SPEED = 60;

const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // UP

export function useSnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(INITIAL_DIRECTION);
  const nextDirectionRef = useRef(INITIAL_DIRECTION);
  const speedRef = useRef(INITIAL_SPEED);

  const spawnFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Make sure food doesn't spawn on the snake
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    setFood(newFood);
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    directionRef.current = INITIAL_DIRECTION;
    nextDirectionRef.current = INITIAL_DIRECTION;
    speedRef.current = INITIAL_SPEED;
    setScore(0);
    setGameOver(false);
    setHasStarted(false);
    setIsPaused(false);
    spawnFood(INITIAL_SNAKE);
  }, [spawnFood]);

  const startGame = () => {
    if (gameOver) resetGame();
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!hasStarted || isPaused || gameOver) return;

    let timeoutId: NodeJS.Timeout;

    const tick = () => {
      setSnake((prevSnake) => {
        const currentHead = prevSnake[0];
        const nextDir = nextDirectionRef.current;
        directionRef.current = nextDir; // Lock in the direction for this tick

        const newHead = {
          x: currentHead.x + nextDir.x,
          y: currentHead.y + nextDir.y,
        };

        // Check walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          setHighScore((h) => Math.max(h, score));
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameOver(true);
          setHighScore((h) => Math.max(h, score));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision using the ref for accurate current food position
        // Since functional state update doesn't have immediate access to closure state updates reliably if food changed recently
        // we use functional state combined with local food state
        setFood((currentFood) => {
          if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
            setScore((s) => s + 10);
            speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
            // We need to spawn new food. Doing this cleanly inside the setter is okay.
            let nextFood: Point;
            while (true) {
              nextFood = {
                x: Math.floor(Math.random() * GRID_SIZE),
                y: Math.floor(Math.random() * GRID_SIZE),
              };
              if (!newSnake.some((s) => s.x === nextFood.x && s.y === nextFood.y)) {
                break;
              }
            }
            return nextFood;
          }
          newSnake.pop(); // Remove tail if no food eaten
          return currentFood;
        });

        return newSnake;
      });

      timeoutId = setTimeout(tick, speedRef.current);
    };

    timeoutId = setTimeout(tick, speedRef.current);

    return () => clearTimeout(timeoutId);
  }, [hasStarted, isPaused, gameOver, score]); // score is included so high score updates can use closure, but could be refactored.

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted && !gameOver && (e.key === 'ArrowUp' || e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd')) {
         startGame();
      }

      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
        return;
      }

      const dir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (dir.y !== 1) nextDirectionRef.current = { x: 0, y: -1 };
          e.preventDefault();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (dir.y !== -1) nextDirectionRef.current = { x: 0, y: 1 };
          e.preventDefault();
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (dir.x !== 1) nextDirectionRef.current = { x: -1, y: 0 };
          e.preventDefault();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (dir.x !== -1) nextDirectionRef.current = { x: 1, y: 0 };
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  return {
    snake,
    food,
    gameOver,
    score,
    highScore,
    isPaused,
    hasStarted,
    startGame,
    resetGame,
    setIsPaused
  };
}
