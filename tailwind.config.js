/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'maze-wall': '#1f2937',
        'maze-path': '#f9fafb',
        'maze-visited': '#3b82f6',
        'maze-current': '#ef4444',
        'maze-start': '#10b981',
        'maze-end': '#f59e0b',
        'maze-solution': '#8b5cf6',
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
