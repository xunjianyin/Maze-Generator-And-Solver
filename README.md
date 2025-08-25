# Maze Generator & Solver

An interactive web application that generates mazes using different algorithms and provides both manual gameplay and automatic solving capabilities.

## Features

### 🎮 Core Features
- **Multiple Generation Algorithms**: DFS, Prim's, and Kruskal's algorithms
- **Multiple Solver Algorithms**: BFS, DFS, and A* search with real-time visualization
- **Interactive Gameplay**: Manual maze solving with keyboard controls
- **Real-time Statistics**: Move counter and timer for manual gameplay
- **Multiple Themes**: Classic, Neon, Dungeon, Forest, and Ocean themes
- **Responsive Design**: Works on desktop and mobile devices

### 🎯 Game Modes
- **Manual Play**: Control the player with arrow keys or WASD
- **Auto-Solve**: Watch algorithms solve the maze automatically
- **Adjustable Speed**: Control animation speed for solver visualization

### 🎨 Visual Features
- **Smooth Animations**: Powered by Framer Motion
- **Color-coded Elements**: Different colors for walls, paths, visited cells, and solution
- **Interactive Controls**: Click on adjacent cells to move
- **Real-time Updates**: Live statistics and completion status

## Technologies Used

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Modern ES6+** JavaScript features

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd maze-generator-solver
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## How to Play

### Manual Mode
1. Use **arrow keys** or **WASD** to move the player
2. Click on **adjacent cells** to move
3. Navigate from the **green start** to the **yellow end**
4. Try to complete the maze with the fewest moves and fastest time

### Auto-Solve Mode
1. Select a **solver algorithm** (BFS, DFS, or A*)
2. Adjust the **animation speed** as desired
3. Click **"Auto-Solve Maze"** to watch the algorithm work
4. Observe how different algorithms explore the maze differently

### Maze Generation
1. Choose a **maze size** (11x11 to 41x41)
2. Select a **generation algorithm**:
   - **DFS**: Creates mazes with long corridors
   - **Prim's**: Creates balanced mazes
   - **Kruskal's**: Creates complex mazes with many paths
3. Click **"Generate New Maze"** to create a new puzzle

## Algorithms Explained

### Generation Algorithms

#### Depth-First Search (DFS)
- Uses a stack-based approach
- Creates mazes with long corridors and fewer dead ends
- Good for creating challenging, winding paths

#### Prim's Algorithm
- Uses a minimum spanning tree approach
- Creates more balanced mazes with uniform path distribution
- Good for creating fair, solvable mazes

#### Kruskal's Algorithm
- Uses a union-find data structure
- Creates mazes with many short paths and more complexity
- Good for creating intricate, challenging mazes

### Solver Algorithms

#### Breadth-First Search (BFS)
- Explores all neighbors at the current depth before moving deeper
- Guarantees the shortest path to the goal
- Good for finding optimal solutions

#### Depth-First Search (DFS)
- Explores as far as possible along each branch before backtracking
- May not find the shortest path
- Good for exploring maze structure

#### A* Search
- Uses heuristic function to guide search toward the goal
- Combines the benefits of BFS and DFS
- Efficiently finds optimal paths in most cases

## Project Structure

```
src/
├── components/          # React components
│   ├── MazeCanvas.tsx   # Main maze rendering component
│   ├── ControlsPanel.tsx # Control panel with settings
│   └── GameStats.tsx    # Statistics and completion display
├── types/              # TypeScript type definitions
│   └── maze.ts         # Core types and interfaces
├── utils/              # Utility functions and algorithms
│   ├── mazeGenerators.ts # Maze generation algorithms
│   ├── mazeSolvers.ts   # Maze solving algorithms
│   └── themes.ts       # Theme definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Customization

### Adding New Themes
1. Add a new theme object to `src/utils/themes.ts`
2. Include all required color properties
3. The theme will automatically appear in the theme selector

### Adding New Algorithms
1. Implement the algorithm in the appropriate utility file
2. Add the algorithm type to the TypeScript definitions
3. Update the UI components to include the new option

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by classic maze generation algorithms
- Built with modern React and TypeScript best practices
- Uses Tailwind CSS for beautiful, responsive design
- Powered by Framer Motion for smooth animations
