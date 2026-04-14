/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Palette allineata al sito pubblico (HSL tokens)
        brand: {
          DEFAULT: 'hsl(276, 30%, 45%)',
          light: 'hsl(276, 23%, 72%)',
          subtle: 'hsl(276, 45%, 95%)',
        },
        accent: {
          DEFAULT: 'hsl(142, 30%, 38%)',
          light: 'hsl(142, 24%, 65%)',
        },
      },
    },
  },
  plugins: [],
};
