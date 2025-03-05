import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom dark theme colors with glass morphism support
        'game-bg': 'hsl(240, 10%, 3%)',
        'board-bg': 'hsla(240, 10%, 10%, 0.7)',
        'cell-bg': 'hsla(240, 10%, 15%, 0.5)',
        'tile-2': 'hsla(210, 50%, 40%, 0.9)',
        'tile-4': 'hsla(200, 55%, 45%, 0.9)',
        'tile-8': 'hsla(190, 60%, 50%, 0.9)',
        'tile-16': 'hsla(180, 65%, 50%, 0.9)',
        'tile-32': 'hsla(170, 70%, 45%, 0.9)',
        'tile-64': 'hsla(150, 75%, 40%, 0.9)',
        'tile-128': 'hsla(130, 80%, 40%, 0.9)',
        'tile-256': 'hsla(110, 85%, 40%, 0.9)',
        'tile-512': 'hsla(90, 90%, 40%, 0.9)',
        'tile-1024': 'hsla(60, 95%, 45%, 0.9)',
        'tile-2048': 'hsla(40, 100%, 50%, 0.9)',
      },
      boxShadow: {
        'tile': '0 0 12px rgba(100, 180, 255, 0.2)',
        'tile-glow-sm': '0 0 6px rgba(100, 180, 255, 0.3)',
        'tile-glow-md': '0 0 12px rgba(100, 180, 255, 0.4)',
        'tile-glow-lg': '0 0 20px rgba(120, 200, 255, 0.5)',
        'board': '0 0 30px rgba(0, 0, 0, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'appear': 'appear 200ms ease-out',
        'slide': 'slide 150ms ease-out',
        'merge': 'merge 200ms ease-in-out',
      },
      keyframes: {
        appear: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slide: {
          '0%': { transform: 'translateX(0) translateY(0)' },
          '100%': { transform: 'translateX(var(--slide-x, 0)) translateY(var(--slide-y, 0))' },
        },
        merge: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config; 