/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1E3A8A',
          'primary-600': '#1E40AF',
          accent: '#059669',
          'accent-600': '#047857',
          warning: '#EA580C',
          danger: '#DC2626',
          info: '#3B82F6',
          text: '#1F2937',
          'text-secondary': '#5F6B7A',
          'text-light': '#8A95A5',
          bg: '#F3F4F6',
          surface: '#FFFFFF',
          'surface-elevated': '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
