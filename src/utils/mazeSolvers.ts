import { Cell, Position, SolverAlgorithm, SolverStep } from '../types/maze';

export class MazeSolver {
  private maze: Cell[][];
  private width: number;
  private height: number;

  constructor(maze: Cell[][]) {
    this.maze = maze;
    this.height = maze.length;
    this.width = maze[0].length;
  }

  public solve(algorithm: SolverAlgorithm, start: Position, end: Position): SolverStep[] {
    switch (algorithm) {
      case 'bfs':
        return this.solveBFS(start, end);
      case 'dfs':
        return this.solveDFS(start, end);
      case 'astar':
        return this.solveAStar(start, end);
      default:
        return this.solveBFS(start, end);
    }
  }

  private solveBFS(start: Position, end: Position): SolverStep[] {
    const queue: Array<{ pos: Position; path: Position[] }> = [{ pos: start, path: [start] }];
    const visited: boolean[][] = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
    const steps: SolverStep[] = [];

    visited[start.row][start.col] = true;
    steps.push({ position: start, type: 'current' });

    while (queue.length > 0) {
      const { pos, path } = queue.shift()!;
      
      if (pos.row === end.row && pos.col === end.col) {
        // Found the solution
        path.forEach((p, index) => {
          if (index === 0) return; // Skip start position
          steps.push({ position: p, type: 'solution' });
        });
        return steps;
      }

      const neighbors = this.getValidNeighbors(pos);
      
      for (const neighbor of neighbors) {
        if (!visited[neighbor.row][neighbor.col]) {
          visited[neighbor.row][neighbor.col] = true;
          steps.push({ position: neighbor, type: 'visited' });
          
          queue.push({
            pos: neighbor,
            path: [...path, neighbor]
          });
        }
      }
    }

    return steps;
  }

  private solveDFS(start: Position, end: Position): SolverStep[] {
    const stack: Array<{ pos: Position; path: Position[] }> = [{ pos: start, path: [start] }];
    const visited: boolean[][] = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
    const steps: SolverStep[] = [];

    visited[start.row][start.col] = true;
    steps.push({ position: start, type: 'current' });

    while (stack.length > 0) {
      const { pos, path } = stack.pop()!;
      
      if (pos.row === end.row && pos.col === end.col) {
        // Found the solution
        path.forEach((p, index) => {
          if (index === 0) return; // Skip start position
          steps.push({ position: p, type: 'solution' });
        });
        return steps;
      }

      const neighbors = this.getValidNeighbors(pos);
      
      for (const neighbor of neighbors) {
        if (!visited[neighbor.row][neighbor.col]) {
          visited[neighbor.row][neighbor.col] = true;
          steps.push({ position: neighbor, type: 'visited' });
          
          stack.push({
            pos: neighbor,
            path: [...path, neighbor]
          });
        }
      }
    }

    return steps;
  }

  private solveAStar(start: Position, end: Position): SolverStep[] {
    const openSet: Array<{ pos: Position; f: number; g: number; h: number; parent: Position | null }> = [
      { pos: start, f: 0, g: 0, h: 0, parent: null }
    ];
    const closedSet: Set<string> = new Set();
    const cameFrom: Map<string, Position> = new Map();
    const gScore: Map<string, number> = new Map();
    const fScore: Map<string, number> = new Map();
    const steps: SolverStep[] = [];

    gScore.set(this.posToKey(start), 0);
    fScore.set(this.posToKey(start), this.heuristic(start, end));
    steps.push({ position: start, type: 'current' });

    while (openSet.length > 0) {
      // Find node with lowest f score
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      
      if (current.pos.row === end.row && current.pos.col === end.col) {
        // Reconstruct path
        const path: Position[] = [];
        let currentPos = current.pos;
        
        while (cameFrom.has(this.posToKey(currentPos))) {
          path.unshift(currentPos);
          currentPos = cameFrom.get(this.posToKey(currentPos))!;
        }
        path.unshift(start);
        
        // Add solution steps
        path.forEach((p, index) => {
          if (index === 0) return; // Skip start position
          steps.push({ position: p, type: 'solution' });
        });
        
        return steps;
      }

      closedSet.add(this.posToKey(current.pos));
      steps.push({ position: current.pos, type: 'visited' });

      const neighbors = this.getValidNeighbors(current.pos);
      
      for (const neighbor of neighbors) {
        if (closedSet.has(this.posToKey(neighbor))) {
          continue;
        }

        const tentativeGScore = current.g + 1;
        const neighborKey = this.posToKey(neighbor);
        
        if (!gScore.has(neighborKey) || tentativeGScore < gScore.get(neighborKey)!) {
          cameFrom.set(neighborKey, current.pos);
          gScore.set(neighborKey, tentativeGScore);
          fScore.set(neighborKey, tentativeGScore + this.heuristic(neighbor, end));
          
          const existingIndex = openSet.findIndex(item => 
            item.pos.row === neighbor.row && item.pos.col === neighbor.col
          );
          
          if (existingIndex === -1) {
            openSet.push({
              pos: neighbor,
              f: fScore.get(neighborKey)!,
              g: tentativeGScore,
              h: this.heuristic(neighbor, end),
              parent: current.pos
            });
          }
        }
      }
    }

    return steps;
  }

  private getValidNeighbors(pos: Position): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 }
    ];

    for (const dir of directions) {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;
      
      if (newRow >= 0 && newRow < this.height && 
          newCol >= 0 && newCol < this.width && 
          !this.maze[newRow][newCol].isWall) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  }

  private heuristic(pos: Position, end: Position): number {
    // Manhattan distance
    return Math.abs(pos.row - end.row) + Math.abs(pos.col - end.col);
  }

  private posToKey(pos: Position): string {
    return `${pos.row},${pos.col}`;
  }
}
