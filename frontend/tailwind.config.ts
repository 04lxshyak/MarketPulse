import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Anton', 'sans-serif'], // For the massive bold headers
      },
      colors: {
        background: '#04000b', // Deep space dark
        surface: '#0b0416',
        surface_container_low: '#120726',
        surface_container_high: '#1a0b38',
        surface_container_highest: '#24104c',
        outline_variant: '#4c3a73',
        buy: '#22c55e',
        sell: '#ef4444',
        hold: '#f59e0b',
        primary: '#8b5cf6', // The majestic purple from the screenshot CTA
        primary_hover: '#9333ea',
        primary_container: '#a78bfa',
        accent: '#6366f1',
        dark: '#020005',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom, rgba(34, 42, 61, 0.4), rgba(6, 14, 32, 0.1))',
        'space-glow': 'radial-gradient(ellipse at bottom, #3b0764 0%, #04000b 70%)',
        'space-glow-top': 'radial-gradient(ellipse at top, #3b0764 0%, #04000b 70%)',
      }
    },
  },
  plugins: [],
} satisfies Config
