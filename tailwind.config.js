/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#fdf8f5',
          100: '#f8ebe4',
          200: '#eed1c3',
          300: '#e2b19b',
          400: '#d38b6d',
          500: '#c56b46',
          600: '#b85237',
          700: '#993f2d',
          800: '#7e3627',
          900: '#652d23',
        }
      }
    },
  },
  plugins: [],
}

