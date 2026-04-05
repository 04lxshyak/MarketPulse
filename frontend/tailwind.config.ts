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
      },
      colors: {
        background: '#0b1326',
        surface: '#0b1326',
        surface_container_low: '#131b2e',
        surface_container_high: '#222a3d',
        surface_container_highest: '#2d3449',
        outline_variant: '#464554',
        buy: '#22c55e',
        sell: '#ef4444',
        hold: '#f59e0b',
        primary: '#c0c1ff',
        primary_container: '#8083ff',
        accent: '#6366f1',
        dark: '#0f172a',
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(to bottom, rgba(34, 42, 61, 0.4), rgba(6, 14, 32, 0.1))',
      }
    },
  },
  plugins: [],
} satisfies Config
