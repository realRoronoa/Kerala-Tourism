/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kerala: {
          green: '#1B4332',
          gold: '#C89B3C',
          laterite: '#8B4513',
          surface: '#F8F9FA',
          border: '#D9DADB',
          white: '#FFFFFF',
        },
      },
      borderRadius: {
        card: '8px',
      },
      fontFamily: {
        inter: ['Inter_400Regular'],
        'inter-medium': ['Inter_500Medium'],
        'inter-semibold': ['Inter_600SemiBold'],
        'inter-bold': ['Inter_700Bold'],
      },
    },
  },
  plugins: [],
};
