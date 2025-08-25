export type CellType = 'wall' | 'path' | 'visited' | 'current' | 'start' | 'end' | 'solution';

export interface Cell {
  row: number;
  col: number;
  type: CellType;
  isWall: boolean;
  isVisited: boolean;
  isCurrent: boolean;
  isStart: boolean;
  isEnd: boolean;
  isSolution: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface MazeConfig {
  width: number;
  height: number;
  startPosition: Position;
  endPosition: Position;
}

export type GenerationAlgorithm = 'dfs' | 'prim' | 'kruskal';
export type SolverAlgorithm = 'bfs' | 'dfs' | 'astar';

export interface GameStats {
  moves: number;
  time: number;
  isComplete: boolean;
}

export interface SolverStep {
  position: Position;
  type: 'visited' | 'current' | 'solution';
}

export interface MazeTheme {
  name: string;
  wallColor: string;
  pathColor: string;
  visitedColor: string;
  currentColor: string;
  startColor: string;
  endColor: string;
  solutionColor: string;
}
