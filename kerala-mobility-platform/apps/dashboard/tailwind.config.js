/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"'
        ],
      },
      colors: {
        natpac: {
          primary: '#06142E',     // Very Dark Navy
          secondary: '#0B1B3D',   // Dark Navy
          royal: '#0A1E42',       // Dark Navy Blue (Main Navigation)
          accent: '#d4a017',      // Gold/amber
          lightBg: '#F4F7FA',     // Slightly cool light grey for contrast
        },
        // Kept for compatibility if used elsewhere before full phase rollout
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
