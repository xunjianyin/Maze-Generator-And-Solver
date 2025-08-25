import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GenerationAlgorithm, SolverAlgorithm } from '../types/maze';

interface ControlsPanelProps {
  mazeSize: number;
  setMazeSize: (size: number) => void;
  generationAlgorithm: GenerationAlgorithm;
  setGenerationAlgorithm: (algorithm: GenerationAlgorithm) => void;
  solverAlgorithm: SolverAlgorithm;
  setSolverAlgorithm: (algorithm: SolverAlgorithm) => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  gameMode: 'manual' | 'auto';
  setGameMode: (mode: 'manual' | 'auto') => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  onGenerateMaze: () => void;
  onSolveMaze: () => void;
  onResetGame: () => void;
  isGenerating: boolean;
  isSolving: boolean;
}

const ControlsPanel: React.FC<ControlsPanelProps> = ({
  mazeSize,
  setMazeSize,
  generationAlgorithm,
  setGenerationAlgorithm,
  currentTheme,
  setCurrentTheme,
  gameMode,
  setGameMode,
  onGenerateMaze,
  onResetGame,
  isGenerating,
}) => {
  const [isGameSettingsOpen, setIsGameSettingsOpen] = useState(false);

  const generationAlgorithms = [
    { value: 'dfs', label: 'Depth-First Search', description: 'Creates mazes with long corridors' },
    { value: 'prim', label: "Prim's Algorithm", description: 'Creates more balanced mazes' },
    { value: 'kruskal', label: "Kruskal's Algorithm", description: 'Creates mazes with many short paths' },
  ];

  const themes = [
    { value: 'classic', label: 'Classic' },
    { value: 'neon', label: 'Neon' },
    { value: 'dungeon', label: 'Dungeon' },
    { value: 'forest', label: 'Forest' },
    { value: 'ocean', label: 'Ocean' },
  ];

  const mazeSizes = [
    { value: 11, label: '11x11 (Easy)' },
    { value: 21, label: '21x21 (Medium)' },
    { value: 31, label: '31x31 (Hard)' },
    { value: 41, label: '41x41 (Expert)' },
  ];

  return (
    <div className="space-y-6">
      {/* Game Settings - Collapsible (Moved to top) */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-6"
      >
        {/* Collapsible Header Button */}
        <motion.button
          onClick={() => setIsGameSettingsOpen(!isGameSettingsOpen)}
          className="w-full flex items-center justify-between mb-4"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800">Game Settings</h3>
          </div>
          <motion.div
            animate={{ rotate: isGameSettingsOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-6 text-gray-600"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </motion.button>
        
        {/* Collapsible Content */}
        <AnimatePresence>
          {isGameSettingsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="space-y-6 pt-4 border-t border-gray-200">
                {/* Game Mode */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Game Mode
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 rounded-xl border border-gray-200 hover:border-blue-200 cursor-pointer transition-all">
                      <input
                        type="radio"
                        value="manual"
                        checked={gameMode === 'manual'}
                        onChange={(e) => setGameMode(e.target.value as 'manual' | 'auto')}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <div>
                        <span className="text-sm font-medium">Manual Play</span>
                        <p className="text-xs text-gray-500">Control the player yourself</p>
                      </div>
                    </label>
                    <label className="flex items-center p-3 rounded-xl border border-gray-200 hover:border-blue-200 cursor-pointer transition-all">
                      <input
                        type="radio"
                        value="auto"
                        checked={gameMode === 'auto'}
                        onChange={(e) => setGameMode(e.target.value as 'manual' | 'auto')}
                        className="mr-3 w-4 h-4 text-blue-600"
                      />
                      <div>
                        <span className="text-sm font-medium">Auto-Solve Only</span>
                        <p className="text-xs text-gray-500">Watch algorithms solve</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Theme
                  </label>
                  <select
                    value={currentTheme}
                    onChange={(e) => setCurrentTheme(e.target.value)}
                    className="select-field touch-target"
                  >
                    {themes.map((theme) => (
                      <option key={theme.value} value={theme.value}>
                        {theme.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                <motion.button
                  onClick={onResetGame}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full btn-secondary touch-target"
                >
                  <div className="flex items-center justify-center">
                    Reset Game
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Maze Generation */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 00-2-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Maze Generation</h3>
        </div>
        
        {/* Maze Size */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Maze Size
          </label>
          <select
            value={mazeSize}
            onChange={(e) => setMazeSize(Number(e.target.value))}
            className="select-field touch-target"
            disabled={isGenerating}
          >
            {mazeSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        {/* Generation Algorithm */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Generation Algorithm
          </label>
          <select
            value={generationAlgorithm}
            onChange={(e) => setGenerationAlgorithm(e.target.value as GenerationAlgorithm)}
            className="select-field touch-target"
            disabled={isGenerating}
          >
            {generationAlgorithms.map((algo) => (
              <option key={algo.value} value={algo.value}>
                {algo.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-2 italic">
            {generationAlgorithms.find(a => a.value === generationAlgorithm)?.description}
          </p>
        </div>

        {/* Generate Button */}
        <motion.button
          onClick={onGenerateMaze}
          disabled={isGenerating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full btn-primary touch-target"
        >
          {isGenerating ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Generating...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              Generate New Maze
            </div>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ControlsPanel;
