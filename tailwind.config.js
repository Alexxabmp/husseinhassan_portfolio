/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#000000',
          900: '#050507',
          850: '#0a0a0f',
          800: '#111218',
          700: '#1b1c24',
          600: '#272834',
        },
        cyan: {
          glow: '#00f0ff',
          neon: '#06b6d4',
          deep: '#0284c7',
        },
        amber: {
          glow: '#fb923c',
          sunset: '#f59e0b',
          deep: '#d97706',
        }
      },
      fontFamily: {
        sans: ['"Geist Mono"', 'monospace'],
        mono: ['"Geist Mono"', 'monospace'],
        display: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
