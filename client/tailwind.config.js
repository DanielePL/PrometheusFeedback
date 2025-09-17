/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Prometheus Campus Color System
        campus: {
          orange: '#ff6600',
          'orange-light': '#ff8533',
          'orange-dark': '#cc5200',
        },
        prometheus: {
          orange: '#ff6600',
          'orange-dark': '#e55a00',
          'orange-light': '#ff8533',
          dark: '#1a1a1a',
          gray: '#2d2d2d',
          'gray-light': '#404040',
          'gray-lighter': '#666666',
        },
        // Revenue Level Colors
        rev1: {
          light: '#9ca3af',
          DEFAULT: '#6b7280',
          dark: '#4b5563',
        },
        rev2: {
          light: '#60a5fa',
          DEFAULT: '#3b82f6',
          dark: '#2563eb',
        },
        rev3: {
          light: '#a78bfa',
          DEFAULT: '#8b5cf6',
          dark: '#7c3aed',
        },
        'prometheus-orange': '#ff6600',
        'prometheus-orange-dark': '#e55a00',
        'prometheus-orange-light': '#ff8533',
        'campus-orange': '#ff6600',
        'campus-orange-dark': '#e55a00',
        'campus-orange-light': '#ff8533',
        // Dark theme grays
        gray: {
          750: '#374151',
          850: '#1f2937',
          950: '#111827',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
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
      },
      backgroundImage: {
        'gradient-prometheus': 'linear-gradient(135deg, #ff6600 0%, #ff8533 100%)',
      },
      animation: {
        'flame': 'flame 1.5s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        flame: {
          '0%': { transform: 'scale(1) rotate(-1deg)', opacity: '1' },
          '100%': { transform: 'scale(1.05) rotate(1deg)', opacity: '0.9' },
        }
      }
    },
  },
  plugins: [],
}
