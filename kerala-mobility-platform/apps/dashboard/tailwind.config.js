/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', 'sans-serif'],
      },
      colors: {
        gov: {
          blue: {
            primary: '#0D2137',
            secondary: '#163557',
            footer: '#091929',
          }
        },
        accent: {
          orange: '#D4600A',
          red: '#B5251F',
        },
        status: {
          low: '#22c55e',       // green-500
          moderate: '#eab308',  // yellow-500
          high: '#f97316',      // orange-500
          veryHigh: '#ea580c',  // orange-600
          critical: '#b91c1c',  // red-700
        }
      }
    },
  },
  plugins: [],
}
