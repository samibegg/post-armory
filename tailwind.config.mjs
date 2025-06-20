/** @type {import('tailwindcss').Config} */
const config = {
  // THIS IS THE CORRECTED CONTENT ARRAY FOR THE PAGES ROUTER
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;