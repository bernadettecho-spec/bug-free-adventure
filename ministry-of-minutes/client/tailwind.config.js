/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cyan: '#00C0F3',
        magenta: '#BA2FA2',
        'gov-red': '#F4333D',
        'dark-grey': '#3D3D3D',
        grey: '#ADADAD',
        'off-white': '#F7F7F7',
      },
      fontFamily: {
        lato: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
