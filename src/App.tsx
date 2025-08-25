import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import MazeCanvas from './components/MazeCanvas';
import ControlsPanel from './components/ControlsPanel';
import GameStats from './components/GameStats';
import { Cell, Position, GenerationAlgorithm, SolverAlgorithm, GameStats as GameStatsType } from './types/maze';
import { MazeGenerator } from './utils/mazeGenerators';
import { MazeSolver } from './utils/mazeSolvers';
import { themes } from './utils/themes';

const DEFAULT_MAZE_SIZE = 21; // Must be odd for proper maze generation

function App() {
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [mazeSize, setMazeSize] = useState(DEFAULT_MAZE_SIZE);
  const [generationAlgorithm, setGenerationAlgorithm] = useState<GenerationAlgorithm>('dfs');
  const [solverAlgorithm, setSolverAlgorithm] = useState<SolverAlgorithm>('bfs');
  const [currentTheme, setCurrentTheme] = useState('classic');
  const [gameMode, setGameMode] = useState<'manual' | 'auto'>('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(50);
  const [gameStats, setGameStats] = useState<GameStatsType>({
    moves: 0,
    time: 0,
    isComplete: false,
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [playerPosition, setPlayerPosition] = useState<Position>({ row: 1, col: 1 });
  const [endPosition] = useState<Position>({ row: DEFAULT_MAZE_SIZE - 2, col: DEFAULT_MAZE_SIZE - 2 });

  // Define start position at the top level
  const startPosition = { row: 1, col: 1 };

  const generateMaze = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate generation delay for visual effect
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const generator = new MazeGenerator(mazeSize, mazeSize);
    const newMaze = generator.generate(generationAlgorithm);
    
    // Set start and end positions
    newMaze[startPosition.row][startPosition.col].isStart = true;
    newMaze[startPosition.row][startPosition.col].type = 'start';
    newMaze[endPosition.row][endPosition.col].isEnd = true;
    newMaze[endPosition.row][endPosition.col].type = 'end';
    
    setMaze(newMaze);
    setPlayerPosition(startPosition);
    setGameStats({ moves: 0, time: 0, isComplete: false });
    setStartTime(null);
    setIsGenerating(false);
  }, [mazeSize, generationAlgorithm, startPosition, endPosition]);

  const solveMaze = useCallback(async () => {
    if (maze.length === 0) return;
    
    setIsSolving(true);
    const solver = new MazeSolver(maze);
    const steps = solver.solve(solverAlgorithm, startPosition, endPosition);
    
    // Animate the solution
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      setMaze(prevMaze => {
        const newMaze = prevMaze.map(row => row.map(cell => ({ ...cell })));
        const cell = newMaze[step.position.row][step.position.col];
        
        if (step.type === 'visited') {
          cell.isVisited = true;
          cell.type = 'visited';
        } else if (step.type === 'current') {
          cell.isCurrent = true;
          cell.type = 'current';
        } else if (step.type === 'solution') {
          cell.isSolution = true;
          cell.type = 'solution';
        }
        
        return newMaze;
      });
      
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
    
    setIsSolving(false);
  }, [maze, solverAlgorithm, startPosition, endPosition, animationSpeed]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameMode !== 'manual' || isSolving || gameStats.isComplete) return;
    
    const directions = {
      up: { row: -1, col: 0 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
      right: { row: 0, col: 1 },
    };
    
    const dir = directions[direction];
    const newRow = playerPosition.row + dir.row;
    const newCol = playerPosition.col + dir.col;
    
    if (newRow >= 0 && newRow < mazeSize && 
        newCol >= 0 && newCol < mazeSize && 
        !maze[newRow][newCol].isWall) {
      
      setMaze(prevMaze => {
        const newMaze = prevMaze.map(row => row.map(cell => ({ ...cell })));
        
        // Clear previous player position
        newMaze[playerPosition.row][playerPosition.col].isCurrent = false;
        if (newMaze[playerPosition.row][playerPosition.col].type === 'current') {
          newMaze[playerPosition.row][playerPosition.col].type = 'path';
        }
        
        // Set new player position
        newMaze[newRow][newCol].isCurrent = true;
        newMaze[newRow][newCol].type = 'current';
        
        return newMaze;
      });
      
      setPlayerPosition({ row: newRow, col: newCol });
      setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
      
      // Check if reached end
      if (newRow === endPosition.row && newCol === endPosition.col) {
        setGameStats(prev => ({ ...prev, isComplete: true }));
      }
    }
  }, [playerPosition, maze, mazeSize, gameMode, isSolving, gameStats.isComplete, endPosition]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        movePlayer('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        movePlayer('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        movePlayer('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        movePlayer('right');
        break;
    }
  }, [movePlayer]);

  const resetGame = useCallback(() => {
    setPlayerPosition(startPosition);
    setGameStats({ moves: 0, time: 0, isComplete: false });
    setStartTime(null);
    
    if (maze.length > 0) {
      setMaze(prevMaze => 
        prevMaze.map(row => 
          row.map(cell => ({
            ...cell,
            isVisited: false,
            isCurrent: false,
            isSolution: false,
            type: cell.isStart ? 'start' : cell.isEnd ? 'end' : cell.isWall ? 'wall' : 'path'
          }))
        )
      );
    }
  }, [startPosition, maze]);

  // Update timer
  useEffect(() => {
    let interval: number;
    
    if (gameMode === 'manual' && !gameStats.isComplete && startTime) {
      interval = setInterval(() => {
        setGameStats(prev => ({
          ...prev,
          time: Math.floor((Date.now() - startTime) / 1000)
        }));
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameMode, gameStats.isComplete, startTime]);

  // Start timer when player moves
  useEffect(() => {
    if (gameMode === 'manual' && gameStats.moves === 1 && !startTime) {
      setStartTime(Date.now());
    }
  }, [gameStats.moves, gameMode, startTime]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Generate initial maze
  useEffect(() => {
    generateMaze();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 container mx-auto px-4 py-8"
      >
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold gradient-text mb-4">
            Maze Generator & Solver
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the art of maze generation with multiple algorithms and solve them manually or automatically
          </p>
        </motion.header>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Controls Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-1"
          >
            <ControlsPanel
              mazeSize={mazeSize}
              setMazeSize={setMazeSize}
              generationAlgorithm={generationAlgorithm}
              setGenerationAlgorithm={setGenerationAlgorithm}
              solverAlgorithm={solverAlgorithm}
              setSolverAlgorithm={setSolverAlgorithm}
              currentTheme={currentTheme}
              setCurrentTheme={setCurrentTheme}
              gameMode={gameMode}
              setGameMode={setGameMode}
              animationSpeed={animationSpeed}
              setAnimationSpeed={setAnimationSpeed}
              onGenerateMaze={generateMaze}
              onSolveMaze={solveMaze}
              onResetGame={resetGame}
              isGenerating={isGenerating}
              isSolving={isSolving}
            />
          </motion.div>

          {/* Maze Canvas */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <MazeCanvas
              maze={maze}
              theme={themes[currentTheme]}
              onCellClick={movePlayer}
              isGenerating={isGenerating}
              isSolving={isSolving}
            />
          </motion.div>

          {/* Game Stats */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="lg:col-span-1"
          >
            <GameStats
              stats={gameStats}
              gameMode={gameMode}
              isComplete={gameStats.isComplete}
            />
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 pt-8 border-t border-white/20"
        >
          <p className="text-gray-500 text-sm">
            Built with React, TypeScript, and Tailwind CSS • 
            <span className="ml-2">Use arrow keys or WASD to move • 
            <span className="ml-2">Touch gestures supported on mobile</span></span>
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}

export default App;
