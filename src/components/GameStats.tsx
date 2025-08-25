import React from 'react';
import { motion } from 'framer-motion';
import { GameStats as GameStatsType } from '../types/maze';

interface GameStatsProps {
  stats: GameStatsType;
  gameMode: 'manual' | 'auto';
  isComplete: boolean;
}

const GameStats: React.FC<GameStatsProps> = ({ stats, gameMode, isComplete }) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Game Statistics */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-6"
      >
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800">Game Statistics</h3>
        </div>
        
        <div className="space-y-4">
          {/* Moves Counter */}
          <motion.div 
            className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-700">Moves:</span>
            </div>
            <span className="text-2xl font-bold text-blue-600">{stats.moves}</span>
          </motion.div>

          {/* Timer */}
          {gameMode === 'manual' && (
            <motion.div 
              className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-700">Time:</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {formatTime(stats.time)}
              </span>
            </motion.div>
          )}

          {/* Game Mode */}
          <motion.div 
            className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center">
              <span className="text-sm font-semibold text-gray-700">Mode:</span>
            </div>
            <span className="text-sm font-bold text-purple-600 capitalize px-3 py-1 bg-purple-100 rounded-full">
              {gameMode}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Completion Status */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="card p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div 
              className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          </div>
          
          <motion.h4 
            className="text-2xl font-bold text-green-800 text-center mb-3"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Maze Completed!
          </motion.h4>
          
          <motion.p 
            className="text-sm text-green-700 text-center mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Congratulations! You've successfully reached the end of the maze.
          </motion.p>
          
          {gameMode === 'manual' && (
            <motion.div 
              className="p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-300"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-center">
                <p className="text-sm font-semibold text-green-800 mb-2">
                  Final Score
                </p>
                <div className="flex justify-center items-center space-x-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-900">{stats.moves}</p>
                    <p className="text-xs text-green-600">moves</p>
                  </div>
                  <div className="text-green-400">×</div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-900">{formatTime(stats.time)}</p>
                    <p className="text-xs text-green-600">time</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default GameStats;
