/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rb: {
          dark: '#050711',
          navy: '#090D22',
          surface: '#111736',
          card: '#161F48',
          red: '#ED1B2D',
          redGlow: '#FF2A3D',
          yellow: '#FFC800',
          yellowBright: '#FFE600',
          blue: '#0055B8',
          cyan: '#00D8FF',
          silver: '#C8CFDD',
          muted: '#8A95AF',
          line: 'rgba(255,255,255,0.08)',
        }
      },
      fontFamily: {
        display: ['"Syne"', 'Impact', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
        sans: ['"Geist Variable"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        widest: '0.25em',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      boxShadow: {
        'glow-red': '0 0 40px -10px rgba(237, 27, 45, 0.5)',
        'glow-yellow': '0 0 40px -10px rgba(255, 200, 0, 0.5)',
        'glow-cyan': '0 0 40px -10px rgba(0, 216, 255, 0.4)',
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
