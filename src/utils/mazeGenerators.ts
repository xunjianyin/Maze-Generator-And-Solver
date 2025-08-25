import { Cell, Position, GenerationAlgorithm } from '../types/maze';

export class MazeGenerator {
  private width: number;
  private height: number;
  private maze: Cell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.maze = [];
    this.initializeMaze();
  }

  private initializeMaze(): void {
    for (let row = 0; row < this.height; row++) {
      this.maze[row] = [];
      for (let col = 0; col < this.width; col++) {
        this.maze[row][col] = {
          row,
          col,
          type: 'wall',
          isWall: true,
          isVisited: false,
          isCurrent: false,
          isStart: false,
          isEnd: false,
          isSolution: false,
        };
      }
    }
  }

  public generate(algorithm: GenerationAlgorithm): Cell[][] {
    switch (algorithm) {
      case 'dfs':
        return this.generateDFS();
      case 'prim':
        return this.generatePrim();
      case 'kruskal':
        return this.generateKruskal();
      default:
        return this.generateDFS();
    }
  }

  private generateDFS(): Cell[][] {
    const stack: Position[] = [];
    const visited: boolean[][] = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
    
    // Start from a random odd position
    const startRow = 1;
    const startCol = 1;
    
    stack.push({ row: startRow, col: startCol });
    visited[startRow][startCol] = true;
    this.maze[startRow][startCol].isWall = false;
    this.maze[startRow][startCol].type = 'path';

    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = this.getUnvisitedNeighbors(current, visited);

      if (neighbors.length === 0) {
        stack.pop();
      } else {
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        const wall = this.getWallBetween(current, next);
        
        if (wall) {
          this.maze[wall.row][wall.col].isWall = false;
          this.maze[wall.row][wall.col].type = 'path';
        }
        
        this.maze[next.row][next.col].isWall = false;
        this.maze[next.row][next.col].type = 'path';
        
        visited[next.row][next.col] = true;
        stack.push(next);
      }
    }

    return this.maze;
  }

  private generatePrim(): Cell[][] {
    const walls: Position[] = [];
    const visited: boolean[][] = Array(this.height).fill(null).map(() => Array(this.width).fill(false));
    
    // Start from a random position
    const startRow = 1;
    const startCol = 1;
    
    this.maze[startRow][startCol].isWall = false;
    this.maze[startRow][startCol].type = 'path';
    visited[startRow][startCol] = true;
    
    // Add walls around the starting cell
    this.addWalls({ row: startRow, col: startCol }, walls);

    while (walls.length > 0) {
      const wallIndex = Math.floor(Math.random() * walls.length);
      const wall = walls.splice(wallIndex, 1)[0];
      
      const neighbors = this.getNeighbors(wall);
      const visitedNeighbors = neighbors.filter(n => visited[n.row][n.col]);
      
      if (visitedNeighbors.length === 1) {
        this.maze[wall.row][wall.col].isWall = false;
        this.maze[wall.row][wall.col].type = 'path';
        visited[wall.row][wall.col] = true;
        
        // Add new walls
        this.addWalls(wall, walls);
      }
    }

    return this.maze;
  }

  private generateKruskal(): Cell[][] {
    const edges: Array<{ wall: Position; cell1: Position; cell2: Position }> = [];
    const sets: Map<string, Set<string>> = new Map();
    
    // Initialize sets for each cell
    for (let row = 1; row < this.height - 1; row += 2) {
      for (let col = 1; col < this.width - 1; col += 2) {
        const key = `${row},${col}`;
        sets.set(key, new Set([key]));
      }
    }
    
    // Collect all walls
    for (let row = 1; row < this.height - 1; row++) {
      for (let col = 1; col < this.width - 1; col++) {
        if (row % 2 === 0 || col % 2 === 0) {
          const neighbors = this.getNeighbors({ row, col });
          const cells = neighbors.filter(n => n.row % 2 === 1 && n.col % 2 === 1);
          
          if (cells.length === 2) {
            edges.push({
              wall: { row, col },
              cell1: cells[0],
              cell2: cells[1]
            });
          }
        }
      }
    }
    
    // Shuffle edges
    for (let i = edges.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [edges[i], edges[j]] = [edges[j], edges[i]];
    }
    
    // Process edges
    for (const edge of edges) {
      const key1 = `${edge.cell1.row},${edge.cell1.col}`;
      const key2 = `${edge.cell2.row},${edge.cell2.col}`;
      
      if (!this.sameSet(key1, key2, sets)) {
        this.maze[edge.wall.row][edge.wall.col].isWall = false;
        this.maze[edge.wall.row][edge.wall.col].type = 'path';
        this.unionSets(key1, key2, sets);
      }
    }
    
    // Make all odd cells paths
    for (let row = 1; row < this.height - 1; row += 2) {
      for (let col = 1; col < this.width - 1; col += 2) {
        this.maze[row][col].isWall = false;
        this.maze[row][col].type = 'path';
      }
    }

    return this.maze;
  }

  private getUnvisitedNeighbors(pos: Position, visited: boolean[][]): Position[] {
    const neighbors: Position[] = [];
    const directions = [
      { row: -2, col: 0 },
      { row: 2, col: 0 },
      { row: 0, col: -2 },
      { row: 0, col: 2 }
    ];

    for (const dir of directions) {
      const newRow = pos.row + dir.row;
      const newCol = pos.col + dir.col;
      
      if (newRow > 0 && newRow < this.height - 1 && 
          newCol > 0 && newCol < this.width - 1 && 
          !visited[newRow][newCol]) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  }

  private getNeighbors(pos: Position): Position[] {
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
          newCol >= 0 && newCol < this.width) {
        neighbors.push({ row: newRow, col: newCol });
      }
    }

    return neighbors;
  }

  private getWallBetween(pos1: Position, pos2: Position): Position | null {
    const wallRow = (pos1.row + pos2.row) / 2;
    const wallCol = (pos1.col + pos2.col) / 2;
    
    if (wallRow >= 0 && wallRow < this.height && 
        wallCol >= 0 && wallCol < this.width) {
      return { row: wallRow, col: wallCol };
    }
    
    return null;
  }

  private addWalls(pos: Position, walls: Position[]): void {
    const neighbors = this.getNeighbors(pos);
    
    for (const neighbor of neighbors) {
      if (this.maze[neighbor.row][neighbor.col].isWall) {
        walls.push(neighbor);
      }
    }
  }

  private sameSet(key1: string, key2: string, sets: Map<string, Set<string>>): boolean {
    return sets.get(key1) === sets.get(key2);
  }

  private unionSets(key1: string, key2: string, sets: Map<string, Set<string>>): void {
    const set1 = sets.get(key1)!;
    const set2 = sets.get(key2)!;
    
    if (set1 !== set2) {
      const union = new Set([...set1, ...set2]);
      
      for (const key of union) {
        sets.set(key, union);
      }
    }
  }
}
