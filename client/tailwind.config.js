import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
        'nunito-sans': ['Nunito Sans', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#0EA5E9', // Sky 500 for buttons/actions
          light: '#E6F4FF',   // User specified primary
          medium: '#BEE3F8',  // User specified primary
          dark: '#0284C7',    // Sky 600
          50: '#E6F4FF',
          100: '#BEE3F8',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          900: '#0C4A6E',
        },
        secondary: {
          DEFAULT: '#10B981', // Emerald 500
          light: '#D1FAE5',   // User specified secondary
          medium: '#A7F3D0',  // User specified secondary
          dark: '#059669',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          900: '#064E3B',
        },
        accent: {
          DEFAULT: '#2DD4BF', // User specified accent (Teal 400)
          hover: '#14B8A6',   // Teal 500
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          900: '#134E4A',
        },
        text: {
          primary: '#1F2937',   // Gray 800
          secondary: '#6B7280', // Gray 500
        },
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.3rem', { lineHeight: '1.8rem' }],
        '2xl': ['1.6rem', { lineHeight: '2.2rem' }],
        '3xl': ['2rem', { lineHeight: '2.5rem' }],
        '4xl': ['2.5rem', { lineHeight: '3rem' }],
        '5xl': ['3.2rem', { lineHeight: '1' }],
        '6xl': ['4rem', { lineHeight: '1' }],
        '7xl': ['5rem', { lineHeight: '1' }],
        '8xl': ['6.5rem', { lineHeight: '1' }],
        '9xl': ['9rem', { lineHeight: '1' }],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'slide-left': 'slideLeft 0.5s ease-out',
        'slide-right': 'slideRight 0.5s ease-out',
        'zoom-in': 'zoomIn 0.5s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [daisyui],
  daisyui: {
    logs: false,
  },
}
