/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        prometheus: {
          orange: '#ff6600',
          dark: '#1a1a1a',
          gray: '#2d2d2d',
          'gray-light': '#404040',
          'gray-lighter': '#666666',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'prometheus': '0 10px 25px rgba(255, 102, 0, 0.15)',
        'prometheus-lg': '0 20px 40px rgba(255, 102, 0, 0.2)',
      }
    },
  },
  plugins: [],
}
