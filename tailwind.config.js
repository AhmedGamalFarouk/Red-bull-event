/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        concrete: '#D6D8D4',
        ink: '#0E1116',
        slate: '#4A525C',
        card: '#FFD200',
        cut: '#D7143A',
        paper: '#F4F5F2',
      },
      fontFamily: {
        display: ['"Mona Sans Variable"', 'sans-serif'],
        sans: ['"Geist Variable"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        utility: '0.08em',
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '2px',
        md: '2px',
      },
    },
  },
  plugins: [],
}
