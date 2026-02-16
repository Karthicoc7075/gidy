module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {

    extend: {
      keyframes: {
        'up-down': {
          '0%, 100%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(10px)' },
        },
      },
      animation: {
        'up-down': 'up-down 2s ease-in-out infinite',
      },
    },
    screens: {

    },
  },
  plugins: [],
  darkMode: 'class',
}
