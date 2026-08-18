/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base)',
          card: 'var(--bg-card)',
          elevated: 'var(--bg-elevated)',
          hover: 'var(--bg-hover)',
        },
        // Class names ainda são `purple-*` por compatibilidade histórica,
        // mas os hex são a paleta azul do Sinceramente EnglishFlow (#0066FF / #3DA5FF).
        purple: {
          50:  '#eef4ff',
          100: '#dbe8ff',
          200: '#b8d1ff',
          300: '#8fb6ff',
          400: '#5b93ff',
          500: '#3da5ff',
          600: '#0066ff',
          700: '#0054d6',
          800: '#003fa3',
          900: '#0a0f2c',
          950: '#050914',
        },
        border: {
          subtle: 'var(--border-subtle)',
          DEFAULT: 'var(--border-default)',
          bright: 'var(--border-bright)',
        },
      },
      fontFamily: {
        sans: ['"Poppins"', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'system-ui', 'sans-serif'],
        display: ['"Orbitron"', '"Poppins"', 'system-ui', 'sans-serif'],
        marker: ['"Permanent Marker"', 'cursive'],
      },
      boxShadow: {
        // Azul-neon: #0066FF
        'glow-sm': '0 0 15px rgba(0,102,255,0.28)',
        'glow':    '0 0 30px rgba(0,102,255,0.36)',
        'glow-lg': '0 0 60px rgba(0,102,255,0.32)',
        'card':    '0 4px 24px rgba(0,0,0,0.4)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
