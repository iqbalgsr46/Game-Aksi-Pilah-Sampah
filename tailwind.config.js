/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'short': { 'raw': '(max-height: 500px)' },
      },
      fontFamily: {
        bubbly: ['"Blue Water"', 'cursive'],
      }
    },
  },
  plugins: [],
}
