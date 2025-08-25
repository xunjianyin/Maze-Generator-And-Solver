import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Cell, MazeTheme } from '../types/maze';

interface MazeCanvasProps {
  maze: Cell[][];
  theme: MazeTheme;
  onCellClick: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isGenerating: boolean;
  isSolving: boolean;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({
  maze,
  theme,
  onCellClick,
  isGenerating,
  isSolving,
}) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getCellStyle = (cell: Cell) => {
    const baseStyle = {
      width: '20px',
      height: '20px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      transition: 'all 0.15s ease-in-out',
      borderRadius: '2px',
    };

    let backgroundColor = theme.pathColor;

    if (cell.isWall) {
      backgroundColor = theme.wallColor;
    } else if (cell.isStart) {
      backgroundColor = theme.startColor;
    } else if (cell.isEnd) {
      backgroundColor = theme.endColor;
    } else if (cell.isSolution) {
      backgroundColor = theme.solutionColor;
    } else if (cell.isCurrent) {
      backgroundColor = theme.currentColor;
    } else if (cell.isVisited) {
      backgroundColor = theme.visitedColor;
    }

    return {
      ...baseStyle,
      backgroundColor,
    };
  };

  const handleCellClick = (cell: Cell) => {
    if (isGenerating || isSolving || cell.isWall) return;

    // Find current player position
    const currentPlayer = maze.flat().find(c => c.isCurrent);
    if (!currentPlayer) return;

    const rowDiff = cell.row - currentPlayer.row;
    const colDiff = cell.col - currentPlayer.col;

    // Determine direction based on relative position
    if (Math.abs(rowDiff) + Math.abs(colDiff) === 1) {
      if (rowDiff === -1) onCellClick('up');
      else if (rowDiff === 1) onCellClick('down');
      else if (colDiff === -1) onCellClick('left');
      else if (colDiff === 1) onCellClick('right');
    }
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // If movement is significant, mark as dragging
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      setIsDragging(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || isDragging) {
      setTouchStart(null);
      setIsDragging(false);
      return;
    }

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    
    // Determine swipe direction
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          onCellClick('right');
        } else {
          onCellClick('left');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          onCellClick('down');
        } else {
          onCellClick('up');
        }
      }
    }
    
    setTouchStart(null);
    setIsDragging(false);
  };

  // Mouse drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setTouchStart({ x: e.clientX, y: e.clientY });
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!touchStart) return;
    
    const deltaX = e.clientX - touchStart.x;
    const deltaY = e.clientY - touchStart.y;
    
    if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
      setIsDragging(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!touchStart || isDragging) {
      setTouchStart(null);
      setIsDragging(false);
      return;
    }

    const deltaX = e.clientX - touchStart.x;
    const deltaY = e.clientY - touchStart.y;
    
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          onCellClick('right');
        } else {
          onCellClick('left');
        }
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0) {
          onCellClick('down');
        } else {
          onCellClick('up');
        }
      }
    }
    
    setTouchStart(null);
    setIsDragging(false);
  };

  if (maze.length === 0) {
    return (
      <div className="card p-8">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-500 text-lg">Generating maze...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Maze</h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-sm font-medium"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Generating...
            </motion.div>
          )}
          {isSolving && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium"
            >
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
              Solving...
            </motion.div>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <div 
          ref={canvasRef}
          className="grid gap-0 border-2 border-gray-300 rounded-xl overflow-hidden shadow-2xl"
          style={{
            gridTemplateColumns: `repeat(${maze[0]?.length || 0}, 20px)`,
            gridTemplateRows: `repeat(${maze.length || 0}, 20px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            setTouchStart(null);
            setIsDragging(false);
          }}
        >
          {maze.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className="maze-cell"
                style={getCellStyle(cell)}
                onClick={() => handleCellClick(cell)}
                whileHover={!cell.isWall ? { 
                  scale: 1.2, 
                  zIndex: 10,
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
                } : {}}
                whileTap={!cell.isWall ? { scale: 0.9 } : {}}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 0.1, 
                  delay: (rowIndex + colIndex) * 0.001,
                  type: "spring",
                  stiffness: 300
                }}
                title={`${cell.row}, ${cell.col} - ${cell.type}`}
              />
            ))
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div className="space-y-2">
          <div className="flex items-center">
            <div 
              className="w-4 h-4 mr-3 rounded shadow-sm"
              style={{ backgroundColor: theme.startColor }}
            ></div>
            <span className="font-medium">Start</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-4 h-4 mr-3 rounded shadow-sm"
              style={{ backgroundColor: theme.endColor }}
            ></div>
            <span className="font-medium">End</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-4 h-4 mr-3 rounded shadow-sm"
              style={{ backgroundColor: theme.currentColor }}
            ></div>
            <span className="font-medium">Player</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <div 
              className="w-4 h-4 mr-3 rounded shadow-sm"
              style={{ backgroundColor: theme.visitedColor }}
            ></div>
            <span className="font-medium">Visited</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-4 h-4 mr-3 rounded shadow-sm"
              style={{ backgroundColor: theme.solutionColor }}
            ></div>
            <span className="font-medium">Solution</span>
          </div>
          <div className="flex items-center">
            <div 
              className="w-4 h-4 mr-3 rounded shadow-sm"
              style={{ backgroundColor: theme.wallColor }}
            ></div>
            <span className="font-medium">Wall</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-medium text-blue-800">Controls</p>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          <strong>Desktop:</strong> Use arrow keys, WASD, or click adjacent cells • 
          <strong className="ml-2">Mobile:</strong> Swipe in any direction or tap adjacent cells
        </p>
      </div>
    </div>
  );
};

export default MazeCanvas;
