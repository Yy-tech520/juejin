/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1e80ff',
          dark: '#1171ee',
          soft: '#f4f9ff',
        },
        line: '#e5e6eb',
        ink: '#1d2129',
        hint: '#86909c',
      },
      boxShadow: {
        panel: '0 12px 32px rgba(15, 39, 87, 0.06)',
      },
      fontFamily: {
        sans: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
