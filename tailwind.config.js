/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50:  '#FAF7F2',
          100: '#F5F0E8',
          200: '#EDE4D4',
        },
        rose: {
          brand: '#E91E8C',
          soft:  '#F8D7EA',
          light: '#FDE8F3',
          muted: '#FCEEF7',
        },
        purple: {
          soft:  '#F3E8FF',
          mid:   '#C084FC',
          deep:  '#7C3AED',
        },
        green: {
          soft:  '#DCFCE7',
          mid:   '#86EFAC',
          deep:  '#16A34A',
          text:  '#14532D',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
