/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        horror: ['Creepster', 'cursive'],
        analog: ['Special Elite', 'cursive'],
        mono: ['Courier New', 'monospace'],
      },
      colors: {
        blood: '#8a0b0b',
      },
    },
  },
  plugins: [],
}
