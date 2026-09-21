/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#050608',
        surface: {
          DEFAULT: '#0c0e12',
          elevated: '#12151c',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: 'rgba(255, 255, 255, 0.16)',
        },
        primary: '#f4f5f6',
        secondary: '#8c919d',
        muted: '#525660',
        accent: {
          DEFAULT: '#c99a5e',
          light: '#dfb784',
          glow: 'rgba(201, 154, 94, 0.28)',
          muted: 'rgba(201, 154, 94, 0.12)',
          cyan: '#38bdf8',
          emerald: '#34d399',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '0',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.18em',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
    },
  },
  plugins: [],
}
