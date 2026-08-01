/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0a0a0a',
          soft: '#141414',
          card: '#1a1a1a',
          border: '#2a2a2a'
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#F5D061',
          dark: '#a5842a'
        },
        silver: {
          DEFAULT: '#C0C0C0',
          soft: '#9a9a9a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        gold: '0 0 20px rgba(212, 175, 55, 0.25)',
        goldStrong: '0 0 30px rgba(212, 175, 55, 0.4)'
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5D061 50%, #D4AF37 100%)'
      }
    }
  },
  plugins: []
}
