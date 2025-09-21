/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif']
      },
      colors: {
        'primary': '#1f2937',
        'secondary': '#6b7280',
      },
      boxShadow: {
        'custom': '0 10px 25px rgba(65,1,56,0.1)',
      }
    },
  },
  plugins: [],
}

